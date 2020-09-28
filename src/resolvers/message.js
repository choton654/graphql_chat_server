import mongoose from 'mongoose';
import requireAuth from '../middleware/permission';
import Message from '../models/message';
import User from '../models/user';
module.exports = {
  Message: {
    user: ({ userId }) => User.findOne({ _id: userId }),
  },

  Query: {
    messages: requireAuth.createResolver((_, { channelId }, { req }, ___) => {
      console.log(req.user);
      return Message.find({ channelId });
    }),
    message: (root, { id }, context, info) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("can't find post");
      }
      return Message.findById(id);
    },
  },

  Mutation: {
    createMessage: requireAuth.createResolver(
      async (root, args, { req, pubSub }, info) => {
        try {
          const message = await Message.create({
            text: args.text,
            userId: req.user._id,
            channelId: args.channelId,
          });
          console.log(message);
          return true;
        } catch (error) {
          console.error(error);
          return false;
        }
      },
    ),
  },

  Subscription: {
    newMessage: {
      subscribe: (root, args, { pubSub }, info) => {
        return pubSub.asyncIterator('NEW POST');
      },
    },
  },
};
