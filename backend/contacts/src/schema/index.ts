import { gql } from "apollo-server";

export default gql`
  # User type definition as an Entity to be shared with multiple services
  # The @key directive defines the entity's primary key
  # This primary key will be used as a unique reference for all implementing services
  type EmergencyContact @key(fields: "id") {
    id: ID!
    contactId: ID!
  }
  
  type Query {
    emergencyContacts(userId: ID!): [EmergencyContact!]!
  }

  type Mutation {
    addEmergencyContact(userId: ID!, contactId: ID!): EmergencyContact!
    removeEmergencyContact(id: ID!): EmergencyContact
  }
`;
