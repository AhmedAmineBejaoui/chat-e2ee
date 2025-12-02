import React, { useCallback, useEffect, useState, useRef } from "react";
import Image from "../Image";
import { Timestamp } from "mongodb";
import { Play, Pause, Volume2 } from "lucide-react";

type messageProps = {
  owner: boolean;
  body?: string;
  image?: string;
  audio?: string;
  local?: boolean;
  id?: string;
  timestamp?: Timestamp;
};

type MessageProps = {
  handleSend: any;
  index: number;
  message: messageProps;
  deliveredID?: string[];
};

// Custom Audio Player Component
const AudioPlayer = ({ src, owner }: { src: string; owner: boolean }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number.parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    if (Number.isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-3 min-w-[200px] sm:min-w-60">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
      
      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className={`flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-200 ${
          owner 
            ? 'bg-[#063943]/40 hover:bg-[#063943]/60 text-[#04262d]' 
            : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400'
        }`}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" />
        ) : (
          <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" fill="currentColor" />
        )}
      </button>

      {/* Waveform / Progress */}
      <div className="flex-1 flex flex-col gap-1">
        <div className="relative h-8 flex items-center">
          {/* Waveform visualization (decorative) */}
          <div className="absolute inset-0 flex items-center gap-[2px] opacity-40">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={`flex-1 rounded-full ${owner ? 'bg-[#063943]' : 'bg-cyan-400'}`}
                style={{
                  height: `${20 + Math.sin(i * 0.8) * 15 + Math.random() * 10}%`,
                  opacity: i / 20 <= progressPercent / 100 ? 1 : 0.3,
                }}
              />
            ))}
          </div>
          
          {/* Seek slider */}
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
          />
        </div>
        
        {/* Time display */}
        <div className={`flex justify-between text-[10px] ${owner ? 'text-[#063943]/70' : 'text-cyan-400/70'}`}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume indicator */}
      <Volume2 className={`w-4 h-4 flex-shrink-0 ${owner ? 'text-[#063943]/50' : 'text-cyan-400/50'}`} />
    </div>
  );
};

export const Message = ({
  handleSend,
  index,
  message: { owner, body, image, audio, local, id, timestamp },
  deliveredID,
}: MessageProps) => {
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const sendMessage = useCallback(async () => {
    setSending(true);
    setFailed(false);
    setSendError(null);

    try {
      await handleSend(body, image, audio, index);
    } catch (error: any) {
      console.log({ error });
      setFailed(true);
      setSendError(error?.message || null);
    }
    setSending(false);
  }, [audio, body, image, handleSend, index]);

  useEffect(() => {
    if (local) {
      sendMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bubbleColor = owner
    ? "bg-holo-cyan text-[#04262d]"
    : "bg-holo-panel/90 text-holo-text-primary border border-holo-border/70";
  const bubbleShadow = owner
    ? "shadow-[0_18px_55px_rgba(0,201,213,0.32)]"
    : "shadow-[0_20px_55px_rgba(0,0,0,0.45)]";
  const timestampColor = owner ? "text-[#063943]/70" : "text-holo-text-secondary";

  return (
    <div className={`flex w-full ${owner ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[82%] sm:max-w-[70%] flex flex-col gap-1 ${
          owner ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`rounded-3xl px-5 py-3.5 space-y-2 transition-all duration-200 backdrop-blur-md ${bubbleColor} ${bubbleShadow} ${
            owner ? "rounded-br-sm" : "rounded-bl-sm"
          }`}
        >
          {image && (
            <div className="overflow-hidden rounded-xl border border-black/10">
              <Image src={image} maxWidth="320px" maxHeight="320px" />
            </div>
          )}
          {audio && <AudioPlayer src={audio} owner={owner} />}
          {body && <p className="text-[15px] leading-relaxed">{body}</p>}
          {timestamp && (
            <div
              className={`text-[10px] tracking-wide text-right ${timestampColor} flex items-center gap-1 justify-end`}
            >
              {new Date(timestamp as any).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          )}
        </div>
        {failed && !sending && (
          <div className="text-xs text-rose-600">
            Failed to send message{sendError ? `: ${sendError}` : ""}
            <button className="ml-2 underline" onClick={sendMessage}>
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
