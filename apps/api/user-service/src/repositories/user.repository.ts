import { prisma } from "../utils/prisma";

export type UpdateProfileInput = {
  firstName?: string;
  lastName?: string;
  bio?: string;
  currentRole?: string;
  location?: string;
  educationLevel?: string;
  skills?: string[];
  interests?: string[];
};

export const userRepository = {
  getProfile: async (userId: string) => {
    return prisma.userProfile.findUnique({
      where: { userId },
      include: { skills: true, interests: true },
    });
  },

  upsertProfile: async (userId: string, email: string, data: UpdateProfileInput) => {
    return prisma.userProfile.upsert({
      where: { userId },
      update: {
        firstName: data.firstName,
        lastName: data.lastName,
        bio: data.bio,
        currentRole: data.currentRole,
        location: data.location,
        educationLevel: data.educationLevel,
        skills: data.skills
          ? {
              deleteMany: {},
              create: data.skills.map((s) => ({ skillName: s })),
            }
          : undefined,
        interests: data.interests
          ? {
              deleteMany: {},
              create: data.interests.map((i) => ({ interestName: i })),
            }
          : undefined,
      },
      create: {
        userId,
        email,
        firstName: data.firstName,
        lastName: data.lastName,
        bio: data.bio,
        currentRole: data.currentRole,
        location: data.location,
        educationLevel: data.educationLevel,
        skills: {
          create: data.skills?.map((s) => ({ skillName: s })) || [],
        },
        interests: {
          create: data.interests?.map((i) => ({ interestName: i })) || [],
        },
      },
    });
  },
};
