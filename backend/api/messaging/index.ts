import express, { Request, Response } from 'express';

import db from '../../db';
import { PUBLIC_KEY_COLLECTION } from '../../db/const';
import asyncHandler from '../../middleware/asyncHandler';
import { SOCKET_TOPIC, socketEmit } from '../../socket.io';
import getClientInstance from '../../socket.io/clients';
import channelValid from '../chatHash/utils/validateChannel';
import {
    ChatMessageType, GetPublicKeyResponse, MessageResponse, SharePublicKeyResponse, UsersInChannelResponse
} from './types';

const router = express.Router({ mergeParams: true });
const clients = getClientInstance();

router.post(
  "/message",
  asyncHandler(async (req: Request, res: Response): Promise<Response<MessageResponse>> => {
    const { message, sender, channel, image, audio, file } = req.body;

    if (!message && !image && !audio) {
      return res.status(400).send({ message: "Message content missing" });
    }
    const { valid } = await channelValid(channel);

    if (!valid) {
      return res.sendStatus(404);
    }

    if (!clients.isSenderInChannel(channel, sender)) {
      console.error('Sender is not in channel');
      return res.status(401).send({ error: "Permission denied" });
    }

    const id = new Date().valueOf();
    const timestamp = new Date().valueOf();
    const dataToPublish: ChatMessageType = {
      channel,
      sender,
      message,
      id,
      timestamp,
      ...(image ? { image } : {}),
      ...(audio ? { audio } : {}),
      ...(file ? { file } : {})
    };

    const channelMode = clients.getChannelMode(channel);
    
    if (channelMode === 'group') {
      // Group mode: send to all members except sender
      const receivers = clients.getReceiversBySenderID(sender, channel);
      if (receivers.length === 0) {
        console.error('No other members in the group');
        return res.status(503).send({ message: "No other members in the group" });
      }

      let deliveredCount = 0;
      receivers.forEach(receiverId => {
        const receiverClient = clients.getSIDByIDs(receiverId, channel);
        if (receiverClient?.sid) {
          socketEmit<SOCKET_TOPIC.CHAT_MESSAGE>(SOCKET_TOPIC.CHAT_MESSAGE, receiverClient.sid, dataToPublish);
          deliveredCount++;
        }
      });

      return res.send({ message: "message sent", id, timestamp, deliveredTo: deliveredCount });
    } else {
      // Private mode: send to single receiver
      const receiver = clients.getReceiverIDBySenderID(sender, channel);
      if(!receiver) {
        console.error('No receiver is in the channel');
        return res.status(503).send({ message: "Receiver is not connected" });
      }

      const receiverClient = clients.getSIDByIDs(receiver, channel);
      if (!receiverClient?.sid) {
        console.error('Receiver socket not found', { channel, receiver });
        return res.status(503).send({ message: "Receiver is not connected" });
      }
      socketEmit<SOCKET_TOPIC.CHAT_MESSAGE>(SOCKET_TOPIC.CHAT_MESSAGE, receiverClient.sid, dataToPublish);
      return res.send({ message: "message sent", id, timestamp });
    }
  })
);

router.post(
  "/share-public-key",
  asyncHandler(async (req: Request, res: Response): Promise<Response<SharePublicKeyResponse>> => {
    const { aesKey, publicKey, sender, channel } = req.body;

    const { valid } = await channelValid(channel);
    if (!valid) {
      return res.sendStatus(404);
    }
    // TODO: do not store if already exists
    await db.insertInDb({ aesKey, publicKey, user: sender, channel }, PUBLIC_KEY_COLLECTION);
    return res.send({ status: "ok" });
  })
);

router.get(
  "/get-public-key",
  asyncHandler(async (req: Request, res: Response): Promise<Response<GetPublicKeyResponse>> => {
    const { userId, channel } = req.query;

    const { valid } = await channelValid(channel as string);

    if (!valid) {
      return res.sendStatus(404);
    }
    const receiverID = clients.getReceiverIDBySenderID(userId as string, channel as string);
    const data = await db.findOneFromDB<GetPublicKeyResponse>({ channel, user: receiverID }, PUBLIC_KEY_COLLECTION);
    return res.send(data || {
      publicKey: null,
      aesKey: null
  });
  })
);

// Get public keys of all members in a group
router.get(
  "/get-group-public-keys",
  asyncHandler(async (req: Request, res: Response) => {
    const { userId, channel } = req.query;

    const { valid } = await channelValid(channel as string);
    if (!valid) {
      return res.sendStatus(404);
    }

    const channelMode = clients.getChannelMode(channel as string);
    if (channelMode !== 'group') {
      return res.status(400).send({ error: "Not a group channel" });
    }

    const members = clients.getOtherMembersInChannel(channel as string, userId as string);
    const publicKeys: Record<string, { publicKey: string | null, aesKey: string | null }> = {};

    for (const memberId of members) {
      const data = await db.findOneFromDB<GetPublicKeyResponse>({ channel, user: memberId }, PUBLIC_KEY_COLLECTION);
      publicKeys[memberId] = data || { publicKey: null, aesKey: null };
    }

    return res.send({ publicKeys, members });
  })
);

router.get(
  "/get-users-in-channel",
  asyncHandler(async (req: Request, res: Response): Promise<Response<UsersInChannelResponse>> => {
    const { channel } = req.query;

    const { valid } = await channelValid(channel as string);

    if (!valid) {
      return res.sendStatus(404);
    }

    const data = clients.getClientsByChannel(channel as string);
    const usersInChannel = data ? Object.keys(data).map((oderId) => ({ uuid: oderId })) : [];
    const channelMode = clients.getChannelMode(channel as string);
    
    return res.send({
      users: usersInChannel,
      count: usersInChannel.length,
      mode: channelMode,
      maxMembers: channelMode === 'group' ? 100 : 2
    });
  })
);

// Get channel info including mode and member count
router.get(
  "/channel-info",
  asyncHandler(async (req: Request, res: Response) => {
    const { channel } = req.query;

    const { valid } = await channelValid(channel as string);
    if (!valid) {
      return res.sendStatus(404);
    }

    const memberCount = clients.getMemberCount(channel as string);
    const channelMode = clients.getChannelMode(channel as string);
    const members = clients.getAllMembersInChannel(channel as string);

    return res.send({
      channelId: channel,
      mode: channelMode,
      memberCount,
      members,
      maxMembers: channelMode === 'group' ? 100 : 2
    });
  })
);

export default router;
