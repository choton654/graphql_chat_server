"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  extend type Query {\n    me: User!\n    allUsers: [User!]!\n    getUser(userId: ID!): User\n  }\n  extend type Mutation {\n    createUser(email: String!, username: String!, password: String!): User!\n    loginUser(email: String!, password: String!): Token\n  }\n\n  extend type Subscription {\n    newUser: User!\n  }\n  type User {\n    id: ID!\n    username: String!\n    email: String!\n    teams: [Team!]!\n  }\n  type Token {\n    errors: [Error!]\n    token: String\n    refreshToken: String\n  }\n  type Error {\n    error: String!\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var _require = require("apollo-server-express"),
    gql = _require.gql;

module.exports = gql(_templateObject());