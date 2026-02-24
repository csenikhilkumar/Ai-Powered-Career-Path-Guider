import { cn } from '@/utils/cn';

interface MatchScoreBadgeProps {
    score: number;
    className?: string;
}

export function MatchScoreBadge({ score, className }: MatchScoreBadgeProps) {
    const getScoreColor = (score: number) => {
        if (score >= 90) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
        if (score >= 70) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
        if (score >= 50) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    };

    return (
        <div
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold',
                getScoreColor(score),
                className
            )}
        >
            <div className="h-2 w-2 rounded-full bg-current" />
            {score}% match
        </div>
    );
}
