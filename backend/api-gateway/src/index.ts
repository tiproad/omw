import { ApolloServer } from "apollo-server";
import { ApolloGateway } from "@apollo/gateway";
import dotenv from "dotenv";

dotenv.config();

const {
  PORT = 4000,
  ROUTES_ENDPOINT = "http://localhost:4001/graphql",
} = process.env;

(() => {
  const gateway = new ApolloGateway({
    serviceList: [
      { name: "routes-api", url: ROUTES_ENDPOINT },
    ],
  });

  const server = new ApolloServer({
    gateway,
    subscriptions: false, // Disable subscriptions (not currently supported with ApolloGateway)
  });

  void server.listen({ port: PORT }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
})();
