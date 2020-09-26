import Channel from '../models/channel';

module.exports = {
  Query: {
    channels: () => Channel.find({}),
    channel: (_, __, { id }) => Channel.findById(id),
  },

  Mutation: {
    createChannel: async (root, args, { req }, info) => {
      console.log(req.user);

      try {
        if (req.user !== null) {
          const channel = await Channel.create(args);
          console.log(channel);
          return {
            ok: true,
            channel,
          };
        } else {
          return {
            ok: false,
          };
        }
      } catch (error) {
        console.error(error);
        return {
          ok: false,
          error: error.message,
        };
      }
    },
  },
};
