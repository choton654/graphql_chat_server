const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: String,
    channelMember: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'channel',
      },
    ],
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    // console.log(this.password);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.models.user || mongoose.model('user', userSchema);

module.exports = User;
