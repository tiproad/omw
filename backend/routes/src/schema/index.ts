import { gql } from "apollo-server";

export default gql`
  # User type definition as an Entity to be shared with multiple services
  # The @key directive defines the entity's primary key
  # This primary key will be used as a unique reference for all implementing services
  type Route @key(fields: "id") {
    id: ID!
    waypoints: [Coordinate!]!
  }
  
  type Coordinate {
    lat: Float!
    long: Float!
  }

  type Query {
    route(id: ID): Route
    createRoute(data: CreateRouteInput): Route
  }

  input CreateRouteInput {
    origin: String!
    dest: String!
  }

`;
