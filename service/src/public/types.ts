import { SocketListenerType } from "../socket/socket";
import { E2ECall, PeerConnectionEventType, CallMode } from "../webrtc";

export type LinkObjType = {
    hash: string,
    link: string,
    absoluteLink: string | undefined,
    expired: boolean,
    deleted: boolean,
    pin: string,
    pinCreatedAt:number
}

// Types pour les fichiers
export type FileCategory = 'image' | 'video' | 'audio' | 'document' | 'archive' | 'code' | 'other';

export interface IFileInfo {
    url: string;
    filename: string;
    originalName: string;
    size: number;
    mimetype: string;
    category: FileCategory;
}

export interface IUploadFileResponse {
    success: boolean;
    file?: IFileInfo;
    error?: string;
}

export interface IUploadMultipleResponse {
    success: boolean;
    files?: IFileInfo[];
    count?: number;
    error?: string;
}

export interface ISendMessageReturn { id: string, timestamp: string };
export interface IGetPublicKeyReturn { publicKey: string, aesKey: string};
export type TypeUsersInChannel = { "uuid":string }[];

export interface IChatE2EE {
    init(): Promise<void>;
    getKeyPair(): { privateKey: string, publicKey: string };
    isEncrypted(): boolean;
    getLink(): Promise<LinkObjType>;
    setChannel(channelId: string, userId: string, userName?: string): void;
    joinGroup(channelId: string, userId: string, userName?: string): Promise<void>;
    isInGroupMode(): boolean;
    getGroupMembers(): string[];
    getGroupMemberCount(): number;
    delete(): Promise<void>;
    getUsersInChannel(): Promise<TypeUsersInChannel>;
    sendMessage(args: { image?: string, audio?: string, text: string, file?: IFileInfo }): Promise<ISendMessageReturn>;
    dispose(): void;
    encrypt({ image, audio, text, file }: { image?: string; audio?: string; text: string; file?: IFileInfo }): { send: () => Promise<ISendMessageReturn> };
    decryptMessage(ciphertext: string): Promise<string>;
    on(listener: SocketListenerType | PeerConnectionEventType, callback: (...args: any) => void): void;
    // webrtc call 
    startCall(options?: { withVideo?: boolean }): Promise<E2ECall>;
    endCall(): void;
    activeCall: E2ECall | null;
    // file upload
    uploadFile(file: File): Promise<IUploadFileResponse>;
    uploadFiles(files: File[]): Promise<IUploadMultipleResponse>;
}

export interface IUtils {
    decryptMessage(ciphertext: string, privateKey: string): Promise<string>,
    signMessage(plaintext: string, privateKey: string): Promise<string>,
    verifySignature(plaintext: string, signature: string, publicKey: string): Promise<boolean>,
    generateSigningKeypairs(): Promise<{ privateKey: string, publicKey: string }>,
    generateUUID(): string,
}

export type configType = {
    apiURL: string | null,
    socketURL: string | null,
    settings: {
        disableLog: boolean,
    }
}
export type SetConfigType = (config: Partial<configType>) => void;
