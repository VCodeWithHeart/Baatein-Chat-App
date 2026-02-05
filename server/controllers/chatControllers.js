// controllers/chatControllers.js

const Room = require("../models/Room"); // Adjust path as needed
const Message = require("../models/Message"); // Needed for 'lastMessage' population

const getChats = async (req, res, next) => {
  // IMPORTANT: Include 'next' argument
  try {
    // 1. Identify User: The 'protect' middleware ensures req.user exists
    //    and contains the authenticated user's document, including their _id.
    const currentUserId = req.user._id;

    // 2. Query Rooms, Populate, and Sort
    const rooms = await Room.find({
      members: currentUserId,
    })
      .select("-admins")
      .populate({
        path: "members",
        select: "username avatarUrl",
        match: { _id: { $ne: currentUserId } },
      })
      .populate({
        path: "lastMessage", // Assuming this field is in your Room model
        select: "content sender createdAt",
      })
      .sort({ updatedAt: -1 });

    // 3. Prepare response data (Mapping the result for cleaner frontend use)
    const chatList = rooms.map((room) => {
      let chatName = room.name;
      let chatAvatar = null;
      let isGroup = room.type !== "direct";

      // Custom handling for Direct Messages (DM)
      if (room.type === "direct" && room.members.length > 0) {
        const otherUser = room.members[0];
        chatName = otherUser?.username || "Unknown User";
        chatAvatar = otherUser?.avatarUrl;
      }

      return {
        id: room._id,
        name: chatName,
        type: room.type,
        isGroup: isGroup,
        members: room.members,
        avatarUrl: chatAvatar,
        lastMessage: room.lastMessage,
        updatedAt: room.updatedAt,
      };
    });

    // 4. Send Response
    res.status(200).json(chatList);
  } catch (error) {
    // Crucial Step: If any asynchronous operation fails,
    // manually pass the error to the Express error handler.
    console.error("Error fetching chats:", error);
    next(error);
  }
};

const deleteChat = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const currentUserId = req.user._id;

    // Find the room
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Check if user is a member of the room
    if (!room.members.includes(currentUserId)) {
      return res
        .status(403)
        .json({ message: "You are not a member of this chat" });
    }

    // For direct messages, delete the room completely
    // For group chats, remove the user from members (soft delete)
    if (room.type === "direct") {
      // Delete all messages associated with this room
      await Message.deleteMany({ roomId });
      // Delete the room
      await Room.findByIdAndDelete(roomId);

      res.status(200).json({
        success: true,
        message: "Chat deleted successfully",
        roomId,
      });
    } else {
      // For group chats, remove user from members
      room.members = room.members.filter(
        (memberId) => !memberId.equals(currentUserId),
      );

      // If user is an admin, remove them from admins too
      room.admins = room.admins.filter(
        (adminId) => !adminId.equals(currentUserId),
      );

      // If no members left, delete the room
      if (room.members.length === 0) {
        await Message.deleteMany({ roomId });
        await Room.findByIdAndDelete(roomId);
      } else {
        await room.save();
      }

      res.status(200).json({
        success: true,
        message: "You have left the chat",
        roomId,
      });
    }
  } catch (error) {
    console.error("Error deleting chat:", error);
    next(error);
  }
};

const editGroupName = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { newName } = req.body;
    const currentUserId = req.user._id;

    // Validate input
    if (!newName || newName.trim().length === 0) {
      return res.status(400).json({ message: "Group name cannot be empty" });
    }

    // Find the room
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Check if user is a member of the room
    if (!room.members.includes(currentUserId)) {
      return res
        .status(403)
        .json({ message: "You are not a member of this chat" });
    }

    // Check if it's a group chat
    if (room.type === "direct") {
      return res
        .status(400)
        .json({ message: "Cannot edit name for direct messages" });
    }

    // Update the group name
    room.name = newName.trim();
    await room.save();

    res.status(200).json({
      success: true,
      message: "Group name updated successfully",
      room: {
        id: room._id,
        name: room.name,
      },
    });
  } catch (error) {
    console.error("Error editing group name:", error);
    next(error);
  }
};

module.exports = {
  getChats,
  deleteChat,
  editGroupName,
};
