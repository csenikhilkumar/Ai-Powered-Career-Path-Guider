import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Compass, BookOpen, Settings, LogOut, Network, Brain, Briefcase } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/hooks/useAuth';

const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Career Paths', href: '/dashboard/careers', icon: Compass },
    { name: 'Learning', href: '/dashboard/learning', icon: BookOpen },
    { name: 'Jobs & Internships', href: '/dashboard/jobs', icon: Briefcase },
    { name: 'Skill Mapping', href: '/dashboard/skill-mapping', icon: Network },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
    const location = useLocation();
    const { logout } = useAuth();

    return (
        <div className="hidden lg:flex h-screen w-72 flex-col border-r border-white/10 glass-strong relative z-20">
            <div className="flex h-20 items-center px-6 gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Brain className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">PathGuide</span>
            </div>

            <div className="flex flex-1 flex-col gap-2 px-4 py-6">
                {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                                isActive
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/20'
                                    : 'text-purple-200 hover:bg-white/5 hover:text-white'
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-purple-400 group-hover:text-white")} />
                            {item.name}
                        </Link>
                    );
                })}
            </div>

            <div className="border-t border-white/10 p-6">
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/10 hover:text-red-200"
                >
                    <LogOut className="h-5 w-5" />
                    Sign out
                </button>
            </div>
        </div>
    );
}
