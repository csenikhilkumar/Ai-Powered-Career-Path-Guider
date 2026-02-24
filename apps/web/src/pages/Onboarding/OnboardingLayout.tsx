import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, ArrowRight, Brain, Sparkles, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProfileStep } from './steps/ProfileStep';
import { SkillsStep } from './steps/SkillsStep';
import { InterestsStep } from './steps/InterestsStep';
import { AssessmentStep } from './steps/AssessmentStep';
import { userApi } from '@/api/user';

const steps = [
    { id: 1, title: 'About You', desc: 'Tell us your story', icon: '👤' },
    { id: 2, title: 'Your Skills', desc: 'What you excel at', icon: '⚡' },
    { id: 3, title: 'Your Interests', desc: 'What excites you', icon: '❤️' },
    { id: 4, title: 'Assessment', desc: 'Final insights', icon: '🎯' },
];

export default function OnboardingLayout() {
    const [currentStep, setCurrentStep] = useState(1);
    const navigate = useNavigate();

    // Form State
    const [profileData, setProfileData] = useState({
        fullname: '',
        location: '',
        currentRole: '',
        education: ''
    });
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    const progress = (currentStep / steps.length) * 100;

    const handleComplete = async () => {
        try {
            const [firstName, ...lastNameParts] = profileData.fullname.split(' ');
            const lastName = lastNameParts.join(' ');

            await userApi.updateProfile({
                firstName,
                lastName,
                location: profileData.location,
                currentRole: profileData.currentRole,
                educationLevel: profileData.education,
                skills: selectedSkills,
                interests: selectedInterests
            });

            navigate('/dashboard');
        } catch (error) {
            console.error("Failed to save profile", error);
        }
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return <ProfileStep data={profileData} updateData={(data) => setProfileData(prev => ({ ...prev, ...data }))} />;
            case 2:
                return <SkillsStep selectedSkills={selectedSkills} onChange={setSelectedSkills} />;
            case 3:
                return <InterestsStep selectedInterests={selectedInterests} onChange={setSelectedInterests} />;
            case 4:
                return <AssessmentStep />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen gradient-surface relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -100, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        x: [0, -100, 0],
                        y: [0, 100, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
                />
            </div>

            {/* Header */}
            <div className="relative z-10 glass border-b border-white/10">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
                                <Brain className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">PathGuide AI</h2>
                                <p className="text-xs text-purple-300">Discovery Process</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-white">Step {currentStep} of {steps.length}</p>
                            <p className="text-xs text-purple-300">{Math.round(progress)}% complete</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/50"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                    </div>

                    {/* Step Indicators */}
                    <div className="mt-8 grid grid-cols-4 gap-4">
                        {steps.map((step) => {
                            const isComplete = step.id < currentStep;
                            const isActive = step.id === currentStep;

                            return (
                                <div
                                    key={step.id}
                                    className={`flex flex-col items-center transition-all ${isComplete || isActive ? 'opacity-100' : 'opacity-40'
                                        }`}
                                >
                                    <div
                                        className={`mb-2 flex h-12 w-12 items-center justify-center rounded-full transition-all text-xl ${isComplete
                                                ? 'bg-gradient-to-br from-teal-500 to-emerald-500 shadow-lg shadow-teal-500/50'
                                                : isActive
                                                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-purple-500/50 scale-110'
                                                    : 'bg-white/5 border-2 border-white/20'
                                            }`}
                                    >
                                        {isComplete ? <Check className="h-6 w-6 text-white" /> : step.icon}
                                    </div>
                                    <div className="text-center hidden sm:block">
                                        <p className={`text-sm font-semibold ${isComplete || isActive ? 'text-white' : 'text-purple-300'}`}>
                                            {step.title}
                                        </p>
                                        <p className="text-xs text-purple-400">{step.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Step Content */}
            <div className="container mx-auto px-6 py-12 relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="mx-auto max-w-3xl"
                    >
                        <div className="glass rounded-3xl p-8 md:p-12 shadow-2xl">
                            {/* Step Header */}
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="text-4xl">{steps[currentStep - 1].icon}</div>
                                    <div>
                                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
                                            {steps[currentStep - 1].title}
                                        </h1>
                                        <p className="text-purple-200">{steps[currentStep - 1].desc}</p>
                                    </div>
                                </div>

                                {/* Personalized Message */}
                                <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                    <Sparkles className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-blue-200">
                                            {currentStep === 1 && "Let's start by getting to know you better. This helps our AI create a personalized career roadmap."}
                                            {currentStep === 2 && "Tell us about your skills. Our AI will match them with perfect career opportunities."}
                                            {currentStep === 3 && "Your interests guide your journey. Share what excites you most."}
                                            {currentStep === 4 && "Almost there! This final step helps us fine-tune your perfect career match."}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {renderStepContent()}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="mx-auto mt-8 flex max-w-3xl justify-between">
                    <Button
                        variant="ghost"
                        disabled={currentStep === 1}
                        onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                        className="glass hover:bg-white/10 text-white disabled:opacity-50"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back
                    </Button>
                    <Button
                        onClick={() =>
                            currentStep < steps.length
                                ? setCurrentStep(currentStep + 1)
                                : handleComplete()
                        }
                        className="gradient-accent shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all"
                    >
                        <Sparkles className="h-5 w-5 mr-2" />
                        {currentStep === steps.length ? 'Complete Journey' : 'Continue'}
                        {currentStep < steps.length && <ArrowRight className="h-5 w-5 ml-2" />}
                    </Button>
                </div>

                {/* Bottom Encouragement */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mx-auto mt-8 max-w-3xl text-center"
                >
                    <p className="text-sm text-purple-300">
                        🔒 Your information is secure and private • Used only to personalize your experience
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
