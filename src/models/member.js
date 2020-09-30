import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  admin: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'team',
    required: true,
  },
});

const Member = mongoose.model('member', memberSchema);

export default Member;
