import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, MoreVertical, Trash2, X, Edit2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useUIStore from "@/stores/useUIStore";
import useChatStore from "@/stores/useChatStore";
import { cn } from "@/lib/utils";
import { getOnlineStatus } from "@/utils/userUtils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const ConversationSidebar = () => {
  const { setShowGroupModal, sidebarOpen, setSidebarOpen } = useUIStore();
  const {
    chats,
    onlineUsers,
    isChatsLoading,
    isChatLoadingError,
    activeChatUser,
    setActiveChatUser,
    getMessagesForUser,
    deleteChatHandler,
    editGroupNameHandler,
  } = useChatStore();

  const [openMenuId, setOpenMenuId] = useState(null);
  const [deletingChatId, setDeletingChatId] = useState(null);
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    isOpen: false,
    chatId: null,
    chatName: null,
  });
  const [editGroupModal, setEditGroupModal] = useState({
    isOpen: false,
    chatId: null,
    chatName: null,
    newName: null,
  });

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId !== null) {
        const menuButton = event.target.closest("[data-menu-button]");
        const menuContent = event.target.closest("[data-menu-content]");
        if (!menuButton && !menuContent) {
          setOpenMenuId(null);
        }
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openMenuId]);

  const handleInitializeChat = (chatObj) => {
    setSidebarOpen(false);

    if (chatObj?.id === activeChatUser?.id) return;
    setActiveChatUser(chatObj);
    getMessagesForUser(chatObj);
  };

  const openDeleteModal = (e, chatObj) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setDeleteConfirmModal({
      isOpen: true,
      chatId: chatObj.id,
      chatName: chatObj.name,
    });
  };

  const openEditModal = (e, chatObj) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setEditGroupModal({
      isOpen: true,
      chatId: chatObj.id,
      chatName: chatObj.name,
      newName: chatObj.name,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      setDeletingChatId(deleteConfirmModal.chatId);
      await deleteChatHandler(deleteConfirmModal.chatId);
      setDeleteConfirmModal({ isOpen: false, chatId: null, chatName: null });
    } catch (error) {
      console.error("Failed to delete chat:", error);
    } finally {
      setDeletingChatId(null);
    }
  };

  const handleConfirmEditGroupName = async () => {
    if (!editGroupModal.newName || editGroupModal.newName.trim().length === 0) {
      return;
    }

    try {
      setEditingGroupId(editGroupModal.chatId);
      await editGroupNameHandler(editGroupModal.chatId, editGroupModal.newName);
      setEditGroupModal({
        isOpen: false,
        chatId: null,
        chatName: null,
        newName: null,
      });
    } catch (error) {
      console.error("Failed to edit group name:", error);
    } finally {
      setEditingGroupId(null);
    }
  };

  const handleCloseModal = () => {
    setDeleteConfirmModal({ isOpen: false, chatId: null, chatName: null });
  };

  const handleCloseEditModal = () => {
    setEditGroupModal({
      isOpen: false,
      chatId: null,
      chatName: null,
      newName: null,
    });
  };

  return (
    <aside
      className={`${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 transition-transform duration-300 ease-in-out border-r bg-white w-full md:w-80 lg:w-96 flex flex-col h-full fixed md:static z-40`}
    >
      {/* Header Section */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold flex items-center text-gray-800">
          <MessageCircle className="mr-2 h-5 w-5 text-primary" />
          Your Conversations
        </h2>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-242px)] md:max-h-none">
        {isChatsLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2" />
            <p className="text-sm text-gray-500">Loading conversations...</p>
          </div>
        ) : isChatLoadingError ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-10 h-10 mb-2 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <p className="text-sm text-red-500">Error loading conversations</p>
          </div>
        ) : chats?.length === 0 && !isChatsLoading ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="w-16 h-16 mb-3 rounded-full bg-gray-100 flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-800 mb-1">
              No conversations yet
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Start a new chat to begin
            </p>
          </div>
        ) : (
          <div>
            {chats?.map((chatObj, i) => {
              const onlineStatus = getOnlineStatus(chatObj, onlineUsers);

              return (
                <div
                  key={i}
                  className={cn(
                    "cursor-pointer transition-colors duration-200 group relative",
                    String(activeChatUser?.id || activeChatUser?._id) ===
                      String(chatObj?.id || chatObj?._id)
                      ? "bg-gray-50 border-l-4 border-black"
                      : "hover:bg-gray-50",
                  )}
                  onClick={() => handleInitializeChat(chatObj)}
                >
                  <div className="p-4 flex items-center gap-4">
                    <div className="relative shrink-0">
                      <Avatar className="w-12 h-12 border border-gray-200">
                        <AvatarImage
                          src={chatObj?.avatar}
                          alt={chatObj?.name}
                        />
                        <AvatarFallback className="font-medium bg-gray-100 text-gray-700">
                          {chatObj?.name?.[0]?.toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
                           ${
                             onlineStatus === "green"
                               ? "bg-green-500"
                               : onlineStatus === "blue"
                                 ? "bg-blue-500"
                                 : "bg-gray-500"
                           }`}
                          ></span>
                        </TooltipTrigger>
                        <TooltipContent
                          className="[&_svg]:hidden!"
                          align="right"
                          sideOffset={4}
                          side="right"
                        >
                          <p
                            className={`text-xs text-black ${
                              onlineStatus === "green"
                                ? "bg-green-100"
                                : onlineStatus === "blue"
                                  ? "bg-blue-100"
                                  : "bg-gray-100"
                            } px-2 py-1 rounded-full`}
                          >
                            {onlineStatus === "green"
                              ? "Online"
                              : onlineStatus === "blue"
                                ? "Someone is online"
                                : "Offline"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-medium text-gray-800 truncate">
                          {chatObj?.name}
                        </h3>
                        <span className="text-xs text-gray-500 shrink-0 ml-2">
                          {i === 0 ? "2m ago" : `${i * 5}m ago`}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 truncate">
                        {chatObj?.lastMessage?.content || "No messages yet"}
                      </p>
                    </div>

                    {/* Three Dots Menu */}
                    <div className="relative">
                      <button
                        data-menu-button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(
                            openMenuId === chatObj.id ? null : chatObj.id,
                          );
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-200 rounded-lg"
                      >
                        <MoreVertical size={18} className="text-gray-600" />
                      </button>

                      {/* Dropdown Menu */}
                      {openMenuId === chatObj.id && (
                        <div
                          data-menu-content
                          className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                        >
                          {/* Edit Group Name - Only for groups */}
                          {chatObj.isGroup && (
                            <button
                              onClick={(e) => openEditModal(e, chatObj)}
                              disabled={editingGroupId === chatObj.id}
                              className="w-full px-4 py-2 text-left text-blue-600 hover:bg-blue-50 flex items-center gap-2 rounded-t-lg transition-colors disabled:opacity-50"
                            >
                              {editingGroupId === chatObj.id ? (
                                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Edit2 size={16} />
                              )}
                              Edit Group Name
                            </button>
                          )}

                          <button
                            onClick={(e) => openDeleteModal(e, chatObj)}
                            disabled={deletingChatId === chatObj.id}
                            className={`w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors disabled:opacity-50 ${
                              chatObj.isGroup ? "rounded-b-lg" : "rounded-lg"
                            }`}
                          >
                            {deletingChatId === chatObj.id ? (
                              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                            Delete Chat
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Start Group Chat Button */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <Button
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 transition-all duration-200"
          onClick={() => setShowGroupModal(true)}
        >
          <span className="mr-2">+</span> Start Group Chat
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmModal.isOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Trash2 size={24} className="text-red-600" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-gray-900">Delete Chat?</h2>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <p className="text-gray-600 mb-8 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                "{deleteConfirmModal.chatName}"
              </span>
              ?
              <br />
              <span className="text-sm text-gray-500 block mt-2">
                This action cannot be undone.
              </span>
            </p>

            {/* Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deletingChatId === deleteConfirmModal.chatId}
                className="px-6 py-2.5 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {deletingChatId === deleteConfirmModal.chatId && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Group Name Modal */}
      {editGroupModal.isOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50"
          onClick={handleCloseEditModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Edit2 size={24} className="text-blue-600" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Edit Group Name
              </h2>
              <button
                onClick={handleCloseEditModal}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Subtitle */}
            <p className="text-gray-600 text-sm mb-6">
              Update your group name to something new
            </p>

            {/* Content */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Group Name
              </label>
              <input
                type="text"
                value={editGroupModal.newName || ""}
                onChange={(e) =>
                  setEditGroupModal({
                    ...editGroupModal,
                    newName: e.target.value,
                  })
                }
                placeholder="Enter new group name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleConfirmEditGroupName();
                  }
                }}
              />
              <p className="text-xs text-gray-500 mt-2">
                {editGroupModal.newName?.length || 0} / 50 characters
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCloseEditModal}
                className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmEditGroupName}
                disabled={
                  editingGroupId === editGroupModal.chatId ||
                  !editGroupModal.newName?.trim()
                }
                className="px-6 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {editingGroupId === editGroupModal.chatId && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default ConversationSidebar;
