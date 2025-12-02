import React, { useContext, useState } from "react";
import { ThemeContext } from "../ThemeContext";
import ThemeToggle from "./ThemeToggle/ThemeToggle";
import { Send, Plus, Search, MoreVertical, Phone, Video } from "lucide-react";

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

interface ChatLayoutProps {
  messages?: Message[];
  currentChat?: Chat | null;
  onSendMessage?: (message: string) => void;
  chats?: Chat[];
  onSelectChat?: (chat: Chat) => void;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({
  messages = [
    {
      id: "1",
      content: "Hey! How are you doing?",
      isOwn: false,
      timestamp: new Date(Date.now() - 3600000),
      avatar: "👤",
    },
    {
      id: "2",
      content: "I'm doing great! Just working on some projects.",
      isOwn: true,
      timestamp: new Date(Date.now() - 3300000),
    },
    {
      id: "3",
      content: "That's awesome! Tell me more about it.",
      isOwn: false,
      timestamp: new Date(Date.now() - 3000000),
    },
    {
      id: "4",
      content: "It's an end-to-end encrypted chat application with WebRTC support.",
      isOwn: true,
      timestamp: new Date(Date.now() - 2700000),
    },
    {
      id: "5",
      content: "Wow, that sounds really cool! When will it be ready?",
      isOwn: false,
      timestamp: new Date(Date.now() - 2400000),
    },
    {
      id: "6",
      content: "Soon! I'm adding more features now.",
      isOwn: true,
      timestamp: new Date(Date.now() - 2100000),
    },
  ],
  currentChat = {
    id: "1",
    name: "Chat User",
    lastMessage: "Soon! I'm adding more features now.",
    timestamp: new Date(),
    avatar: "👤",
  },
  chats = [
    {
      id: "1",
      name: "Chat User",
      lastMessage: "Soon! I'm adding more features now.",
      timestamp: new Date(),
      unread: 0,
    },
    {
      id: "2",
      name: "Alice",
      lastMessage: "See you later!",
      timestamp: new Date(Date.now() - 86400000),
      unread: 2,
    },
    {
      id: "3",
      name: "Bob",
      lastMessage: "Thanks for your help",
      timestamp: new Date(Date.now() - 172800000),
      unread: 0,
    },
    {
      id: "4",
      name: "Carol",
      lastMessage: "Can you help me?",
      timestamp: new Date(Date.now() - 259200000),
      unread: 1,
    },
  ],
  onSendMessage = () => {},
  onSelectChat = () => {},
}) => {
  const [darkMode] = useContext(ThemeContext);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`flex h-screen bg-holo-radial text-holo-text-primary`}
    >
      {/* Sidebar */}
      <div
        className={`w-80 flex flex-col border-r border-holo-border-soft/80 bg-slate-950/60 backdrop-blur-xl shadow-holo-card`}
      >
        {/* Header */}
        <div
          className={`p-4 border-b border-holo-border-soft/80`}
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-sky-300 to-cyan-300 bg-clip-text text-transparent">
              Messages
            </h1>
            <div className="flex gap-2">
              <button
                className={`p-2 rounded-2xl bg-slate-900/80 border border-holo-border-soft/80 hover:border-holo-cyan/60 hover:bg-slate-900/60 transition-colors`}
              >
                <Plus size={20} />
              </button>
              <ThemeToggle />
            </div>
          </div>

          {/* Search Bar */}
          <div
            className={`flex items-center px-3 py-2 rounded-2xl bg-slate-900/60 border border-holo-border-soft/80 focus-within:border-holo-cyan/70 transition-colors`}
          >
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`ml-2 bg-transparent outline-none w-full placeholder-slate-400 ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            />
          </div>
        </div>

        {/* Chats List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat)}
              className={`w-full p-4 border-b transition-colors flex items-start gap-3 ${
                currentChat?.id === chat.id
                  ? darkMode
                    ? "bg-slate-700"
                    : "bg-slate-200"
                  : darkMode
                  ? "hover:bg-slate-700/50"
                  : "hover:bg-slate-100"
              } ${darkMode ? "border-slate-700" : "border-slate-200"}`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-semibold flex-shrink-0 bg-gradient-to-br from-sky-400 via-cyan-400 to-indigo-500 shadow-holo-glow`}
              >
                {chat.avatar || chat.name[0].toUpperCase()}
              </div>
              <div className="flex-1 text-left">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-sm text-slate-100">
                    {chat.name}
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    {chat.timestamp.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p
                  className={`text-xs truncate ${
                    chat.unread ? "text-slate-200" : "text-slate-500"
                  }`}
                >
                  {chat.lastMessage}
                </p>
              </div>
              {chat.unread ? (
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-400/90 flex items-center justify-center text-[10px] font-semibold text-slate-950 shadow-holo-glow">
                  {chat.unread}
                </div>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-slate-950/60 backdrop-blur-2xl shadow-holo-card border-l border-holo-border-soft/80">
        {/* Chat Header */}
        {currentChat && (
          <div
            className={`px-6 py-4 border-b border-holo-border-soft/80 flex items-center justify-between bg-slate-950/60`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-semibold bg-gradient-to-br from-sky-400 via-cyan-400 to-indigo-500 shadow-holo-glow`}
              >
                {currentChat.avatar || currentChat.name[0].toUpperCase()}
              </div>
              <div>
                <h2 className="font-semibold text-lg text-slate-50">
                  {currentChat.name}
                </h2>
                <p className={`text-[11px] text-slate-500`}>
                  Active now
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className={`p-2 rounded-2xl bg-slate-900/80 border border-holo-border-soft/80 hover:border-holo-cyan/60 hover:bg-slate-900/60 text-slate-300 transition-colors`}
              >
                <Phone size={20} />
              </button>
              <button
                className={`p-2 rounded-2xl bg-slate-900/80 border border-holo-border-soft/80 hover:border-holo-cyan/60 hover:bg-slate-900/60 text-slate-300 transition-colors`}
              >
                <Video size={20} />
              </button>
              <button
                className={`p-2 rounded-2xl bg-slate-900/80 border border-holo-border-soft/80 hover:border-holo-cyan/60 hover:bg-slate-900/60 text-slate-300 transition-colors`}
              >
                <MoreVertical size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 bg-gradient-to-b from-slate-900/40 via-slate-950/60 to-black/80">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-3xl break-words border shadow-holo-soft ${
                  message.isOwn
                    ? "bg-gradient-to-br from-cyan-400 via-sky-400 to-indigo-500 text-slate-950 border-transparent rounded-br-none"
                    : "bg-slate-900/70 text-slate-100 border-holo-border-soft/80 rounded-bl-none"
                }`}
              >
                <p>{message.content}</p>
                <p
                  className={`text-[10px] mt-1 ${
                    message.isOwn ? "text-slate-900/80" : "text-slate-400"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div
          className={`px-6 pb-5 pt-3 border-t border-holo-border-soft/80 bg-black/60 backdrop-blur-xl`}
        >
          <div
            className={`flex gap-3 items-end p-3 rounded-3xl bg-slate-950/70 border border-holo-border-soft/80 focus-within:border-holo-cyan/70 transition-colors`}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className={`flex-1 bg-transparent outline-none placeholder-slate-500 text-slate-100 text-sm`}
            />
            <button
              onClick={handleSend}
              className="p-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 text-slate-950 hover:from-cyan-300 hover:via-sky-300 hover:to-indigo-400 transition-all flex-shrink-0 shadow-holo-glow"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
