import { gql } from 'apollo-server-express';

const typeDefs = gql`
  extend type Query {
    team(id: ID!): Team!
    allTeams: [Team!]!
  }
  extend type Mutation {
    createTeam(name: String!): TeamResponse
  }
  type TeamResponse {
    ok: Boolean!
    error: Error
    team: Team!
  }
  type Team {
    id: ID!
    name: String!
    owner: User!
    members: [User!]!
    channels: [Channel!]!
  }
`;

module.exports = typeDefs;
