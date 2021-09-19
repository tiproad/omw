import { ApolloServer } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

import resolvers from "./resolvers";
import typeDefs from "./schema";

dotenv.config();

export interface Context {
  prisma: PrismaClient;
}

const prisma = new PrismaClient();

(() => {
  const { PORT = 4001 } = process.env;

  const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }]),
    context: { prisma },
  });

  server.listen({ port: PORT }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
})()

