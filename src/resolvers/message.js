import { PubSub, withFilter } from 'apollo-server-express';
import mongoose from 'mongoose';
import requireAuth from '../middleware/permission';
import Message from '../models/message';
import User from '../models/user';

const pubSub = new PubSub();

const NEW_MESSAGE = 'NEW POST';

module.exports = {
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        () => pubSub.asyncIterator(NEW_MESSAGE),
        (payload, args) => {
          // console.log(payload, args);
          return payload.channelId === args.channelId;
        },
      ),
    },
  },
  Message: {
    user: async ({ user, userId }, _, { req }) => {
      try {
        if (user) {
          return user;
        } else {
          return await User.findOne({ _id: userId });
        }
      } catch (error) {
        console.error(error);
      }
    },
  },

  Query: {
    messages: requireAuth.createResolver((_, { channelId }, { req }, ___) => {
      // console.log(req.user);
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
      async (root, args, { req }, info) => {
        try {
          // console.log('....', req.user);
          const message = await Message.create({
            text: args.text,
            userId: req.user._id,
            channelId: args.channelId,
          });
          console.log(message);

          const user = await User.findOne({ _id: req.user._id });

          pubSub.publish(NEW_MESSAGE, {
            channelId: args.channelId,
            newMessage: {
              // ...message,
              id: message._id,
              text: message.text,
              createdAt: message.createdAt,
              user,
            },
          });
          return true;
        } catch (error) {
          console.error(error);
          return false;
        }
      },
    ),
  },
};
