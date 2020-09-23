import Channel from '../models/channel';

module.exports = {
  // Query: {
  //   channels: () => Channel.find({}),
  //   channel: (_, __, { id }) => Channel.findById(id),
  // },

  Mutation: {
    createChannel: async (root, args, context, info) => {
      console.log(args);
      try {
        const channel = await Channel.create(args);
        console.log(channel);
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
  },
};
