import React from "react";
import { FiPhoneCall, FiVideo, FiPhoneOff } from "react-icons/fi";

type CallMode = "audio" | "video" | null;

type CallControlsProps = {
  activeMode: CallMode;
  callState?: RTCPeerConnectionState | null;
  onStartAudio: () => void;
  onStartVideo: () => void;
  onEndCall: () => void;
  darkMode: boolean;
};

const CallControls = ({
  activeMode,
  callState,
  onStartAudio,
  onStartVideo,
  onEndCall,
  darkMode: _darkMode,
}: CallControlsProps) => {
  const callActive = Boolean(activeMode);

  const iconBtn =
    "inline-flex items-center justify-center rounded-full p-2.5 text-base text-[#54656f] transition hover:bg-[#e9edef]";

  return (
    <div className="flex items-center gap-2 text-[#54656f]">
      {!callActive && (
        <>
          <button
            className={iconBtn}
            disabled={callActive}
            onClick={onStartAudio}
            type="button"
            aria-label="Appel audio"
          >
            <FiPhoneCall />
          </button>
          <button
            className={iconBtn}
            disabled={callActive}
            onClick={onStartVideo}
            type="button"
            aria-label="Appel vidéo"
          >
            <FiVideo />
          </button>
        </>
      )}
      {callActive && (
        <>
          <span className="text-xs uppercase tracking-[0.2em] text-[#54656f]">
            {activeMode === "video" ? "Vidéo" : "Audio"} {callState || "en cours"}
          </span>
          <button
            className={iconBtn}
            onClick={onEndCall}
            type="button"
            aria-label="Raccrocher"
          >
            <FiPhoneOff />
          </button>
        </>
      )}
    </div>
  );
};

export default CallControls;
