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

  updateUserPassword: async (userId: string, passwordHash: string) => {
    return prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  },

  createRefreshToken: async (data: { userId: string; token: string; expiresAt: Date }) => {
    return prisma.refreshToken.create({
      data: {
        userId: data.userId,
        token: data.token,
        expiresAt: data.expiresAt,
      },
    });
  },

  findRefreshToken: async (token: string) => {
    return prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
  },

  deleteRefreshToken: async (token: string) => {
    return prisma.refreshToken.delete({ where: { token } });
  },

  deleteAllUserRefreshTokens: async (userId: string) => {
    return prisma.refreshToken.deleteMany({ where: { userId } });
  },
};
