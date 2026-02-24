import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // If not loading and no user, redirect to login
        if (!isLoading && !user) {
            navigate('/auth/login', { replace: true });
        }
    }, [user, isLoading, navigate]);

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
                <div className="text-center space-y-4">
                    <div className="relative inline-block">
                        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                    </div>
                    <p className="text-purple-300 text-lg font-medium">Verifying authentication...</p>
                </div>
            </div>
        );
    }

    // If no user after loading, return null (will redirect)
    if (!user) {
        return null;
    }

    // User is authenticated, render children
    return <>{children}</>;
}
