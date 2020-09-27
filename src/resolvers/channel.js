import requireAuth from '../middleware/permission';
import Channel from '../models/channel';
import Team from '../models/team';

module.exports = {
  Query: {
    channels: () => Channel.find({}),
    channel: (_, __, { id }) => Channel.findById(id),
  },

  Mutation: {
    createChannel: requireAuth.createResolver(
      async (root, args, { req }, info) => {
        console.log(req.user);
        try {
          const team = await Team.findOne({ _id: args.teamId });
          console.log('team', team);
          if (team.owner !== req.user._id) {
            return {
              ok: false,
              error: { error: 'You are not owner of the team' },
            };
          }
          const channel = await Channel.create(args);
          console.log(channel);
          return {
            ok: true,
            channel,
          };
          // if (req.user !== null) {
          // } else {
          //   return {
          //     ok: false,
          //   };
          // }
        } catch (error) {
          console.error(error);
          return {
            ok: false,
            error: error.message,
          };
        }
      },
    ),
  },
};
