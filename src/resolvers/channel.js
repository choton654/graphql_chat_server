import requireAuth from "../middleware/permission";
import Channel from "../models/channel";
import Member from "../models/member";
import PCMember from "../models/pcmember";
import Team from "../models/team";

module.exports = {
  Query: {
    channels: () => Channel.find({}),
    channel: (_, __, { id }) => Channel.findById(id),
  },

  Mutation: {
    createChannel: requireAuth.createResolver(
      async (root, args, { req: { user } }, info) => {
        try {
          const team = await Team.findOne({ _id: args.teamId });
          if (!team.admin) {
            return {
              ok: false,
              error: { error: "You are not owner of the team" },
            };
          }
          const channel = await Channel.create(args);

          if (!args.public) {
            const members = args.members.filter((m) => m !== user._id);
            members.push(user._id);
            const pcmembers = members.map((m) => ({
              userId: m,
              channelId: channel._id,
            }));
            await PCMember.create(pcmembers);
          }

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
