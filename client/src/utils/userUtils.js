const getOnlineStatus = (chatObj, onlineUsers) => {
  // Create a set of online user IDs for O(1) lookups
  const onlineUserIds = new Set(onlineUsers.map((user) => user.userId));

  // For direct chats
  if (!chatObj.isGroup) {
    const partnerId = chatObj.members[0]?._id;
    return onlineUserIds.has(partnerId) ? "green" : "grey";
  }

  // For group chats
  let onlineCount = 0;
  const totalMembers = chatObj.members.length;

  for (const member of chatObj.members) {
    if (onlineUserIds.has(member._id)) {
      onlineCount++;
      // Early return if all members are online
      if (onlineCount === totalMembers) {
        return "green";
      }
    }
  }

  return onlineCount > 0 ? "blue" : "grey";
};

export { getOnlineStatus };
