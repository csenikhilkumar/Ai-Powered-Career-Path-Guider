import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/types/auth';
import { storage } from '@/utils/storage';
import { authApi } from '@/api/auth';
interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = storage.getToken();
            if (token) {
                if (token) {
                    try {
                        const user = await authApi.getCurrentUser();
                        setUser(user);
                    } catch (error) {
                        console.error("Auth check failed", error);
                        storage.clearToken();
                    }
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = (token: string, userData: User) => {
        storage.setToken(token);
        setUser(userData);
        window.location.href = '/dashboard';
    };

    const logout = () => {
        storage.clearToken();
        setUser(null);
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            login,
            logout,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
