const root = require('./root');
const user = require('./user');
const mesasage = require('./message');
const channel = require('./team');
const team = require('./channel');
module.exports = [root, user, mesasage, team, channel];

// import { gql } from 'apollo-server-express';

// const typeDefs = gql`
//   type Query {
//     message(id: ID!): Message
//     messages: [Message!]!
//     user(id: ID!): User
//     users: [User!]!
//     team(id: ID!): Team
//     teams: [Team!]!
//     channel(id: ID!): Channel
//     channels: [Channel!]!
//   }
//   type Mutation {
//     createMessage(text: String!): Message
//     signUp(
//       email: String!
//       name: String!
//       username: String!
//       password: String!
//     ): User
//     createTeam(name: String!): Team
//     createChannel(name: String!): Channel
//   }
//   type Subscription {
//     newMessage: Message!
//     newUser: User!
//     newTeam: Team!
//     newChannel: Channel!
//   }

// `;

// module.exports = typeDefs;
