import "@chat-e2ee/service";

declare module "@chat-e2ee/service" {
  interface IChatE2EE {
    sendMessage(args: { image?: string; audio?: string; text: string }): Promise<ISendMessageReturn>;
    encrypt(args: {
      image?: string;
      audio?: string;
      text: string;
    }): { send: () => Promise<ISendMessageReturn> };
    decryptMessage(ciphertext: string): Promise<string>;
    startCall(options?: { withVideo?: boolean }): Promise<IE2ECall>;
    on(listener: "call-added", callback: (call: IE2ECall) => void): void;
    on(listener: "call-removed", callback: () => void): void;
  }

  interface IE2ECall {
    mode: "audio" | "video";
    state: RTCPeerConnectionState;
    on(event: "state-changed", cb: (state: RTCPeerConnectionState) => void): void;
    endCall(): Promise<void>;
  }
}
