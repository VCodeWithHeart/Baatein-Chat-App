import { useAuth } from "@/context/AuthContext";
import useChatStore from "@/stores/useChatStore";
import { formatDateLabel, isSameDay } from "@/utils/dateUtils";
import { Check, MessageCircle, MoreVertical, Pencil, Trash2, X } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "../ui/input";

const MessagesList = ({ messagesEndRef }) => {
  const { userData } = useAuth();
  const {
    messages,
    loadingMessages,
    isTyping,
    typingUsers,
    deleteMessageHandler,
    editMessageHandler,
  } = useChatStore();

  // NEW: Local state for editing
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState("");

  // Function to start editing
  const handleEditClick = (msg) => {
    setEditingMessageId(msg._id);
    setEditText(msg.content);
  };

  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditText("");
  };

  // Function to submit edit
  const handleUpdate = async (messageId) => {
    if (!editText.trim()) return;
    try {
      await editMessageHandler(messageId, { content: editText });
      setEditingMessageId(null);
      setEditText("");
    } catch (error) {
      console.error("Failed to update message", error);
    }
  };

  const handleDelete = (messageId) => {
    try {
      deleteMessageHandler(messageId);
    } catch (error) {
      console.log("error: failed to delete message", error);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-amber-50/60 custom-scrollbar">
      {loadingMessages ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : messages?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-60">
          <div className="bg-amber-100 p-4 rounded-full mb-3">
            <MessageCircle className="h-8 w-8 text-amber-600" />
          </div>
          <p className="text-sm font-medium">No messages yet. Say hello! 👋</p>
        </div>
      ) : (
        messages.map((msg, index) => {
          const isStartOfDay =
            index === 0 ||
            !isSameDay(
              new Date(messages[index - 1].createdAt),
              new Date(msg.createdAt)
            );

          const isCurrentUser = msg?.sender?._id === userData?.userId;
          const isEditing = editingMessageId === msg._id;
          const isSequence =
            index > 0 && messages[index - 1]?.sender?._id === msg?.sender?._id;

          return (
            <React.Fragment key={msg._id || index}>
              {/* Date separator - now inside the scrollable area */}
              {isStartOfDay && (
                <div className="flex justify-center my-4">
                  <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs">
                    {formatDateLabel(msg.createdAt)}
                  </span>
                </div>
              )}

              {/* Message bubble */}
              <div
                className={`flex w-full group ${
                  isCurrentUser ? "justify-end" : "justify-start"
                } ${isSequence ? "mt-1" : "mt-4"}`}
              >
                {/* Avatar: Only show for others, and only if it's the start of a sequence or standalone */}
                {!isCurrentUser && (
                  <div
                    className={`flex flex-col justify-end mr-2 w-8 ${
                      isSequence ? "invisible" : ""
                    }`}
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-100 to-purple-200 border border-white shadow-sm flex items-center justify-center">
                      <span className="text-violet-700 font-bold text-xs uppercase">
                        {msg?.sender?.username?.charAt(0)}
                      </span>
                    </div>
                  </div>
                )}

                <div
                  className={`flex items-end gap-2 max-w-[75%] ${
                    isCurrentUser ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`relative px-4 py-2 shadow-sm transition-all ${
                      isCurrentUser
                        ? "bg-violet-600 text-white rounded-2xl rounded-tr-sm"
                        : "bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-sm"
                    }`}
                  >
                    {/* Username: Only show for others in group chats */}
                    {!isCurrentUser && !isSequence && (
                      <span className="text-[11px] font-bold text-violet-600 block mb-1">
                        {msg?.sender?.username}
                      </span>
                    )}

                    {/* Conditional Rendering: Edit Input vs Text */}
                    {isEditing ? (
                      <div className="flex flex-col space-y-2 min-w-[220px]">
                        <Input
                          multiline="true"
                          className={`min-h-[2.5rem] text-sm border-none focus-visible:ring-1 focus-visible:ring-offset-0 ${
                            isCurrentUser
                              ? "bg-white/10 text-white placeholder:text-white/50 focus-visible:ring-white/30"
                              : "bg-gray-50 text-black focus-visible:ring-violet-400"
                          }`}
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleUpdate(msg._id);
                            if (e.key === "Escape") handleCancelEdit();
                          }}
                          autoFocus
                        />
                        <div className="flex justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className={`h-6 w-6 hover:bg-black/10 cursor-pointer ${
                              isCurrentUser
                                ? "text-red-200 hover:text-red-100"
                                : "text-red-500 hover:text-red-600"
                            }`}
                            onClick={handleCancelEdit}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className={`h-6 w-6 hover:bg-black/10 cursor-pointer ${
                              isCurrentUser
                                ? "text-green-200 hover:text-green-100"
                                : "text-green-600 hover:text-green-700"
                            }`}
                            onClick={() => handleUpdate(msg._id)}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-end gap-2">
                        <p
                          className={`text-sm leading-relaxed whitespace-pre-wrap ${
                            isCurrentUser ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {typeof msg?.content === "object"
                            ? msg.content
                            : msg?.content}
                          {msg.isEdited && (
                            <span className="text-[10px] ml-1 opacity-60 italic">
                              (edited)
                            </span>
                          )}
                        </p>
                        <span
                          className={`text-[10px] min-w-fit ${
                            isCurrentUser ? "text-violet-200" : "text-gray-400"
                          }`}
                        >
                          {new Date(msg?.createdAt)?.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Options Menu (Three Dots) */}
                  {isCurrentUser && !isEditing && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full hover:bg-gray-200/50"
                        >
                          <MoreVertical className="h-3.5 w-3.5 text-gray-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-32 rounded-xl border border-gray-200 bg-white/95 backdrop-blur-sm shadow-lg p-1"
                      >
                        <DropdownMenuItem
                          onClick={() => handleEditClick(msg)}
                          className="cursor-pointer text-xs rounded-lg py-2 px-3 hover:bg-gray-50"
                        >
                          <span className="flex items-center">
                            <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(msg._id)}
                          className="cursor-pointer text-xs rounded-lg py-2 px-3 hover:bg-red-50 text-red-600"
                        >
                          <span className="flex items-center">
                            <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                          </span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })
      )}

      {/* Improved Typing Indicator */}
      {isTyping && (
        <div className="flex items-center gap-2 mt-4 ml-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-3">
            <span className="text-xs font-medium text-gray-500">
              {typingUsers?.length > 2
                ? "Several people are typing"
                : `${typingUsers?.map((c) => c.username).join(", ")} is typing`}
            </span>
            <div className="flex space-x-1">
              <span
                className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Auto-scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesList;
