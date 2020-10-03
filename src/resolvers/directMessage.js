import requiresAuth from "../middleware/permission";
import Directmessage from "../models/directMessage";
import User from "../models/user";

module.exports = {
  DirectMessage: {
    sender: ({ sender, senderId }, args, req) => {
      if (sender) {
        return sender;
      }

      return User.findOne({ _id: senderId });
    },
  },
  Query: {
    directMessages: requiresAuth.createResolver(
      async (parent, { teamId, receiverId }, { req: { user } }) => {
        console.log(user._id);
        try {
          const msgs = await Directmessage.find({
            $and: [
              { teamId },
              {
                $or: [
                  {
                    $and: [{ receiverId }, { senderId: user._id }],
                  },
                  {
                    $and: [{ receiverId: user._id }, { senderId: receiverId }],
                  },
                ],
              },
            ],
          });
          console.log("msgs", msgs);
          return msgs;
        } catch (error) {
          console.error(error);
          return [];
        }
      }
    ),
  },
  Mutation: {
    createDirectMessage: requiresAuth.createResolver(
      async (parent, { receiverId, text, teamId }, { req: { user } }) => {
        try {
          const directMessage = await Directmessage.create({
            receiverId,
            text,
            teamId,
            senderId: user._id,
          });
          console.log(directMessage);
          // const asyncFunc = async () => {
          //   const currentUser = await models.User.findOne({
          //     where: {
          //       id: user.id,
          //     },
          //   });

          //   pubsub.publish(NEW_CHANNEL_MESSAGE, {
          //     channelId: args.channelId,
          //     newChannelMessage: {
          //       ...message.dataValues,
          //       user: currentUser.dataValues,
          //     },
          //   });
          // };

          // asyncFunc();

          return true;
        } catch (err) {
          console.log(err);
          return false;
        }
      }
    ),
  },
};
