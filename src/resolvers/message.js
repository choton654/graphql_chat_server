import mongoose from 'mongoose';
import requireAuth from '../middleware/permission';
import Message from '../models/message';
module.exports = {
  Query: {
    messages: (_, __, { req }, ___) => {
      console.log(req.user);
      return Message.find({});
    },
    message: (root, { id }, context, info) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("can't find post");
      }
      return Message.findById(id);
    },
  },

  Mutation: {
    createMessage: requireAuth.createResolver(
      async (root, args, { user, pubSub }, info) => {
        try {
          const message = await Message.create({
            text: args.text,
            userId: user._id,
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
