const { UserInputError } = require('apollo-server-express');
const mongoose = require('mongoose');
const User = require('../models/user');
import requireAuth from '../middleware/permission';
import Member from '../models/member';
import Team from '../models/team';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { signupSchema } = require('../validation/userValidation');
const Joi = require('joi');
const { createTokens } = require('../middleware/authMiddleware');

const NEW_USER = 'NEW_USER';

const maxAge = 3 * 24 * 60 * 60;

module.exports = {
  User: {
    teams: async (root, args, { req }, info) => {
      try {
        let teams;
        const members = await Member.find({ userId: req.user._id });
        // console.log(members);
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
  },
  Query: {
    allUsers: (root, args, { req, res, pubSub }, info) => {
      // console.log('req user', req.user);
      return User.find({});
    },
    me: requireAuth.createResolver(
      async (root, { id }, { req, pubsub }, info) => {
        // if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
        //   return UserInputError(`${id} is not exists`);
        // }
        return await User.findById(req.user._id);
      },
    ),
  },
  Mutation: {
    createUser: async (root, args, { res }, info) => {
      await signupSchema.validateAsync(args, { abortEarly: false });
      const user = await User.create(args);
      return user;
    },
    loginUser: async (root, { email, password }, { req, res }, info) => {
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

      return {
        token: newToken,
        refreshToken: newRefreshtoken,
      };
    },
  },
  Subscription: {
    newUser: {
      subscribe(root, args, { pubSub }, info) {
        return pubSub.asyncIterator(NEW_USER);
      },
    },
  },
};
