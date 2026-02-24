import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/api/auth';
import { ArrowLeft, Mail, Lock, User, AlertCircle, Brain, Sparkles, Target, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { signInWithGoogle, isFirebaseConfigured } from '@/config/firebase';

export default function Register() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            const response = await authApi.register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password
            });
            login(response.token, response.user);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to create account');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setIsGoogleLoading(true);

        try {
            const result = await signInWithGoogle();
            const user = result.user;

            const email = user.email || '';
            if (!email) {
                setError('Google account must have an email address.');
                return;
            }

            const idToken = await user.getIdToken();
            const displayName = user.displayName || '';
            const nameParts = displayName.trim().split(/\s+/);
            const firstName = nameParts[0] ?? '';
            const lastName = nameParts.slice(1).join(' ') ?? '';

            const response = await authApi.googleLogin({
                idToken,
                email,
                firstName: firstName || undefined,
                lastName: lastName || undefined,
            });

            login(response.token, response.user);
        } catch (err: unknown) {
            const e = err as { code?: string; message?: string; response?: { data?: { message?: string } } };
            if (e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request') {
                return;
            }
            const msg = e.response?.data?.message ?? e.message ?? 'Failed to sign in with Google. Please try again.';
            setError(msg);
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="relative flex min-h-screen gradient-surface">
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

            {/* Back Button */}
            <Button
                variant="ghost"
                className="absolute left-4 top-4 md:left-8 md:top-8 z-10 glass hover:bg-white/10 text-white border-white/10"
                onClick={() => navigate('/')}
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
            </Button>

            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center px-12">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-lg"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
                            <Brain className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-3xl font-bold text-gradient-light">PathGuide AI</span>
                    </div>

                    <h1 className="text-5xl font-bold text-white mb-6">
                        Begin Your Discovery
                    </h1>

                    <p className="text-xl text-purple-200 mb-12 leading-relaxed">
                        Join thousands who've found their perfect career path. Your journey to clarity and success starts here.
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3 glass rounded-2xl p-4">
                            <div className="p-2 rounded-xl bg-purple-500/20 flex-shrink-0">
                                <Sparkles className="h-5 w-5 text-purple-400" />
                            </div>
                            <div>
                                <div className="font-semibold text-white mb-1">AI-Powered Matching</div>
                                <div className="text-sm text-purple-200">Get personalized career recommendations in minutes</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 glass rounded-2xl p-4">
                            <div className="p-2 rounded-xl bg-teal-500/20 flex-shrink-0">
                                <Target className="h-5 w-5 text-teal-400" />
                            </div>
                            <div>
                                <div className="font-semibold text-white mb-1">Personalized Roadmap</div>
                                <div className="text-sm text-purple-200">Step-by-step guidance tailored to your goals</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 glass rounded-2xl p-4">
                            <div className="p-2 rounded-xl bg-blue-500/20 flex-shrink-0">
                                <Shield className="h-5 w-5 text-blue-400" />
                            </div>
                            <div>
                                <div className="font-semibold text-white mb-1">100% Free to Start</div>
                                <div className="text-sm text-purple-200">No credit card required. Ever.</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center px-4 py-12 lg:px-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    <div className="card-glass p-8 md:p-10">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="lg:hidden mx-auto mb-6 h-14 w-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
                                <Brain className="h-7 w-7 text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Create Your Account</h2>
                            <p className="text-purple-200">
                                Start your journey to career clarity
                            </p>
                        </div>

                        {/* Form */}
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    label="First name"
                                    required
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    icon={<User className="h-4 w-4" />}
                                    className="bg-white/5 border-white/10 text-white placeholder:text-purple-300/50"
                                />

                                <Input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    label="Last name"
                                    required
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="bg-white/5 border-white/10 text-white placeholder:text-purple-300/50"
                                />
                            </div>

                            <Input
                                id="email"
                                name="email"
                                type="email"
                                label="Email address"
                                autoComplete="email"
                                required
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                icon={<Mail className="h-4 w-4" />}
                                className="bg-white/5 border-white/10 text-white placeholder:text-purple-300/50"
                            />

                            <Input
                                id="password"
                                name="password"
                                type="password"
                                label="Password"
                                autoComplete="new-password"
                                required
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                icon={<Lock className="h-4 w-4" />}
                                className="bg-white/5 border-white/10 text-white placeholder:text-purple-300/50"
                            />

                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                label="Confirm password"
                                autoComplete="new-password"
                                required
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                icon={<Lock className="h-4 w-4" />}
                                className="bg-white/5 border-white/10 text-white placeholder:text-purple-300/50"
                            />

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2 rounded-xl glass-strong p-4 text-sm text-red-300 border border-red-500/30"
                                >
                                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                    {error}
                                </motion.div>
                            )}

                            <Button
                                className="w-full h-12 gradient-accent shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] transition-all"
                                type="submit"
                                loading={isLoading}
                            >
                                <Sparkles className="mr-2 h-4 w-4" />
                                {isLoading ? 'Creating account...' : 'Start Free Journey'}
                            </Button>

                            {/* Divider */}
                            <div className="relative flex items-center justify-center text-sm">
                                <div className="flex-1 border-t border-white/10" />
                                <span className="px-4 text-purple-300">OR</span>
                                <div className="flex-1 border-t border-white/10" />
                            </div>

                            {/* Google Sign In Button */}
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full h-12 bg-white hover:bg-gray-100 text-gray-900 border-white/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-60"
                                onClick={handleGoogleSignIn}
                                loading={isGoogleLoading}
                                disabled={isLoading || isGoogleLoading || !isFirebaseConfigured()}
                                title={!isFirebaseConfigured() ? 'Add Firebase config in apps/web/.env to enable Google sign-in' : undefined}
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                {isGoogleLoading ? 'Signing in...' : !isFirebaseConfigured() ? 'Google sign-in (not configured)' : 'Sign up with Google'}
                            </Button>

                            <p className="text-xs text-center text-purple-300 leading-relaxed">
                                By creating an account, you agree to our Terms of Service and Privacy Policy
                            </p>

                            <div className="text-center text-sm">
                                <span className="text-purple-300">Already have an account? </span>
                                <Link to="/auth/login" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                                    Sign in
                                </Link>
                            </div>
                        </form>

                        {/* Trust Badge */}
                        <div className="mt-8 pt-6 border-t border-white/10 text-center">
                            <div className="flex items-center justify-center gap-2 text-sm text-purple-300">
                                <Shield className="h-4 w-4 text-teal-400" />
                                <span>100% Free • No credit card required</span>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Trust Indicators */}
                    <div className="lg:hidden mt-8 space-y-3">
                        <div className="flex items-center gap-3 glass rounded-xl p-3 text-sm">
                            <Sparkles className="h-5 w-5 text-purple-400 flex-shrink-0" />
                            <span className="text-purple-200">AI-powered career matching in minutes</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
