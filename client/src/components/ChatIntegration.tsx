/**
 * Complete Integration Example for ChatLayout
 * 
 * This file shows how to integrate the ChatLayout component
 * with your existing chat-e2ee backend and services.
 */

import React, { useState } from "react";
import { ThemeContext } from "../ThemeContext";
import ChatLayout from "./ChatLayout";

interface Message {
  id: string;
  content: string;
  isOwn: boolean;
  timestamp: Date;
  avatar?: string;
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  avatar?: string;
  unread?: number;
}

/**
 * ChatIntegration Component
 * 
 * This component demonstrates how to:
 * 1. Fetch chats from backend
 * 2. Load messages for selected chat
 * 3. Send encrypted messages
 * 4. Update UI in real-time
 * 5. Handle dark/light mode
 */
const ChatIntegration: React.FC = () => {
  const [darkMode] = React.useContext(ThemeContext) as [
    boolean,
    (value: boolean) => void
  ];

  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Sample data initialization
   * Replace with actual backend calls
   */
  const initializeSampleData = () => {
    const sampleChats: Chat[] = [
      {
        id: "1",
        name: "Alice",
        lastMessage: "See you later!",
        timestamp: new Date(),
        unread: 0,
      },
      {
        id: "2",
        name: "Bob",
        lastMessage: "Thanks for your help",
        timestamp: new Date(Date.now() - 86400000),
        unread: 2,
      },
      {
        id: "3",
        name: "Carol",
        lastMessage: "Can you help me?",
        timestamp: new Date(Date.now() - 172800000),
        unread: 1,
      },
    ];

    const sampleMessages: Message[] = [
      {
        id: "1",
        content: "Hey! How are you?",
        isOwn: false,
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: "2",
        content: "I'm doing great! How about you?",
        isOwn: true,
        timestamp: new Date(Date.now() - 3300000),
      },
      {
        id: "3",
        content: "All good! Check out this new feature",
        isOwn: false,
        timestamp: new Date(Date.now() - 3000000),
      },
    ];

    setChats(sampleChats);
    setMessages(sampleMessages);
    setActiveChat(sampleChats[0]);
  };

  /**
   * Handle sending a message
   * 
   * Steps:
   * 1. Encrypt message (using your crypto service)
   * 2. Send to backend via socket.io
   * 3. Update local state
   * 4. Handle errors
   */
  const handleSendMessage = async (content: string) => {
    if (!activeChat) return;

    try {
      setLoading(true);
      setError(null);

      // In production:
      // const encrypted = await encryptMessage(content, recipientPublicKey);
      // await socket.emit('message:send', {
      //   chatId: activeChat.id,
      //   encryptedContent: encrypted,
      //   timestamp: new Date(),
      // });

      // For now, just add to local state
      const newMessage: Message = {
        id: Date.now().toString(),
        content,
        isOwn: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
      console.error("Send message error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChat = (chat: Chat) => {
    setActiveChat(chat);
  };

  React.useEffect(() => {
    if (!chats.length) {
      initializeSampleData();
    }
  }, [chats.length]);

  return (
    <div
      className={`flex flex-col h-screen ${
        darkMode ? "bg-slate-900" : "bg-white"
      }`}
    >
      {/* Error Display */}
      {error && (
        <div className="bg-red-500 text-white px-4 py-2">
          <p>Error: {error}</p>
          <button
            onClick={() => setError(null)}
            className="text-sm underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Chat Layout */}
      <ChatLayout
        messages={messages}
        currentChat={activeChat}
        chats={chats}
        onSendMessage={handleSendMessage}
        onSelectChat={handleSelectChat}
      />

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div
            className={`px-6 py-4 rounded-lg ${
              darkMode ? "bg-slate-800" : "bg-white"
            }`}
          >
            <p>Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatIntegration;

/*
 * TODO LIST
 * 
 * - [ ] Implement call/video integration with WebRTC
 * - [ ] Add message reactions
 * - [ ] Implement message editing/deletion
 * - [ ] Add rich text formatting
 * - [ ] Implement message pinning
 * - [ ] Add group chat support
 * - [ ] Implement chat deletion
 * - [ ] Add notifications
 * 
 * SECURITY CHECKLIST
 * 
 * - [ ] Validate all user inputs
 * - [ ] Encrypt messages before transmission
 * - [ ] Use HTTPS/WSS only
 * - [ ] Implement CORS properly
 * - [ ] Rate limit API endpoints
 * - [ ] Implement CSP headers
 * - [ ] Sanitize message content (XSS prevention)
 * - [ ] Implement rate limiting on socket.io
 * - [ ] Validate file uploads
 * - [ ] Implement proper authentication
 * - [ ] Use secure session tokens
 * - [ ] Implement refresh token rotation
 */
