import { motion } from 'framer-motion';
import { Award, CheckCircle, Flag, Star, Zap } from 'lucide-react';

interface RoadmapPhase {
    title: string;
    duration: string;
    description?: string;
    topics?: { name: string; description?: string }[];
    milestones?: string[];
}

interface RoadmapTimelineProps {
    phases: RoadmapPhase[];
    title?: string;
    className?: string;
}

export function RoadmapTimeline({ phases, title, className = '' }: RoadmapTimelineProps) {
    return (
        <div className={`p-6 ${className}`}>
            {title && (
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, type: "spring" }}
                        className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
                    >
                        {title}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 mt-2"
                    >
                        Your AI-Generated Path to Success
                    </motion.p>
                </div>
            )}

            <div className="relative max-w-4xl mx-auto">
                {/* Animated Vertical Line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ height: "0%" }}
                        whileInView={{ height: "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="w-full bg-gradient-to-b from-purple-500 via-pink-500 to-red-500"
                    />
                </div>

                <div className="space-y-24">
                    {phases.map((phase, index) => {
                        const isEven = index % 2 === 0;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6, type: "spring", stiffness: 50 }}
                                className={`relative flex items-center justify-between ${isEven ? 'flex-row' : 'flex-row-reverse'}`}
                            >
                                {/* Content Card */}
                                <div className={`w-5/12 ${isEven ? 'text-right' : 'text-left'}`}>
                                    <motion.div
                                        whileHover={{ scale: 1.05, rotateY: isEven ? 5 : -5 }}
                                        className="relative group perspective-1000"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                                        <div className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all">

                                            {/* Phase Header */}
                                            <div className={`flex items-center gap-3 mb-3 ${isEven ? 'justify-end' : 'justify-start'}`}>
                                                <span className="text-xs font-bold tracking-wider uppercase text-purple-600 dark:text-purple-400 px-3 py-1 bg-purple-50 dark:bg-purple-900/20 rounded-full">
                                                    {phase.duration}
                                                </span>
                                                {index === 0 && <span className="animate-pulse w-2 h-2 rounded-full bg-green-500" />}
                                            </div>

                                            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 mb-3">
                                                {phase.title}
                                            </h3>
                                            <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6 leading-relaxed">
                                                {phase.description}
                                            </p>

                                            {/* Milestones / Topics with Staggered Animation */}
                                            {(phase.milestones || phase.topics) && (
                                                <ul className={`space-y-2 ${isEven ? 'items-end' : 'items-start'} flex flex-col`}>
                                                    {(phase.milestones || phase.topics?.map(t => t.name))?.map((item, idx) => (
                                                        <motion.li
                                                            key={idx}
                                                            initial={{ opacity: 0, x: isEven ? 20 : -20 }}
                                                            whileInView={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.3 + (idx * 0.1) }}
                                                            className={`text-sm text-neutral-600 dark:text-neutral-300 flex items-center gap-2 group/item`}
                                                        >
                                                            {isEven || <CheckCircle className="w-4 h-4 text-green-500 group-hover/item:scale-125 transition-transform" />}
                                                            <span className="group-hover/item:text-purple-600 transition-colors">{item}</span>
                                                            {isEven && <CheckCircle className="w-4 h-4 text-green-500 group-hover/item:scale-125 transition-transform" />}
                                                        </motion.li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Center Icon */}
                                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                                    <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        whileInView={{ scale: 1, rotate: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                        whileHover={{ scale: 1.2, rotate: 360 }}
                                        className="w-14 h-14 rounded-full bg-neutral-900 border-4 border-purple-500 z-10 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.6)]"
                                    >
                                        {index === 0 ? <Flag className="w-6 h-6 text-white" /> :
                                            index === phases.length - 1 ? <Award className="w-6 h-6 text-yellow-400" /> :
                                                index % 2 === 0 ? <Zap className="w-6 h-6 text-yellow-300" /> :
                                                    <Star className="w-6 h-6 text-purple-300" />}
                                    </motion.div>

                                    {/* Connecting Pulse Effect */}
                                    <div className="absolute w-20 h-20 rounded-full bg-purple-500/20 animate-ping -z-10" />
                                </div>

                                {/* Spacer for layout balance */}
                                <div className="w-5/12" />
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

