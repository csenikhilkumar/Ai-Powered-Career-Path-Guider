import { Card } from '@/components/ui/Card';
import { cn } from '@/utils/cn';
import { TrendingUp } from 'lucide-react';

interface StatsWidgetProps {
    title: string;
    value: string | number;
    subtext: string;
    trend?: 'up' | 'down' | 'neutral';
    className?: string;
}

export function StatsWidget({ title, value, subtext, trend, className }: StatsWidgetProps) {
    return (
        <Card className={cn("flex flex-col justify-between p-6", className)}>
            <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-neutral-500">{title}</span>
                <span className="rounded-full bg-neutral-100 p-1 px-2 text-[10px] font-bold text-neutral-600 dark:bg-dark-hover dark:text-neutral-400">Details</span>
            </div>

            <div className="mt-4">
                <div className="flex items-end gap-2">
                    <h3 className="text-4xl font-bold text-neutral-900 dark:text-white">{value}</h3>
                    {trend === 'up' && (
                        <div className="mb-1 flex items-center text-xs font-medium text-green-500">
                            <TrendingUp className="mr-1 h-3 w-3" />
                            +12%
                        </div>
                    )}
                </div>
                <p className="mt-1 text-xs text-neutral-400">{subtext}</p>
            </div>

            {/* Mock Sparkline */}
            <div className="mt-4 flex h-8 items-end gap-1">
                {[40, 60, 45, 70, 50, 80, 65].map((h, i) => (
                    <div
                        key={i}
                        className="w-full rounded-t-sm bg-orange-100 dark:bg-orange-900/20"
                        style={{ height: `${h}%` }}
                    >
                        <div
                            className="w-full rounded-t-sm bg-orange-400"
                            style={{ height: '30%' }}
                        />
                    </div>
                ))}
            </div>
        </Card>
    );
}
