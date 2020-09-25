const { UserInputError } = require('apollo-server-express');
const mongoose = require('mongoose');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { signupSchema } = require('../validation/userValidation');
const Joi = require('joi');
const { createTokens } = require('../middleware/authMiddleware');

const NEW_USER = 'NEW_USER';

const maxAge = 3 * 24 * 60 * 60;

module.exports = {
  Subscription: {
    newUser: {
      subscribe(root, args, { pubSub }, info) {
        return pubSub.asyncIterator(NEW_USER);
      },
    },
  },
  Query: {
    allUsers: (root, args, { req, res, pubSub }, info) => {
      console.log('req user', req.user);
      return User.find({});
    },
    getUser: (root, { id }, { pubsub }, info) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return UserInputError(`${id} is not exists`);
      }
      return User.findById(id);
    },
  },
  Mutation: {
    createUser: async (root, args, { res }, info) => {
      await signupSchema.validateAsync(args, { abortEarly: false });
      const user = await User.create(args);
      return user;
    },
    loginUser: async (root, { email, password }, { res }, info) => {
      let errors = [];
      const user = await User.findOne({ email });
      if (!user) {
        errors.push({ error: 'wrong email' });
        console.log(errors);
        return {
          errors,
        };
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        errors.push({ error: 'wrong password' });
        console.log(errors);
        return {
          errors,
        };
      }

      const refreshSecret = user.password + process.env.SECRET2;

      const [newToken, newRefreshtoken] = await createTokens(
        user,
        refreshSecret,
      );

      // const token = jwt.sign({ id: user._id }, process.env.SECRET, {
      //   expiresIn: '1hr',
      // });
      // const refreshToken = jwt.sign({ id: user._id }, refreshSecret, {
      //   expiresIn: '7d',
      // });

      return {
        token: newToken,
        refreshToken: newRefreshtoken,
      };
    },
  },
};
