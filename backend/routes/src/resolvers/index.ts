import { QueryResolvers } from "../generated/graphql";

const Query: QueryResolvers = {
  route: async (_, { id }, { prisma }) =>
    prisma.route.findUnique({ where: { id } })
};

export default { Query };
