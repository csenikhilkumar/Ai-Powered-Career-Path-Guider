import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MatchScoreBadge } from './MatchScoreBadge';
import { CareerPath } from '@/types/career';
import { TrendingUp, DollarSign, BookOpen, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface CareerCardProps {
    career: CareerPath;
    matchScore?: number;
    index?: number;
}

export function CareerCard({ career, matchScore, index = 0 }: CareerCardProps) {
    const navigate = useNavigate();

    const formatSalary = (salary: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(salary);
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Beginner':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'Intermediate':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'Advanced':
                return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
        >
            <Card
                className="group h-full cursor-pointer hover:shadow-lg dark:hover:shadow-primary-500/10 transition-all duration-300"
                onClick={() => navigate(`/dashboard/career/${career.id}`)}
            >
                <CardHeader>
                    <div className="mb-4 flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-900/20 dark:to-pink-900/10">
                            <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        {matchScore !== undefined && <MatchScoreBadge score={matchScore} />}
                    </div>

                    <CardTitle className="group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {career.title}
                    </CardTitle>

                    <p className="mt-2 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
                        {career.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                        <Badge className={getDifficultyColor(career.difficulty)}>
                            {career.difficulty}
                        </Badge>
                        <Badge variant="outline">{career.category}</Badge>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="space-y-3 border-t border-neutral-200 pt-4 dark:border-white/10">
                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                                <DollarSign className="h-4 w-4" />
                                Avg. Salary
                            </span>
                            <span className="font-semibold text-neutral-900 dark:text-white">
                                {formatSalary(career.avgSalary)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                                <TrendingUp className="h-4 w-4" />
                                Growth Rate
                            </span>
                            <span className="font-semibold text-green-600 dark:text-green-400">
                                +{career.growthRate}%
                            </span>
                        </div>

                        {career.requiredSkills && career.requiredSkills.length > 0 && (
                            <div className="pt-2">
                                <p className="mb-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                    Key Skills
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    {career.requiredSkills.slice(0, 3).map((skill, i) => (
                                        <span
                                            key={i}
                                            className="rounded-md bg-neutral-100 px-2 py-1 text-xs text-neutral-700 dark:bg-white/10 dark:text-neutral-300"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                    {career.requiredSkills.length > 3 && (
                                        <span className="rounded-md bg-neutral-100 px-2 py-1 text-xs text-neutral-500 dark:bg-white/10">
                                            +{career.requiredSkills.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <Button
                        variant="ghost"
                        className="mt-4 w-full group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20"
                    >
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
}
