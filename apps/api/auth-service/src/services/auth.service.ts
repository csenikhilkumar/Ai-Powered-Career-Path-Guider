import { AppError } from "../utils/errors";
import { authRepository } from "../repositories/auth.repository";
import { comparePassword, generateAccessToken, hashPassword, verifyAccessToken } from "../utils/auth";

export const authService = {
  register: async (input: { email: string; password: string; firstName?: string; lastName?: string }) => {
    const existingUser = await authRepository.findUserByEmail(input.email);
    if (existingUser) {
      throw new AppError("User already exists", 400);
    }

    const passwordHash = await hashPassword(input.password);
    const user = await authRepository.createUser({
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
    });

    const token = generateAccessToken({ userId: user.id, email: user.email, role: "USER" });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        role: "USER",
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    };
  },

  login: async (input: { email: string; password: string }) => {
    const user = await authRepository.findUserByEmail(input.email);
    if (!user || !(await comparePassword(input.password, user.passwordHash))) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = generateAccessToken({ userId: user.id, email: user.email, role: "USER" });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        role: "USER",
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    };
  },

  verifyToken: async (token?: string) => {
    if (!token) {
      return { valid: false } as const;
    }

    try {
      const decoded = verifyAccessToken(token) as { userId?: string; email?: string };
      const userId = decoded.userId;
      if (!userId) {
        return { valid: false } as const;
      }

      const user = await authRepository.findUserById(userId);
      if (!user) {
        return { valid: false } as const;
      }

      return {
        valid: true,
        userId: user.id,
        email: user.email,
      };
    } catch {
      return { valid: false } as const;
    }
  },

  getUserById: async (userId: string) => {
    const user = await authRepository.findUserById(userId);

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      role: "USER",
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  },

  googleLogin: async (input: { email: string; firstName?: string; lastName?: string }) => {
    // Check if user exists
    let user = await authRepository.findUserByEmail(input.email);

    // If user doesn't exist, create them with a random password (they'll use Google to login)
    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-12);
      const passwordHash = await hashPassword(randomPassword);
      user = await authRepository.createUser({
        email: input.email,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
      });
    }

    const token = generateAccessToken({ userId: user.id, email: user.email, role: "USER" });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        role: "USER",
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    };
  },
};
