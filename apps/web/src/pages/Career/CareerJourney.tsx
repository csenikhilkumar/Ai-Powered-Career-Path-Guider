import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { careerApi, Roadmap } from '@/api/career';
import { aiApi } from '@/api/ai';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, CheckCircle2, Lock, Trophy, Zap, BookOpen, ExternalLink, PlayCircle, Newspaper, Globe, X, Play } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export default function CareerJourney() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'path' | 'resources'>('path');
    const [aiResources, setAiResources] = useState<any>(null);
    const [resourcesLoading, setResourcesLoading] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    // Load roadmap logic
    useEffect(() => {
        const loadRoadmap = async () => {
            if (location.state?.roadmap) {
                setRoadmap(location.state.roadmap);
                setLoading(false);
                return;
            }

            if (id) {
                try {
                    const data = await careerApi.getUserRoadmaps();
                    const found = data.find(r => r.id === id);
                    if (found) {
                        setRoadmap(found);
                    }
                } catch (error) {
                    console.error("Failed to load journey", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        loadRoadmap();
    }, [id, location.state]);

    // Fetch AI resources when roadmap is loaded
    useEffect(() => {
        if (roadmap && !aiResources && !resourcesLoading) {
            const fetchResources = async () => {
                setResourcesLoading(true);
                try {
                    const completedCount = roadmap.items.filter(i => i.status === 'completed').length;
                    const totalCount = roadmap.items.length;
                    const progress = totalCount > 0 ? (completedCount / totalCount) : 0;

                    let stage = "Beginner";
                    if (progress > 0.3) stage = "Intermediate";
                    if (progress > 0.7) stage = "Advanced";

                    const data = await aiApi.generateResources({
                        careerPathTitle: roadmap.title,
                        currentStage: `Currently at ${Math.round(progress * 100)}% progress (${stage})`,
                        interests: [] // TODO: Get from user profile if available
                    });
                    setAiResources(data);
                } catch (error) {
                    console.error("Failed to fetch AI resources", error);
                } finally {
                    setResourcesLoading(false);
                }
            };
            fetchResources();
        }
    }, [roadmap, aiResources, resourcesLoading]);

    const handleStartLearning = async (itemId: string, index: number) => {
        if (!roadmap || !roadmap.items) return;

        try {
            await careerApi.updateRoadmapItem(roadmap.id, itemId, 'completed');

            let nextItemUpdated = false;
            const nextIndex = index + 1;

            if (nextIndex < roadmap.items.length) {
                const nextItem = roadmap.items[nextIndex];
                await careerApi.updateRoadmapItem(roadmap.id, nextItem.id, 'active');
                nextItemUpdated = true;
            }

            setRoadmap(prev => {
                if (!prev) return null;
                const newItems = prev.items.map((item, i) => {
                    if (i === index) return { ...item, status: 'completed' as const };
                    if (i === nextIndex && nextItemUpdated) return { ...item, status: 'active' as const };
                    return item;
                });
                return { ...prev, items: newItems };
            });

        } catch (error) {
            console.error("Failed to update journey progress", error);
            alert("Failed to update progress. Please check your connection.");
        }
    };

    const getYouTubeId = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-white">
            <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
        </div>;
    }

    if (!roadmap) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-white p-4">
                <h2 className="text-2xl font-bold mb-4">Journey Not Found</h2>
                <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
            </div>
        );
    }

    const completedItems = roadmap.items?.filter(i => i.status === 'completed').length || 0;
    const totalItems = roadmap.items?.length || 0;
    const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

    const getCoachTip = () => {
        const tips = [
            `Consistency is the key to mastering ${roadmap.title}. Focus on one small step today.`,
            `The path to becoming a ${roadmap.title} is a marathon, not a sprint.`,
            `Every module completed in ${roadmap.title} brings you closer to your goal.`,
            "Don't be afraid to revisit the basics; they are the foundation of your expertise."
        ];
        return tips[Math.floor(Math.random() * tips.length)];
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white pb-20 relative">
            {/* Header */}
            <div className="bg-gradient-to-b from-purple-900/20 to-neutral-950 border-b border-white/5 pb-10 pt-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <Button variant="ghost" onClick={() => navigate('/dashboard/skill-mapping')} className="text-gray-400 hover:text-white mb-6 pl-0">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Maps
                    </Button>

                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider">
                                    Active Journey
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                                {roadmap.title}
                            </h1>
                            <p className="text-xl text-gray-400 max-w-2xl">
                                {roadmap.description || `Your personalized path to mastering ${roadmap.title}.`}
                            </p>
                        </div>
                        <div className="hidden md:block text-right">
                            <div className="text-4xl font-black text-purple-400">{Math.round(progress)}%</div>
                            <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Complete</div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-8 relative h-3 bg-white/5 rounded-full overflow-hidden shadow-inner ring-1 ring-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.max(progress, 1)}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                        />
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex gap-6 mt-10 border-b border-white/10">
                        {[
                            { id: 'path', label: 'Your Path', icon: Zap },
                            { id: 'resources', label: 'Learning Resources', icon: BookOpen }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`pb-4 px-2 text-sm font-bold uppercase tracking-wide flex items-center gap-2 transition-all relative
                                    ${activeTab === tab.id ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="md:col-span-2 space-y-6">

                        {/* PATH TAB */}
                        {activeTab === 'path' && (
                            <div className="relative border-l-2 border-white/10 ml-4 pl-8 space-y-10 pb-10">
                                {roadmap.items?.map((item, index) => (
                                    <motion.div
                                        key={item.id || index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="relative"
                                    >
                                        <div className={`absolute -left-[41px] top-1 h-6 w-6 rounded-full border-4 flex items-center justify-center transition-colors
                                            ${item.status === 'completed' ? 'bg-green-500 border-green-900 shadow-[0_0_10px_rgba(34,197,94,0.3)]' :
                                                item.status === 'active' ? 'bg-purple-500 border-purple-900 shadow-[0_0_15px_rgba(168,85,247,0.5)]' :
                                                    'bg-neutral-900 border-neutral-700'}`}
                                        >
                                            {item.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-black" />}
                                            {item.status === 'locked' && <Lock className="w-3 h-3 text-gray-500" />}
                                        </div>

                                        <Card className={`p-5 border-none transition-all
                                            ${item.status === 'active' ? 'bg-white/10 ring-1 ring-purple-500/50' :
                                                item.status === 'locked' ? 'bg-white/5 opacity-60 grayscale' :
                                                    'bg-white/5'}`}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className={`font-bold text-lg ${item.status === 'completed' ? 'text-green-400 line-through' : 'text-white'}`}>
                                                    {item.title}
                                                </h3>
                                                <span className="text-xs font-mono text-gray-500 bg-black/30 px-2 py-1 rounded">
                                                    {item.duration || 'Flexible'}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                                {item.description}
                                            </p>

                                            {item.status === 'active' && (
                                                <Button
                                                    size="sm"
                                                    className="bg-purple-600 text-white hover:bg-purple-500 font-bold px-6"
                                                    onClick={() => handleStartLearning(item.id, index)}
                                                >
                                                    Complete Step <CheckCircle2 className="ml-2 w-4 h-4" />
                                                </Button>
                                            )}
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        )}


                        {/* RESOURCES TAB */}
                        {activeTab === 'resources' && (
                            <div className="space-y-8">
                                {/* YouTube Videos */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            <PlayCircle className="text-red-500" /> Recommended Videos
                                        </h3>
                                    </div>

                                    {resourcesLoading && <div className="h-40 bg-white/5 rounded-xl animate-pulse" />}

                                    <div className="grid gap-6">
                                        {aiResources?.youtubeVideos?.map((video: any, i: number) => {
                                            const videoId = getYouTubeId(video.url);
                                            const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
                                            const fallbackUrl = video.url || `https://www.youtube.com/results?search_query=${encodeURIComponent(video.title)}`;

                                            return (
                                                <Card key={i} className="bg-neutral-900 border-white/10 overflow-hidden group">
                                                    <div className="relative aspect-video bg-neutral-800 cursor-pointer overflow-hidden border-b border-white/5"
                                                        onClick={() => videoId ? setSelectedVideo(videoId) : window.open(fallbackUrl, '_blank')}
                                                    >
                                                        {thumbnail ? (
                                                            <div className="relative w-full h-full">
                                                                <img
                                                                    src={thumbnail}
                                                                    alt={video.title}
                                                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105"
                                                                />
                                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                                                            </div>
                                                        ) : (
                                                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-900/40 to-blue-900/40 text-gray-400 gap-2">
                                                                <PlayCircle className="w-12 h-12 text-white/50 group-hover:text-white transition-colors" />
                                                                <span className="text-xs font-medium text-white/50">Click to Play</span>
                                                            </div>
                                                        )}

                                                        {/* Play Button Overlay */}
                                                        <div className="absolute inset-0 flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
                                                            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-red-600 group-hover:border-red-500 transition-all duration-300 shadow-xl">
                                                                <Play className="w-6 h-6 text-white ml-1 fill-white" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="p-4">
                                                        <div className="flex justify-between items-start gap-4 mb-2">
                                                            <h4
                                                                className="font-bold text-white line-clamp-2 hover:text-blue-400 transition-colors cursor-pointer"
                                                                onClick={() => videoId ? setSelectedVideo(videoId) : window.open(fallbackUrl, '_blank')}
                                                            >
                                                                {video.title}
                                                            </h4>
                                                        </div>

                                                        <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                                                            <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1"></span>
                                                            {video.channel || 'YouTube'}
                                                        </p>

                                                        <p className="text-xs text-gray-500 line-clamp-2">{video.reason}</p>
                                                    </div>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* News */}
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <Newspaper className="text-blue-500" /> Industry News
                                    </h3>
                                    <div className="grid gap-4">
                                        {aiResources?.newsTopics?.map((news: any, i: number) => {
                                            const searchUrl = `https://www.google.com/search?tbm=nws&q=${encodeURIComponent(`${news.topic} ${news.source}`)}`;
                                            const finalUrl = news.url && news.url.length > 5 ? news.url : searchUrl;

                                            return (
                                                <Card key={i} className="bg-white/5 border-white/10 p-4 hover:bg-white/10 transition-colors cursor-pointer" onClick={() => window.open(finalUrl, '_blank')}>
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-bold text-white text-sm">{news.topic}</h4>
                                                            <div className="flex gap-2 text-xs text-gray-400 mt-1">
                                                                <Globe className="w-3 h-3" />
                                                                <span>{news.source}</span>
                                                                {!news.url && <span className="text-gray-600 italic ml-2 text-[10px]">(Search)</span>}
                                                            </div>
                                                        </div>
                                                        <ExternalLink className="w-4 h-4 text-gray-500" />
                                                    </div>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar: Daily Coach */}
                    <div className="space-y-6">
                        <Card className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-purple-500/30 p-6 shadow-2xl sticky top-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <Trophy className="w-5 h-5 text-purple-400" />
                                </div>
                                <h3 className="font-bold text-white">Daily Coach</h3>
                            </div>
                            <p className="text-sm text-gray-300 italic mb-4 leading-relaxed">
                                "{getCoachTip()}"
                            </p>
                            <Button
                                variant="outline"
                                className="w-full border-purple-500/30 hover:bg-purple-500/10 text-purple-300 font-bold"
                                onClick={() => window.location.reload()}
                            >
                                Get New Tip
                            </Button>
                        </Card>

                    </div>
                </div>
            </main>

            {/* Video Modal Overlay */}
            <AnimatePresence>
                {selectedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-10"
                        onClick={() => setSelectedVideo(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative border border-white/10 ring-1 ring-white/10 group"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedVideo(null)}
                                className="absolute top-4 right-4 z-20 p-2 bg-black/40 hover:bg-black/70 border border-white/10 hover:border-white/30 rounded-full text-white transition-all transform hover:scale-105"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <div className="w-full h-full bg-neutral-900">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1&rel=0`}
                                    title="Video Player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
