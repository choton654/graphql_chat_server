import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "channel",
    required: true,
  },
});

const PCMember = mongoose.model("pcmember", memberSchema);

export default PCMember;
