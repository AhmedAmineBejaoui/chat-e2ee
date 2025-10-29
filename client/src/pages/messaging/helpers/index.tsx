import { LS, SS } from '../../../utils/storage';

const LEGACY_KEY = "session-user-uuid";
const SESSION_MAP_KEY = "session-user-uuid-map";

type SessionMap = Record<string, string>;

const readSessionMap = (): SessionMap => SS.get(SESSION_MAP_KEY) || {};

const writeSessionMap = (map: SessionMap): void => {
  SS.set(SESSION_MAP_KEY, map);
};

const migrateLegacyEntry = (): SessionMap => {
  const legacyEntry = LS.get(LEGACY_KEY);
  if (!legacyEntry) {
    return readSessionMap();
  }

  const { channelID, userId } = legacyEntry;
  const map = readSessionMap();
  if (channelID && userId && !map[channelID]) {
    map[channelID] = userId;
    writeSessionMap(map);
  }
  LS.remove(LEGACY_KEY);
  return map;
};

export { isEmptyMessage } from "./validator";
export { getKeyPairFromCache, storeKeyPair } from "./crypto";

export const getUserSessionID = (channelID: string): string | null => {
  const sessionMap = migrateLegacyEntry();
  return sessionMap[channelID] || null;
};

export const createUserSessionID = (channelID: string): string => `${channelID}-${Date.now()}`;

export const storeUserSessionID = (channelID: string, userId: string): void => {
  const sessionMap = migrateLegacyEntry();
  sessionMap[channelID] = userId;
  writeSessionMap(sessionMap);
};
