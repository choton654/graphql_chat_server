"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _apolloServerExpress = require("apollo-server-express");

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  extend type Query {\n    team(id: ID!): Team!\n    # allTeams: [Team!]!\n    # inviteTeams: [Team!]\n    getTeamMembers(teamId: ID!): [User!]!\n  }\n  extend type Mutation {\n    createTeam(name: String!): TeamResponse!\n    addTeamMember(email: String!, teamId: ID!): VoidResponse!\n  }\n  extend type Subscription {\n    newTeam: Team!\n  }\n  type VoidResponse {\n    ok: Boolean!\n    error: Error\n  }\n  type TeamResponse {\n    ok: Boolean!\n    error: Error\n    team: Team\n  }\n  type Team {\n    id: ID!\n    name: String!\n    admin: Boolean!\n    owner: ID!\n    members: [User!]!\n    directMessageMembers: [User!]!\n    channels: [Channel!]!\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var typeDefs = (0, _apolloServerExpress.gql)(_templateObject());
module.exports = typeDefs;