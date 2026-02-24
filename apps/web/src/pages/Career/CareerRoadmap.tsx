import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { RoadmapTimeline } from '@/components/features/RoadmapTimeline';
import { ArrowLeft, Save, Sparkles, Share2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { careerApi } from '@/api/career';

export default function CareerRoadmap() {
    const location = useLocation();
    const navigate = useNavigate();
    const { result, careerTitle: stateTitle, userProfile, careerRecommendation, savedRoadmap } = location.state || {};
    const [isSaving, setIsSaving] = useState(false);

    // If we have a saved roadmap, we use its data
    const activeRoadmap = savedRoadmap || result?.roadmap;
    const activeTitle = savedRoadmap?.title || stateTitle;

    if (!activeRoadmap) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">No Roadmap Found</h2>
                    <p className="text-gray-400 mb-6 max-w-md mx-auto">
                        It looks like the roadmap data wasn't passed correctly.
                    </p>
                    <div className="bg-gray-900 p-4 rounded-lg mb-6 text-left text-xs font-mono overflow-auto max-w-lg max-h-40 mx-auto">
                        <p className="text-gray-500 mb-2">Debug Info:</p>
                        <pre>{JSON.stringify(location.state || { error: "No state received" }, null, 2)}</pre>
                    </div>
                    <Button onClick={() => navigate('/dashboard/career-wizard')}>Go to Wizard</Button>
                </div>
            </div>
        );
    }

    // Transform API roadmap phases to component format
    let timelinePhases: any[] = [];

    let rawPhases = activeRoadmap.phases;
    if (typeof rawPhases === 'string') {
        try {
            rawPhases = JSON.parse(rawPhases);
        } catch (e) {
            console.error("Failed to parse stringified phases", e);
            rawPhases = [];
        }
    }

    const phasesArray = rawPhases
        ? (Array.isArray(rawPhases)
            ? rawPhases
            : typeof rawPhases === 'object'
                ? Object.values(rawPhases)
                : [])
        : [];

    if (phasesArray.length > 0) {
        timelinePhases = phasesArray.map((phase: any) => ({
            title: phase.title || "Untitled Phase",
            duration: phase.duration || "Self-Paced",
            description: phase.description || "",
            topics: phase.topics || [],
            milestones: phase.milestones || []
        }));
    } else if (activeRoadmap.items && activeRoadmap.items.length > 0) {
        // Reconstruct from DB items
        timelinePhases = [{
            title: "Mastery Path",
            duration: "Self-Paced",
            description: `Guided roadmap for ${activeTitle}`,
            topics: activeRoadmap.items.map((item: any) => ({
                name: item.title,
                description: item.description,
                status: item.status
            })),
            milestones: []
        }];
    }

    const handleSaveRoadmap = async () => {
        setIsSaving(true);
        try {
            let targetRoadmap = savedRoadmap;

            if (!targetRoadmap) {
                // Flatten phases into a linear list of items (initially without IDs)
                let savePhases = activeRoadmap.phases;
                if (typeof savePhases === 'string') {
                    try { savePhases = JSON.parse(savePhases); } catch (e) { savePhases = []; }
                }

                const phasesArray = savePhases
                    ? (Array.isArray(savePhases) ? savePhases : typeof savePhases === 'object' ? Object.values(savePhases) : [])
                    : [];

                const items = phasesArray.length > 0
                    ? phasesArray.flatMap((phase: any, phaseIndex: number) => {
                        return (phase.topics || []).map((topic: any, topicIndex: number) => ({
                            title: topic.name || topic,
                            description: topic.description || `Part of ${phase.title}`,
                            status: phaseIndex === 0 && topicIndex === 0 ? 'active' : 'locked',
                            duration: '1 week',
                            order: phaseIndex * 10 + topicIndex
                        }));
                    })
                    : activeRoadmap.items;

                // Save to DB
                targetRoadmap = await careerApi.saveRoadmap({
                    title: activeTitle,
                    description: careerRecommendation?.description || `Career path for ${activeTitle}`,
                    careerPathId: result?.careerId,
                    items: items,
                    category: careerRecommendation?.category,
                    avgSalary: careerRecommendation?.avgSalary,
                    growthRate: careerRecommendation?.growthRate,
                    difficulty: careerRecommendation?.difficulty,
                    matchScore: careerRecommendation?.matchScore,
                    salary: careerRecommendation?.salary,
                    growth: careerRecommendation?.growth,
                    demand: careerRecommendation?.demand,
                    growthSpeed: careerRecommendation?.growthSpeed,
                    requiredSkills: careerRecommendation?.requiredSkills,
                    phases: activeRoadmap.phases
                });

                localStorage.setItem('currentCareerGoal', activeTitle);
                window.dispatchEvent(new Event('career-goal-update'));
            }

            // Navigate using the full roadmap object from DB (which has IDs)
            navigate(`/dashboard/career-journey/${targetRoadmap.id}`, {
                state: {
                    roadmap: targetRoadmap
                }
            });
        } catch (error) {
            console.error("Failed to save roadmap", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />

            {/* Header */}
            <header className="relative z-10 p-6 border-b border-white/10 backdrop-blur-md sticky top-0">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Dashboard
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" className="border-white/20">
                            <Share2 className="mr-2 h-4 w-4" /> Share
                        </Button>
                        <Button
                            className="bg-purple-600 hover:bg-purple-500"
                            onClick={handleSaveRoadmap}
                            disabled={isSaving || !!savedRoadmap}
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {isSaving ? 'Saving...' : savedRoadmap ? 'Saved' : 'Save Path'}
                        </Button>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="text-center mb-20 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex gap-3 mb-4"
                    >
                        <div className="p-2 px-4 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-sm font-medium">
                            <Sparkles className="inline-block w-4 h-4 mr-2" />
                            {savedRoadmap ? 'Saved Roadmap' : `AI-Generated for ${userProfile?.name || 'You'}`}
                        </div>
                        {userProfile?.timeCommitment && (
                            <div className="p-2 px-4 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-sm font-medium capitalize">
                                ⏱️ {userProfile.timeCommitment.replace('_', ' ')} Schedule
                            </div>
                        )}
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-neutral-500"
                    >
                        Mastering {activeTitle}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-neutral-400 max-w-2xl mx-auto"
                    >
                        Your personalized {activeRoadmap.totalDuration || 'custom'} journey from {userProfile?.currentStatus === 'beginner' ? 'Beginner' : 'Current Level'} to Expert.
                    </motion.p>
                </div>

                {/* Timeline Visualization */}
                <RoadmapTimeline
                    phases={timelinePhases}
                    className="bg-neutral-900/50 rounded-3xl border border-white/5 backdrop-blur-sm"
                />

                {/* Next Steps CTA */}
                <div className="mt-20 text-center">
                    <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/20 max-w-3xl mx-auto">
                        <h3 className="text-2xl font-bold mb-4">Ready to start Phase 1?</h3>
                        <p className="text-gray-400 mb-6">
                            Lock in this roadmap to your profile to track your progress and get daily AI coaching.
                        </p>
                        <Button
                            size="lg"
                            className="bg-white text-black hover:bg-gray-200 px-8 py-6 text-lg rounded-full font-bold"
                            onClick={handleSaveRoadmap}
                        >
                            Start Journey Now <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
