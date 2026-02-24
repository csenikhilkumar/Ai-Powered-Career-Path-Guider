import { client } from './client';

export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    bio?: string;
    educationLevel?: string;
    currentRole?: string;
    location?: string;
    skills?: string[];
    interests?: string[];
    role: string;
    notifications?: {
        email: boolean;
        push: boolean;
    };
}

export const userApi = {
    getProfile: async (): Promise<UserProfile> => {
        const response = await client.get<{ user: UserProfile }>('/users/profile');
        return response.data.user;
    },

    updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
        const response = await client.put<{ user: UserProfile }>('/users/profile', data);
        return response.data.user;
    }
};
