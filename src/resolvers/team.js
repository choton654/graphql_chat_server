import mongoose from 'mongoose';
import requireAuth from '../middleware/permission';
import Channel from '../models/channel';
import Member from '../models/member';
import Team from '../models/team';
import User from '../models/user';

module.exports = {
  Query: {
    allTeams: (_, __, { req }) => Team.find({ owner: req.user._id }),
    inviteTeams: async (_, __, { req }) => {
      console.log(req.user);
      try {
        let teams;
        const members = await Member.find({ userId: req.user._id });
        console.log(members);
        members.map((member) => {
          teams = Team.find({ _id: member.teamId });
          console.log(teams);
          return teams;
        });
        return teams;
      } catch (error) {
        console.error(error);
      }
    },
    team: (root, { id }, context, info) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw Error('Team is not exists');
      }

      return Team.findById(id);
    },
  },
  Mutation: {
    addTeamMember: requireAuth.createResolver(
      async (root, { email, teamId }, { req, pubSub }, info) => {
        try {
          const userToAddPromise = User.findOne({ email });
          const teamPromise = Team.findById(teamId);
          const [team, userToAdd] = await Promise.all([
            teamPromise,
            userToAddPromise,
          ]);
          if (team.owner.toString() !== req.user._id.toString()) {
            return {
              ok: false,
              error: { error: 'You cannot add members to the team' },
            };
          }
          if (!userToAdd) {
            return {
              ok: false,
              error: { error: 'Could not find user with this email' },
            };
          }
          if (!teamPromise) {
            return {
              ok: false,
              error: { error: 'Select team to add people' },
            };
          }
          await Member.create({ userId: userToAdd._id, teamId });
          return {
            ok: true,
          };
        } catch (error) {
          console.error(error);
          return {
            ok: false,
            error: { error: error.message },
          };
        }
      },
    ),
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
          if (error.code === 11000) {
            return {
              ok: false,
              error: { error: 'Team already exists' },
            };
          }
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
