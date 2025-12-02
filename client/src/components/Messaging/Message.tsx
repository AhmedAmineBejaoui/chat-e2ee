import React, { useCallback, useEffect, useState } from "react";
import Image from "../Image";
import { Timestamp } from "mongodb";

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
          {audio && (
            <audio
              controls
              preload="none"
              src={audio}
              className="w-full rounded-full bg-transparent"
            >
              Your browser does not support the audio element.
            </audio>
          )}
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
