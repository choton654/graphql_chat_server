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
  console.log(req.user);

  if (!req.user || !req.user.id) {
    throw new Error('Not authenticated');
    // return {
    //   ok: false,
    //   error: { error: 'Not authenticated' },
    // };
  }
});
