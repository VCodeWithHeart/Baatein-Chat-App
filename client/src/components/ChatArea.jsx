import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import useChatStore from "@/stores/useChatStore";
import ChatHeader from "./chat/ChatHeader";
import MessageInput from "./chat/MessageInput";
import MessagesList from "./chat/MessagesList";

const ChatArea = () => {
  const { userData } = useAuth();
  const { activeChatUser, message } = useChatStore();
  const [searchState, setSearchState] = useState({
    searchTerm: "",
    showSearch: false,
    currentMatchIndex: 0,
    totalMatches: 0,
  });

  // NEW: Auto-scroll ref
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!message.trim() || !activeChatUser?.id) {
      const { socket } = useChatStore.getState();
      const { exp, iat, ...user } = userData;
      socket.emit("stop-typing", user);
      return;
    }

    const { socket } = useChatStore.getState();
    const { exp, iat, ...user } = userData;

    socket.emit("typing", user);

    const typingTimer = setTimeout(() => {
      socket.emit("stop-typing", user);
    }, 2000);

    return () => clearTimeout(typingTimer);
  }, [message, activeChatUser?.id, userData]);

  return (
    <main className="flex-1 flex flex-col min-h-0 overflow-hidden bg-card/30 backdrop-blur-sm">
      {/* Chat Header */}
      {activeChatUser?.id && (
        <ChatHeader searchState={searchState} setSearchState={setSearchState} />
      )}

      {/* Messages Area */}
      <MessagesList
        messagesEndRef={messagesEndRef}
        searchState={searchState}
        setSearchState={setSearchState}
      />

      {/* Message Input Area */}
      {activeChatUser?.id && <MessageInput messagesEndRef={messagesEndRef} />}
    </main>
  );
};

export default ChatArea;
