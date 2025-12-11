import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    createChatInstance, utils, TypeUsersInChannel, setConfig, IE2ECall
} from '@chat-e2ee/service';
import { Message, NewMessageForm, ScrollWrapper, CallOverlay } from '../../components/Messaging';
import LinkSharingInstruction from '../../components/Messaging/LinkSharingInstruction';
import GroupMembersList from '../../components/Messaging/GroupMembersList';
import Notification from '../../components/Notification';
import notificationAudio from '../../components/Notification/audio.mp3';
import ringtoneAudio from '../../components/Notification/ringtone.mp3';
import { ThemeContext } from '../../ThemeContext';
import { LS, SS } from '../../utils/storage';
import {
    getKeyPairFromCache, getUserSessionID, isEmptyMessage, storeKeyPair, storeUserSessionID
} from './helpers';
import { getServerURL } from '../../utils/serverConfig';
import { MessageCircle, Phone, Video, Moon, Trash2, Lock, Users, User } from 'lucide-react';

const serverURL = getServerURL();

setConfig({
  apiURL: serverURL,
  socketURL: serverURL,
});

const chate2ee = createChatInstance();
type messageObj = {
  body?: string;
  image?: string;
  audio?: string;
  file?: any;
  sender?: string;
  id?: string;
  local?: boolean;
  timestamp?: any;
}[];

const Chat = () => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<messageObj>([]);
  const [selectedImg, setSelectedImg] = useState("");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [voiceClip, setVoiceClip] = useState("");
  const [previewImg, setPreviewImg] = useState(false);
  const [voiceUploading, setVoiceUploading] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);
  const [usersInChannel, setUsers] = useState<{ uuid?: string }[]>([]);
  const [notificationState, setNotificationState] = useState(false);
  const [deliveredID, setDeliveredID] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useContext(ThemeContext);
  const [linkActive, setLinkActive] = useState(true);
  const [cryptoError, setCryptoError] = useState<string | null>(null);
  const [activeCallMode, setActiveCallMode] = useState<"audio" | "video" | null>(null);
  const [callState, setCallState] = useState<RTCPeerConnectionState | null>(null);
  const [isGroupMode, setIsGroupMode] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [isRinging, setIsRinging] = useState(false);
  const navigate = useNavigate();

  const myKeyRef = useRef<{ privateKey?: string } | null>();
  const notificationTimer = useRef<number | undefined>(undefined);
  const callRef = useRef<IE2ECall | null>(null);
  const callStateHandlerRef = useRef<((state: RTCPeerConnectionState) => void) | null>(null);
  const ringtoneAudioRef = useRef<HTMLAudioElement | null>(null);

  const params = useParams<{ channelID: string }>();
  const channelID = params.channelID;

  let userId = getUserSessionID(channelID);
  if (!userId) {
    userId = utils.generateUUID();
  }

  useEffect(() => {
    storeUserSessionID(channelID, userId);
  }, [channelID, userId]);


  useEffect(() => {
    if (LS.get("store-chat-messages") && messages.length > 0) {
      SS.set(`chat#${channelID}`, messages);
    }
  }, [channelID, messages]);

  const playNotification = () => {
    setNotificationState(true);
    window.clearTimeout(notificationTimer.current);
    notificationTimer.current = window.setTimeout(() => {
      setNotificationState(false);
    }, 500);
  };

  const playRingtone = () => {
    if (!ringtoneAudioRef.current) {
      ringtoneAudioRef.current = new Audio(ringtoneAudio);
      ringtoneAudioRef.current.loop = true;
      ringtoneAudioRef.current.volume = 0.5;
    }
    
    setIsRinging(true);
    ringtoneAudioRef.current.play().catch(err => console.error('Ringtone play error:', err));
  };

  const stopRingtone = () => {
    if (ringtoneAudioRef.current) {
      ringtoneAudioRef.current.pause();
      ringtoneAudioRef.current.currentTime = 0;
    }
    setIsRinging(false);
  };

  const initPublicKey = async (channelID: string, forceGroupMode = false) => {
    try {
      await chate2ee.init();
    } catch (err: any) {
      console.error('Failed to initialize crypto / SDK:', err);
      setCryptoError(err?.message || String(err));
      return;
    }
    let _keyPair = await getKeyPairFromCache(channelID);
    if (!_keyPair) {
      _keyPair = chate2ee.getKeyPair();
      await storeKeyPair(channelID, _keyPair).catch((error) => {
        console.error("Failed to cache key pair securely", error);
      });
      console.log("KeyPair received");
    }
    myKeyRef.current = _keyPair;

    // Determine if this should be group mode
    const urlParams = new URLSearchParams(window.location.search);
    const modeParam = urlParams.get('mode');
    const shouldBeGroup = forceGroupMode || modeParam === 'group';

    if (shouldBeGroup) {
      setIsGroupMode(true);
      // Prompt for username if not set
      if (!userName) {
        const name = prompt("Entrez votre nom pour rejoindre le groupe:", `User${Math.floor(Math.random() * 1000)}`);
        if (name) {
          setUserName(name);
          chate2ee.joinGroup(channelID, userId, name);
        } else {
          // Fallback to private mode if no name provided
          setIsGroupMode(false);
          chate2ee.setChannel(channelID, userId);
        }
      } else {
        chate2ee.joinGroup(channelID, userId, userName);
      }
    } else {
      // Default to group mode and ask for name
      setIsGroupMode(true);
      if (!userName) {
        const name = prompt("Entrez votre nom pour rejoindre la conversation:", `User${Math.floor(Math.random() * 1000)}`);
        if (name) {
          setUserName(name);
          chate2ee.joinGroup(channelID, userId, name);
        } else {
          setUserName(`User${Math.floor(Math.random() * 1000)}`);
          chate2ee.joinGroup(channelID, userId, `User${Math.floor(Math.random() * 1000)}`);
        }
      } else {
        chate2ee.joinGroup(channelID, userId, userName);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (voiceUploading) {
      alert("Voice message is uploading, please wait.");
      return;
    }

    if (isEmptyMessage(text) && !selectedImg && !voiceClip && !selectedFile) {
      alert("Please enter a message or attach media.");
      return;
    }

    if (!chate2ee.isEncrypted()) {
      alert("No one is in chat!");
      return;
    }

    setMessages((prevMsg) =>
      prevMsg.concat({
        body: text,
        image: selectedImg,
        file: selectedFile,
        audio: voiceClip,
        sender: userId,
        local: true
      })
    );
    resetComposer();
  };

  const resetImageHandler = () => {
    setSelectedImg("");
    setPreviewImg(false);
    setText("");
  };

  const clearVoiceClip = () => {
    setVoiceClip("");
    setVoiceUploading(false);
  };

  const resetComposer = () => {
    setText("");
    setSelectedImg("");
    setPreviewImg(false);
    setVoiceClip("");
    setVoiceUploading(false);
    setSelectedFile(null);
    setFileUploading(false);
  };

  const uploadAndSetFile = async (file: File) => {
    setFileUploading(true);
    try {
      const res = await chate2ee.uploadFile(file);
      if (res?.success && res.file) {
        setSelectedFile(res.file);
        // optionally set text to filename
        setText((prev) => prev || res.file.originalName);
      } else {
        alert(res.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error', err);
      alert('Erreur lors de l\'upload');
    } finally {
      setFileUploading(false);
    }
  };

  const resetCallState = useCallback(() => {
    stopRingtone();
    setActiveCallMode(null);
    setCallState(null);
    callRef.current = null;
  }, []);

  const attachCall = useCallback((call: IE2ECall | null) => {
    if (!call) {
      resetCallState();
      return;
    }
    callRef.current = call;
    setActiveCallMode(call.mode);
    setCallState(call.state);
    
    // Play ringtone if call is in connecting state
    if (call.state === "new" || call.state === "connecting") {
      playRingtone();
    }
    
    if (!callStateHandlerRef.current) {
      callStateHandlerRef.current = (state: RTCPeerConnectionState) => {
        setCallState(state);
        
        // Stop ringtone when call is connected or ended
        if (state === "connected") {
          stopRingtone();
        }
        
        if (state === "closed" || state === "disconnected" || state === "failed") {
          resetCallState();
        }
      };
    }
    call.on("state-changed", callStateHandlerRef.current);
  }, [resetCallState]);

  const handleSend = useCallback(async (body: string, image: string = "", audio: string = "", index: number, file: any = null) => {
    if (!chate2ee.isEncrypted()) {
      alert("Key not received / No one in chat");
    }

    const { id, timestamp } = await chate2ee.encrypt({ image, audio, text: body, file }).send();

    setMessages((prevMsg) => {
      const { ...message } = prevMsg[index];
      message.local = false;
      message.id = id;
      message.timestamp = timestamp;
      prevMsg[index] = message;
      return [...prevMsg];
    });
  }, []);

  const getSetUsers = async () => {
    const usersInChannel: TypeUsersInChannel = [];

    try {
      const response: any = await chate2ee.getUsersInChannel();
      console.log('[getSetUsers] Response from API:', response);
      
      // Handle both array and object with users property
      const users = Array.isArray(response) ? response : (response?.users || []);
      usersInChannel.push(...users);
      
      console.log('[getSetUsers] Users in channel:', usersInChannel);
      console.log('[getSetUsers] Current user ID:', userId);
      console.log('[getSetUsers] Group mode:', isGroupMode);
    } catch (err) {
      console.error('[getSetUsers] Error:', err);
    }

    setUsers(usersInChannel);
    const otherUsers = usersInChannel.filter((user) => user.uuid !== userId);
    console.log('[getSetUsers] Other users:', otherUsers);

    if (otherUsers.length > 0) {
      playNotification();
    }
  };

  const validateCallReady = useCallback(() => {
    // Allow calls in group mode only when there are exactly 2 users
    const totalUsers = usersInChannel.length;
    if (isGroupMode && totalUsers > 2) {
      alert("Les appels ne sont supportés qu'entre 2 personnes. Actuellement " + totalUsers + " membres.");
      return false;
    }
    if (!chate2ee.isEncrypted()) {
      alert("No one is in chat!");
      return false;
    }
    const hasPeer = usersInChannel.some((user) => user.uuid && user.uuid !== userId);
    if (!hasPeer) {
      alert("Attendez que votre correspondant rejoigne la conversation.");
      return false;
    }
    if (totalUsers !== 2) {
      alert("Les appels nécessitent exactement 2 participants.");
      return false;
    }
    return true;
  }, [usersInChannel, userId, isGroupMode]);

  const startCall = useCallback(
    async (withVideo: boolean) => {
      if (callRef.current) {
        alert("Un appel est déjà en cours.");
        return;
      }
      if (!validateCallReady()) {
        return;
      }
      if (chate2ee.activeCall && !callRef.current) {
        try {
          await chate2ee.endCall();
        } catch (err) {
          console.warn("Impossible de terminer l'appel précédent", err);
        }
        resetCallState();
      }
      try {
        playRingtone();
        const call = await chate2ee.startCall({ withVideo });
        attachCall(call);
      } catch (err: any) {
        stopRingtone();
        console.error(err);
        if (err?.message?.toLowerCase().includes("call already active")) {
          if (chate2ee.activeCall) {
            attachCall(chate2ee.activeCall);
          }
          alert("Un appel est déjà actif. Veuillez raccrocher avant d'en démarrer un nouveau.");
        } else {
          alert(err?.message || "Impossible d'initialiser l'appel.");
        }
      }
    },
    [attachCall, validateCallReady, resetCallState]
  );

  const startAudioCall = useCallback(() => startCall(false), [startCall]);
  const startVideoCall = useCallback(() => startCall(true), [startCall]);
  const endActiveCall = useCallback(async () => {
    try {
      await callRef.current?.endCall();
    } catch (err) {
      console.error(err);
    } finally {
      resetCallState();
    }
  }, [resetCallState]);

  useEffect(() => {
    const handleCallAdded = (call: IE2ECall) => {
      attachCall(call);
    };
    const handleCallRemoved = () => {
      resetCallState();
    };
    chate2ee.on("call-added", handleCallAdded);
    chate2ee.on("call-removed", handleCallRemoved);
  }, [attachCall, resetCallState]);

  const toggleGroupMode = async () => {
    if (isGroupMode) {
      // Switch to private mode
      setIsGroupMode(false);
      // Reinitialize with private mode
      await initPublicKey(channelID, false);
    } else {
      // Switch to group mode
      setIsGroupMode(true);
      // Reinitialize with group mode
      await initPublicKey(channelID, true);
    }
  };

  const handleDeleteLink = async () => {
    if (window.confirm("Are you sure you want to delete this chat link? This action cannot be undone.")) {
      setLinkActive(false);
      await chate2ee.delete();
      navigate("/");
    }
  };

  const initChat = async () => {
    const messages = SS.get(`chat#${channelID}`);
    if (!messages) {
      return;
    }
    setMessages((prevMsg) => prevMsg.concat(messages));
  };

  useEffect(() => {
    initPublicKey(channelID).then(() => {
      chate2ee.on("limit-reached", () => {
        setMessages((prevMsg) =>
          prevMsg.concat({
            image: "",
            body: `Sorry, can't be used by more than two users. Check if the link is open on other tab`,
            sender: ""
          })
        );
      });
      chate2ee.on("delivered", (id: string) => {
        setDeliveredID((prev) => [...prev, id]);
      });
      chate2ee.on("on-alice-join", ({ publicKey }: { publicKey: string | null }) => {
        if (publicKey) {
          playNotification();
        }
        getSetUsers();
      });

      chate2ee.on("on-alice-disconnect", () => {
        console.log("alice disconnected!!");
        playNotification();
        getSetUsers();
      });

      // Group event handlers
      chate2ee.on("on-member-join", (data: any) => {
        console.log("Member joined:", data);
        playNotification();
        getSetUsers();
      });

      chate2ee.on("on-member-leave", (data: any) => {
        console.log("Member left:", data);
        playNotification();
        getSetUsers();
      });

      chate2ee.on("member-list-update", (data: any) => {
        console.log("Member list updated:", data);
        getSetUsers();
      });

      chate2ee.on(
        "chat-message",
        async (msg: {
          message: string;
          image: string;
          audio?: string;
          file?: any;
          sender: string;
          id: string;
          timestamp: number;
        }) => {
          try {
            const message = await chate2ee.decryptMessage(msg.message);
            setMessages((prevMsg) =>
              prevMsg.concat({
                image: msg.image,
                file: msg.file,
                audio: msg.audio,
                body: message,
                sender: msg.sender,
                id: msg.id,
                timestamp: msg.timestamp
              })
            );
          } catch (err) {
            console.error(err);
            setCryptoError((err as Error)?.message || "Unable to decrypt message.");
          }
        }
      );

      getSetUsers();
      initChat();
    });
    return () => chate2ee.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelID]);

  const alice = usersInChannel.find((u) => u.uuid !== userId);
  const messagesFormatted = messages.map(({ body, sender, image, audio, local, id, timestamp }, i) => {
    return {
      owner: sender === userId,
      body,
      image,
      file: (messages as any)[i]?.file,
      audio,
      local,
      id,
      timestamp
    };
  });

  if (linkActive) {
    if (cryptoError) {
      return (
        <div className="p-5 font-mono text-red-500">
          <h2>Encryption Initialization Error</h2>
          <p>{cryptoError}</p>
          <p>Ensure you are accessing via <code>localhost</code> or HTTPS.</p>
        </div>
      );
    }
    return (
      <div 
        className="relative min-h-screen text-white font-sans overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0a1929 0%, #001e3c 50%, #0a1929 100%)",
        }}
      >
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse" 
               style={{ animation: "float 15s ease-in-out infinite" }} />
          <div className="absolute top-40 right-20 w-80 h-80 bg-blue-600/20 rounded-full blur-[120px]" 
               style={{ animation: "float 12s ease-in-out infinite reverse" }} />
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-purple-500/15 rounded-full blur-[100px]" 
               style={{ animation: "float 18s ease-in-out infinite" }} />
        </div>

        {/* Geometric background pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-msg" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0ff" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-msg)" />
          </svg>
        </div>

        {/* Animated diagonal lines background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg width="100%" height="100%" viewBox="0 0 1200 800" className="absolute" style={{ opacity: 0.5 }}>
            <defs>
              <linearGradient id="cyanGrad-msg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#0ff", stopOpacity: 0.8 }} />
                <stop offset="100%" style={{ stopColor: "#0ff", stopOpacity: 0.2 }} />
              </linearGradient>
              <linearGradient id="purpleGrad-msg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#a855f7", stopOpacity: 0.8 }} />
                <stop offset="100%" style={{ stopColor: "#a855f7", stopOpacity: 0.2 }} />
              </linearGradient>
            </defs>

            {/* Animated lines */}
            <g opacity="0.7">
              <path d="M 100 700 L 300 600" stroke="#0ff" strokeWidth="2" fill="none" strokeLinecap="round">
                <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
                <animateTransform attributeName="transform" type="translate" values="0,0; 10,-10; 0,0" dur="6s" repeatCount="indefinite" />
              </path>
              <path d="M 1100 100 L 900 200" stroke="#0ff" strokeWidth="2" fill="none" strokeLinecap="round">
                <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.8s" repeatCount="indefinite" />
                <animateTransform attributeName="transform" type="translate" values="0,0; -10,10; 0,0" dur="5s" repeatCount="indefinite" />
              </path>
              <path d="M 1050 650 L 850 550" stroke="url(#cyanGrad-msg)" strokeWidth="2" fill="none" strokeLinecap="round">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="3.5s" repeatCount="indefinite" />
                <animateTransform attributeName="transform" type="translate" values="0,0; 8,8; 0,0" dur="7s" repeatCount="indefinite" />
              </path>
              <path d="M 200 300 L 400 200" stroke="url(#purpleGrad-msg)" strokeWidth="2" fill="none" strokeLinecap="round">
                <animate attributeName="opacity" values="0.4;0.85;0.4" dur="3.2s" repeatCount="indefinite" />
                <animateTransform attributeName="transform" type="translate" values="0,0; -8,8; 0,0" dur="6.5s" repeatCount="indefinite" />
              </path>
              <path d="M 900 700 L 700 600" stroke="url(#purpleGrad-msg)" strokeWidth="2" fill="none" strokeLinecap="round">
                <animate attributeName="opacity" values="0.3;0.75;0.3" dur="2.9s" repeatCount="indefinite" />
                <animateTransform attributeName="transform" type="translate" values="0,0; 12,-8; 0,0" dur="5.8s" repeatCount="indefinite" />
              </path>
            </g>

            {/* Animated circles */}
            <circle cx="150" cy="680" r="6" fill="#0ff" opacity="0.6">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
              <animate attributeName="r" values="5;10;5" dur="2s" repeatCount="indefinite" />
              <animate attributeName="cy" values="680;670;680" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle cx="1050" cy="120" r="7" fill="#a855f7" opacity="0.5">
              <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="r" values="6;12;6" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="cy" values="120;110;120" dur="3.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="600" cy="400" r="8" fill="#00d9ff" opacity="0.4">
              <animate attributeName="opacity" values="0.2;0.7;0.2" dur="3s" repeatCount="indefinite" />
              <animate attributeName="r" values="7;13;7" dur="3s" repeatCount="indefinite" />
              <animate attributeName="cx" values="600;610;600" dur="5s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${8 + Math.random() * 10}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: 0.3 + Math.random() * 0.4,
              }}
            />
          ))}
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            25% { transform: translateY(-20px) translateX(10px); }
            50% { transform: translateY(-10px) translateX(-10px); }
            75% { transform: translateY(-15px) translateX(5px); }
          }
        `}</style>

        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Header */}
          <header className="w-full max-w-6xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 pt-8 pb-6 border-b border-cyan-400/20 backdrop-blur-sm bg-gradient-to-r from-blue-900/20 via-cyan-900/10 to-blue-900/20 relative">
            {/* Animated border glow effect */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50">
              <div className="h-full w-1/3 bg-cyan-400 blur-sm animate-pulse" 
                   style={{ animation: "slideGlow 3s ease-in-out infinite" }} />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300 animate-pulse" />
                <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border-2 border-cyan-400/50 flex items-center justify-center shadow-[0_10px_40px_rgba(0,255,255,0.4)] group-hover:shadow-[0_15px_50px_rgba(0,255,255,0.6)] transition-all duration-300 group-hover:scale-110">
                  <MessageCircle className="w-7 h-7 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                  <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20 animate-ping" style={{ animationDuration: '2s' }} />
                </div>
                {alice && (
                  <div className="absolute -bottom-1 -right-1 flex items-center justify-center">
                    <div className="absolute w-4 h-4 bg-green-400 rounded-full animate-ping" />
                    <div className="relative w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[#0a1929] shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                  </div>
                )}
              </div>
              <div className="relative">
                <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  {alice ? (
                    <>
                      <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                      Connected
                    </>
                  ) : (
                    <>
                      <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
                      Waiting to join...
                    </>
                  )}
                </p>
                <h2 className="font-bold text-xl leading-tight text-white bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                  {isGroupMode ? "Groupe Chat" : "Secure Chat"}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-white/60">
                  <Lock className="w-3 h-3 text-cyan-400 animate-pulse" style={{ animationDuration: '3s' }} />
                  <span>End-to-end encrypted</span>
                  {isGroupMode && (
                    <>
                      <span className="mx-1">•</span>
                      <Users className="w-3 h-3 text-cyan-400" />
                      <span>{usersInChannel.length} membres</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleGroupMode} 
                className={`relative p-2.5 rounded-full border-2 border-cyan-400/50 bg-cyan-400/10 text-cyan-400 hover:bg-cyan-400 hover:text-black hover:scale-110 hover:shadow-[0_0_20px_rgba(0,255,255,0.6)] transition-all duration-300 group ${isGroupMode ? 'bg-cyan-400 text-black' : ''}`}
                title={isGroupMode ? `Mode Groupe (${usersInChannel.length} membres)` : "Basculer en mode Groupe"}
              >
                {isGroupMode ? <Users className="w-5 h-5 relative z-10" /> : <User className="w-5 h-5 relative z-10" />}
                <div className="absolute inset-0 rounded-full bg-cyan-400/0 group-hover:bg-cyan-400/20 blur-lg transition-all duration-300" />
              </button>
              <button 
                onClick={startAudioCall} 
                className="relative p-2.5 rounded-full border-2 border-cyan-400/50 bg-cyan-400/10 text-cyan-400 hover:bg-cyan-400 hover:text-black hover:scale-110 hover:shadow-[0_0_20px_rgba(0,255,255,0.6)] transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                title={usersInChannel.length === 2 ? "Audio Call" : `Appels disponibles avec 2 personnes (actuellement ${usersInChannel.length})`}
                disabled={usersInChannel.length !== 2}
              >
                <Phone className="w-5 h-5 relative z-10" />
                <div className="absolute inset-0 rounded-full bg-cyan-400/0 group-hover:bg-cyan-400/20 blur-lg transition-all duration-300" />
              </button>
              <button 
                onClick={startVideoCall} 
                className="relative p-2.5 rounded-full border-2 border-cyan-400/50 bg-cyan-400/10 text-cyan-400 hover:bg-cyan-400 hover:text-black hover:scale-110 hover:shadow-[0_0_20px_rgba(0,255,255,0.6)] transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                title={usersInChannel.length === 2 ? "Video Call" : `Appels disponibles avec 2 personnes (actuellement ${usersInChannel.length})`}
                disabled={usersInChannel.length !== 2}
              >
                <Video className="w-5 h-5 relative z-10" />
                <div className="absolute inset-0 rounded-full bg-cyan-400/0 group-hover:bg-cyan-400/20 blur-lg transition-all duration-300" />
              </button>
              <button 
                onClick={() => setDarkMode(!darkMode)} 
                className="relative p-2.5 rounded-full border-2 border-cyan-400/50 bg-cyan-400/10 text-cyan-400 hover:bg-cyan-400 hover:text-black hover:scale-110 hover:shadow-[0_0_20px_rgba(0,255,255,0.6)] transition-all duration-300 group"
                title="Toggle Theme"
              >
                <Moon className="w-5 h-5 relative z-10" />
                <div className="absolute inset-0 rounded-full bg-cyan-400/0 group-hover:bg-cyan-400/20 blur-lg transition-all duration-300" />
              </button>
              <button 
                onClick={handleDeleteLink} 
                className="relative p-2.5 rounded-full border-2 border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white hover:scale-110 hover:shadow-[0_0_20px_rgba(239,68,68,0.6)] transition-all duration-300 group"
                title="Delete Chat"
              >
                <Trash2 className="w-5 h-5 relative z-10" />
                <div className="absolute inset-0 rounded-full bg-red-500/0 group-hover:bg-red-500/20 blur-lg transition-all duration-300" />
              </button>
            </div>

            <style>{`
              @keyframes slideGlow {
                0%, 100% { transform: translateX(-100%); }
                50% { transform: translateX(200%); }
              }
            `}</style>
          </header>

          {/* Messages Area */}
          <main className="flex-1 w-full">
            <div className="max-w-6xl mx-auto px-3 sm:px-6 pb-28">
              <div className="flex-1 flex flex-col min-h-[60vh] pt-4">
                <ScrollWrapper messageCount={messagesFormatted.length}>
                  <div className="flex flex-col gap-4 pb-10">
                    {/* Encryption Notice */}
                    <div className="flex justify-center mt-2 mb-6">
                      <div className="relative group">
                        {/* Glowing background animation */}
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-blue-500/30 to-cyan-400/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse" />
                        
                        {/* Main badge */}
                        <div className="relative bg-gradient-to-r from-cyan-900/60 to-blue-900/60 border-2 border-cyan-400/50 rounded-full px-6 py-3 flex items-center gap-3 text-sm shadow-[0_10px_40px_rgba(0,255,255,0.3)] backdrop-blur-sm group-hover:border-cyan-400/80 group-hover:shadow-[0_15px_50px_rgba(0,255,255,0.5)] transition-all duration-300">
                          {/* Animated border effect */}
                          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/0 group-hover:border-cyan-400/30 transition-all duration-300" style={{ padding: '2px' }} />
                          
                          <Lock className="w-5 h-5 text-cyan-400 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                          <span className="font-bold text-cyan-400 uppercase tracking-wide relative z-10 bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
                            Hey! This connection is encrypted
                          </span>
                          
                          {/* Pulse rings */}
                          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20 animate-ping" style={{ animationDuration: '3s' }} />
                        </div>
                      </div>
                    </div>

                    {messagesFormatted.map((message, index) => (
                      <Message
                        key={message.id || index}
                        handleSend={handleSend}
                        index={index}
                        message={message}
                        deliveredID={deliveredID}
                      />
                    ))}
                    
                    {!alice && (
                      <div className="mt-8 flex justify-center">
                        <LinkSharingInstruction
                          link={window.location.href}
                          pin={new URLSearchParams(window.location.search).get("pin")}
                          darkMode={darkMode}
                        />
                      </div>
                    )}
                  </div>
                </ScrollWrapper>
              </div>
            </div>
          </main>

          {/* Input Area */}
          <div className="fixed bottom-0 left-0 right-0 border-t-2 border-cyan-400/30 bg-gradient-to-br from-blue-900/80 to-cyan-900/60 backdrop-blur-xl relative overflow-hidden">
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent animate-pulse pointer-events-none" />
            
            {/* Floating particles in input area */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
                  style={{
                    left: `${10 + i * 12}%`,
                    bottom: `${20 + Math.random() * 40}%`,
                    animation: `float ${4 + Math.random() * 4}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
            
            {/* Top glow line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent">
              <div className="h-full w-1/4 bg-cyan-400 blur-sm" 
                   style={{ animation: "slideGlow 4s ease-in-out infinite" }} />
            </div>
            
            <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 relative z-10">
              {isGroupMode && (
                <div className="mb-4">
                  <GroupMembersList
                    members={usersInChannel.map(u => u.uuid || '').filter(id => id)}
                    currentUserId={userId}
                    maxMembers={100}
                    isOpen={true}
                    onToggle={() => {}}
                    darkMode={darkMode}
                  />
                </div>
              )}
              
              <NewMessageForm
                handleSubmit={handleSubmit}
                text={text}
                setText={setText}
                selectedImg={selectedImg}
                setSelectedImg={setSelectedImg}
                previewImg={previewImg}
                setPreviewImg={setPreviewImg}
                resetImage={resetImageHandler}
                voiceClip={voiceClip}
                setVoiceClip={setVoiceClip}
                clearVoiceClip={clearVoiceClip}
                voiceUploading={voiceUploading}
                setVoiceUploading={setVoiceUploading}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                fileUploading={fileUploading}
                setFileUploading={setFileUploading}
                onFileChoose={uploadAndSetFile}
              />
            </div>
          </div>

          <Notification play={notificationState} audio={notificationAudio} />
          <CallOverlay
            mode={activeCallMode}
            callState={callState}
            onEndCall={endActiveCall}
            darkMode={darkMode}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div 
        className="min-h-screen text-white flex flex-col items-center justify-center gap-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0a1929 0%, #001e3c 50%, #0a1929 100%)",
        }}
      >
        {/* Animated background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/15 rounded-full blur-[100px]" 
               style={{ animation: "float 10s ease-in-out infinite" }} />
        </div>

        {/* Geometric pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-expired" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ef4444" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-expired)" />
          </svg>
        </div>

        {/* Icon with animation */}
        <div className="relative group">
          <div className="absolute inset-0 bg-red-500/30 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500 animate-pulse" />
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-red-500/30 to-red-600/30 border-2 border-red-400/50 flex items-center justify-center shadow-[0_20px_60px_rgba(239,68,68,0.4)] group-hover:shadow-[0_25px_70px_rgba(239,68,68,0.6)] transition-all duration-300 group-hover:scale-110">
            <Trash2 className="w-12 h-12 text-red-400 group-hover:text-red-300 transition-colors animate-pulse" style={{ animationDuration: '2s' }} />
            <div className="absolute inset-0 rounded-full border-2 border-red-400/20 animate-ping" style={{ animationDuration: '3s' }} />
          </div>
        </div>

        <div className="text-center space-y-3 relative z-10">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent animate-pulse" style={{ animationDuration: '3s' }}>
            Link Expired
          </h2>
          <p className="text-white/70 text-lg max-w-md">This chat link is no longer active.</p>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="relative mt-4 px-10 py-5 bg-cyan-400 text-black rounded-2xl font-bold uppercase text-sm tracking-wider hover:bg-transparent hover:text-cyan-400 border-2 border-cyan-400 transition-all duration-300 shadow-[0_10px_40px_rgba(0,255,255,0.4)] hover:shadow-[0_15px_50px_rgba(0,255,255,0.6)] hover:scale-105 group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <span className="relative z-10">Create New Link</span>
        </button>
        
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            25% { transform: translateY(-20px) translateX(10px); }
            50% { transform: translateY(-10px) translateX(-10px); }
            75% { transform: translateY(-15px) translateX(5px); }
          }
        `}</style>
      </div>
    );
  }
};

export default Chat;
