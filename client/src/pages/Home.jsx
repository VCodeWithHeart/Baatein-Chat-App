// pages/Home.js
import React, { useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import useChatStore from "@/stores/useChatStore";
import Navbar from "@/components/Navbar";
import ConversationSidebar from "@/components/ConversationSidebar";
import ChatArea from "@/components/ChatArea";
import GroupCreationModal from "@/components/GroupCreationModal";
import { useAuth } from "@/context/AuthContext";

const Home = () => {
  const { userData } = useAuth();
  const {
    connectSocket,
    disconnectSocket,
    initializeChats,
    setupSocketListeners,
    cleanupSocket,
  } = useChatStore();

  useEffect(() => {
    if (userData?.userId) {
      connectSocket(userData);
      setupSocketListeners();
      initializeChats();
    }

    return () => {
      cleanupSocket();
      disconnectSocket();
    };
  }, [userData?.userId]);

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen bg-background text-foreground">
        <Navbar />

        <div className="flex flex-1 overflow-hidden">
          <ConversationSidebar />
          <ChatArea />
        </div>
        <GroupCreationModal />
      </div>
    </TooltipProvider>
  );
};

export default Home;
