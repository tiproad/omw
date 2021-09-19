import { QueryResolvers } from "../generated/graphql";
import axios from "axios";

const Query: QueryResolvers = {
  route: async (_, { id }, { prisma }) =>
    prisma.route.findUnique({ where: { id } }).then(route => ({
      id: route.id,
      waypoints: []
    })),
  createRoute: async (_, { data }) => {
    const res = await axios.post("http://localhost:5000/api/saferoutes", data)
    console.log(res.data);
    return {
      id: "gibberish",
      waypoints: res.data.res
    }
  }
};

export default { Query };
