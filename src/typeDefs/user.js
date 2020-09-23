const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    getUser(id: ID!): User
    allUsers: [User!]!
  }
  extend type Mutation {
    createUser(email: String!, username: String!, password: String!): User!
  }
  extend type Subscription {
    newUser: User!
  }
  type User {
    id: ID!
    username: String!
    email: String!
    teams: [Team!]!
  }
`;
