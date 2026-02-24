import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { careerApi, Roadmap } from '@/api/career';
import { aiApi } from '@/api/ai';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Briefcase, ExternalLink, Map, Search, Loader2 } from 'lucide-react';

export default function Jobs() {
    const navigate = useNavigate();
    const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
    const [selectedRoadmapId, setSelectedRoadmapId] = useState<string | null>(null);
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [jobsLoading, setJobsLoading] = useState(false);

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
        const fetchJobs = async () => {
            if (!selectedRoadmapId) return;

            setJobsLoading(true);
            try {
                const roadmap = roadmaps.find(r => r.id === selectedRoadmapId);
                if (!roadmap) return;

                const completedCount = roadmap.items.filter(i => i.status === 'completed').length;
                const totalCount = roadmap.items.length;
                const progress = totalCount > 0 ? (completedCount / totalCount) : 0;

                let stage = "Beginner";
                if (progress > 0.3) stage = "Intermediate";
                if (progress > 0.7) stage = "Advanced";

                // We reuse the existing AI resource generation but only render jobs
                const data = await aiApi.generateResources({
                    careerPathTitle: roadmap.title,
                    currentStage: `Currently at ${Math.round(progress * 100)}% progress (${stage})`,
                    interests: []
                });

                if (data?.jobSearchQueries) {
                    setJobs(data.jobSearchQueries);
                }
            } catch (error) {
                console.error("Failed to fetch jobs", error);
            } finally {
                setJobsLoading(false);
            }
        };

        if (selectedRoadmapId) {
            fetchJobs();
        }
    }, [selectedRoadmapId, roadmaps]);

    const handleApply = (url: string | undefined, query: string) => {
        window.open(url || `https://www.google.com/search?q=${encodeURIComponent(query + ' jobs')}`, '_blank');
    };

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
                    <Briefcase className="w-16 h-16 text-purple-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">No Active Career Paths</h2>
                <p className="text-gray-400 max-w-md mb-8">
                    Start a career journey to get personalized job and internship recommendations tailored to your progress.
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
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Briefcase className="w-6 h-6 text-blue-400" />
                    </div>
                    <span className="text-blue-400 font-bold tracking-wider uppercase text-sm">Opportunities</span>
                </div>
                <h1 className="text-4xl font-black text-white mb-4">Jobs & Internships</h1>
                <p className="text-gray-400 max-w-2xl text-lg">
                    Discover opportunities matched to your current skills and progress in your career journey.
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

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="wait">
                    {jobsLoading ? (
                        // Loading Skeletons
                        [...Array(6)].map((_, i) => (
                            <motion.div
                                key={`skeleton-${i}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-64 bg-white/5 rounded-2xl animate-pulse border border-white/5"
                            />
                        ))
                    ) : jobs.length > 0 ? (
                        jobs.map((job, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Card className="h-full bg-neutral-900 border-white/10 p-6 hover:bg-neutral-800 transition-all duration-300 group flex flex-col justify-between hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10">
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 bg-blue-500/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                                <Briefcase className="w-6 h-6 text-blue-400" />
                                            </div>
                                            <span className="bg-white/5 px-3 py-1 rounded-full text-xs font-medium text-gray-400 group-hover:bg-white/10 transition-colors">
                                                {job.platform}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                                            {job.query}
                                        </h3>

                                        <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                                            {job.description || `Find the best ${job.query} roles tailored for your current experience level.`}
                                        </p>

                                        {job.reason && (
                                            <div className="mb-6 p-3 bg-purple-500/5 rounded-lg border border-purple-500/10">
                                                <p className="text-xs text-purple-300/80 italic">
                                                    "{job.reason}"
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        onClick={() => handleApply(job.url, job.query)}
                                        className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 group-hover:border-blue-500/30 group-hover:text-blue-300"
                                    >
                                        Apply Now <ExternalLink className="ml-2 w-4 h-4" />
                                    </Button>
                                </Card>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center bg-white/5 rounded-3xl border border-white/5 border-dashed">
                            <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">No specific roles found</h3>
                            <p className="text-gray-400">Try checking back later or advancing further in your roadmap.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
