/**
 * Storybook stories for ChatLayout component
 * 
 * Usage examples and different states for the ChatLayout component
 */

import React from "react";
import ChatLayout from "./ChatLayout";

const meta = {
  component: ChatLayout,
  title: "Components/ChatLayout",
};

export default meta;

export const Default = () => <ChatLayout />;

export const WithCustomMessages = () => {
  const customMessages = [
    {
      id: "1",
      content: "Bonjour! Comment ça va?",
      isOwn: false,
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: "2",
      content: "Ça va bien, merci! Et toi?",
      isOwn: true,
      timestamp: new Date(Date.now() - 3300000),
    },
    {
      id: "3",
      content: "Impeccable! J'ai terminé le composant UI",
      isOwn: true,
      timestamp: new Date(Date.now() - 3000000),
    },
    {
      id: "4",
      content: "Super! Montre moi!",
      isOwn: false,
      timestamp: new Date(Date.now() - 2700000),
    },
  ];

  return <ChatLayout messages={customMessages} />;
};

export const DarkMode = () => {
  return (
    <div className="dark">
      <ChatLayout />
    </div>
  );
};

export const LightMode = () => {
  return (
    <div className="light">
      <ChatLayout />
    </div>
  );
};
