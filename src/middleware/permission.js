import Channel from '../models/channel';
import Member from '../models/member';

const createResolver = (resolver) => {
  const baseResolver = resolver;
  baseResolver.createResolver = (childResolver) => {
    const newResolver = async (parent, args, context, info) => {
      await resolver(parent, args, context, info);
      return childResolver(parent, args, context, info);
    };
    return createResolver(newResolver);
  };
  return baseResolver;
};

// requiresAuth
export default createResolver((parent, args, { req }) => {
  if (!req.user || !req.user._id) {
    throw new Error('Not authenticated');
  }
});

export const requireTeamAccess = createResolver(
  async (parent, { channelId }, { req: { user } }) => {
    console.log('permission user', user);
    if (!user || !user._id) {
      throw new Error('Not authenticated');
    }
    // check if part of the team
    const channel = await Channel.findOne({ _id: channelId });
    const member = await Member.findOne({
      teamId: channel.teamId,
      userId: user._id,
    });
    if (!member) {
      throw new Error(
        "You have to be a member of the team to subcribe to it's messages",
      );
    }
  },
);
