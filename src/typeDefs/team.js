import { gql } from 'apollo-server-express';

const typeDefs = gql`
  extend type Query {
    team(id: ID!): Team!
    allTeams: [Team!]!
    inviteTeams: [Team!]
  }
  extend type Mutation {
    createTeam(name: String!): TeamResponse!
    addTeamMember(email: String!, teamId: ID!): VoidResponse!
  }
  extend type Subscription {
    newTeam: Team!
  }
  type VoidResponse {
    ok: Boolean!
    error: Error
  }
  type TeamResponse {
    ok: Boolean!
    error: Error
    team: Team
  }
  type Team {
    id: ID!
    name: String!
    admin: Boolean
    members: [User!]!
    channels: [Channel!]!
  }
`;

module.exports = typeDefs;
