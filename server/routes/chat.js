const express = require("express");
const {
  getChats,
  deleteChat,
  editGroupName,
} = require("../controllers/chatControllers");
const router = express.Router();

// get chats api
router.get("/chats", getChats);

// delete chat api
router.delete("/chats/:roomId", deleteChat);

// edit group name api
router.put("/chats/:roomId", editGroupName);

module.exports = router;
