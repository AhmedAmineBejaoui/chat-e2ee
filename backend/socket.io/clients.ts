type UserSidTypes = Record<'sid', string>;
type UserRecordType = Record<string, UserSidTypes>;
type ClientRecordType = Record<string, UserRecordType>;

// Group mode: allows up to MAX_GROUP_MEMBERS in the same channel
// Private mode (default): allows only 2 users
type ChannelMode = 'private' | 'group';
type ChannelModeRecord = Record<string, ChannelMode>;

import { MAX_GROUP_MEMBERS } from '../db/const';

/*
const clientRecord: ClientRecordType = {
    channelID: {
        userID1: {
            sid: <sid>
        },
        userID2: {
            sid: <sid>
        }
    }
};
*/
export interface ClientRecordInterface {
  getClients(): ClientRecordType,
  getClientsByChannel(channelID: string): UserRecordType,
  getSIDByIDs(userID: string, channelID: string): UserSidTypes,
  setClientToChannel(userID: string, channelID: string, sid: string): void,
  deleteClient(userID: string, channelID: string): void,
  setChannelMode(channelID: string, mode: ChannelMode): void,
  getChannelMode(channelID: string): ChannelMode,
  getMemberCount(channelID: string): number,
  getAllMembersInChannel(channelID: string): string[],
  getOtherMembersInChannel(channelID: string, excludeUserId: string): string[],
}

class Clients implements ClientRecordInterface{
  private clientRecord: ClientRecordType = {}
  private channelModes: ChannelModeRecord = {}

  getClients(): ClientRecordType { return this.clientRecord }

  getClientsByChannel(channelID: string): UserRecordType {
    if (!channelID) {
      throw new Error("channelID - required param");
    }
    return this.clientRecord[channelID] || {};
  }

  setChannelMode(channelID: string, mode: ChannelMode): void {
    this.channelModes[channelID] = mode;
  }

  getChannelMode(channelID: string): ChannelMode {
    return this.channelModes[channelID] || 'private';
  }

  getMemberCount(channelID: string): number {
    const users = this.getClientsByChannel(channelID);
    return Object.keys(users).length;
  }

  getMaxMembers(channelID: string): number {
    const mode = this.getChannelMode(channelID);
    return mode === 'group' ? MAX_GROUP_MEMBERS : 2;
  }

  getAllMembersInChannel(channelID: string): string[] {
    const usersInChannel = this.getClientsByChannel(channelID);
    return Object.keys(usersInChannel);
  }

  getOtherMembersInChannel(channelID: string, excludeUserId: string): string[] {
    const usersInChannel = this.getClientsByChannel(channelID);
    return Object.keys(usersInChannel).filter(u => u !== excludeUserId);
  }

  getReceiverIDBySenderID(sender: string, channelID: string): string {
    const usersInChannel = this.getClientsByChannel(channelID);
    const usersInChannelArr = Object.keys(usersInChannel);

    const receiver = usersInChannelArr.find((u) => u !== sender);
    return receiver;
  }

  // For group chat: get all receivers except sender
  getReceiversBySenderID(sender: string, channelID: string): string[] {
    const usersInChannel = this.getClientsByChannel(channelID);
    return Object.keys(usersInChannel).filter((u) => u !== sender);
  }

  getSIDByIDs(userID: string, channelID: string): UserSidTypes {
    if (!(channelID && userID)) {
      throw new Error("channelID, userID - required param");
    }

    if(!this.clientRecord[channelID]) {
      return null;
    }
    const users = Object.keys(this.clientRecord[channelID]);

    const user = users.find((u) => u === userID);
    return this.clientRecord[channelID][user];
  }

  setClientToChannel(userID: string, channelID: string, sid: string): void {
    if (this.clientRecord[channelID]) {
      this.clientRecord[channelID][userID] = { sid };
    } else {
      this.clientRecord[channelID] = {
        [userID]: { sid }
      };
    }
  }

  deleteClient(userID: string, channelID: string): void {
    delete this.clientRecord[channelID][userID];
    // Clean up empty channels
    if (Object.keys(this.clientRecord[channelID] || {}).length === 0) {
      delete this.clientRecord[channelID];
      delete this.channelModes[channelID];
    }
  }

  isSenderInChannel(channel: string, sender: string): boolean {
    const usersInChannel = this.getClientsByChannel(channel);
    const usersInChannelArr = Object.keys(usersInChannel);
    return !!usersInChannelArr.find((u) => u === sender);
  }

}

const clientInstance = new Clients();
const getClientInstance = () => clientInstance;

export default getClientInstance;
