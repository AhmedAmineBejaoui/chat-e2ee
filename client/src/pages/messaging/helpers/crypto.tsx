import { LS, SS } from "../../../utils/storage";

type keyPairType = {
  publicKey: string;
  privateKey: string;
};

const STORAGE_KEY = "session-keyPair";
const SESSION_AES_KEY = "session-keystore-key";
const IV_LENGTH = 12;

const toBase64 = (input: ArrayBuffer | Uint8Array): string => {
  const arr = input instanceof Uint8Array ? input : new Uint8Array(input);
  let binary = "";
  arr.forEach((b) => (binary += String.fromCharCode(b)));
  return window.btoa(binary);
};

const fromBase64 = (input: string): Uint8Array => {
  const binary = window.atob(input);
  const arr = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    arr[i] = binary.charCodeAt(i);
  }
  return arr;
};

const getSessionCryptoKey = async (): Promise<CryptoKey> => {
  const cached = SS.get(SESSION_AES_KEY);
  if (cached) {
    try {
      return await window.crypto.subtle.importKey(
        "jwk",
        cached,
        { name: "AES-GCM" },
        true,
        ["encrypt", "decrypt"]
      );
    } catch (err) {
      console.error("Failed to import session keystore key", err);
    }
  }
  const key = await window.crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
    "encrypt",
    "decrypt"
  ]);
  const exported = await window.crypto.subtle.exportKey("jwk", key);
  SS.set(SESSION_AES_KEY, exported);
  return key;
};

const encryptForStorage = async (payload: unknown): Promise<string | null> => {
  if (!(window.crypto?.subtle)) {
    return null;
  }
  const key = await getSessionCryptoKey();
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encoded = new TextEncoder().encode(JSON.stringify(payload));
  const encrypted = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
  return `${toBase64(iv)}:${toBase64(encrypted)}`;
};

const decryptFromStorage = async (payload: string): Promise<any | null> => {
  if (!(window.crypto?.subtle)) {
    return null;
  }
  const [ivRaw, dataRaw] = payload.split(":");
  if (!ivRaw || !dataRaw) {
    return null;
  }
  const key = await getSessionCryptoKey();
  const iv = fromBase64(ivRaw);
  const cipher = fromBase64(dataRaw);
  const decrypted = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, cipher);
  const text = new TextDecoder().decode(decrypted);
  return JSON.parse(text);
};

export const getKeyPairFromCache = async (channelID: string): Promise<keyPairType | null> => {
  const stored = LS.get(STORAGE_KEY);
  if (!stored || stored.channelID !== channelID) {
    return null;
  }
  if (stored.keyPair?.publicKey && stored.keyPair?.privateKey) {
    return stored.keyPair as keyPairType;
  }
  if (!stored.payload) {
    return null;
  }
  try {
    const decrypted = await decryptFromStorage(stored.payload);
    if (decrypted?.publicKey && decrypted?.privateKey) {
      return decrypted as keyPairType;
    }
  } catch (err) {
    console.error("Failed to decrypt cached key pair", err);
  }
  return null;
};

export const storeKeyPair = async (channelID: string, keys: keyPairType | null): Promise<void> => {
  if (!keys) {
    LS.remove(STORAGE_KEY);
    return;
  }
  try {
    const payload = await encryptForStorage(keys);
    if (payload) {
      LS.set(STORAGE_KEY, { channelID, payload });
    }
  } catch (err) {
    console.error("Failed to encrypt key pair for storage", err);
  }
};
