import getClientInstance from "./clients";
import channelValid from "../api/chatHash/utils/validateChannel";
import { socketEmit, SOCKET_TOPIC , CustomSocket} from "./index";
import { MAX_GROUP_MEMBERS } from "../db/const";

const clients = getClientInstance();

const connectionListener = (socket: CustomSocket, io) => {
  // Regular chat join (private mode - 2 users only)
  socket.on("chat-join", async (data) => {
    const { userID, channelID, publicKey } = data;
    console.log("[socket.io] chat-join", { channelID, userID });

    const { valid } = await channelValid(channelID);
    if (!valid) {
      console.error("Invalid channelID - ", channelID);
      return;
    }
    
    const currentMode = clients.getChannelMode(channelID);
    const maxMembers = currentMode === 'group' ? MAX_GROUP_MEMBERS : 2;
    const userCount = clients.getMemberCount(channelID);

    const receiverSocket = io.sockets.sockets.get(socket.id);
    if (userCount >= maxMembers && receiverSocket) {
      socketEmit<SOCKET_TOPIC.LIMIT_REACHED>(SOCKET_TOPIC.LIMIT_REACHED, socket.id, null);
      receiverSocket.disconnect();
      return;
    }

    clients.setClientToChannel(userID, channelID, socket.id);
    socket.join(channelID);
    console.log("[socket.io] clients in channel", channelID, clients.getAllMembersInChannel(channelID));
    socket.channelID = channelID;
    socket.userID = userID;

    // For group mode: notify all members
    if (currentMode === 'group') {
      const otherMembers = clients.getOtherMembersInChannel(channelID, userID);
      otherMembers.forEach(memberId => {
        const memberSocket = clients.getSIDByIDs(memberId, channelID);
        if (memberSocket?.sid) {
          socketEmit<SOCKET_TOPIC.ON_MEMBER_JOIN>(SOCKET_TOPIC.ON_MEMBER_JOIN, memberSocket.sid, { 
            oderId: userID, 
            publicKey 
          });
        }
      });
      // Send updated member list to all
      broadcastMemberList(channelID, clients, io);
    } else {
      // Private mode: share the public key to the receiver if present
      const usersInChannel = clients.getClientsByChannel(channelID);
      const receiverId = Object.keys(usersInChannel).find(user => user !== userID);
      const receiver = receiverId && clients.getSIDByIDs(receiverId, channelID);
      if (receiver) {
        socketEmit<SOCKET_TOPIC.ON_ALICE_JOIN>(SOCKET_TOPIC.ON_ALICE_JOIN, receiver.sid, { publicKey });
      }
    }
  });

  // Group chat join (group mode - up to 100 users)
  socket.on("group-join", async (data) => {
    const { userID, channelID, publicKey, userName } = data;
    console.log("[socket.io] group-join", { channelID, userID, userName });

    const { valid } = await channelValid(channelID);
    if (!valid) {
      console.error("Invalid channelID - ", channelID);
      return;
    }

    // Set channel to group mode
    clients.setChannelMode(channelID, 'group');
    
    const userCount = clients.getMemberCount(channelID);

    if (userCount >= MAX_GROUP_MEMBERS) {
      socketEmit<SOCKET_TOPIC.LIMIT_REACHED>(SOCKET_TOPIC.LIMIT_REACHED, socket.id, null);
      const receiverSocket = io.sockets.sockets.get(socket.id);
      if (receiverSocket) {
        receiverSocket.disconnect();
      }
      return;
    }

    clients.setClientToChannel(userID, channelID, socket.id);
    socket.join(channelID);
    console.log("[socket.io] group members in channel", channelID, clients.getAllMembersInChannel(channelID));
    socket.channelID = channelID;
    socket.userID = userID;

    // Notify all other members about new member
    const otherMembers = clients.getOtherMembersInChannel(channelID, userID);
    otherMembers.forEach(memberId => {
      const memberSocket = clients.getSIDByIDs(memberId, channelID);
      if (memberSocket?.sid) {
        socketEmit<SOCKET_TOPIC.ON_MEMBER_JOIN>(SOCKET_TOPIC.ON_MEMBER_JOIN, memberSocket.sid, { 
          oderId: userID, 
          odernName: userName,
          publicKey 
        });
      }
    });

    // Broadcast updated member list to all members
    broadcastMemberList(channelID, clients, io);
  });

  socket.on("received", ({ channel, sender, id }) => {
    const { sid } = clients.getSIDByIDs(sender, channel);
    if (sid) {
      socketEmit<SOCKET_TOPIC.DELIVERED>(SOCKET_TOPIC.DELIVERED, sid, id);
    }
  });

  socket.on("disconnect", () => {
    const { channelID, userID } = socket;
    if (!(channelID && userID)) {
      return;
    }
    try {
      console.log("[socket.io] disconnect", { channelID, userID });
      const channelMode = clients.getChannelMode(channelID);
      
      clients.deleteClient(userID, channelID);

      if (channelMode === 'group') {
        // For group: notify all remaining members
        const remainingMembers = clients.getAllMembersInChannel(channelID);
        remainingMembers.forEach(memberId => {
          const memberSocket = clients.getSIDByIDs(memberId, channelID);
          if (memberSocket?.sid) {
            socketEmit<SOCKET_TOPIC.ON_MEMBER_LEAVE>(SOCKET_TOPIC.ON_MEMBER_LEAVE, memberSocket.sid, { userId: userID });
          }
        });
        // Broadcast updated member list
        if (remainingMembers.length > 0) {
          broadcastMemberList(channelID, clients, io);
        }
      } else {
        // Private mode: notify the other user
        const receiver = clients.getReceiverIDBySenderID(userID, channelID);
        if (receiver) {
          const receiverSocket = clients.getSIDByIDs(receiver, channelID);
          if (receiverSocket?.sid) {
            socketEmit<SOCKET_TOPIC.ON_ALICE_DISCONNECTED>(SOCKET_TOPIC.ON_ALICE_DISCONNECTED, receiverSocket.sid, null);
          }
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  });

  socket.emit(SOCKET_TOPIC.MESSAGE, "ping!");
};

// Helper function to broadcast member list to all channel members
function broadcastMemberList(channelID: string, clients: ReturnType<typeof getClientInstance>, io: any) {
  const members = clients.getAllMembersInChannel(channelID);
  const memberListData = { members, count: members.length };
  
  members.forEach(memberId => {
    const memberSocket = clients.getSIDByIDs(memberId, channelID);
    if (memberSocket?.sid) {
      socketEmit<SOCKET_TOPIC.MEMBER_LIST_UPDATE>(SOCKET_TOPIC.MEMBER_LIST_UPDATE, memberSocket.sid, memberListData);
    }
  });
}

export default connectionListener;
