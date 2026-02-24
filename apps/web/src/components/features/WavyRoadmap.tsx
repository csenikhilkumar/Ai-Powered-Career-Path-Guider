import { motion } from 'framer-motion';
import { CheckCircle, Flag, Briefcase, BookOpen, Monitor } from 'lucide-react';
import { useEffect, useState } from 'react';

interface RoadmapStep {
    id: string;
    title: string;
    description: string;
    status: 'completed' | 'current' | 'upcoming' | 'locked';
    duration?: string;
}

interface WavyRoadmapProps {
    steps: RoadmapStep[];
    className?: string;
    onStepClick?: (step: RoadmapStep) => void;
}

export function WavyRoadmap({ steps, className = '', onStepClick }: WavyRoadmapProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (isMobile) {
        return <VerticalRoadmap steps={steps} className={className} onStepClick={onStepClick} />;
    }

    return <DesktopWavyRoadmap steps={steps} className={className} onStepClick={onStepClick} />;
}

function VerticalRoadmap({ steps, className, onStepClick }: WavyRoadmapProps) {
    return (
        <div className={`space-y-8 relative pl-8 py-8 ${className}`}>
            {/* Vertical Line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-neutral-200 dark:bg-neutral-800" />

            {steps.map((step, index) => (
                <motion.div
                    key={step.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                >
                    {/* Node */}
                    <div
                        onClick={() => onStepClick && onStepClick(step)}
                        className={`absolute -left-[30px] top-1 w-10 h-10 rounded-full border-4 z-10 flex items-center justify-center bg-white dark:bg-neutral-900 cursor-pointer transition-transform hover:scale-110 ${step.status === 'completed' ? 'border-green-500 text-green-500' :
                            step.status === 'current' ? 'border-purple-500 text-purple-500 animate-pulse' :
                                'border-neutral-300 text-neutral-300 dark:border-neutral-700 hover:border-purple-300'
                            }`}>
                        {getIconForStatus(step.status, index, steps.length)}
                    </div>

                    <div className="bg-white dark:bg-neutral-900 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                        <span className="text-xs font-semibold text-purple-600 mb-1 block">{step.duration}</span>
                        <h3 className="font-bold text-lg mb-1">{step.title}</h3>
                        <p className="text-sm text-neutral-500">{step.description}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

function DesktopWavyRoadmap({ steps, className, onStepClick }: WavyRoadmapProps) {
    // Calculate SVG dimensions based on steps
    // Each step takes ~320px width to accomodate w-64 cards (256px) plus spacing.
    const stepWidth = 320;
    const waveHeight = 100;
    const totalWidth = steps.length * stepWidth + 200;
    const svgHeight = 500;
    const midY = svgHeight / 2;

    // Generate Path
    const svgPaddingX = 50;
    let pathD = `M 0,${midY}`; // Start from far left edge
    const points: { x: number; y: number }[] = [];

    // Calculate points first
    for (let i = 0; i < steps.length; i++) {
        const x = 100 + (i * stepWidth);
        const y = i % 2 === 0 ? midY - waveHeight : midY + waveHeight;
        points.push({ x, y });
    }

    // Construct Path
    // Start with a curve to the first point
    const firstPoint = points[0];
    pathD += ` C ${svgPaddingX},${midY} ${firstPoint.x - 50},${firstPoint.y} ${firstPoint.x},${firstPoint.y}`;

    for (let i = 0; i < points.length; i++) {
        const curr = points[i];

        if (i < points.length - 1) {
            const next = points[i + 1];
            const midX = (curr.x + next.x) / 2;
            pathD += ` C ${midX},${curr.y} ${midX},${next.y} ${next.x},${next.y}`;
        }
    }

    // Add a trailing line to the right
    const lastPoint = points[points.length - 1];
    pathD += ` C ${lastPoint.x + 50},${lastPoint.y} ${totalWidth - 50},${midY} ${totalWidth},${midY}`;

    return (
        <div className={`overflow-x-auto pb-12 pt-12 ${className} bg-white dark:bg-white rounded-3xl p-8 shadow-sm`}>
            <div className="mb-8 flex justify-between items-center text-slate-900 px-4">
                <span className="font-bold text-lg">April 2024</span>
                <span className="font-bold text-lg">July 2026</span>
            </div>

            <div className="relative mx-auto" style={{ width: totalWidth, height: svgHeight }}>
                <svg width={totalWidth} height={svgHeight} className="absolute inset-0 pointer-events-none">
                    {/* Dotted Blue Line */}
                    <path
                        d={pathD}
                        fill="none"
                        stroke="#3b82f6" // blue-500
                        strokeWidth="3"
                        strokeDasharray="12 12"
                        className=""
                        strokeLinecap="round"
                    />
                </svg>

                {steps.map((step, index) => {
                    const point = points[index];
                    const isTop = index % 2 === 0;

                    return (
                        <motion.div
                            key={index}
                            className="absolute flex flex-col items-center w-64"
                            style={{
                                left: point.x - 128,
                                top: point.y - 32,
                            }}
                            initial={{ scale: 0, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 + (index * 0.15), type: "spring" }}
                        >
                            {/* Content Text - Alternating */}
                            <div className={`absolute w-full text-center ${isTop ? '-top-24' : 'top-20'}`}>
                                <h3 className="font-bold text-slate-900 text-lg mb-1">{step.title}</h3>
                                <p className="text-slate-500 text-sm leading-snug px-2">{step.description}</p>
                            </div>

                            {/* Node Icon */}
                            <div
                                onClick={() => onStepClick && onStepClick(step)}
                                className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110 shadow-xl ${step.status === 'completed' || step.status === 'current' ? 'bg-[#1e293b] text-white' : 'bg-white border-2 border-slate-200 text-slate-400'
                                    }`}
                            >
                                {getIconForStatus(step.status, index, steps.length)}

                                {step.status === 'completed' && index === 0 && (
                                    <div className="absolute -right-2 -top-2 bg-blue-500 text-white p-1 rounded-full">
                                        <CheckCircle size={14} fill="white" className="text-blue-500" />
                                    </div>
                                )}
                            </div>

                            {/* Step Label below/above node immediate */}
                            <div className={`absolute w-max font-semibold text-slate-600 ${isTop ? 'top-24 mt-2' : '-top-10 mb-2'}`}>
                                {isTop ? (index === 0 ? "Skill Assessment" : index === 2 ? "Academic Project" : "Begin Career") :
                                    (index === 1 ? "Online Courses" : "Internship")}
                            </div>

                        </motion.div>
                    );
                })}
            </div>
            <div className="mt-4 text-center text-slate-500 font-medium">
                Experiential Learning
            </div>
        </div>
    );
}

function getIconForStatus(status: string, index: number, total: number) {
    if (index === 0) return <CheckCircle size={32} strokeWidth={2} />; // Assessment
    if (index === 1) return <Monitor size={32} strokeWidth={2} />; // Online Courses
    if (index === 2) return <BookOpen size={32} strokeWidth={2} />; // Academic
    if (index === 3) return <Briefcase size={32} strokeWidth={2} />; // Internship
    return <Flag size={32} strokeWidth={2} />; // Flag
}
