# ChatLayout Component Documentation

## 🎨 Overview

`ChatLayout` is a fully-featured, responsive chat UI component built with **React**, **TypeScript**, and **Tailwind CSS**. It supports both **dark** and **light** modes seamlessly.

## ✨ Features

- ✅ **Dark/Light Mode Support** - Toggle between themes with smooth transitions
- ✅ **Responsive Design** - Works perfectly on all screen sizes
- ✅ **Message Bubbles** - Styled messages with timestamps
- ✅ **Search Functionality** - Filter chats in real-time
- ✅ **Unread Indicators** - Visual indicators for unread messages
- ✅ **Call & Video Buttons** - Ready for integration with WebRTC
- ✅ **User Avatars** - Colored avatars with initials
- ✅ **Custom Scrollbar** - Smooth scrollbar styling
- ✅ **TypeScript Support** - Full type safety
- ✅ **Accessible** - Proper ARIA labels and keyboard navigation

## 📦 Dependencies

```json
{
  "react": "^18.3.1",
  "lucide-react": "^latest"
}
```

**Install lucide-react:**
```bash
npm install lucide-react
```

## 🚀 Quick Start

### Basic Usage

```tsx
import ChatLayout from './components/ChatLayout';
import { ThemeProvider } from './ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <ChatLayout />
    </ThemeProvider>
  );
}
```

### With Props

```tsx
<ChatLayout
  messages={messages}
  currentChat={activeChat}
  chats={chatsList}
  onSendMessage={(message) => handleSendMessage(message)}
  onSelectChat={(chat) => handleSelectChat(chat)}
/>
```

## 📋 Props

```typescript
interface ChatLayoutProps {
  messages?: Message[];
  currentChat?: Chat | null;
  onSendMessage?: (message: string) => void;
  chats?: Chat[];
  onSelectChat?: (chat: Chat) => void;
}

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
```

## 🎯 Component Structure

### Layout Sections

1. **Sidebar** (Left Panel - 320px)
   - Header with theme toggle and new chat button
   - Search bar with real-time filtering
   - List of chats with avatars and unread indicators

2. **Chat Window** (Right Panel)
   - **Header**: Chat info, call/video buttons, more options
   - **Messages Area**: Scrollable chat messages with timestamps
   - **Input Area**: Message input field with send button

## 🌓 Dark Mode Integration

The component uses `ThemeContext` to manage dark/light modes:

```tsx
import { ThemeContext } from './ThemeContext';
import { useContext } from 'react';

// Inside component
const [darkMode, setDarkMode] = useContext(ThemeContext);

// Classes automatically apply based on darkMode state
className={`${darkMode ? "bg-slate-800" : "bg-white"}`}
```

### Theme Toggle Button

The theme toggle is built into the header:

```tsx
<ThemeToggle /> // Handles dark/light mode switching
```

## 🎨 Tailwind Configuration

The component uses Tailwind CSS with these custom colors:

```javascript
// tailwind.config.js
theme: {
  colors: {
    slate: { /* slate color palette */ },
    yellow: { 400: '#facc15' },
    primary: {
      50: "#f0f9ff",
      400: "#38bdf8",
      500: "#0ea5e9",
      600: "#0284c7",
      700: "#0369a1",
    }
  }
}
```

## 💬 Message Styling

**Own Messages:**
- Background: Primary blue gradient
- Text color: White
- Alignment: Right
- Border radius: Rounded except bottom-right

**Other Messages:**
- Background: Slate (dark) or light gray (light)
- Text color: White (dark) or dark gray (light)
- Alignment: Left
- Border radius: Rounded except bottom-left

## 🔧 Customization

### Styling

Modify Tailwind classes in the component to customize colors:

```tsx
// Change message bubble colors
className={message.isOwn
  ? "bg-gradient-to-br from-primary-500 to-primary-600"
  : "bg-slate-700" // Change this
}
```

### Layout

Adjust sidebar width by changing the `w-80` class:

```tsx
<div className="w-96"> {/* Wider sidebar */}
```

### Behavior

Implement handlers for custom functionality:

```tsx
const handleSendMessage = (message: string) => {
  // Encrypt and send message
  // Update state
};

const handleSelectChat = (chat: Chat) => {
  // Load chat messages
  // Update active chat
};
```

## 🔌 Integration with Backend

Example integration with your chat service:

```tsx
import { useEffect, useState } from 'react';
import ChatLayout from './components/ChatLayout';

function ChatPage() {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    // Fetch chats from backend
    fetchChats().then(setChats);
  }, []);

  const handleSendMessage = async (content: string) => {
    const encrypted = await encryptMessage(content);
    await sendMessage(activeChat.id, encrypted);
    setMessages([...messages, newMessage]);
  };

  return (
    <ChatLayout
      messages={messages}
      currentChat={activeChat}
      chats={chats}
      onSendMessage={handleSendMessage}
      onSelectChat={setActiveChat}
    />
  );
}
```

## 🧪 Testing

Example test setup:

```tsx
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from './ThemeContext';
import ChatLayout from './components/ChatLayout';

test('renders chat layout', () => {
  render(
    <ThemeProvider>
      <ChatLayout />
    </ThemeProvider>
  );
  
  expect(screen.getByText('Messages')).toBeInTheDocument();
});
```

## 📱 Responsive Breakpoints

The component automatically adapts to screen sizes:
- **Mobile**: Full width sidebar, stacked layout on small screens
- **Tablet**: Sidebar 320px, content takes remaining space
- **Desktop**: Full layout with optimal spacing

## ⚡ Performance Optimization

- Messages are rendered efficiently without virtualization (suitable for <500 messages)
- For larger message lists, consider implementing `react-window`
- Memoization applied to individual messages if needed

## 🐛 Troubleshooting

### Dark Mode Not Working
Ensure `ThemeProvider` wraps your app and `html.dark` class is applied to root element.

### Icons Not Showing
Install `lucide-react`:
```bash
npm install lucide-react
```

### Tailwind Classes Not Applied
- Verify `tailwind.config.js` includes content paths
- Check that `tailwind.css` is imported in your main file
- Ensure proper Tailwind version compatibility

## 📄 Files Structure

```
client/src/
├── components/
│   ├── ChatLayout.tsx         # Main component
│   ├── ChatLayout.stories.tsx # Storybook stories
│   ├── ChatExample.tsx        # Usage example
│   └── ThemeToggle/
│       └── ThemeToggle.tsx    # Theme switcher
├── ThemeContext.tsx           # Dark/light mode context
└── tailwind.css               # Tailwind configuration
```

## 🎓 Examples

See `ChatLayout.stories.tsx` for example implementations in different states.

## 📝 License

Part of the chat-e2ee project. See main LICENSE for details.

## 🤝 Contributing

Feel free to enhance the component with:
- Emoji picker
- File uploads
- Voice message support
- Reactions/replies
- Message search
- Message pinning

