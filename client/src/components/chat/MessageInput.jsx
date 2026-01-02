import React, { useEffect, useRef, useState } from "react";
import { Textarea } from "../ui/textarea";
import EmojiPicker from "emoji-picker-react";
import { Smile, Paperclip, SendHorizontal } from "lucide-react";
import useChatStore from "@/stores/useChatStore";
import { useAuth } from "@/context/AuthContext";
import useUIStore from "@/stores/useUIStore";
import { Button } from "../ui/button";

const MessageInput = ({ messagesEndRef }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiRef = useRef(null);
  const { userData } = useAuth();
  const isAnonymous = useUIStore((state) => state.isAnonymous);

  const { messages, isTyping, message, setMessage, sendMessageHandler } =
    useChatStore();

  const handleWriteMessage = (e) => {
    setMessage(e.target.value);
  };

  const handleSend = () => {
    if (message.trim()) {
      sendMessageHandler(userData);
    }
  };

  const onEmojiClick = (emojiObject) => {
    setMessage(message + emojiObject.emoji);
  };

  // Scroll to bottom whenever messages change or someone starts typing
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="border-t p-4 bg-card/70 relative">
      {showEmojiPicker && (
        <div
          ref={emojiRef}
          className="absolute bottom-20 left-4 z-50 shadow-xl rounded-xl"
        >
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            theme="auto"
            searchDisabled={false}
            width={300}
            height={400}
          />
        </div>
      )}
      <div className="flex items-end space-x-2 max-w-3xl mx-auto">
        <Button
          variant="ghost"
          className={`text-muted-foreground hover:text-yellow-400 hover:bg-yellow-50 rounded-full h-12 w-12 cursor-pointer ${
            showEmojiPicker ? "text-yellow-500 bg-yellow-100" : ""
          }`}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <Smile className="h-8 w-8" />
        </Button>
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-blue-500 hover:bg-blue-50 h-12 w-12 rounded-full cursor-pointer"
        >
          <Paperclip className="h-6 w-6" />
        </Button>

        <div className="flex-1 min-w-0">
          <Textarea
            placeholder={
              isAnonymous ? "Send anonymous message..." : "Type your message..."
            }
            className="min-h-[44px] bg-background/80 max-h-[200px]"
            value={message}
            onChange={handleWriteMessage}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (!e.shiftKey) {
                  handleSend(e);
                }
              }
            }}
          />
        </div>

        <Button
          size="icon"
          className="bg-black/80 text-white rounded-full w-11 h-11 cursor-pointer hover:bg-black"
          onClick={handleSend}
        >
          <SendHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
