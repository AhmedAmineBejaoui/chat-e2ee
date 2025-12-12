import React from 'react';

interface MessageBubbleProps {
  message: any;
  isOwn: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  const alignment = isOwn ? 'self-end items-end' : 'self-start items-start';
  const bg = isOwn ? 'bg-holo-cyan/90 text-[#04262d]' : 'bg-holo-panel/80 text-holo-text-primary';

  return (
    <div className={`flex flex-col ${alignment} w-full`}>
      <div className={`rounded-xl px-3 py-2 break-words ${bg} max-w-[80%] md:max-w-[60%] lg:max-w-[45%]`}>
        {message.messageType === 'audio' ? (
          <div className="audio-message">
            <audio controls className="w-full">
              <source src={message.audioUrl} type="audio/webm" />
              Votre navigateur ne supporte pas l'élément audio.
            </audio>
            <div className="text-xs text-holo-text-secondary mt-2">Taille: {(message.audioSize / 1024).toFixed(2)} KB</div>
          </div>
        ) : (
          <p className="text-sm leading-relaxed">{message.content}</p>
        )}
      </div>
      <small className="text-[11px] text-holo-text-secondary mt-1">{new Date(message.timestamp).toLocaleTimeString()}</small>
    </div>
  );
};

export default MessageBubble;
