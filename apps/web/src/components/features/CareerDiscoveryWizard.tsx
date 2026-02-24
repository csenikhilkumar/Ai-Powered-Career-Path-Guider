import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Sparkles, ArrowRight, Loader2, BookOpen, ArrowLeft, Brain, Cpu, Target, Zap, Users } from 'lucide-react';
import { aiApi } from '@/api/ai';
import { WavyRoadmap } from './WavyRoadmap'; // Import WavyRoadmap

interface WizardProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete?: (data: any) => void;
}

const STEPS = [
    {
        id: 'intro',
        title: 'Discover Your Path',
        desc: 'Let AI analyze your psychology and interests to find your perfect career.',
        icon: Sparkles
    },
    {
        id: 'interests',
        title: 'What excites you?',
        desc: 'List topics, industries, or hobbies (e.g., Crypto, Gaming, Biology).',
        placeholder: 'e.g., I love solving puzzles, reading about blockchain, and gaming...',
        icon: Brain
    },
    {
        id: 'work_style',
        title: 'Work Environment',
        desc: 'Do you prefer Team vs Solo? Remote vs Office? Structued vs Chaos?',
        placeholder: 'e.g., I thrive in remote, autonomous setups but like weekly team syncs.',
        icon: Users
    },
    {
        id: 'problem_solving',
        title: 'Problem Solving Style',
        desc: 'Are you more Logical/Analytical or Creative/Visual?',
        placeholder: 'e.g., I like breaking down complex logic rather than designing visuals.',
        icon: Cpu
    },
    {
        id: 'risk_tolerance',
        title: 'Risk & Stability',
        desc: 'Stable Corp with benefits OR High-growth Startup with chaos?',
        placeholder: 'e.g., I want high growth and ownership, willing to take risks.',
        icon: Zap
    },
    {
        id: 'motivation',
        title: 'Core Motivation',
        desc: 'What drives you? Money, Social Impact, Technical Complexity?',
        placeholder: 'e.g., Building things that people actually use drives me.',
        icon: Target
    },
    {
        id: 'team_size',
        title: 'Ideal Team Size',
        desc: 'Do you prefer small agile squads or large established departments?',
        placeholder: 'e.g., Small close-knit team where I wear many hats.',
        icon: Users
    },
    {
        id: 'skill_confidence',
        title: 'Superpower',
        desc: 'What is your strongest natural ability?',
        placeholder: 'e.g., Understanding complex systems and logic.',
        icon: Brain
    },
    {
        id: 'learning_style',
        title: 'Learning Style',
        desc: 'How do you pick up new skills most effectively?',
        placeholder: 'e.g., I learn by doing and breaking things intentionally.',
        icon: BookOpen
    },
    {
        id: 'long_term',
        title: '5-Year Vision',
        desc: 'Where do you see yourself in the future?',
        placeholder: 'e.g., Leading a technical team or starting my own venture.',
        icon: Target
    },
    {
        id: 'analysis',
        title: 'Analyzing Profile...',
        desc: 'Connecting your psychological traits to 1000+ career paths.',
        icon: Loader2
    },
    {
        id: 'result',
        title: 'Your Matches',
        desc: 'Here are the career paths best suited for you.',
        icon: Sparkles
    }
];

export function CareerDiscoveryWizard({ isOpen, onClose, onComplete }: WizardProps) {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({
        interests: '',
        work_style: '',
        problem_solving: '',
        risk_tolerance: '',
        motivation: '',
        team_size: '',
        skill_confidence: '',
        learning_style: '',
        long_term: ''
    });
    const [result, setResult] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [generatedRoadmapSteps, setGeneratedRoadmapSteps] = useState<any[] | null>(null);
    const [selectedCareer, setSelectedCareer] = useState<any>(null); // Track selected career

    const handleNext = async () => {
        // Steps 1 to 9 are questions (indices 1-9)
        // Step 10 is Analysis
        if (step === 9) {
            // Submit for analysis
            setStep(10);
            setLoading(true);
            try {
                const analysis = await aiApi.analyzeCareerPath(answers);
                const recs = analysis.recommendations || [];
                setResult(Array.isArray(recs) ? recs : [recs]);
                setStep(11);
            } catch (error) {
                console.error("Analysis failed", error);
                // Fallback mock
                setResult([
                    {
                        title: "AI Solutions Architect",
                        description: "Design scalable AI systems for enterprise. Matches your logic + high growth preference.",
                        category: "AI/ML",
                        difficulty: "Advanced",
                        matchScore: 95,
                        reason: "Perfect fit for your analytical problem solving style."
                    },
                    {
                        title: "Product Manager (Technical)",
                        description: "Bridge the gap between engineering and business.",
                        category: "Product",
                        difficulty: "Intermediate",
                        matchScore: 88,
                        reason: "Aligns with your desire for impact and ownership."
                    }
                ]);
                setStep(11);
            } finally {
                setLoading(false);
            }
        } else {
            setStep(prev => prev + 1);
        }
    };

    const handleGenerateRoadmap = async (career: any) => {
        setLoading(true);
        setSelectedCareer(career);
        // Save to local storage so Skill Mapping can pick it up
        localStorage.setItem('currentCareerGoal', career.title || career.role);

        try {
            const roadmapData = await aiApi.generateRoadmap({
                careerPathTitle: career.title || career.role,
                currentSkills: ["General Aptitude"],
                targetSkills: career.requiredSkills || [],
                timeframe: "6 months"
            });

            // Transform roadmap to WavyRoadmap format
            const wSteps = roadmapData.roadmap.phases.flatMap((phase: any) => {
                // Try to map topics to steps if available, or just use phase info
                if (phase.topics && phase.topics.length > 0) {
                    return phase.topics.map((t: any, idx: number) => ({
                        id: `${phase.phase}-${idx}`,
                        title: t.name,
                        description: t.description,
                        status: phase.phase === 1 ? 'current' : 'upcoming',
                        duration: t.estimatedHours ? `${t.estimatedHours}h` : phase.duration
                    }));
                }
                return [{
                    id: `phase-${phase.phase}`,
                    title: phase.title,
                    description: phase.description || phase.focus,
                    status: phase.phase === 1 ? 'current' : 'upcoming',
                    duration: phase.duration
                }];
            });

            setGeneratedRoadmapSteps(wSteps);
        } catch (error) {
            console.error("Roadmap generation failed", error);
            // Mock Fallback
            setGeneratedRoadmapSteps([
                { id: '1', title: 'Fundamentals', description: 'Core concepts and basics.', status: 'completed', duration: '1 Month' },
                { id: '2', title: 'Advanced Topics', description: 'Deep dive into specialized skills.', status: 'current', duration: '2 Months' },
                { id: '3', title: 'Real World Projects', description: 'Build and deploy apps.', status: 'upcoming', duration: '2 Months' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            <motion.div
                layoutId="wizard-modal"
                className="relative w-full max-w-4xl bg-slate-900 border border-purple-500/20 rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col"
            >
                {/* Progress Bar */}
                <div className="h-1 bg-slate-800 w-full shrink-0">
                    <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                    />
                </div>

                <div className="p-8 flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                    <div className="mb-8 shrink-0">
                        <motion.div
                            key={STEPS[step].id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-2"
                        >
                            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                                {STEPS[step].id === 'analysis' && <Loader2 className="animate-spin text-purple-400" />}
                                {STEPS[step].title}
                            </h2>
                            <p className="text-slate-400 text-lg">{STEPS[step].desc}</p>
                        </motion.div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                        <AnimatePresence mode="wait">
                            {step === 0 && (
                                <motion.div
                                    key="intro"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex flex-col items-center justify-center text-center space-y-6"
                                >
                                    <div className="w-24 h-24 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                                        <Sparkles className="w-12 h-12 text-purple-400" />
                                    </div>
                                    <Button size="lg" onClick={() => setStep(1)} className="bg-white text-black hover:bg-slate-200 px-8 py-6 text-lg rounded-xl">
                                        Start Assessment <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </motion.div>
                            )}

                            {/* Question Steps 1-9 */}
                            {step >= 1 && step <= 9 && (
                                <motion.div key={STEPS[step].id} className="space-y-6">
                                    <div className="relative">
                                        <div className="absolute top-4 left-4 text-slate-500">
                                            {step === 1 && <Brain />}
                                            {step === 2 && <Users />}
                                            {step === 3 && <Cpu />}
                                            {step === 4 && <Zap />}
                                            {step === 5 && <Target />}
                                            {step >= 6 && <Sparkles />}
                                        </div>
                                        <Input
                                            placeholder={STEPS[step].placeholder}
                                            className="bg-slate-800/50 border-slate-700 text-xl p-6 pl-14 h-auto text-white placeholder:text-slate-600 rounded-2xl focus:ring-purple-500/50"
                                            value={(answers as any)[STEPS[step].id]}
                                            onChange={(e) => setAnswers({ ...answers, [STEPS[step].id]: e.target.value })}
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && (answers as any)[STEPS[step].id]) handleNext();
                                            }}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center mt-8">
                                        <Button variant="ghost" onClick={() => setStep(prev => prev - 1)} className="text-slate-400">
                                            Back
                                        </Button>
                                        <Button
                                            onClick={handleNext}
                                            disabled={!(answers as any)[STEPS[step].id]}
                                            className="bg-purple-600 hover:bg-purple-500"
                                        >
                                            {step === 9 ? 'Analyze Profile' : 'Next'} <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 11: Results */}
                            {step === 11 && result && !generatedRoadmapSteps && (
                                <motion.div key="result" className="space-y-6">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {result.map((career: any, idx: number) => (
                                            <Card
                                                key={idx}
                                                className="bg-slate-800/50 border-purple-500/30 p-6 hover:border-purple-500 transition-all hover:shadow-purple-500/10 cursor-pointer group rounded-2xl"
                                                onClick={() => handleGenerateRoadmap(career)}
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h4 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">{career.title || career.role}</h4>
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                            <span className="text-xs bg-purple-500/20 text-purple-300 px-2.5 py-1 rounded-full">{career.category || 'Tech'}</span>
                                                            <span className="text-xs bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-full">{career.difficulty || 'Intermediate'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-center bg-green-500/10 px-3 py-1 rounded-lg">
                                                        <span className="text-green-400 font-bold block text-lg">{career.matchScore || career.match}%</span>
                                                        <span className="text-green-500/60 text-xs uppercase">Match</span>
                                                    </div>
                                                </div>
                                                <p className="text-slate-300 text-sm mb-6 leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                                                    "{career.reason || career.description}"
                                                </p>
                                                <Button className="w-full bg-slate-700 hover:bg-slate-600">
                                                    {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <BookOpen className="w-4 h-4 mr-2" />}
                                                    View Roadmap
                                                </Button>
                                            </Card>
                                        ))}
                                    </div>
                                    <div className="flex justify-center mt-4">
                                        <Button variant="ghost" onClick={() => setStep(0)} className="text-slate-500 hover:text-white">
                                            Restart Assessment
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Roadmap View */}
                            {step === 11 && generatedRoadmapSteps && (
                                <motion.div key="roadmap" className="h-full">
                                    <div className="flex items-center gap-2 mb-6">
                                        <Button variant="ghost" size="sm" onClick={() => setGeneratedRoadmapSteps(null)} className="text-slate-400 hover:text-white pl-0 gap-2">
                                            <ArrowLeft className="w-4 h-4" /> Back to Matches
                                        </Button>
                                    </div>

                                    <div className="bg-slate-950/50 rounded-3xl p-8 border border-white/5">
                                        {/* Use generated steps but map to correct interface */}
                                        <WavyRoadmap steps={generatedRoadmapSteps.map(s => ({
                                            id: s.id,
                                            title: s.title,
                                            description: s.description,
                                            status: s.status as any,
                                            duration: s.duration
                                        }))} />
                                    </div>

                                    <div className="mt-8 flex justify-center">
                                        <Button
                                            size="lg"
                                            className="bg-purple-600 hover:bg-purple-500 text-white px-8 rounded-xl shadow-lg shadow-purple-500/25"
                                            onClick={() => {
                                                if (onComplete) onComplete({ career: selectedCareer, roadmap: generatedRoadmapSteps });
                                                onClose();
                                            }}
                                        >
                                            Save & Go to Dashboard
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
