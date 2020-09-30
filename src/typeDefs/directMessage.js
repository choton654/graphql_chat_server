import { gql } from 'apollo-server-express';

const typeDefs = gql`
  extend type Query {
    directMessages: [DirectMessage!]!
  }
  extend type Mutation {
    createDirectMessage(reciverId: ID!, text: String!): Boolean!
  }
  type DirectMessage {
    id: ID!
    text: String!
    sender: User!
    reciverId: ID!
  }
`;

module.exports = typeDefs;
