import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  text: String,
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'channel',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
});

const Message = mongoose.model('message', messageSchema);

export default Message;
