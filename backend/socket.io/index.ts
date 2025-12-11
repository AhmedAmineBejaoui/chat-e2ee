import { Server, Socket } from "socket.io";
import { ChatMessageType } from "../api/messaging/types";
import connectionListener from "./listeners";

export interface CustomSocket extends Socket {
  userID: string,
  channelID: string
}

let io: Server = null;
export enum SOCKET_TOPIC {
  CHAT_MESSAGE='chat-message',
  LIMIT_REACHED='limit-reached',
  ON_ALICE_JOIN='on-alice-join',
  DELIVERED = 'delivered',
  ON_ALICE_DISCONNECTED = 'on-alice-disconnect',
  MESSAGE = 'message',
  WEBRTC_SESSION_DESCRIPTION = 'webrtc-session-description',
  // Group events
  ON_MEMBER_JOIN = 'on-member-join',
  ON_MEMBER_LEAVE = 'on-member-leave',
  MEMBER_LIST_UPDATE = 'member-list-update',
}

type MemberInfo = {
  oderId: string,
  odernName?: string,
  publicKey?: string
};

type emitDataTypes = {
  [SOCKET_TOPIC.CHAT_MESSAGE]: ChatMessageType,
  [SOCKET_TOPIC.LIMIT_REACHED]: null,
  [SOCKET_TOPIC.DELIVERED]: string,
  [SOCKET_TOPIC.ON_ALICE_DISCONNECTED]: null,
  [SOCKET_TOPIC.ON_ALICE_JOIN]: {
    publicKey: string
  },
  [SOCKET_TOPIC.MESSAGE]: string,
  [SOCKET_TOPIC.ON_MEMBER_JOIN]: MemberInfo,
  [SOCKET_TOPIC.ON_MEMBER_LEAVE]: { userId: string },
  [SOCKET_TOPIC.MEMBER_LIST_UPDATE]: { members: string[], count: number },
  [key: string]: unknown,
}

const parseAllowedOrigins = (): (string | RegExp)[] => {
  const raw = process.env.CLIENT_ORIGIN || "";
  return raw
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

export const initSocket = (server) => {
  if (io) {
    return io;
  }

  const allowedOrigins = parseAllowedOrigins();

  const maxPayloadBytes = Number(process.env.SOCKET_MAX_PAYLOAD_BYTES || 5 * 1024 * 1024);
  io = new Server(server, {
    allowEIO3: true,
    transports: ["websocket", "polling"],
    maxHttpBufferSize: maxPayloadBytes,
    cors: {
      origin: allowedOrigins.length > 0 ? allowedOrigins : "*",
      methods: ["GET", "POST", "OPTIONS"],
      credentials: true
    }
  });
  // eslint-disable-next-line no-console
  console.log("Websocket is up!");

  // add listeners
  io.on("connection", (socket) => connectionListener(socket as CustomSocket, io));

  return io;
};

export const socketEmit = <T extends keyof emitDataTypes>(topic: T, sid: string, data: emitDataTypes[T]): void => {
  const socket = io.sockets.sockets.get(sid);
  if(!socket) {
    console.warn("SKIPPING. No socket found.");
    return;
  }
  socket.emit(topic as string, data);
};
