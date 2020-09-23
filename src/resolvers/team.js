import mongoose from 'mongoose';
import Team from '../models/team';

const NEW_TEAM = 'NEW TEAM';

module.exports = {
  Query: {
    teams: () => Team.find({}),
    team: (root, { id }, context, info) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw Error('Team is not exists');
      }

      return Team.findById(id);
    },
  },

  Mutation: {
    createTeam: async (root, args, { pubSub }, info) => {
      try {
        const team = await Team.create(args);
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
      // pubSub.publish(NEW_TEAM, {
      //   newTeam: team,
      // });
    },
  },

  // Subscription: {
  //   newTeam: {
  //     subscribe: (root, args, { pubsub }, info) => {
  //       return pubsub.asyncIterator(NEW_TEAM);
  //     },
  //   },
  // },
};
