import { gql } from 'apollo-server-express';

const typeDefs = gql`
  extend type Query {
    team(id: ID!): Team!
    teams: [Team!]!
  }
  extend type Mutation {
    createTeam(name: String!): TeamResponse
  }
  type TeamResponse {
    ok: Boolean!
    error: Error
  }
  type Team {
    id: ID!
    owner: User!
    members: [User!]!
    channels: [Channel!]!
  }
`;

module.exports = typeDefs;
