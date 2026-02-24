import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Search, Sparkles, ArrowRight, Compass, Code, Palette, LineChart, Zap, Flame, Star, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CareerDiscoveryWizard } from '@/components/features/CareerDiscoveryWizard';

export default function CareerList() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All');

    const categories = [
        { name: 'All', icon: <Compass className="w-4 h-4" /> },
        { name: 'Technology', icon: <Code className="w-4 h-4" /> },
        { name: 'Creative', icon: <Palette className="w-4 h-4" /> },
        { name: 'Business', icon: <LineChart className="w-4 h-4" /> },
        { name: 'Esports', icon: <Zap className="w-4 h-4" /> }
    ];

    const popularRoles = [
        { title: 'AI Engineer', category: 'Technology', salary: '$140k+', growth: '+25%', trending: true },
        { title: 'Full Stack Developer', category: 'Technology', salary: '$120k+', growth: '+15%', trending: false },
        { title: 'UX Designer', category: 'Creative', salary: '$110k+', growth: '+12%', trending: true },
        { title: 'Product Manager', category: 'Business', salary: '$130k+', growth: '+18%', trending: false },
        { title: 'Blockchain Dev', category: 'Technology', salary: '$150k+', growth: '+30%', trending: true },
        { title: 'Esports Pro', category: 'Esports', salary: '$80k+', growth: '+40%', trending: true }
    ];

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        try {
            const { AiInteraction } = await import('@/api/ai');
            const { userApi } = await import('@/api/user');

            // Get user profile for personalization
            let userSkills: any[] = [];
            let userName = 'User';
            try {
                const profile = await userApi.getProfile();
                userSkills = profile.skills?.map(s => ({ skillName: s, proficiency: 'Beginner' })) || [];
                userName = profile.firstName || 'User';
            } catch (e) {
                console.warn("Could not fetch user profile for personalization", e);
            }

            const analysis = await AiInteraction.analyzeCareerPath({
                interests: [searchQuery],
                preferences: { role: searchQuery }
            });
            const topCareer = analysis.recommendations[0] || { title: searchQuery };

            const roadmapData = await AiInteraction.generateRoadmap({
                careerPathTitle: topCareer.title,
                currentSkills: userSkills,
                targetSkills: topCareer.requiredSkills || [],
                timeframe: '6 months'
            });

            navigate('/dashboard/career-roadmap', {
                state: {
                    result: roadmapData,
                    careerTitle: topCareer.title,
                    careerRecommendation: topCareer,
                    userProfile: { name: userName }
                }
            });

        } catch (error) {
            console.error("Failed to generate AI roadmap", error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickAction = (role: string) => {
        setSearchQuery(role);
        setLoading(true);
        setTimeout(() => {
            const triggerSearch = async () => {
                try {
                    const { AiInteraction } = await import('@/api/ai');
                    const { userApi } = await import('@/api/user');

                    let userSkills: any[] = [];
                    let userName = 'User';
                    try {
                        const profile = await userApi.getProfile();
                        userSkills = profile.skills?.map(s => ({ skillName: s, proficiency: 'Beginner' })) || [];
                        userName = profile.firstName || 'User';
                    } catch (e) { }

                    const analysis = await AiInteraction.analyzeCareerPath({
                        interests: [role],
                        preferences: { role: role }
                    });
                    const topCareer = analysis.recommendations[0] || { title: role };

                    const roadmapData = await AiInteraction.generateRoadmap({
                        careerPathTitle: topCareer.title,
                        currentSkills: userSkills,
                        targetSkills: topCareer.requiredSkills || [],
                        timeframe: '6 months'
                    });

                    navigate('/dashboard/career-roadmap', {
                        state: {
                            result: roadmapData,
                            careerTitle: topCareer.title,
                            careerRecommendation: topCareer,
                            userProfile: { name: userName }
                        }
                    });
                } finally {
                    setLoading(false);
                }
            };
            triggerSearch();
        }, 0);
    };

    const filteredRoles = activeFilter === 'All'
        ? popularRoles
        : popularRoles.filter(r => r.category === activeFilter);

    return (
        <div className="min-h-screen pb-20 pt-4 space-y-12">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative rounded-[2.5rem] overflow-hidden p-12 text-center"
            >
                <div className="absolute inset-0 bg-[#0a0515]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#4f46e5_0%,_transparent_50%)] opacity-30" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,_#ec4899_0%,_transparent_50%)] opacity-20" />
                <div className="absolute inset-0 backdrop-blur-3xl" />

                <div className="relative z-10 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-purple-300 text-sm mb-8"
                    >
                        <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                        <span>Discover Your High-Growth Career Path</span>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-white leading-[1.1]">
                        Architect Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Professional Future</span>
                    </h1>

                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Input your vision, and our AI will engineer a data-driven blueprint for your success.
                    </p>

                    <div className="max-w-2xl mx-auto relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-[2rem] blur-xl opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <form
                            onSubmit={handleSearch}
                            className="relative flex items-center bg-[#151125] border border-white/10 rounded-[1.5rem] p-2 h-[4.5rem] shadow-2xl"
                        >
                            <div className="pl-6 pr-4">
                                <Search className="w-6 h-6 text-gray-500" />
                            </div>
                            <input
                                type="text"
                                placeholder="E.g. Full Stack Engineer, AI Researcher..."
                                className="flex-1 bg-transparent border-none text-xl text-white placeholder-gray-600 focus:ring-0 focus:outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Button
                                type="submit"
                                disabled={loading}
                                className="h-14 px-8 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-lg shadow-xl shadow-purple-900/20 transition-all active:scale-95"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Designing...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span>Generate</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                )}
                            </Button>
                        </form>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-4">
                        <button
                            onClick={() => setIsWizardOpen(true)}
                            className="group flex items-center gap-2 px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all text-sm text-gray-400 hover:text-white"
                        >
                            <Sparkles className="w-4 h-4 text-purple-400 group-hover:animate-pulse" />
                            <span>Not sure? Launch Career Wizard</span>
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Filter Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-2 px-2 overflow-x-auto no-scrollbar pb-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => setActiveFilter(cat.name)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all whitespace-nowrap
                                ${activeFilter === cat.name
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20'
                                    : 'bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:border-white/20'}`}
                        >
                            {cat.icon}
                            {cat.name}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                    <Filter className="w-3 h-3" />
                    <span>Showing {filteredRoles.length} high-potential paths</span>
                </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                <AnimatePresence mode='popLayout'>
                    {filteredRoles.map((role, idx) => (
                        <motion.div
                            key={role.title}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => handleQuickAction(role.title)}
                            className="group relative cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative glass-strong p-8 rounded-3xl border border-white/5 group-hover:border-purple-500/30 transition-all overflow-hidden">
                                {role.trending && (
                                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] font-bold text-orange-400 uppercase tracking-wider">
                                        <Star className="w-3 h-3 fill-orange-400" />
                                        Hot Path
                                    </div>
                                )}

                                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-white/10 shadow-inner">
                                    <Compass className="w-7 h-7 text-purple-400 group-hover:text-blue-400 transition-colors" />
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-200 transition-all">
                                    {role.title}
                                </h3>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Avg. Salary</span>
                                        <span className="text-sm text-gray-300 font-semibold">{role.salary}</span>
                                    </div>
                                    <div className="w-[1px] h-8 bg-white/10" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Market Growth</span>
                                        <span className="text-sm text-emerald-400 font-bold">{role.growth}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <span className="text-xs text-purple-300 opacity-60 group-hover:opacity-100 transition-opacity">Build Roadmap</span>
                                    <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all">
                                        <ArrowRight className="w-4 h-4 translate-x-[-2px] group-hover:translate-x-0 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <CareerDiscoveryWizard
                isOpen={isWizardOpen}
                onClose={() => setIsWizardOpen(false)}
                onComplete={(data) => {
                    if (data?.career?.title) {
                        handleQuickAction(data.career.title);
                    }
                }}
            />
        </div>
    );
}
