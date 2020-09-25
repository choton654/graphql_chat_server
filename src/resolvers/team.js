import mongoose from 'mongoose';
import requireAuth from '../middleware/permission';
import Channel from '../models/channel';
import Team from '../models/team';

module.exports = {
  Query: {
    allTeams: () => Team.find({}),
    team: (root, { id }, context, info) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw Error('Team is not exists');
      }

      return Team.findById(id);
    },
  },
  Mutation: {
    createTeam: requireAuth.createResolver(
      async (root, args, { req, pubSub }, info) => {
        try {
          const team = await Team.create({
            name: args.name,
            owner: req.user._id,
          });
          console.log('team', team);
          await Channel.create({
            name: `${team.name}-general`,
            teamId: team._id,
            public: true,
          });
          return {
            ok: true,
            team,
          };
        } catch (error) {
          console.error(error);
          return {
            ok: false,
            error: { error: 'Team already exists' },
          };
        }
      },
    ),
  },
  Team: {
    channels: ({ id }, args, context, info) => Channel.find({ teamId: id }),
  },
};

// const NEW_TEAM = 'NEW TEAM';
// pubSub.publish(NEW_TEAM, {
//   newTeam: team,
// });
// Subscription: {
//   newTeam: {
//     subscribe: (root, args, { pubsub }, info) => {
//       return pubsub.asyncIterator(NEW_TEAM);
//     },
//   },
// },
// if (req.user !== null) {
// } else {
//   return {
//     ok: false,
//     error: { error: 'User must be sign in' },
//   };
// }
