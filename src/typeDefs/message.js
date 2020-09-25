import { gql } from 'apollo-server-express';

const typeDefs = gql`
  extend type Query {
    message(id: ID!): Message
    messages: [Message!]!
  }
  extend type Mutation {
    createMessage(channelId: ID!, text: String!): Boolean!
  }
  extend type Subscription {
    newMessage: Message!
  }
  type Message {
    id: ID!
    text: String!
    user: User!
    channel: Channel!
  }
`;

module.exports = typeDefs;