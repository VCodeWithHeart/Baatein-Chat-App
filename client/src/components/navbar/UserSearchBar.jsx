import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserSearch } from "@/hooks/useUserSearch";

const UserSearchBar = ({ onStartChat, className = "" }) => {
  const {
    searchText,
    hasSearched,
    userSearchResults,
    isUsersLoading,
    isUserLoadingError,
    searchHandler,
    setSearchText,
    setHasSearched,
    setUserSearchResults,
  } = useUserSearch();

  const handleUserSelect = (user) => {
    setSearchText("");
    setUserSearchResults([]);
    setHasSearched(false);
    if (onStartChat) {
      onStartChat(user);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input Area */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          name="search"
          value={searchText}
          onChange={(e) => searchHandler(e.target.value)}
          placeholder="Search users..."
          className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all w-full"
          autoComplete="off"
        />

        {/* Loading indicator inside input */}
        {isUsersLoading && searchText && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {searchText && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-md max-h-96 overflow-y-auto left-0">
          <div className={`${isUsersLoading ? "p-2" : ""} bg-white`}>
            {isUsersLoading ? (
              <div className="py-8 text-center text-gray-500">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Searching users...
              </div>
            ) : isUserLoadingError ? (
              <div className="py-4 text-center text-red-500 text-sm">
                Failed to search users. Please try again.
              </div>
            ) : userSearchResults?.length === 0 && hasSearched ? (
              <div className="py-4 text-center text-gray-500 text-sm">
                No users found matching "{searchText}"
              </div>
            ) : (
              <div className="space-y-1">
                {userSearchResults?.map((user, index) => (
                  <div
                    key={user?._id || index}
                    className="flex items-center p-3 rounded-md hover:bg-gray-50 cursor-pointer transition-colors group"
                    onClick={() => {
                      console.log("Selected user:", user);
                      handleUserSelect(user);
                    }}
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={user?.avatar || `/avatars/${(index % 5) + 1}.png`}
                        alt={user?.username}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {user?.name?.charAt(0) ||
                          user?.username?.charAt(0) ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">
                        {user?.username || `User ${index + 1}`}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs px-2 border-gray-600 border-2 text-primary cursor-pointer hover:bg-primary/5"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUserSelect(user);
                      }}
                    >
                      Chat
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSearchBar;
