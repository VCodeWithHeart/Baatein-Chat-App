import useChatStore from "@/stores/useChatStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Info,
  MessageCircle,
  MoreVerticalIcon,
  User,
  Users,
  Video,
  Edit2,
  X,
  Search,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { getOnlineStatus } from "@/utils/userUtils";
import { useState } from "react";

const ChatHeader = ({ searchState, setSearchState }) => {
  const { activeChatUser, onlineUsers, editGroupNameHandler } = useChatStore();
  const onlineStatus = getOnlineStatus(activeChatUser, onlineUsers);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState(activeChatUser?.name || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleEditGroupName = async () => {
    if (!newGroupName.trim()) return;
    setIsEditing(true);
    try {
      await editGroupNameHandler(activeChatUser?.id, newGroupName);
      setShowEditModal(false);
    } catch (error) {
      console.error("Failed to edit group name:", error);
    } finally {
      setIsEditing(false);
    }
  };

  const handleCloseEditModal = () => {
    setNewGroupName(activeChatUser?.name || "");
    setShowEditModal(false);
  };

  return (
    <>
      <div className="border-b border-gray-200 dark:border-gray-700 p-3 bg-white backdrop-blur-sm">
        <div className="flex items-center justify-between">
          {/* Left Section - User Info */}
          <div className="flex items-center space-x-3 min-w-0">
            {/* Avatar */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-medium">
                {activeChatUser?.name
                  ?.split(" ")
                  .map((word) => word[0])
                  .join("")
                  .substring(0, 3)
                  .toUpperCase() || "U"}
              </div>
            </div>

            {/* User Details */}
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-lg truncate max-w-[180px]">
                  {activeChatUser?.name || "User"}
                </h1>

                {activeChatUser?.type.includes("group") && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                    Group
                  </span>
                )}
              </div>

              <div className="flex items-center mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                <span
                  className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                    onlineStatus === "green"
                      ? "bg-green-500"
                      : onlineStatus === "blue"
                        ? "bg-blue-500"
                        : "bg-gray-500"
                  }`}
                ></span>
                {onlineStatus === "green"
                  ? "Online"
                  : onlineStatus === "blue"
                    ? "Someone is Online"
                    : "Offline"}
              </div>
            </div>
          </div>

          {/* Right Section - Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setSearchState({
                  ...searchState,
                  showSearch: !searchState.showSearch,
                  searchTerm: "",
                  currentMatchIndex: 0,
                });
              }}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Search className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Video className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </button>

            {/* NEW: Group Options Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <MoreVerticalIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 rounded-xl border border-gray-100 bg-white/90 backdrop-blur-sm shadow-lg p-2"
              >
                {activeChatUser?.type.includes("group") ? (
                  <>
                    {/* Group Members Option */}
                    <div
                      onClick={() => setShowMembersModal(true)}
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                        <Users className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        View Group Members
                      </span>
                    </div>

                    {/* Edit Group Name Option */}
                    <div
                      onClick={() => {
                        setShowEditModal(true);
                        setNewGroupName(activeChatUser?.name || "");
                      }}
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                        <Edit2 className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        Edit Group Name
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="my-1 h-px bg-gray-100" />

                    {/* Group ID */}
                    <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-default">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mr-3">
                        <Info className="h-4 w-4" />
                      </div>
                      <span className="text-xs text-gray-500">
                        Group ID: {activeChatUser?.id}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Profile Option */}
                    <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                        <User className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        View Profile
                      </span>
                    </div>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {searchState.showSearch && (
        <div className="border-b border-gray-200 dark:border-gray-700 p-3 bg-white/80 backdrop-blur-sm flex items-center gap-2">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchState.searchTerm}
            onChange={(e) => {
              setSearchState({
                ...searchState,
                searchTerm: e.target.value,
                currentMatchIndex: 0,
              });
            }}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />

          {searchState.searchTerm && searchState.totalMatches > 0 && (
            <span className="text-sm font-medium text-gray-600 min-w-fit">
              {searchState.currentMatchIndex + 1} of {searchState.totalMatches}
            </span>
          )}

          {searchState.searchTerm && searchState.totalMatches > 0 && (
            <>
              <button
                onClick={() => {
                  const newIndex =
                    searchState.currentMatchIndex === 0
                      ? searchState.totalMatches - 1
                      : searchState.currentMatchIndex - 1;
                  setSearchState({
                    ...searchState,
                    currentMatchIndex: newIndex,
                  });
                  const event = new CustomEvent("scrollToMatch", {
                    detail: newIndex,
                  });
                  window.dispatchEvent(event);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Previous match"
              >
                <ChevronUp size={18} className="text-gray-600" />
              </button>

              <button
                onClick={() => {
                  const newIndex =
                    searchState.currentMatchIndex ===
                    searchState.totalMatches - 1
                      ? 0
                      : searchState.currentMatchIndex + 1;
                  setSearchState({
                    ...searchState,
                    currentMatchIndex: newIndex,
                  });
                  const event = new CustomEvent("scrollToMatch", {
                    detail: newIndex,
                  });
                  window.dispatchEvent(event);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Next match"
              >
                <ChevronDown size={18} className="text-gray-600" />
              </button>
            </>
          )}

          <button
            onClick={() => {
              setSearchState({
                searchTerm: "",
                showSearch: false,
                currentMatchIndex: 0,
                totalMatches: 0,
              });
            }}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={18} className="text-gray-600" />
          </button>
        </div>
      )}

      {/* View Group Members Modal */}
      {showMembersModal && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50"
          onClick={() => setShowMembersModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 max-h-96 overflow-y-auto transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Group Members
              </h2>
              <button
                onClick={() => setShowMembersModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Members List */}
            <div className="space-y-3">
              {activeChatUser?.members && activeChatUser.members.length > 0 ? (
                activeChatUser.members.map((member, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
                      {member?.username?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {member?.username || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-500">Member</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">No members</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Group Name Modal */}
      {showEditModal && (
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
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Enter new group name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleEditGroupName();
                  }
                }}
              />
              <p className="text-xs text-gray-500 mt-2">
                {newGroupName?.length || 0} / 50 characters
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
                onClick={handleEditGroupName}
                disabled={isEditing || !newGroupName?.trim()}
                className="px-6 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isEditing && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatHeader;
