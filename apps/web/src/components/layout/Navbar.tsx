import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Bell, Search, Sun, Moon, Sparkles } from 'lucide-react';
import { useUi } from '@/context/UiContext';

export function Navbar() {
    const { user } = useAuth();
    const { theme, setTheme } = useTheme();
    const { openAiModal } = useUi();

    return (
        <header className="flex h-20 items-center justify-between border-b border-white/10 glass-strong px-8 relative z-20">
            {/* ... search ... */}
            <div className="flex flex-1 items-center gap-4">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-300" />
                    <input
                        type="text"
                        placeholder="Search careers, skills, or paths..."
                        className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white placeholder-purple-300/50 outline-none transition-all focus:border-purple-500/50 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/20"
                    />
                </div>
                <Button
                    onClick={openAiModal}
                    className="hidden md:flex ml-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/25 border-0 rounded-xl"
                >
                    <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                    AI Assistant
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-white/10 text-purple-200 hover:text-white"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                    {theme === 'dark' ? (
                        <Sun className="h-5 w-5" />
                    ) : (
                        <Moon className="h-5 w-5" />
                    )}
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-purple-200 hover:text-white">
                    <Bell className="h-5 w-5" />
                </Button>

                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-white">
                            {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-purple-300">{user?.role || 'Explorer'}</p>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20">
                        {user?.firstName?.[0]}
                    </div>
                </div>
            </div>
        </header>
    );
}
