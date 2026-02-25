import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, Bell, Shield, LogOut, Save, Lock, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/api/auth';
import { userApi, UserProfile } from '@/api/user';
import { motion } from 'framer-motion';

export default function Settings() {
    const { logout } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [message, setMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' });
    const [activeTab, setActiveTab] = useState('profile');
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await userApi.getProfile();
                setProfile(data);
            } catch (err) {
                console.error("Failed to load profile", err);
                // Mock Fallback for UI testing
                setProfile({
                    id: '1',
                    email: 'demo@pathguide.ai',
                    firstName: 'Demo',
                    lastName: 'User',
                    bio: 'Passionate learner exploring AI career paths.',
                    preferences: {}
                } as any);
            }
        };
        loadProfile();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        setIsLoading(true);
        try {
            const updated = await userApi.updateProfile(profile);
            setProfile(updated);
            setMessage('Profile updated successfully');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage({ text: '', type: '' });

        if (passwords.new !== passwords.confirm) {
            setPasswordMessage({ text: 'New passwords do not match', type: 'error' });
            return;
        }

        if (passwords.new.length < 6) {
            setPasswordMessage({ text: 'New password must be at least 6 characters', type: 'error' });
            return;
        }

        setIsChangingPassword(true);
        try {
            await authApi.changePassword(passwords.current, passwords.new);
            setPasswordMessage({ text: 'Password successfully changed', type: 'success' });
            setPasswords({ current: '', new: '', confirm: '' });
            setTimeout(() => setPasswordMessage({ text: '', type: '' }), 4000);
        } catch (err: any) {
            setPasswordMessage({
                text: err.response?.data?.message || 'Failed to change password. Please check your current password.',
                type: 'error'
            });
        } finally {
            setIsChangingPassword(false);
        }
    };

    if (!profile) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />
                    <p className="text-purple-300">Loading settings...</p>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-purple-500/20">
                        <User className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-white">Settings</h1>
                        <p className="text-purple-300">Manage your profile and preferences</p>
                    </div>
                </div>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-4">
                {/* Sidebar Navigation */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-1"
                >
                    <div className="glass rounded-2xl p-4 space-y-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/30'
                                        : 'text-purple-300 hover:bg-white/5'
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            );
                        })}

                        <div className="my-2 border-t border-white/10" />

                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
                        >
                            <LogOut className="h-5 w-5" />
                            <span className="font-medium">Log out</span>
                        </button>
                    </div>
                </motion.div>

                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-3"
                >
                    {activeTab === 'profile' && (
                        <div className="glass rounded-2xl p-8 space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-xl bg-blue-500/20">
                                    <User className="h-5 w-5 text-blue-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                            </div>

                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium text-purple-200 mb-2 block">First Name</label>
                                        <Input
                                            value={profile.firstName}
                                            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                            className="bg-white/5 border-white/10 text-white placeholder:text-purple-300/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-purple-200 mb-2 block">Last Name</label>
                                        <Input
                                            value={profile.lastName}
                                            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                            className="bg-white/5 border-white/10 text-white placeholder:text-purple-300/50"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-purple-200 mb-2 block">Email</label>
                                    <Input
                                        type="email"
                                        value={profile.email}
                                        disabled
                                        className="bg-white/5 border-white/10 text-purple-300 opacity-60"
                                    />
                                    <p className="text-xs text-purple-400 mt-1">Email cannot be changed</p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-purple-200 mb-2 block">Bio</label>
                                    <textarea
                                        className="flex min-h-[120px] w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-purple-300/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 transition-all"
                                        value={profile.bio || ''}
                                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                        placeholder="Tell us about yourself and your career goals..."
                                    />
                                </div>

                                {message && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2 rounded-xl glass-strong p-4 text-sm border border-emerald-500/30"
                                    >
                                        <Check className="h-4 w-4 text-emerald-400" />
                                        <span className="text-emerald-300">{message}</span>
                                    </motion.div>
                                )}

                                <div className="flex justify-end pt-4">
                                    <Button
                                        type="submit"
                                        loading={isLoading}
                                        className="gradient-accent shadow-lg shadow-purple-500/30"
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="glass rounded-2xl p-8 space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-xl bg-amber-500/20">
                                    <Bell className="h-5 w-5 text-amber-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Notification Preferences</h2>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { title: 'Career Recommendations', description: 'Get notified about new career matches' },
                                    { title: 'Milestone Achievements', description: 'Celebrate your progress and accomplishments' },
                                    { title: 'Weekly Insights', description: 'Receive weekly AI-powered career insights' },
                                    { title: 'Learning Reminders', description: 'Stay on track with your learning goals' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-xl glass-light border border-white/5">
                                        <div>
                                            <div className="font-semibold text-white mb-1">{item.title}</div>
                                            <div className="text-sm text-purple-300">{item.description}</div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-purple-600"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="glass rounded-2xl p-8 space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-xl bg-emerald-500/20">
                                    <Shield className="h-5 w-5 text-emerald-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Security Settings</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="p-6 rounded-xl glass-light border border-white/5">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-xl bg-blue-500/20 flex-shrink-0">
                                            <Lock className="h-6 w-6 text-blue-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-white mb-2">Password</h3>
                                            <p className="text-sm text-purple-300 mb-4">Update your password to keep your account secure</p>

                                            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md mt-4">
                                                <div>
                                                    <label className="text-xs font-medium text-purple-200 mb-1 block">Current Password</label>
                                                    <Input
                                                        type="password"
                                                        value={passwords.current}
                                                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                                        placeholder="Enter current password"
                                                        className="bg-white/5 border-white/10 text-white placeholder:text-purple-300/50"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-medium text-purple-200 mb-1 block">New Password</label>
                                                    <Input
                                                        type="password"
                                                        value={passwords.new}
                                                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                                        placeholder="Create new password"
                                                        className="bg-white/5 border-white/10 text-white placeholder:text-purple-300/50"
                                                        required
                                                        minLength={6}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-medium text-purple-200 mb-1 block">Confirm New Password</label>
                                                    <Input
                                                        type="password"
                                                        value={passwords.confirm}
                                                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                                        placeholder="Confirm new password"
                                                        className="bg-white/5 border-white/10 text-white placeholder:text-purple-300/50"
                                                        required
                                                        minLength={6}
                                                    />
                                                </div>

                                                {passwordMessage.text && (
                                                    <div className={`p-3 rounded-lg text-sm border ${passwordMessage.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border-red-500/30 text-red-300'}`}>
                                                        {passwordMessage.text}
                                                    </div>
                                                )}

                                                <Button
                                                    type="submit"
                                                    loading={isChangingPassword}
                                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white mt-2"
                                                >
                                                    Update Password
                                                </Button>
                                            </form>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 rounded-xl glass-light border border-emerald-500/20">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-xl bg-emerald-500/20 flex-shrink-0">
                                            <Shield className="h-6 w-6 text-emerald-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-white mb-2">Data Privacy</h3>
                                            <p className="text-sm text-purple-300 mb-3">Your data is encrypted and secure</p>
                                            <ul className="space-y-2 text-sm text-purple-200">
                                                <li className="flex items-center gap-2">
                                                    <Check className="h-4 w-4 text-emerald-400" />
                                                    256-bit encryption
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <Check className="h-4 w-4 text-emerald-400" />
                                                    GDPR compliant
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <Check className="h-4 w-4 text-emerald-400" />
                                                    Regular security audits
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
