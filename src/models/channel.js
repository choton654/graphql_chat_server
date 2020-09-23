import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'team',
  },
  channelMember: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
  public: {
    type: Boolean,
    default: false,
  },
});

const Channel = mongoose.model('channel', channelSchema);

export default Channel;
