import requireAuth from "../middleware/permission";
import Channel from "../models/channel";
import Member from "../models/member";

module.exports = {
  Query: {
    channels: () => Channel.find({}),
    channel: (_, __, { id }) => Channel.findById(id),
  },

  Mutation: {
    createChannel: requireAuth.createResolver(
      async (root, args, { req }, info) => {
        try {
          const member = await Member.findOne({ teamId });
          if (!member.admin) {
            return {
              ok: false,
              error: { error: "You are not owner of the team" },
            };
          }
          const channel = await Channel.create(args);
          return {
            ok: true,
            channel,
          };
        } catch (error) {
          console.error(error);
          return {
            ok: false,
            error: error.message,
          };
        }
      }
    ),
  },
};
