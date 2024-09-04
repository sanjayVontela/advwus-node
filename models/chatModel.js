import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Match the ref to your User model
    latestMessage: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatMessage", // This should match the model name
    }],
  },
  { 
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
