import { gql } from 'apollo-server-express';

const typeDefs = gql`
  extend type Query {
    channel(id: ID!): Channel
    channels: [Channel!]!
  }

  extend type Mutation {
    createChannel(teamId: ID!, name: String!, public: Boolean): Boolean!
  }

  type Channel {
    id: ID!
    name: String!
    public: Boolean!
    messages: [Message!]!
    users: [User!]!
  }
`;

module.exports = typeDefs;
