import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  admin: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    unique: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

const Team = mongoose.model('team', teamSchema);

export default Team;
