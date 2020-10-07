import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    text: String,
    url: String,
    filetype: String,
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "channel",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("message", messageSchema);

export default Message;
