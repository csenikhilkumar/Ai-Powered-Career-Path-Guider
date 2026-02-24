import { Card } from '@/components/ui/Card';
import { ArrowRight, Video } from 'lucide-react';

export function PromoCard() {
    return (
        <Card className="flex flex-col justify-between p-6">
            <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                    <Video className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700 dark:bg-green-900/20 dark:text-green-400">FREE</span>
            </div>

            <div className="mt-4">
                <h3 className="font-bold text-neutral-900 dark:text-white">Mock Interview</h3>
                <p className="mt-1 text-xs text-neutral-500">Practice with AI to ace your next job interview.</p>
            </div>

            <button className="mt-4 flex items-center text-sm font-bold text-primary-600 hover:underline">
                Start Session <ArrowRight className="ml-1 h-4 w-4" />
            </button>
        </Card>
    );
}
