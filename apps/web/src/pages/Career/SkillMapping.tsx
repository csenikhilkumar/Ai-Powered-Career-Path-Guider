import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Compass, Brain, ArrowRight, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { careerApi, Roadmap } from '@/api/career';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function SkillMapping() {
    const navigate = useNavigate();
    const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoadmaps = async () => {
            try {
                const data = await careerApi.getUserRoadmaps();
                console.log("[SkillMapping] Raw Roadmaps Data:", data);
                setRoadmaps(data);
            } catch (error) {
                console.error("[SkillMapping] Failed to fetch roadmaps", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRoadmaps();
    }, []);

    const handleCardClick = (roadmap: Roadmap) => {
        navigate('/dashboard/career-roadmap', {
            state: {
                result: {
                    roadmap: {
                        items: roadmap.items || [],
                        phases: (roadmap as any).phases,
                        totalDuration: 'Stored Path',
                    },
                    careerId: roadmap.careerPathId,
                    id: roadmap.id
                },
                careerTitle: roadmap.title,
                savedRoadmap: roadmap
            }
        });
    };

    const handleDelete = (e: React.MouseEvent, roadmapId: string) => {
        e.stopPropagation(); // Prevent card click navigation

        toast('Delete Roadmap?', {
            description: 'This will also remove associated job recommendations.',
            action: {
                label: 'Delete',
                onClick: () => {
                    const promise = careerApi.deleteRoadmap(roadmapId);

                    toast.promise(promise, {
                        loading: 'Deleting your roadmap...',
                        success: () => {
                            setRoadmaps(prev => prev.filter(r => r.id !== roadmapId));
                            return 'Roadmap deleted successfully';
                        },
                        error: (err) => {
                            console.error("Failed to delete roadmap", err);
                            return 'Failed to delete roadmap. Please try again.';
                        },
                    });
                }
            },
            cancel: {
                label: 'Cancel',
                onClick: () => { }
            },
        });
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (roadmaps.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-500">
                <div className="w-24 h-24 bg-purple-500/10 rounded-full flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-purple-500/20 rounded-full animate-ping" />
                    <Brain className="w-12 h-12 text-purple-400" />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-white mb-3 tracking-tight">Gallery Empty</h2>
                    <p className="text-gray-400 max-w-sm mx-auto leading-relaxed">
                        Your AI-generated career paths will appear here once you search and <span className="text-purple-400 font-bold">Save</span> your first roadmap.
                    </p>
                </div>
                <Button
                    onClick={() => navigate('/dashboard/careers')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-10 py-7 rounded-2xl font-black text-xl shadow-xl shadow-purple-900/40 transition-all active:scale-95"
                >
                    Create Your Path <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="mb-8">
                <h1 className="text-4xl font-black text-white tracking-tight">Your Career Architecture</h1>
                <p className="text-gray-400 text-lg">
                    Select a path to continue your <span className="text-purple-400 font-bold">personalized learning journey</span>
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {roadmaps.map((roadmap, index) => (
                    <motion.div
                        key={roadmap.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{
                            y: -10,
                            rotateX: 2,
                            rotateY: 2,
                            scale: 1.02,
                            transition: { type: "spring", stiffness: 300 }
                        }}
                        style={{ perspective: 1000 }}
                        onClick={() => handleCardClick(roadmap)}
                        className="cursor-pointer group"
                    >
                        <Card className="h-full overflow-hidden border-none bg-neutral-900/40 backdrop-blur-xl group-hover:bg-neutral-800/60 transition-all duration-500 ring-1 ring-white/5 group-hover:ring-purple-500/30 shadow-2xl">
                            <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-50 group-hover:opacity-100 transition-opacity" />
                            <div className="p-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-purple-600 transition-colors shadow-inner">
                                        <Compass className="h-7 w-7 text-purple-400 group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-2xl text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-300 transition-all leading-tight">
                                            {roadmap.title}
                                        </h3>
                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/5 text-purple-400 uppercase tracking-widest border border-white/5 mt-1 inline-block">
                                            {roadmap.careerPath?.category || 'General'}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500 font-medium">Steps Unlocked</span>
                                        <span className="text-white font-bold">{roadmap.items?.length || 0} Modules</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500 font-medium">Profile Match</span>
                                        <span className="text-emerald-400 font-bold">{roadmap.careerPath?.matchScore || 85}%</span>
                                    </div>
                                    <button
                                        onClick={(e) => handleDelete(e, roadmap.id)}
                                        className="w-full mt-2 flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all font-bold text-xs"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" /> Delete Roadmap
                                    </button>
                                </div>

                                <div className="pt-6 border-t border-white/5 flex items-center justify-between group">
                                    <span className="text-xs font-bold text-gray-500 group-hover:text-purple-400 transition-colors">Resume Journey</span>
                                    <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-600 transition-all shadow-lg group-hover:shadow-purple-500/20">
                                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
