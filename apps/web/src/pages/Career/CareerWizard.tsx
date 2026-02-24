import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useNavigate } from 'react-router-dom';
import { AiInteraction } from '@/api/ai';

// Icons for gamification
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { Gamepad2, Code, Lightbulb, Heart, Briefcase, User, Users, Globe, Building2, Stethoscope, Scale, GraduationCap, Megaphone, Music, Trophy, Plane, BrainCircuit, ShieldCheck, ChevronDown, ChevronUp, Lock, Database, Server, Cpu, Palette, Smartphone, Bitcoin, PenTool, Video, Camera, Activity, BookOpen, Coins, ShoppingBag, FlaskConical, Atom, Leaf, Microscope, MonitorPlay, Plus, Clock, Calendar, Zap } from 'lucide-react';

export default function CareerWizard() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [showAllInterests, setShowAllInterests] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        currentStatus: '',
        interests: [] as string[],
        hobbies: '',
        technicalStrengths: '',
        softSkills: [] as string[],
        workEnvironment: '',
        timeCommitment: '',
        dream: ''
    });

    const [customInterest, setCustomInterest] = useState('');

    const addCustomInterest = () => {
        if (customInterest.trim() && !formData.interests.includes(customInterest.trim())) {
            updateField('interests', [...formData.interests, customInterest.trim()]);
            setCustomInterest('');
        }
    };

    // Sub-interests mapping
    const subInterestsMap: Record<string, { value: string; label: string; icon: any }[]> = {
        coding: [
            { value: 'fullstack', label: 'Full Stack Dev', icon: <Code className="w-4 h-4" /> },
            { value: 'ai_ml', label: 'AI & Machine Learning', icon: <BrainCircuit className="w-4 h-4" /> },
            { value: 'cybersecurity', label: 'Cybersecurity', icon: <Lock className="w-4 h-4" /> },
            { value: 'web3', label: 'Web3 & Blockchain', icon: <Bitcoin className="w-4 h-4" /> },
            { value: 'mobile_dev', label: 'Mobile App Dev', icon: <Smartphone className="w-4 h-4" /> },
            { value: 'data_science', label: 'Data Science', icon: <Database className="w-4 h-4" /> },
            { value: 'devops', label: 'DevOps & Cloud', icon: <Server className="w-4 h-4" /> },
            { value: 'game_dev', label: 'Game Development', icon: <Gamepad2 className="w-4 h-4" /> },
            { value: 'ui_ux', label: 'UI/UX Design', icon: <Palette className="w-4 h-4" /> },
            { value: 'embedded', label: 'Embedded Systems', icon: <Cpu className="w-4 h-4" /> },
        ],
        gaming: [
            { value: 'esports_pro', label: 'Pro Player (Esports)', icon: <Trophy className="w-4 h-4" /> },
            { value: 'game_design', label: 'Game Design', icon: <PenTool className="w-4 h-4" /> },
            { value: 'streaming', label: 'Streaming & Content', icon: <MonitorPlay className="w-4 h-4" /> },
            { value: 'level_design', label: 'Level Design', icon: <Gamepad2 className="w-4 h-4" /> },
        ],
        creative: [
            { value: 'digital_art', label: 'Digital Art', icon: <Palette className="w-4 h-4" /> },
            { value: 'video_editing', label: 'Video Editing', icon: <Video className="w-4 h-4" /> },
            { value: 'animation', label: 'Animation', icon: <Activity className="w-4 h-4" /> },
            { value: 'graphic_design', label: 'Graphic Design', icon: <PenTool className="w-4 h-4" /> },
            { value: 'music_prod', label: 'Music Production', icon: <Music className="w-4 h-4" /> },
            { value: 'photography', label: 'Photography', icon: <Camera className="w-4 h-4" /> },
        ],
        helping: [
            { value: 'psychology', label: 'Psychology', icon: <BrainCircuit className="w-4 h-4" /> },
            { value: 'nursing', label: 'Nursing', icon: <Activity className="w-4 h-4" /> },
            { value: 'teaching', label: 'Teaching', icon: <BookOpen className="w-4 h-4" /> },
            { value: 'social_work', label: 'Social Work', icon: <Users className="w-4 h-4" /> },
            { value: 'counseling', label: 'Counseling', icon: <Heart className="w-4 h-4" /> },
        ],
        business: [
            { value: 'entrepreneur', label: 'Startups', icon: <Lightbulb className="w-4 h-4" /> },
            { value: 'finance', label: 'Finance & Investing', icon: <Coins className="w-4 h-4" /> },
            { value: 'marketing', label: 'Marketing', icon: <Megaphone className="w-4 h-4" /> },
            { value: 'ecommerce', label: 'E-commerce', icon: <ShoppingBag className="w-4 h-4" /> },
            { value: 'management', label: 'Management', icon: <Briefcase className="w-4 h-4" /> },
        ],
        science: [
            { value: 'biology', label: 'Biology', icon: <Leaf className="w-4 h-4" /> },
            { value: 'physics', label: 'Physics', icon: <Atom className="w-4 h-4" /> },
            { value: 'chemistry', label: 'Chemistry', icon: <FlaskConical className="w-4 h-4" /> },
            { value: 'astronomy', label: 'Astronomy', icon: <Globe className="w-4 h-4" /> },
            { value: 'environmental', label: 'Environmental', icon: <Leaf className="w-4 h-4" /> },
            { value: 'research', label: 'Research', icon: <Microscope className="w-4 h-4" /> },
        ]
    };

    const questions = [
        {
            id: 'name',
            title: "Let's start with your name",
            description: "What should we call you, future legend?",
            type: 'text',
            placeholder: 'Enter your name'
        },
        {
            id: 'currentStatus',
            title: "What's your current status?",
            description: "Where are you in your journey right now?",
            type: 'select',
            options: [
                { value: 'student_hs', label: 'High School Student', icon: '🎓' },
                { value: 'student_uni', label: 'University Student', icon: '🏛️' },
                { value: 'professional', label: 'Working Professional', icon: '💼' },
                { value: 'explorer', label: 'Just Exploring', icon: '🔭' }
            ]
        },
        {
            id: 'interests',
            title: "Pick your core interests",
            description: "Select up to 3 things that excite you.",
            type: 'multi-select',
            options: [
                { value: 'gaming', label: 'Gaming & Esports', icon: <Gamepad2 className="w-6 h-6" /> },
                { value: 'coding', label: 'Coding & Tech', icon: <Code className="w-6 h-6" /> },
                { value: 'creative', label: 'Art & Creativity', icon: <Lightbulb className="w-6 h-6" /> },
                { value: 'helping', label: 'Helping People', icon: <Heart className="w-6 h-6" /> },
                { value: 'business', label: 'Business & Money', icon: <Briefcase className="w-6 h-6" /> },
                { value: 'science', label: 'Science & Nature', icon: <Globe className="w-6 h-6" /> },
                // Expanded options hidden by default
                ...(showAllInterests ? [
                    { value: 'engineering', label: 'Engineering', icon: <Building2 className="w-6 h-6" /> },
                    { value: 'healthcare', label: 'Healthcare', icon: <Stethoscope className="w-6 h-6" /> },
                    { value: 'law', label: 'Law & Politics', icon: <Scale className="w-6 h-6" /> },
                    { value: 'education', label: 'Education', icon: <GraduationCap className="w-6 h-6" /> },
                    { value: 'marketing', label: 'Marketing & Media', icon: <Megaphone className="w-6 h-6" /> },
                    { value: 'music', label: 'Music & Audio', icon: <Music className="w-6 h-6" /> },
                    { value: 'sports', label: 'Sports & Athletics', icon: <Trophy className="w-6 h-6" /> },
                    { value: 'travel', label: 'Hospitality & Travel', icon: <Plane className="w-6 h-6" /> },
                    { value: 'data', label: 'Data & AI', icon: <BrainCircuit className="w-6 h-6" /> },
                    { value: 'cybersecurity', label: 'Cybersecurity', icon: <ShieldCheck className="w-6 h-6" /> }
                ] : [])
            ]
        },
        {
            id: 'hobbies',
            title: "What are your hobbies?",
            description: "What do you do for fun on weekends?",
            type: 'text',
            placeholder: 'e.g. Playing Valorant, Reading Sci-Fi, sketching...'
        },
        {
            id: 'technicalStrengths',
            title: "Any technical superpowers?",
            description: "List any tools or skills you're already good at.",
            type: 'text',
            placeholder: 'e.g. Python, Photoshop, Excel, or "None yet!"'
        },
        {
            id: 'softSkills',
            title: "How do you work best?",
            description: "Pick your top traits.",
            type: 'multi-select',
            options: [
                { value: 'leader', label: 'Natural Leader', icon: <User className="w-6 h-6" /> },
                { value: 'team', label: 'Team Player', icon: <Users className="w-6 h-6" /> },
                { value: 'solo', label: 'Lone Wolf', icon: <User className="w-6 h-6" /> },
                { value: 'creative', label: 'Creative Thinker', icon: <Lightbulb className="w-6 h-6" /> }
            ]
        },
        {
            id: 'workEnvironment',
            title: "Ideal work vibe?",
            description: "Where do you see yourself thriving?",
            type: 'select',
            options: [
                { value: 'remote', label: 'Fully Remote (Work from home)', icon: '🏠' },
                { value: 'office', label: 'Bustling Office', icon: '🏢' },
                { value: 'hybrid', label: 'Best of both worlds', icon: '⚡' },
                { value: 'outdoor', label: 'Out in the field', icon: '🌳' }
            ]
        },
        {
            id: 'timeCommitment',
            title: "Time Availability",
            description: "How much time can you dedicate per week?",
            type: 'select',
            options: [
                { value: 'casual', label: '< 5 hours/week', icon: <Clock className="w-6 h-6" /> },
                { value: 'part_time', label: '5-10 hours/week', icon: <Calendar className="w-6 h-6" /> },
                { value: 'serious', label: '10-20 hours/week', icon: <Zap className="w-6 h-6" /> },
                { value: 'full_time', label: '20+ hours/week', icon: <Trophy className="w-6 h-6" /> }
            ]
        },
        {
            id: 'dream',
            title: "The Dream",
            description: "If you couldn't fail, what would you do?",
            type: 'textarea',
            placeholder: 'e.g. Start my own game studio, Become a pro esports player...'
        }
    ];

    const currentQuestion = questions[step];

    const handleNext = () => {
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setLoadingMessage('Analyzing your profile...');

        try {
            // 1. Analyze Career Path
            const analysis = await AiInteraction.analyzeCareerPath(formData);

            // 2. Get the top recommendation
            const topCareer = analysis.recommendations[0];

            if (!topCareer) {
                throw new Error('No career recommendation found');
            }

            setLoadingMessage(`Designing path for: ${topCareer.title}...`);

            // 3. Generate Roadmap for top career
            // Extract top/relevant skills from formData to pass specifically
            const currentSkills = formData.technicalStrengths.split(',').map(s => s.trim());
            const targetSkills = topCareer.requiredSkills || [];

            // Calculate timeframe based on commitment
            let timeframe = '6 months';
            if (formData.timeCommitment === 'casual') timeframe = '12 months';
            else if (formData.timeCommitment === 'part_time') timeframe = '8 months';
            else if (formData.timeCommitment === 'serious') timeframe = '6 months';
            else if (formData.timeCommitment === 'full_time') timeframe = '3 months';

            const roadmapData = await AiInteraction.generateRoadmap({
                careerPathTitle: topCareer.title,
                currentSkills: currentSkills.map(s => ({ skillName: s, proficiency: 'Beginner' })),
                targetSkills: targetSkills,
                timeframe: timeframe
            });

            // 4. Navigate to Result Page with data
            navigate('/dashboard/career-roadmap', {
                state: {
                    result: roadmapData,
                    careerTitle: topCareer.title,
                    careerRecommendation: topCareer,
                    userProfile: formData
                }
            });

        } catch (error) {
            console.error('Wizard Error:', error);
            setLoadingMessage('Something went wrong. Please try again.');
            // Ideally show error UI here
            setTimeout(() => setLoading(false), 2000);
        }
        // Loading state handled by navigation usually, but safety check
    };

    const updateField = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const toggleSelection = (key: string, value: string) => {
        const current = formData[key as keyof typeof formData] as string[];
        if (current.includes(value)) {
            updateField(key, current.filter(item => item !== value));
        } else {
            if (current.length < 3) {
                updateField(key, [...current, value]);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="mb-8"
                >
                    <div className="w-24 h-24 border-t-4 border-purple-500 rounded-full shadow-[0_0_50px_rgba(168,85,247,0.5)]" />
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={loadingMessage}
                    className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
                >
                    {loadingMessage}
                </motion.h2>
                <p className="text-gray-400 mt-4">Consulting the AI Oracle...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />
            <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />

            <div className="relative z-10 flex-1 flex flex-col max-w-2xl mx-auto w-full p-6 justify-center">
                {/* Progress */}
                <div className="absolute top-8 left-6 right-6 lg:left-0 lg:right-0 max-w-2xl mx-auto">
                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500 font-medium uppercase tracking-wider">
                        <span>Start</span>
                        <span>Question {step + 1} of {questions.length}</span>
                        <span>Finish</span>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8 mt-12"
                    >
                        <div className="space-y-2">
                            <h1 className="text-4xl md:text-5xl font-bold text-white">{currentQuestion.title}</h1>
                            <p className="text-xl text-gray-400">{currentQuestion.description}</p>
                        </div>

                        <div className="min-h-[300px]">
                            {/* Input Types */}
                            {currentQuestion.type === 'text' && (
                                <Input
                                    autoFocus
                                    className="text-2xl p-6 h-auto bg-white/5 border-white/10 focus:border-purple-500"
                                    placeholder={currentQuestion.placeholder}
                                    value={formData[currentQuestion.id as keyof typeof formData] as string}
                                    onChange={(e) => updateField(currentQuestion.id, e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                                />
                            )}

                            {currentQuestion.type === 'textarea' && (
                                <textarea
                                    autoFocus
                                    className="w-full text-xl p-6 h-40 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none text-white resize-none"
                                    placeholder={currentQuestion.placeholder}
                                    value={formData[currentQuestion.id as keyof typeof formData] as string}
                                    onChange={(e) => updateField(currentQuestion.id, e.target.value)}
                                />
                            )}

                            {currentQuestion.type === 'select' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {currentQuestion.options?.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => updateField(currentQuestion.id, opt.value)}
                                            className={`p-6 rounded-xl border text-left transition-all ${formData[currentQuestion.id as keyof typeof formData] === opt.value
                                                ? 'bg-purple-500/20 border-purple-500 ring-2 ring-purple-500/50'
                                                : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                                                }`}
                                        >
                                            <span className="text-4xl mb-4 block">{opt.icon}</span>
                                            <span className="text-lg font-medium text-white block">{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Dynamic Sub-interests for selected categories */}
                            {currentQuestion.id === 'interests' && (
                                <div className="space-y-6 mt-6">
                                    {(formData.interests as string[]).map((interest) => {
                                        const subOptions = subInterestsMap[interest as keyof typeof subInterestsMap];
                                        if (!subOptions) return null;

                                        return (
                                            <motion.div
                                                key={interest}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="pt-6 border-t border-white/10"
                                            >
                                                <h3 className="text-lg font-medium text-purple-300 mb-4 flex items-center capitalize">
                                                    What specific areas of {interest} interest you?
                                                </h3>
                                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {subOptions.map((subOpt) => {
                                                        const isSelected = (formData.interests as string[]).includes(subOpt.value);
                                                        return (
                                                            <button
                                                                key={subOpt.value}
                                                                onClick={() => toggleSelection('interests', subOpt.value)}
                                                                className={`p-3 rounded-lg border text-left transition-all flex items-center gap-3 ${isSelected
                                                                    ? 'bg-purple-500/20 border-purple-500 ring-1 ring-purple-500/50'
                                                                    : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                                                                    }`}
                                                            >
                                                                <div className={`p-1.5 rounded-md ${isSelected ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                                                                    {subOpt.icon}
                                                                </div>
                                                                <span className="text-sm font-medium text-white">{subOpt.label}</span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </motion.div>
                                        );
                                    })}

                                    {/* Manual Entry Section */}
                                    <div className="pt-6 border-t border-white/10">
                                        <h3 className="text-lg font-medium text-purple-300 mb-4 flex items-center">
                                            <Plus className="w-5 h-5 mr-2" /> Can't find what you're looking for?
                                        </h3>
                                        <div className="flex gap-2">
                                            <Input
                                                value={customInterest}
                                                onChange={(e) => setCustomInterest(e.target.value)}
                                                placeholder="Type your custom interest (e.g. Bio-hacking, Poetry)..."
                                                className="bg-white/5 border-white/10"
                                                onKeyDown={(e) => e.key === 'Enter' && addCustomInterest()}
                                            />
                                            <Button
                                                onClick={addCustomInterest}
                                                variant="secondary"
                                                disabled={!customInterest.trim()}
                                            >
                                                Add
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(currentQuestion.type === 'multi-select') && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {currentQuestion.options?.map((opt) => {
                                            const selected = (formData[currentQuestion.id as keyof typeof formData] as string[]).includes(opt.value);
                                            return (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => toggleSelection(currentQuestion.id, opt.value)}
                                                    className={`p-6 rounded-xl border text-left transition-all flex items-center gap-4 ${selected
                                                        ? 'bg-purple-500/20 border-purple-500 ring-2 ring-purple-500/50'
                                                        : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                                                        }`}
                                                >
                                                    <div className={`p-2 rounded-lg ${selected ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                                                        {opt.icon}
                                                    </div>
                                                    <span className="text-lg font-medium text-white">{opt.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {currentQuestion.id === 'interests' && (
                                        <div className="mt-6 flex justify-center">
                                            <button
                                                onClick={() => setShowAllInterests(!showAllInterests)}
                                                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-purple-500/10"
                                            >
                                                {showAllInterests ? (
                                                    <>Show Less <ChevronUp className="w-5 h-5" /></>
                                                ) : (
                                                    <>View All Industries ({10} more) <ChevronDown className="w-5 h-5" /></>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        disabled={step === 0}
                        className={step === 0 ? 'invisible' : ''}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                        onClick={handleNext}
                        size="lg"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8"
                    >
                        {step === questions.length - 1 ? (
                            <>Generate Path <Sparkles className="ml-2 h-4 w-4" /></>
                        ) : (
                            <>Next <ArrowRight className="ml-2 h-4 w-4" /></>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
