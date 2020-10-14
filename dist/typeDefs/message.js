"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _apolloServerExpress = require("apollo-server-express");

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  extend type Query {\n    message(id: ID!): Message\n    messages(offset: Int!, channelId: ID!): [Message!]!\n    uploads: [File]\n  }\n  extend type Mutation {\n    createMessage(channelId: ID!, text: String, file: Upload): Boolean!\n    singleUpload(file: Upload!): File!\n  }\n  extend type Subscription {\n    newMessage(channelId: ID!): Message!\n  }\n\n  type File {\n    url: String!\n  }\n  type Message {\n    id: ID!\n    text: String!\n    user: User!\n    channel: Channel!\n    createdAt: String!\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var typeDefs = (0, _apolloServerExpress.gql)(_templateObject());
module.exports = typeDefs;