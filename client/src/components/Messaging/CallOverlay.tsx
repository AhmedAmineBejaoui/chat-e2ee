import React from "react";
import styles from "./styles/CallOverlay.module.css";

type CallOverlayProps = {
  mode: "audio" | "video" | null;
  callState?: RTCPeerConnectionState | null;
  onEndCall: () => void;
  darkMode: boolean;
};

const CallOverlay = ({ mode, callState, onEndCall, darkMode }: CallOverlayProps) => {
  const hidden = !mode;
  const label = mode === "video" ? "Appel vidéo" : mode === "audio" ? "Appel audio" : "Appel";

  return (
    <div
      className={`${styles.overlay} ${hidden ? styles.overlayHidden : ""}`}
      role="dialog"
      aria-live="assertive"
      aria-hidden={hidden}
    >
      <div
        className={`${styles.overlayCard} ${
          !darkMode ? styles.overlayCardLight : ""
        }`}
      >
        <div className={styles.overlayHeader}>
          <div>
            {label} {mode && <>&mdash; {callState || "en cours..."}</>}
          </div>
          {mode && (
            <button className={styles.hangupBtn} onClick={onEndCall} type="button">
              Raccrocher
            </button>
          )}
        </div>
        <div
          className={`${styles.videoGrid} ${
            mode === "video" ? "" : styles.videoGridHidden
          }`}
        >
          <div id="webrtc-video-remote" className={styles.remoteVideoSlot} />
          <div id="webrtc-video-local" className={styles.localVideoSlot} />
        </div>
        <div
          className={`${styles.audioHint} ${
            mode === "audio" ? "" : styles.audioHintHidden
          }`}
        >
          Micro activé. Vous pouvez couper l'appel à tout moment.
        </div>
        <div id="webrtc-audio-mount" className={styles.audioMount} />
      </div>
    </div>
  );
};

export default CallOverlay;
