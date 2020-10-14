"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _apolloServerExpress = require("apollo-server-express");

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  extend type Query {\n    channel(id: ID!): Channel\n    channels: [Channel!]!\n  }\n\n  extend type Mutation {\n    createChannel(\n      teamId: ID!\n      name: String!\n      public: Boolean = false\n      members: [ID!] = []\n    ): ChannelResponse!\n    getOrCreateChannel(teamId: ID!, members: [ID!]!): DMChannelResponse!\n  }\n  type DMChannelResponse {\n    id: ID!\n    name: String!\n  }\n\n  type ChannelResponse {\n    ok: Boolean!\n    error: Error\n    channel: Channel\n  }\n\n  type Channel {\n    id: ID!\n    name: String!\n    public: Boolean!\n    messages: [Message!]!\n    users: [User!]!\n    dm: Boolean!\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var typeDefs = (0, _apolloServerExpress.gql)(_templateObject());
module.exports = typeDefs;