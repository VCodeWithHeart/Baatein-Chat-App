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
} from "lucide-react";
import { getOnlineStatus } from "@/utils/userUtils";

const ChatHeader = () => {
  const { activeChatUser, onlineUsers } = useChatStore();
  const onlineStatus = getOnlineStatus(activeChatUser, onlineUsers);

  return (
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
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <MessageCircle className="h-4 w-4 text-gray-600 dark:text-gray-300" />
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
                  <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                      <Users className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      View Group Members
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
  );
};

export default ChatHeader;
