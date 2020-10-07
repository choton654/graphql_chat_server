import { PubSub, withFilter } from "apollo-server-express";
import { createWriteStream } from "fs";
import path from "path";
import mongoose from "mongoose";
import {
  default as requireAuth,
  requireTeamAccess,
} from "../middleware/permission";
import Message from "../models/message";
import User from "../models/user";

const pubSub = new PubSub();

const NEW_MESSAGE = "NEW POST";

module.exports = {
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        () => pubSub.asyncIterator(NEW_MESSAGE),
        (payload, args, ctx) => {
          return payload.channelId === args.channelId;
        }
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
        console.log(args);
        try {
          const message = await Message.create({
            // ...messageData,
            text: args.text,
            channelId: args.channelId,
            userId: req.user._id,
          });
          // console.log(message);

          const user = await User.findOne({ _id: req.user._id });

          pubSub.publish(NEW_MESSAGE, {
            channelId: args.channelId,
            newMessage: {
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
      }
    ),
    singleUpload: (parent, args) => {
      return args.file.then(async (file) => {
        const { createReadStream, filename } = await file;
        console.log(filename);
        let files = [];
        await new Promise((res) =>
          createReadStream()
            .pipe(
              createWriteStream(path.join(__dirname, "../images", filename))
            )
            .on("close", res)
        );

        files.push(filename);
        console.log(files);
        return {
          url: `http://localhost:3000/${filename}`,
        };
      });
    },
  },
};
