import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Brain, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiApi } from '@/api/ai';
const QUESTIONS = [
    {
        id: 1,
        question: "How do you prefer to solve problems?",
        options: [
            "I like to break them down into smaller, logical steps.",
            "I prefer to brainstorm multiple creative solutions first.",
            "I look for similar problems solved by others.",
            "I jump in and experiment until something works."
        ]
    },
    {
        id: 2,
        question: "Which environment do you thrive in?",
        options: [
            "Fast-paced, constantly changing environments.",
            "Structured, organized, and predictable settings.",
            "Collaborative team environments with lots of discussion.",
            "Quiet, independent work with deep focus time."
        ]
    },
    {
        id: 3,
        question: "What motivates you the most?",
        options: [
            "Building things that people use every day.",
            "Solving complex technical challenges.",
            "Designing beautiful and intuitive interfaces.",
            "Optimizing processes and making things efficient."
        ]
    }
];

export function AssessmentStep() {
    const [started, setStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [analyzing, setAnalyzing] = useState(false);
    const [completed, setCompleted] = useState(false);

    const [_results, setResults] = useState<any>(null);

    useEffect(() => {
        const analyze = async () => {
            if (analyzing) {
                try {
                    const result = await aiApi.submitAssessment(answers);
                    setResults(result);
                    setCompleted(true);
                } catch (err) {
                    console.error("AI Analysis failed", err);
                    setCompleted(true); // Fallback to complete state even if fail for prototype
                } finally {
                    setAnalyzing(false);
                }
            }
        };
        analyze();
    }, [analyzing, answers]);

    const handleAnswer = (index: number) => {
        const newAnswers = [...answers, index];
        setAnswers(newAnswers);

        if (currentQuestion < QUESTIONS.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setAnalyzing(true);
        }
    };

    if (completed) {
        return (
            <div className="text-center space-y-6">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                >
                    <CheckCircle2 className="h-12 w-12" />
                </motion.div>
                <div>
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">Assessment Complete!</h3>
                    <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                        We've analyzed your responses and have some great career matches for you.
                    </p>
                </div>
            </div>
        );
    }

    if (analyzing) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                <div className="relative">
                    <div className="absolute inset-0 animate-ping rounded-full bg-primary-200 opacity-75 dark:bg-primary-900/20"></div>
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
                        <Brain className="h-10 w-10 text-primary-600 animate-pulse" />
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">Analyzing your profile...</h3>
                    <p className="text-neutral-500">Matching with 500+ career paths</p>
                </div>
            </div>
        );
    }

    if (!started) {
        return (
            <div className="text-center space-y-6">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-50 text-4xl dark:bg-primary-900/20">
                    🧠
                </div>
                <div>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                        AI Aptitude Assessment
                    </h3>
                    <p className="mt-2 text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
                        This quick assessment uses AI to understand your cognitive style and preferences to recommend the best career paths.
                    </p>
                </div>
                <Button size="lg" onClick={() => setStarted(true)} variant="gradient" className="mt-4">
                    Start Assessment <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between text-sm text-neutral-500">
                <span>Question {currentQuestion + 1} of {QUESTIONS.length}</span>
                <span>{Math.round(((currentQuestion) / QUESTIONS.length) * 100)}%</span>
            </div>

            {/* Progress Bar within card */}
            <div className="h-1 w-full bg-neutral-100 rounded-full overflow-hidden dark:bg-dark-hover">
                <div
                    className="h-full bg-primary-600 transition-all duration-300 ease-out"
                    style={{ width: `${((currentQuestion) / QUESTIONS.length) * 100}%` }}
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    <h3 className="text-xl font-semibold text-neutral-900 mb-6 dark:text-white">
                        {QUESTIONS[currentQuestion].question}
                    </h3>

                    <div className="grid gap-3">
                        {QUESTIONS[currentQuestion].options.map((option, idx) => (
                            <Card
                                key={idx}
                                hover
                                className="cursor-pointer p-4 transition-all hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10"
                                onClick={() => handleAnswer(idx)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-neutral-300 text-xs font-medium text-neutral-500 group-hover:border-primary-500 group-hover:text-primary-600">
                                        {String.fromCharCode(65 + idx)}
                                    </div>
                                    <span className="text-neutral-700 dark:text-neutral-300">{option}</span>
                                </div>
                            </Card>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
