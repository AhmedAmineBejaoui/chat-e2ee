import React from "react";
import ChatLayout from "./ChatLayout";

/**
 * Example integration of the new ChatLayout component
 * 
 * Features:
 * - Dark/Light mode support with Tailwind CSS
 * - Responsive design
 * - Message bubbles with timestamps
 * - Search functionality
 * - Unread message indicators
 * - Call and video icons
 * 
 * To use this:
 * 1. Replace your existing chat component with ChatLayout
 * 2. Pass your messages and chats as props
 * 3. Implement the callback handlers (onSendMessage, onSelectChat)
 * 4. Make sure ThemeProvider wraps your app
 */

const ChatExample = () => {
  return (
    <div className="w-full h-screen">
      <ChatLayout />
    </div>
  );
};

export default ChatExample;
