import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  public: {
    type: Boolean,
    default: false,
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "team",
  },
  dm: { type: Boolean, default: false },
});

const Channel = mongoose.model("channel", channelSchema);

export default Channel;
