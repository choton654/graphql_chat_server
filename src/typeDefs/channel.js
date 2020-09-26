import { gql } from 'apollo-server-express';

const typeDefs = gql`
  extend type Query {
    channel(id: ID!): Channel
    channels: [Channel!]!
  }

  extend type Mutation {
    createChannel(teamId: ID!, name: String!, public: Boolean): ChannelResponse!
  }
  type ChannelResponse {
    ok: Boolean!
    error: Error
    channel: Channel
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
