const { UserInputError } = require('apollo-server-express');
const mongoose = require('mongoose');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { signupSchema } = require('../validation/userValidation');
const Joi = require('joi');

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
      console.log(pubSub);
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
    createUser: async (root, args, { res, pubSub }, info) => {
      console.log(pubSub);
      await signupSchema.validateAsync(args, { abortEarly: false });
      const user = User.create(args);

      const token = jwt.sign({ id: user._id }, 'new secret');
      // console.log(token);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

      pubSub.publish(NEW_USER, {
        newUser: user,
      });
      return user;
    },
  },
};
