import React from 'react';

interface MessageBubbleProps {
  message: any;
  isOwn: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  const bubbleClass = isOwn ? 'message-bubble-own' : 'message-bubble-other';

  return (
    <div className={`message-bubble ${bubbleClass}`}>
      {message.messageType === 'audio' ? (
        <div className="audio-message">
          <audio controls style={{ width: '100%', maxWidth: '300px' }}>
            <source src={message.audioUrl} type="audio/webm" />
            Votre navigateur ne supporte pas l'élément audio.
          </audio>
          <small className="text-muted d-block mt-2">
            Taille: {(message.audioSize / 1024).toFixed(2)} KB
          </small>
        </div>
      ) : (
        <p>{message.content}</p>
      )}
      <small className="text-muted">{new Date(message.timestamp).toLocaleTimeString()}</small>
    </div>
  );
};

export default MessageBubble;
