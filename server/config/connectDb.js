const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "chatapp",
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("MongoDB connection failed", error.message);
    setTimeout(() => {
      connectDB();
    }, 3000);
  }
};

module.exports = connectDB;
