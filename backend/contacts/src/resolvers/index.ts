import { QueryResolvers, MutationResolvers } from "../generated/graphql";

const Query: QueryResolvers = {
  emergencyContacts: async (_, { userId }, { prisma }) =>
    prisma.emergencyContact.findMany({ where: { userId } }).then(contacts => contacts.map(contact => ({
      id: contact.id,
      contactId: contact.contactId
    })))
};

const Mutation: MutationResolvers = {
  addEmergencyContact: async (_, data, { prisma }) =>
    prisma.emergencyContact.create({ data }).then(contact => ({
      id: contact.id,
      contactId: contact.contactId
    })),
  removeEmergencyContact: async (_, { id }, { prisma }) =>
    prisma.emergencyContact.delete({ where: { id } }).then(contact => ({
      id: contact.id,
      contactId: contact.contactId
    }))
}

export default { Query, Mutation };
