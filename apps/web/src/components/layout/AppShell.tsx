import { Navbar } from './Navbar';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Compass, BookOpen, Settings, LogOut, Network, Brain, Briefcase } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { UiProvider, useUi } from '@/context/UiContext';
import { AiAssistantModal } from '@/components/dashboard/AiAssistantModal';

function AppContent() {
    const { isAiModalOpen, closeAiModal } = useUi();

    return (
        <div className="flex h-screen overflow-hidden gradient-surface relative text-neutral-900 dark:text-white">
            {/* Animated Background - Global */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ x: [0, 100, 0], y: [0, -100, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ x: [0, -100, 0], y: [0, 100, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
                />
            </div>

            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden relative z-10">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
                    <Outlet />
                </main>
            </div>

            <AiAssistantModal isOpen={isAiModalOpen} onClose={closeAiModal} />
        </div>
    );
}

export function AppShell() {
    return (
        <UiProvider>
            <AppContent />
        </UiProvider>
    );
}

const allNavigation = [
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
    const [showSkillMapping, setShowSkillMapping] = useState(false);

    useEffect(() => {
        const checkCareerGoal = async () => {
            // 1. Check local storage (fastest)
            const goal = localStorage.getItem('currentCareerGoal');
            if (goal) {
                setShowSkillMapping(true);
                return;
            }

            // 2. Fallback to API check
            try {
                const { careerApi } = await import('@/api/career');
                const roadmap = await careerApi.getUserRoadmap();
                if (roadmap && roadmap.title) {
                    setShowSkillMapping(true);
                    localStorage.setItem('currentCareerGoal', roadmap.title);
                } else {
                    setShowSkillMapping(false);
                }
            } catch (e) {
                setShowSkillMapping(false);
            }
        };

        checkCareerGoal();

        // Listen for updates
        window.addEventListener('storage', checkCareerGoal);
        window.addEventListener('career-goal-update', checkCareerGoal);

        return () => {
            window.removeEventListener('storage', checkCareerGoal);
            window.removeEventListener('career-goal-update', checkCareerGoal);
        };
    }, []);

    const navigation = allNavigation.filter(item => {
        if (item.name === 'Skill Mapping') return showSkillMapping;
        return true;
    });

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
