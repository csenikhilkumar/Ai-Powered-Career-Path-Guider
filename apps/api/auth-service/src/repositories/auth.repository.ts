import { prisma } from "../utils/prisma";

export const authRepository = {
  findUserByEmail: async (email: string) => {
    return prisma.user.findUnique({ where: { email } });
  },

  findUserById: async (id: string) => {
    return prisma.user.findUnique({ where: { id } });
  },

  createUser: async (data: { email: string; passwordHash: string; firstName?: string; lastName?: string }) => {
    return prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });
  },
};
