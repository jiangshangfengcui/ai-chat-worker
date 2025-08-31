import { gql } from 'graphql-tag';

/**
 * GraphQL Schema 定义
 * 定义了消息类型和相关的查询、变更操作
 */
export const typeDefs = gql`
  type Message {
    id: ID!
    content: String!
    sender: String!
    timestamp: String!
  }

  type Query {
    messages: [Message!]!
  }

  type Mutation {
    sendMessage(content: String!, sender: String!): Message!
  }

  type Subscription {
    messageAdded: Message!
  }
`;
