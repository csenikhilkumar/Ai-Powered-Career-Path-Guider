import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { Sparkles, TrendingUp, Clock, Target, Award, Zap, BookOpen } from 'lucide-react';
import { careerApi, CareerPath as Career } from '@/api/career';

// Widgets
import { SkillTracker } from '@/components/dashboard/SkillTracker';
import { CalendarWidget } from '@/components/dashboard/CalendarWidget';
import { JobCard } from '@/components/dashboard/JobCard';
import { CourseRail } from '@/components/dashboard/CourseRail';

// Mock data for fallback
const MOCK_CAREERS: Career[] = [
    {
        id: '1',
        title: 'Senior Product Designer',
        description: 'Design interactive user experiences...',
        matchScore: 95,
        salary: '$120k - $160k',
        growth: 'High',
        demand: 'Very High',
        // New fields
        category: 'Design',
        avgSalary: 140000,
        growthRate: 12,
        difficulty: 'Advanced',
        requiredSkills: ['Figma', 'UI/UX', 'Prototyping']
    },
    {
        id: '2',
        title: 'Frontend Engineer',
        description: 'Build scalable web applications...',
        matchScore: 88,
        salary: '$110k - $150k',
        growth: 'High',
        demand: 'High',
        // New fields
        category: 'Technology',
        avgSalary: 130000,
        growthRate: 15,
        difficulty: 'Intermediate',
        requiredSkills: ['React', 'TypeScript', 'CSS']
    }
];

import { useUi } from '@/context/UiContext';

export default function Dashboard() {
    const { user } = useAuth();
    const { openAiModal } = useUi();
    const [careers, setCareers] = useState<Career[]>(MOCK_CAREERS);
    // Removed loading state to force immediate render

    useEffect(() => {
        const loadData = async () => {
            // Fetch in background
            try {
                // Add a timeout to prevent indefinite loading
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Request timed out')), 2000)
                );

                const careerData = await Promise.race([
                    careerApi.getCareers(),
                    timeoutPromise
                ]) as Career[];

                if (careerData && careerData.length > 0) {
                    setCareers(careerData);
                }
            } catch (err) {
                console.log("Dashboard: Using offline mode (API error or timeout)", err);
                // Keep MOCK_CAREERS
            }
        };
        loadData();
    }, []);

    const featuredJob = careers[0] || MOCK_CAREERS[0];

    return (
        <div className="min-h-full relative overflow-hidden">
            <div className="relative z-10 space-y-8 max-w-[1800px] mx-auto fade-in">
                {/* Premium Header */}
                <div className="relative">
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl shadow-purple-500/10">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg shadow-purple-500/50"
                                    >
                                        <Sparkles className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                                            Dashboard
                                        </h1>
                                        <p className="text-purple-300/80 text-lg">
                                            Welcome back, <span className="font-semibold text-white">{user?.firstName || 'User'}</span>! 🚀
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 flex-wrap">
                                <Button
                                    variant="outline"
                                    onClick={() => window.location.href = '/dashboard/careers'}
                                    className="group border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10 text-white backdrop-blur-xl"
                                >
                                    <BookOpen className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                                    Explore Careers
                                </Button>
                                <Button
                                    onClick={openAiModal}
                                    className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/50 text-white border-0"
                                >
                                    <Sparkles className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                                    AI Assistant
                                </Button>
                                <Button
                                    onClick={() => window.location.href = '/dashboard/career-wizard'}
                                    className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg shadow-blue-500/50 text-white border-0"
                                >
                                    <Sparkles className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                                    Launch Career Wizard
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Stat Card 1 */}
                    <div className="group relative backdrop-blur-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-purple-500/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="p-3 bg-purple-500/20 rounded-xl group-hover:scale-110 transition-transform">
                                    <TrendingUp className="h-5 w-5 text-purple-400" />
                                </div>
                                <span className="text-xs font-medium text-green-400 flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    +12%
                                </span>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-white">46</h3>
                                <p className="text-sm text-purple-300/70">Lessons Completed</p>
                            </div>
                        </div>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="group relative backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-blue-500/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="p-3 bg-blue-500/20 rounded-xl group-hover:scale-110 transition-transform">
                                    <Clock className="h-5 w-5 text-blue-400" />
                                </div>
                                <span className="text-xs font-medium text-green-400 flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    +8%
                                </span>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-white">127h</h3>
                                <p className="text-sm text-blue-300/70">Learning Hours</p>
                            </div>
                        </div>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="group relative backdrop-blur-xl bg-gradient-to-br from-pink-500/10 to-pink-600/5 border border-pink-500/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-pink-500/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="p-3 bg-pink-500/20 rounded-xl group-hover:scale-110 transition-transform">
                                    <Target className="h-5 w-5 text-pink-400" />
                                </div>
                                <span className="text-xs font-medium text-green-400 flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    +25%
                                </span>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-white">89%</h3>
                                <p className="text-sm text-pink-300/70">Goal Progress</p>
                            </div>
                        </div>
                    </div>

                    {/* Stat Card 4 */}
                    <div className="group relative backdrop-blur-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-amber-500/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="p-3 bg-amber-500/20 rounded-xl group-hover:scale-110 transition-transform">
                                    <Award className="h-5 w-5 text-amber-400" />
                                </div>
                                <span className="text-xs font-medium text-green-400 flex items-center gap-1">
                                    <Zap className="h-3 w-3" />
                                    New!
                                </span>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-white">12</h3>
                                <p className="text-sm text-amber-300/70">Certifications</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Calendar Widget - Large */}
                    <div className="lg:col-span-8">
                        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-1 shadow-2xl shadow-purple-500/10 h-full">
                            <CalendarWidget />
                        </div>
                    </div>

                    {/* Skill Tracker - Sidebar */}
                    <div className="lg:col-span-4">
                        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-1 shadow-2xl shadow-blue-500/10 h-full">
                            <SkillTracker />
                        </div>
                    </div>

                    {/* Featured Job Card */}
                    <div className="lg:col-span-6">
                        <div className="backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-1 shadow-2xl shadow-pink-500/10">
                            {featuredJob && (
                                <JobCard
                                    title={featuredJob.title}
                                    salary={(featuredJob.salary || '').replace(' - ', '-')}
                                    company="Tech Corp"
                                    location="Remote"
                                />
                            )}
                            {!featuredJob && <JobCard />}
                        </div>
                    </div>
                </div>

                {/* Course Rail */}
                <div>
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-1 shadow-2xl shadow-blue-500/10">
                        <CourseRail />
                    </div>
                </div>
            </div>
        </div>
    );
}
