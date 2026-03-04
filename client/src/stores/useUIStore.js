// src/stores/useUIStore.js
import { create } from "zustand";

const useUIStore = create((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (value) => set({ sidebarOpen: value }),

  showGroupModal: false,
  setShowGroupModal: (value) => set({ showGroupModal: value }),
  toggleGroupModal: () =>
    set((state) => ({ showGroupModal: !state.showGroupModal })),
  // delete confirmation modal state
  deleteConfirmModal: {
    isOpen: false,
    chatId: null,
    chatName: null,
  },
  openDeleteModal: (chat) =>
    set({
      deleteConfirmModal: {
        isOpen: true,
        chatId: chat.id,
        chatName: chat.name,
      },
    }),
  closeDeleteModal: () =>
    set({
      deleteConfirmModal: {
        isOpen: false,
        chatId: null,
        chatName: null,
      },
    }),

  // edit group name modal state
  editGroupModal: {
    isOpen: false,
    chatId: null,
    chatName: null,
    newName: null,
  },
  openEditModal: (chat) =>
    set({
      editGroupModal: {
        isOpen: true,
        chatId: chat.id,
        chatName: chat.name,
        newName: chat.name,
      },
    }),
  setEditModalName: (name) =>
    set((state) => ({
      editGroupModal: {
        ...state.editGroupModal,
        newName: name,
      },
    })),
  closeEditModal: () =>
    set({
      editGroupModal: {
        isOpen: false,
        chatId: null,
        chatName: null,
        newName: null,
      },
    }),
}));

export default useUIStore;
