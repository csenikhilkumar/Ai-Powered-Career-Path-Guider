import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { careerApi, Roadmap } from '@/api/career';
import { aiApi } from '@/api/ai';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { BookOpen, Map, Search, Loader2, PlayCircle, Newspaper, ExternalLink } from 'lucide-react';

export default function Learning() {
    const navigate = useNavigate();
    const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
    const [selectedRoadmapId, setSelectedRoadmapId] = useState<string | null>(null);
    const [resources, setResources] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [resourcesLoading, setResourcesLoading] = useState(false);

    useEffect(() => {
        const loadRoadmaps = async () => {
            try {
                const data = await careerApi.getUserRoadmaps();
                setRoadmaps(data);
                if (data.length > 0) {
                    setSelectedRoadmapId(data[0].id);
                }
            } catch (error) {
                console.error("Failed to load roadmaps", error);
            } finally {
                setLoading(false);
            }
        };
        loadRoadmaps();
    }, []);

    useEffect(() => {
        const fetchResources = async () => {
            if (!selectedRoadmapId) return;

            setResourcesLoading(true);
            try {
                const roadmap = roadmaps.find(r => r.id === selectedRoadmapId);
                if (!roadmap) return;

                const completedCount = roadmap.items?.filter(i => i.status === 'completed').length || 0;
                const totalCount = roadmap.items?.length || 0;
                const progress = totalCount > 0 ? (completedCount / totalCount) : 0;

                let stage = "Beginner";
                if (progress > 0.3) stage = "Intermediate";
                if (progress > 0.7) stage = "Advanced";

                const data = await aiApi.generateResources({
                    careerPathTitle: roadmap.title,
                    currentStage: `Currently at ${Math.round(progress * 100)}% progress (${stage})`,
                    interests: []
                });

                if (data) {
                    setResources(data);
                }
            } catch (error) {
                console.error("Failed to fetch resources", error);
            } finally {
                setResourcesLoading(false);
            }
        };

        if (selectedRoadmapId) {
            fetchResources();
        }
    }, [selectedRoadmapId, roadmaps]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
        );
    }

    if (roadmaps.length === 0) {
        return (
            <div className="min-h-screen p-8 bg-neutral-950 flex flex-col items-center justify-center text-center">
                <div className="bg-purple-500/10 p-6 rounded-full mb-6">
                    <BookOpen className="w-16 h-16 text-purple-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">No Active Learning Paths</h2>
                <p className="text-gray-400 max-w-md mb-8">
                    Start a career journey to get personalized learning resources, tutorials, and industry news tailored to your roadmap.
                </p>
                <Button onClick={() => navigate('/dashboard/careers')} className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-8 py-6 rounded-xl">
                    <Map className="mr-2 w-5 h-5" /> Explore Paths
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 p-6 md:p-10 pb-20">
            <header className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                        <BookOpen className="w-6 h-6 text-purple-400" />
                    </div>
                    <span className="text-purple-400 font-bold tracking-wider uppercase text-sm">Learning Hub</span>
                </div>
                <h1 className="text-4xl font-black text-white mb-4">Personalized Training</h1>
                <p className="text-gray-400 max-w-2xl text-lg">
                    Expert-curated videos and news topics to help you master the skills in your selected roadmap.
                </p>
            </header>

            {/* Roadmap Selector */}
            <div className="flex gap-4 overflow-x-auto pb-6 mb-2 custom-scrollbar">
                {roadmaps.map(roadmap => (
                    <button
                        key={roadmap.id}
                        onClick={() => setSelectedRoadmapId(roadmap.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all whitespace-nowrap
                            ${selectedRoadmapId === roadmap.id
                                ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20'
                                : 'bg-neutral-900 border-white/10 text-gray-400 hover:bg-white/5 hover:text-white'}`}
                    >
                        <Map className="w-4 h-4" />
                        <span className="font-bold">{roadmap.title}</span>
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {resourcesLoading ? (
                    <div className="space-y-12 animate-pulse">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-64 bg-white/5 rounded-2xl border border-white/5" />
                            ))}
                        </div>
                    </div>
                ) : resources ? (
                    <motion.div
                        key={selectedRoadmapId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-12"
                    >
                        {/* YouTube Videos */}
                        <section>
                            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                                <PlayCircle className="text-red-500 w-7 h-7" /> High-Intensity Tutorials
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {resources.youtubeVideos?.map((video: any, i: number) => (
                                    <Card key={i} className="bg-neutral-900 border-white/10 p-6 hover:bg-neutral-800 transition-all duration-300 group flex flex-col justify-between hover:border-red-500/30">
                                        <div>
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-3 bg-red-500/10 rounded-xl">
                                                    <PlayCircle className="w-6 h-6 text-red-500" />
                                                </div>
                                                <span className="bg-white/5 px-3 py-1 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    {video.channel || 'Academy'}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 leading-tight">
                                                {video.title}
                                            </h3>
                                            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                                                {video.reason}
                                            </p>
                                        </div>
                                        <Button
                                            onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(video.title)}`, '_blank')}
                                            className="w-full bg-white/5 hover:bg-red-600 text-white border border-white/10 hover:border-red-500 transition-all font-bold"
                                        >
                                            Watch Now <ExternalLink className="ml-2 w-4 h-4" />
                                        </Button>
                                    </Card>
                                ))}
                            </div>
                        </section>

                        {/* Industry News */}
                        <section>
                            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                                <Newspaper className="text-emerald-500 w-7 h-7" /> Industry Intelligence
                            </h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {resources.newsTopics?.map((news: any, i: number) => (
                                    <Card key={i} className="flex flex-col md:flex-row gap-6 bg-neutral-900 border-white/10 p-6 hover:bg-neutral-800 transition-all border-l-4 border-l-emerald-500/50">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-emerald-400 text-[10px] font-black uppercase tracking-tighter">{news.source}</span>
                                                <div className="w-1 h-1 rounded-full bg-white/20" />
                                                <span className="text-gray-500 text-[10px] uppercase font-bold">Trending Now</span>
                                            </div>
                                            <h3 className="text-xl font-extrabold text-white mb-2 leading-tight">
                                                {news.topic}
                                            </h3>
                                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                                {news.context}
                                            </p>
                                        </div>
                                        <div className="flex items-center">
                                            <Button
                                                onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(news.topic)}`, '_blank')}
                                                variant="outline"
                                                className="border-white/10 text-white hover:bg-emerald-600 hover:border-emerald-500 font-bold whitespace-nowrap"
                                            >
                                                Read Article
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    </motion.div>
                ) : (
                    <div className="col-span-full py-20 text-center bg-white/5 rounded-3xl border border-white/5 border-dashed">
                        <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Analyzing your roadmap...</h3>
                        <p className="text-gray-400">We're finding the best resources to match your current progress.</p>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
