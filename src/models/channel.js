import mongoose from 'mongoose';

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
    ref: 'team',
  },
  channelMember: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
});

const Channel = mongoose.model('channel', channelSchema);

export default Channel;
