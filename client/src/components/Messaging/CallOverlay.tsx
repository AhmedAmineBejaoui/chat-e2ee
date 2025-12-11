import React, { useState, useEffect } from "react";
import styles from "./styles/CallOverlay.module.css";
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Volume2 } from "lucide-react";

type CallOverlayProps = {
  mode: "audio" | "video" | null;
  callState?: RTCPeerConnectionState | null;
  onEndCall: () => void;
  darkMode: boolean;
  onToggleMute?: (muted: boolean) => void;
  onToggleVideo?: (videoOff: boolean) => void;
};

const CallOverlay = ({ mode, callState, onEndCall, darkMode, onToggleMute, onToggleVideo }: CallOverlayProps) => {
  const hidden = !mode;
  const getLabel = () => {
    if (mode === "video") return "Video Call";
    if (mode === "audio") return "Audio Call";
    return "Call";
  };
  const label = getLabel();
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (mode && callState === "connected") {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [mode, callState]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusText = () => {
    switch (callState) {
      case "connecting":
        return "Connecting...";
      case "connected":
        return formatDuration(callDuration);
      case "disconnected":
        return "Disconnected";
      case "failed":
        return "Call Failed";
      case "closed":
        return "Call Ended";
      default:
        return "Calling...";
    }
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    onToggleMute?.(newMutedState);
  };

  const toggleVideo = () => {
    const newVideoOffState = !isVideoOff;
    setIsVideoOff(newVideoOffState);
    onToggleVideo?.(newVideoOffState);
  };

  return (
    <div
      className={`${styles.overlay} ${hidden ? styles.overlayHidden : ""}`}
      role="dialog"
      aria-live="assertive"
      aria-hidden={hidden}
    >
      {/* Backdrop blur */}
      <div className={styles.backdrop} />
      
      <div
        className={`${styles.overlayCard} ${
          darkMode ? "" : styles.overlayCardLight
        }`}
      >
        {/* Header with call info */}
        <div className={styles.overlayHeader}>
          <div className={styles.callInfo}>
            <div className={styles.callType}>
              {mode === "video" ? (
                <Video className={styles.callIcon} />
              ) : (
                <Phone className={styles.callIcon} />
              )}
              <span>{label}</span>
            </div>
            <div className={`${styles.callStatus} ${callState === "connected" ? styles.connected : ""}`}>
              {callState === "connected" && <span className={styles.pulseDot} />}
              {getStatusText()}
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div
          className={`${styles.videoGrid} ${
            mode === "video" ? "" : styles.videoGridHidden
          }`}
        >
          <div id="webrtc-video-remote" className={styles.remoteVideoSlot}>
            <div className={styles.videoPlaceholder}>
              <div className={styles.avatarCircle}>
                <Volume2 size={32} />
              </div>
              <span>Waiting for video...</span>
            </div>
          </div>
          <div id="webrtc-video-local" className={styles.localVideoSlot}>
            <div className={styles.localLabel}>You</div>
          </div>
        </div>

        {/* Audio Mode UI */}
        <div
          className={`${styles.audioContainer} ${
            mode === "audio" ? "" : styles.audioContainerHidden
          }`}
        >
          <div className={styles.audioVisualizer}>
            <div className={styles.avatarCircle + " " + styles.avatarLarge}>
              <Volume2 size={48} />
            </div>
            <div className={styles.audioWaves}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className={styles.wave} style={{ animationDelay: `${i * 0.3}s` }} />
              ))}
            </div>
          </div>
          <p className={styles.audioHint}>
            Audio call in progress
          </p>
        </div>

        {/* Control Buttons */}
        <div className={styles.controlsContainer}>
          {mode === "video" && (
            <button
              className={`${styles.controlBtn} ${isVideoOff ? styles.controlBtnOff : ""}`}
              onClick={toggleVideo}
              type="button"
              aria-label={isVideoOff ? "Turn on camera" : "Turn off camera"}
            >
              {isVideoOff ? <VideoOff size={22} /> : <Video size={22} />}
            </button>
          )}
          
          <button
            className={`${styles.controlBtn} ${isMuted ? styles.controlBtnOff : ""}`}
            onClick={toggleMute}
            type="button"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
          </button>

          <button
            className={styles.hangupBtn}
            onClick={onEndCall}
            type="button"
            aria-label="End call"
          >
            <PhoneOff size={24} />
          </button>
        </div>

        <div id="webrtc-audio-mount" className={styles.audioMount} />
      </div>
    </div>
  );
};

export default CallOverlay;
