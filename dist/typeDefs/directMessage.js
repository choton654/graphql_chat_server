"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _apolloServerExpress = require("apollo-server-express");

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  extend type Query {\n    directMessages(teamId: ID!, receiverId: ID!): [DirectMessage!]!\n  }\n  extend type Mutation {\n    createDirectMessage(receiverId: ID!, text: String!, teamId: ID!): Boolean!\n  }\n  extend type Subscription {\n    newDirectMessage(teamId: ID!, userId: ID!): DirectMessage!\n  }\n  type DirectMessage {\n    id: ID!\n    text: String!\n    sender: User!\n    receiverId: ID!\n    createdAt: String!\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var typeDefs = (0, _apolloServerExpress.gql)(_templateObject());
module.exports = typeDefs;