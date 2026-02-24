import { AppError } from "../utils/errors";
import { userRepository, type UpdateProfileInput } from "../repositories/user.repository";

export const userService = {
  getProfile: async (userId: string) => {
    const profile = await userRepository.getProfile(userId);
    if (!profile) {
      throw new AppError("Profile not found", 404);
    }
    return profile;
  },

  updateProfile: async (userId: string, email: string, data: UpdateProfileInput) => {
    return userRepository.upsertProfile(userId, email, data);
  },
};
