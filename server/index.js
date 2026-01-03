const express = require("express");
require("dotenv").config();
const { Server } = require("socket.io");
const { createServer } = require("http");
const cors = require("cors");
const connectDB = require("./config/connectDb");
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const roomRoutes = require("./routes/room");
const messageRoutes = require("./routes/messages");
const userRoutes = require("./routes/users");
const { protect } = require("./middleware/authMiddleware");

connectDB();

const app = express();
const server = createServer(app);


app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let onlineUsers = []; // Yahan hum sab online users ko store karenge

const addUser = (userData, socketId) => {
  // Check karte hain user pehle se list mein toh nahi
  !onlineUsers.some((user) => user.userId === userData.userId) &&
    onlineUsers.push({
      userId: userData.userId,
      socketId,
      username: userData?.username,
    });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log("User Joined Room with ID :-", roomId);
  });

  // 1. User App mein aaya (Frontend se 'addUser' event aayega)
  socket.on("addUser", (userId) => {
    // to remove the user if he is already online (in case of two users with same socket id)
    removeUser(socket.id);

    addUser(userId, socket.id);

    // const uniqueOnlineUsers = [
    //   ...new Map(onlineUsers.map((user) => [user.socketId, user])).values(),
    // ];

    // Sabhi logon ko updated list bhej do
    io.emit("getUsers", onlineUsers);
  });

  // typing events
  socket.on("typing", (user) => {
    console.log(user, "is Typing...");
    socket.broadcast.emit("user-typing", user);
  });

  socket.on("stop-typing", (user) => {
    socket.broadcast.emit("user-stop-typing", user);
    console.log(user, "stopped Typing...");
  });

  // for editing messages
  socket.on("edit-message", (data) => {
    console.log("Message Edited:", data.messageId);
    io.to(data.roomId).emit("message-updated", data);
  });

  // for delete messages
  socket.on("delete-message", (data) => {
    io.to(data.roomId).emit("message-deleted", data);
  });

  // for new received message
  socket.on("newMessage", (data) => {
    io.to(data.roomId).emit("message received", data);
  });

  // 2. User chala gaya (Browser band kiya ya net gaya)
  socket.on("disconnect", () => {
    removeUser(socket.id);
    // Sabko bata do ki list change ho gayi hai
    io.emit("getUsers", onlineUsers);
  });
});

app.use(express.json());

app.use("/api/auth/", authRoutes);

app.use("/api/", protect, chatRoutes);

app.use("/api/rooms", protect, roomRoutes);
app.use("/api/messages", protect, messageRoutes);
app.use("/api/users", protect, userRoutes);

app.get("/", (req, res) => {
  res.send("Say Hello To Your Chat App!");
});

server.listen(process.env.PORT, () =>
  console.log(`Server is running on port ${process.env.PORT}`)
);
