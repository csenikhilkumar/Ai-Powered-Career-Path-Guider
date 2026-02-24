import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import {
    ArrowRight,
    Sparkles,
    Target,
    Brain,
    TrendingUp,
    CheckCircle2,
    Zap,
    Users,
    Lock,
    Lightbulb,
    BarChart3,
    Compass
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen overflow-hidden gradient-surface">
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
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl"
                />
            </div>

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
                <div className="container mx-auto flex h-20 items-center justify-between px-6">
                    <div className="flex items-center gap-3">
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                            className="relative h-10 w-10 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 shadow-lg shadow-blue-500/50"
                        >
                            <Brain className="h-5 w-5 text-white" />
                        </motion.div>
                        <span className="text-2xl font-bold text-gradient-light">PathGuide AI</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-purple-200">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
                        <a href="#testimonials" className="hover:text-white transition-colors">Success Stories</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => navigate('/auth/login')} className="hidden sm:inline-flex text-white hover:bg-white/10">
                            Sign In
                        </Button>
                        <Button size="sm" onClick={() => navigate('/onboarding')} className="gradient-accent shadow-lg shadow-purple-500/50">
                            Get Started Free
                        </Button>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 pt-32 pb-20">
                {/* Hero Section */}
                <section className="container mx-auto px-6 mb-32">
                    <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            {/* Trust Badge */}
                            <div className="inline-flex items-center gap-2 rounded-full glass-strong px-5 py-2 text-sm font-medium text-blue-300 mb-8 border border-blue-500/30">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                Trusted by 10,000+ Career Seekers
                            </div>

                            {/* Hero Headline */}
                            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight text-gradient-light mb-6">
                                Your Future,<br />
                                Intelligently Guided
                            </h1>

                            {/* Subheadline */}
                            <p className="text-xl md:text-2xl text-purple-200 mb-4 max-w-3xl leading-relaxed">
                                Stop guessing about your career. Our AI-powered platform analyzes your unique strengths, interests, and aspirations to create a personalized roadmap for success.
                            </p>

                            <p className="text-lg text-purple-300/70 mb-10 max-w-2xl">
                                Make conscious choices. Shape your destiny. Let AI illuminate the path.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                                <Button
                                    size="lg"
                                    className="h-14 px-10 text-lg gradient-accent shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all hover:scale-105"
                                    onClick={() => navigate('/onboarding')}
                                >
                                    <Sparkles className="mr-2 h-5 w-5" />
                                    Start Your Journey
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="h-14 px-10 text-lg glass hover:bg-white/10 text-white border-white/20"
                                >
                                    <BarChart3 className="mr-2 h-5 w-5" />
                                    See How It Works
                                </Button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-purple-300">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-teal-400" />
                                    <span>Free to start</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Lock className="h-5 w-5 text-blue-400" />
                                    <span>Your data is secure</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-amber-400" />
                                    <span>Results in minutes</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Hero Visual - AI Dashboard Preview */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="mt-20 w-full max-w-6xl"
                        >
                            <div className="relative rounded-3xl glass-strong p-2 shadow-2xl shadow-purple-500/20 ai-glow">
                                <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 overflow-hidden">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {[
                                            { title: "AI Career Match", value: "95%", color: "from-blue-500 to-purple-500" },
                                            { title: "Skills Analyzed", value: "24", color: "from-purple-500 to-pink-500" },
                                            { title: "Career Paths", value: "12", color: "from-teal-500 to-emerald-500" }
                                        ].map((stat, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.5 + i * 0.1 }}
                                                className="glass rounded-xl p-6"
                                            >
                                                <div className="text-sm text-purple-300 mb-2">{stat.title}</div>
                                                <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                                                    {stat.value}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="container mx-auto px-6 py-20">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Clarity. Trust. Discovery.
                            </h2>
                            <p className="text-xl text-purple-200">
                                Three pillars that guide your journey to career success
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Lightbulb,
                                title: "AI-Powered Clarity",
                                description: "Cut through confusion with intelligent insights tailored to your unique profile. Know exactly what steps to take next.",
                                color: "from-blue-500 to-blue-600",
                                iconBg: "bg-blue-500/20",
                                iconColor: "text-blue-400"
                            },
                            {
                                icon: Lock,
                                title: "Trustworthy Guidance",
                                description: "Built on proven career science and data from thousands of successful professionals. Your journey is in safe hands.",
                                color: "from-purple-500 to-purple-600",
                                iconBg: "bg-purple-500/20",
                                iconColor: "text-purple-400"
                            },
                            {
                                icon: Compass,
                                title: "Self-Discovery Path",
                                description: "Uncover hidden talents and passions you never knew you had. Your career should reflect who you truly are.",
                                color: "from-teal-500 to-teal-600",
                                iconBg: "bg-teal-500/20",
                                iconColor: "text-teal-400"
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -10 }}
                                className="group card-glass card-hover p-8"
                            >
                                <div className={`inline-flex p-4 rounded-2xl ${feature.iconBg} mb-6 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                                <p className="text-purple-200 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* How It Works */}
                <section id="how-it-works" className="container mx-auto px-6 py-20">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Your Journey in 3 Simple Steps
                        </h2>
                        <p className="text-xl text-purple-200">
                            From discovery to success, guided by AI every step of the way
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        {[
                            {
                                step: "01",
                                title: "Tell Us About Yourself",
                                description: "Share your interests, skills, experiences, and aspirations. Our AI listens and understands.",
                                icon: Users
                            },
                            {
                                step: "02",
                                title: "Get Your Personalized Roadmap",
                                description: "Receive a crystal-clear career path tailored to your unique profile, complete with actionable steps.",
                                icon: Target
                            },
                            {
                                step: "03",
                                title: "Track Your Progress",
                                description: "Watch yourself grow with real-time insights, skill development tracking, and milestone celebrations.",
                                icon: TrendingUp
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="flex gap-6 mb-12 group"
                            >
                                <div className="flex-shrink-0">
                                    <div className="journey-node-active w-16 h-16">
                                        <item.icon className="h-7 w-7 text-white" />
                                    </div>
                                </div>
                                <div className="flex-1 pt-2">
                                    <div className="text-sm font-bold text-purple-400 mb-2">STEP {item.step}</div>
                                    <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                                    <p className="text-lg text-purple-200 leading-relaxed">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Success Stories */}
                <section id="testimonials" className="container mx-auto px-6 py-20">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Real People. Real Success.
                        </h2>
                        <p className="text-xl text-purple-200">
                            Join thousands who found their calling with PathGuide AI
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                quote: "PathGuide helped me discover I'm meant to be a UX designer, not just a frontend developer. The AI identified skills I didn't even know I had!",
                                author: "Sarah Chen",
                                role: "UX Designer @ Google",
                                avatar: "SC",
                                color: "from-blue-500 to-purple-500"
                            },
                            {
                                quote: "I was stuck in a job I hated for 5 years. Within 3 months of using PathGuide, I landed my dream role as a Product Manager.",
                                author: "Marcus Johnson",
                                role: "Product Manager @ Microsoft",
                                avatar: "MJ",
                                color: "from-purple-500 to-pink-500"
                            },
                            {
                                quote: "The personalized roadmap was a game-changer. Instead of feeling lost, I now have a clear path forward with tangible milestones.",
                                author: "Elena Rodriguez",
                                role: "Data Scientist @ Netflix",
                                avatar: "ER",
                                color: "from-teal-500 to-emerald-500"
                            }
                        ].map((story, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="card-glass p-8"
                            >
                                <div className="flex gap-1 mb-6">
                                    {[...Array(5)].map((_, j) => (
                                        <Sparkles key={j} className="h-4 w-4 text-amber-400 fill-amber-400" />
                                    ))}
                                </div>
                                <p className="text-purple-100 mb-8 leading-relaxed text-lg italic">"{story.quote}"</p>
                                <div className="flex items-center gap-4">
                                    <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${story.color} flex items-center justify-center text-white font-bold`}>
                                        {story.avatar}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">{story.author}</div>
                                        <div className="text-sm text-purple-300">{story.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Stats Section */}
                <section className="container mx-auto px-6 py-20 border-t border-white/10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: '10k+', label: 'Active Users' },
                            { value: '95%', label: 'Match Accuracy' },
                            { value: '500+', label: 'Career Paths' },
                            { value: '24/7', label: 'AI Guidance' },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="text-5xl font-bold text-gradient-accent mb-2">{stat.value}</div>
                                <div className="text-sm font-medium text-purple-300">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Final CTA */}
                <section className="container mx-auto px-6 py-20">
                    <div className="relative rounded-3xl overflow-hidden glass-strong p-1">
                        <div className="relative z-10 px-8 py-20 text-center bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                                    Ready to Shape Your Future?
                                </h2>
                                <p className="text-xl text-purple-200 mb-10 max-w-2xl mx-auto">
                                    Join thousands who've discovered their true potential. Your perfect career is waiting.
                                </p>
                                <Button
                                    size="lg"
                                    className="h-16 px-12 text-lg gradient-accent shadow-2xl shadow-purple-500/50 hover:scale-110 transition-all"
                                    onClick={() => navigate('/onboarding')}
                                >
                                    <Sparkles className="mr-2 h-6 w-6" />
                                    Start Free Today
                                    <ArrowRight className="ml-2 h-6 w-6" />
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/10 py-12">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center">
                                <Brain className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-bold text-white">PathGuide AI</span>
                        </div>
                        <div className="text-sm text-purple-300">
                            © 2024 PathGuide AI. Empowering careers through intelligence.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
