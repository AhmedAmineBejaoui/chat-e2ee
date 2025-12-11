import { AesGcmEncryption } from "./cryptoAES";
import { Logger } from "./utils/logger";
import { webrtcSession } from "./webrtcSession";

export type CallMode = 'audio' | 'video';
export type CallOptions = { withVideo?: boolean };

export interface IE2ECall {
    on(event: callEvents, cb: (state: RTCPeerConnectionState) => void): void;
    state: RTCPeerConnectionState;
    endCall(): Promise<void>;
    mode: CallMode;
    toggleAudio(enabled: boolean): void;
    toggleVideo(enabled: boolean): void;
}

interface SignalData {
    type: RTCSdpType;
    sdp: string;
}
export type callEvents = 'state-changed';
export type PeerConnectionEventType = "call-added" | "call-removed";
export const peerConnectionEvents: PeerConnectionEventType[] = [ "call-added", "call-removed" ];

export class WebRTCCall { 
    private peer: Peer;
    private subs: Map<callEvents, Set<Function>> = new Map()
    private currentMode: CallMode = 'audio';

    public static isSupported(): boolean {
        return  !!(RTCRtpSender.prototype as any).createEncodedStreams;
    }

    public on(listener: callEvents, cb: (state: RTCPeerConnectionState) => void): void {
        const sub = this.subs.get(listener);
        if (sub) {
            if (sub.has(cb)) {
                return;
            }
            sub.add(cb);
        } else {
            this.subs.set(listener, new Set([cb]));
        }
    }

    constructor(encryption: AesGcmEncryption, sender: string, channel: string, private logger: Logger) {
        this.logger.log('Creating WebRTCCall');
        this.peer = new Peer(
            () => this.subs,
            encryption, 
            sender, 
            channel, 
            this.logger.createChild('Peer')
        );
    }

    public get callState(): RTCPeerConnectionState {
        return this.peer.callState;
    }

    public get mode(): CallMode {
        return this.currentMode;
    }

    async startCall(options: CallOptions = {}): Promise<void> {
        this.logger.log('startCall');
        this.currentMode = options.withVideo ? 'video' : 'audio';
        return this.peer.createAndSendOffer(options);
    }

    public endCall(): void {
        this.logger.log('endCall');
        this.subs.clear();
        this.peer?.dispose();
        this.peer = null;
    }

    public toggleAudio(enabled: boolean): void {
        this.logger.log(`toggleAudio: ${enabled}`);
        this.peer?.toggleAudio(enabled);
    }

    public toggleVideo(enabled: boolean): void {
        this.logger.log(`toggleVideo: ${enabled}`);
        this.peer?.toggleVideo(enabled);
    }

    private descriptionContainsVideo(desc: SignalData): boolean {
        return typeof desc?.sdp === 'string' && /\nm=video/.test(desc.sdp);
    }

    public signal(data: SignalData): void {
        this.logger.log('handling signal data');
        if(!this.peer) {
            this.logger.log('signal() called without active peer, skipping.');
            return;
        }
        const offerHasVideo = data.type === 'offer' && this.descriptionContainsVideo(data);
        if(offerHasVideo) {
            this.currentMode = 'video';
        }
        this.peer.signal(data, { withVideo: offerHasVideo });
    }
}

class Peer {
    private state: RTCPeerConnectionState;
    private pc: RTCPeerConnection;

    private audioEl?: HTMLAudioElement;
    private remoteVideoEl?: HTMLVideoElement;
    private localVideoEl?: HTMLVideoElement;
    private localStream?: MediaStream;
    private localStreamPromise?: Promise<void>;
    private localOptions: CallOptions = { withVideo: false };
    constructor(
        private subCtx: () => Map<callEvents, Set<Function>>,
        private encryption: AesGcmEncryption, 
        private sender: string, 
        private channel: string, 
        private logger: Logger
    ) {
        this.pc = new (RTCPeerConnection as any)({
            encodedInsertableStreams: true,
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "stun:stun.l.google.com:5349" },
                { urls: "stun:stun1.l.google.com:3478" },
                { urls: "stun:stun1.l.google.com:5349" },
                { urls: "stun:stun2.l.google.com:19302" },
                { urls: "stun:stun2.l.google.com:5349" },
                { urls: "stun:stun3.l.google.com:3478" },
                { urls: "stun:stun3.l.google.com:5349" },
                { urls: "stun:stun4.l.google.com:19302" },
                { urls: "stun:stun4.l.google.com:5349" }
            ]
        });

        this.pc.onconnectionstatechange = () => {
            this.logger.log('Peer Connection State: ', this.pc.connectionState);
            this.state = this.pc.connectionState;
            const sub = this.subCtx();
            const stateChangeHanlder = sub.get('state-changed');
            stateChangeHanlder?.forEach(cb => cb(this.state));
        };

        this.pc.onicecandidate = (event) => {
            if (event.candidate) {
                this.logger.log('ICE Candidate (Caller) gathered.');
                webrtcSession({ 
                    description: {
                        candidate: event.candidate,
                        type: 'candidate'
                    },
                    sender: this.sender,
                    channelId: this.channel
                });
            }
        };

        this.pc.ontrack = (event) => {
            const [stream] = event.streams;
            this.logger.log(`ontrack event: ${event.track.kind}, streams: ${event.streams.length}`);
            if (!stream) {
                this.logger.log('No stream in ontrack event');
                return;
            }
            if(event.track.kind === 'video') {
                this.logger.log('Adding remote video track');
                // Note: Decryption disabled for better compatibility
                // this.applyDecryption('video', event.receiver);
                this.appendVideoStreamToDom(stream, 'webrtc-video-remote');
            } else if(event.track.kind === 'audio') {
                this.logger.log('Adding remote audio track');
                // Note: Decryption disabled for better compatibility  
                // this.applyDecryption('audio', event.receiver);
                this.appendAudioStreamToDom(stream);
            }
        };

        this.state = this.pc.connectionState;
    }

    public get callState(): RTCPeerConnectionState {
        return this.state;
    }

    public async createAndSendOffer(options: CallOptions = {}) {
        await this.ensureLocalStream(options);
        this.logger.log('createAndSendOffer');
        const offer = await this.pc.createOffer();
        await this.pc.setLocalDescription(offer);
        await webrtcSession({ 
            description: offer,
            sender: this.sender,
            channelId: this.channel
        });

    }


    public async signal(data: SignalData, options: CallOptions = {}) {
        if (data.type === 'offer') {
            await this.ensureLocalStream(options);
            this.logger.log('Signal, offer');
            await this.pc.setRemoteDescription(new RTCSessionDescription(data));
            const answer = await this.pc.createAnswer();
            await this.pc.setLocalDescription(answer);
            await webrtcSession({ 
                description: answer,
                sender: this.sender,
                channelId: this.channel
            });
        } else if (data.type === 'answer') {
            this.logger.log('Signal, answer');
            await this.pc.setRemoteDescription(new RTCSessionDescription(data));
        } else if ((data as any).type === 'candidate') {
            this.logger.log('Signal, candidate');
            const candidate = new RTCIceCandidate((data as any).candidate);
            this.pc.addIceCandidate(candidate).catch(e => console.error('Error adding ICE candidate:', e));
        }
    }

    public toggleAudio(enabled: boolean): void {
        if (!this.localStream) return;
        const audioTracks = this.localStream.getAudioTracks();
        audioTracks.forEach(track => {
            track.enabled = enabled;
            this.logger.log(`Audio track ${enabled ? 'enabled' : 'disabled'}`);
        });
    }

    public toggleVideo(enabled: boolean): void {
        if (!this.localStream) return;
        const videoTracks = this.localStream.getVideoTracks();
        videoTracks.forEach(track => {
            track.enabled = enabled;
            this.logger.log(`Video track ${enabled ? 'enabled' : 'disabled'}`);
        });
        if (this.localVideoEl) {
            this.localVideoEl.style.opacity = enabled ? '1' : '0.3';
        }
    }

    public dispose(): void {
        if(this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
            this.localStream = null;
        }
        this.cleanupMediaElement(this.audioEl);
        this.audioEl = null;
        this.cleanupMediaElement(this.localVideoEl);
        this.localVideoEl = null;
        this.cleanupMediaElement(this.remoteVideoEl);
        this.remoteVideoEl = null;
        this.localStreamPromise = undefined;
        this.logger.log('Dispose');
        this.pc?.close();
        this.pc = null;
    }
    
    private async ensureLocalStream(options: CallOptions = {}): Promise<void> {
        if (this.localStreamPromise) {
            return this.localStreamPromise;
        }
        const useVideo = !!options.withVideo;
        this.localOptions = { withVideo: useVideo };
        this.localStreamPromise = this.acquireLocalStream(useVideo);
        return this.localStreamPromise;
    }

    private async acquireLocalStream(withVideo: boolean): Promise<void> {
        this.logger.log(`acquireLocalStream, video: ${withVideo}`);
        this.localStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            },
            video: withVideo ? { facingMode: 'user' } : false
        });
        this.localStream.getTracks().forEach(track => {
            this.logger.log(`Adding local track: ${track.kind}`);
            this.pc.addTrack(track, this.localStream);
            // Note: Encryption disabled for better compatibility
            // this.applyEncryption(track.kind as 'audio' | 'video');
        });
        if (withVideo) {
            this.appendVideoStreamToDom(this.localStream, 'webrtc-video-local', true);
        }
    }

    private async appendAudioStreamToDom(stream: MediaStream): Promise<void> {
        this.logger.log('appendAudioStreamToDom called');
        if(!this.audioEl) {
            this.audioEl = document.createElement('audio');
            this.audioEl.autoplay = true;
            this.audioEl.volume = 1.0;
        }
        this.audioEl.srcObject = stream;
        this.logger.log(`Audio element created, stream tracks: ${stream.getAudioTracks().length}`);

        // Mount first to ensure element is in DOM
        this.mountElement(this.audioEl, 'webrtc-audio-mount');

        try {
            await this.audioEl.play();
            this.logger.log('Audio playback started successfully');
        } catch(err) {
            this.logger.log('Audio autoplay failed, adding controls:', err);
            this.audioEl.controls = true;
            // Try again with user gesture fallback
            const playOnClick = () => {
                this.audioEl?.play().then(() => {
                    this.logger.log('Audio started after user interaction');
                }).catch(e => this.logger.log('Still failed:', e));
                document.removeEventListener('click', playOnClick);
            };
            document.addEventListener('click', playOnClick, { once: true });
        }
    }

    private appendVideoStreamToDom(stream: MediaStream, mountId: string, isLocal = false): void {
        const videoEl = isLocal
            ? (this.localVideoEl ||= document.createElement('video'))
            : (this.remoteVideoEl ||= document.createElement('video'));
        videoEl.setAttribute('autoplay', 'true');
        videoEl.setAttribute('playsinline', 'true');
        if(isLocal) {
            videoEl.setAttribute('muted', 'true');
            videoEl.muted = true;
        } else {
            videoEl.removeAttribute('muted');
            videoEl.muted = false;
        }
        videoEl.srcObject = stream;
        this.mountElement(videoEl, mountId);
    }

    private mountElement(el: HTMLElement, mountId: string): void {
        const mount = document.getElementById(mountId);
        if (mount) {
            mount.innerHTML = '';
            mount.appendChild(el);
        } else {
            document.body.appendChild(el);
        }
    }

    private cleanupMediaElement(el?: HTMLMediaElement): void {
        if (!el) {
            return;
        }
        try {
            el.pause?.();
        } catch (err) {
            this.logger.log(err);
        }
        el.srcObject = null;
        if (el.parentElement) {
            el.parentElement.removeChild(el);
        }
    }

    private applyDecryption(mediaType: 'audio' | 'video', receiver: RTCRtpReceiver): void {
        const transformer = new TransformStream({
            transform: async (chunk: RTCEncodedAudioFrame, controller) => {
                
                try {
                    const data = new Uint8Array(chunk.data);
                    const iv = data.slice(0, 12);  // Assuming 12-byte IV
                    const encryptedData = data.slice(12);

                    const decryptedData = await this.encryption.decryptData(encryptedData, iv);
                    chunk.data = decryptedData;
                    controller.enqueue(chunk);
                } catch (error) {
                    this.logger.log('Decryption error:', error);
                }
            }
        });

        const receiverStreams =  (receiver as any).createEncodedStreams();
        receiverStreams.readable
            .pipeThrough(transformer)
            .pipeTo(receiverStreams.writable);
    }

    private applyEncryption( mediaType: 'audio' | 'video'): void {
        const sender = this.pc.getSenders().find(r => r.track.kind === mediaType);

        const transformer = new TransformStream({
            transform: async (chunk: RTCEncodedAudioFrame, controller) => {
                try {
                    const { encryptedData, iv } = await this.encryption.encryptData(chunk.data);
                    
                    const combinedData = new Uint8Array(iv.length + encryptedData.byteLength);
                    combinedData.set(iv, 0);
                    combinedData.set(encryptedData, iv.length);
                    
                    chunk.data = combinedData.buffer;
                    controller.enqueue(chunk);
                } catch (error) {
                    this.logger.log('Encryption error:', error);
                }
            }
        });

        const senderStreams = (sender as any).createEncodedStreams();
        senderStreams.readable
            .pipeThrough(transformer)
            .pipeTo(senderStreams.writable);
    }
}

// Public facing class
export class E2ECall implements IE2ECall {
    constructor(private readonly webRtcCall: WebRTCCall) {}
    public on(event: callEvents, cb: (state: RTCPeerConnectionState) => void): void {
        this.webRtcCall.on(event, cb);
    }
    public get state(): RTCPeerConnectionState {
        return this.webRtcCall.callState;
    }
    public get mode(): CallMode {
        return this.webRtcCall.mode;
    }
    public async endCall(): Promise<void> {
        return this.webRtcCall.endCall();
    }
    public toggleAudio(enabled: boolean): void {
        this.webRtcCall.toggleAudio(enabled);
    }
    public toggleVideo(enabled: boolean): void {
        this.webRtcCall.toggleVideo(enabled);
    }
}
