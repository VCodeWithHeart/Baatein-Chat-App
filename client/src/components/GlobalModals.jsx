import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, X, Edit2 } from "lucide-react";
import useUIStore from "@/stores/useUIStore";
import useChatStore from "@/stores/useChatStore";

const GlobalModals = () => {
  const {
    deleteConfirmModal,
    closeDeleteModal,
    editGroupModal,
    setEditModalName,
    closeEditModal,
  } = useUIStore();
  const { deleteChatHandler, editGroupNameHandler } = useChatStore();

  const [deletingChatId, setDeletingChatId] = useState(null);
  const [editingGroupId, setEditingGroupId] = useState(null);

  const handleConfirmDelete = async () => {
    try {
      setDeletingChatId(deleteConfirmModal.chatId);
      await deleteChatHandler(deleteConfirmModal.chatId);
      closeDeleteModal();
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
      closeEditModal();
    } catch (error) {
      console.error("Failed to edit group name:", error);
    } finally {
      setEditingGroupId(null);
    }
  };

  const handleCloseDelete = () => {
    closeDeleteModal();
  };

  const handleCloseEdit = () => {
    closeEditModal();
  };

  return (
    <>
      {/* Delete Confirmation Modal */}
      {deleteConfirmModal.isOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50"
          onClick={handleCloseDelete}
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
                onClick={handleCloseDelete}
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
                onClick={handleCloseDelete}
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
          onClick={handleCloseEdit}
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
                onClick={handleCloseEdit}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Subtitle */}
            <p className="text-gray-600 text-sm mb-6">
              Update your group name to something new
            </p>

            {/* Input */}
            <input
              type="text"
              value={editGroupModal.newName || ""}
              onChange={(e) => setEditModalName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6"
            />

            {/* Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCloseEdit}
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
                className="px-6 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {editingGroupId === editGroupModal.chatId ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalModals;
