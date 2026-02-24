import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CareerFilters as Filters } from '@/types/career';
import { X } from 'lucide-react';

interface CareerFiltersProps {
    filters: Filters;
    onFilterChange: (filters: Filters) => void;
    onReset: () => void;
}

const CATEGORIES = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Marketing',
    'Design',
    'Sales',
    'Engineering',
];

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

export function CareerFilters({ filters, onFilterChange, onReset }: CareerFiltersProps) {
    const [localFilters, setLocalFilters] = useState<Filters>(filters);

    const handleCategoryChange = (category: string) => {
        const newFilters = {
            ...localFilters,
            category: localFilters.category === category ? undefined : category,
        };
        setLocalFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleDifficultyChange = (difficulty: string) => {
        const newFilters = {
            ...localFilters,
            difficulty: localFilters.difficulty === difficulty ? undefined : difficulty,
        };
        setLocalFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleSalaryChange = (min?: number, max?: number) => {
        const newFilters = { ...localFilters, minSalary: min, maxSalary: max };
        setLocalFilters(newFilters);
        onFilterChange(newFilters);
    };

    const activeFilterCount = [
        filters.category,
        filters.difficulty,
        filters.minSalary,
        filters.maxSalary,
    ].filter(Boolean).length;

    return (
        <Card className="sticky top-6">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Filters</CardTitle>
                    {activeFilterCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={onReset}>
                            <X className="mr-1 h-4 w-4" />
                            Clear ({activeFilterCount})
                        </Button>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Category Filter */}
                <div>
                    <h4 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-white">
                        Category
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((category) => (
                            <Badge
                                key={category}
                                variant={localFilters.category === category ? 'default' : 'outline'}
                                className="cursor-pointer transition-all hover:scale-105"
                                onClick={() => handleCategoryChange(category)}
                            >
                                {category}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Difficulty Filter */}
                <div>
                    <h4 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-white">
                        Difficulty Level
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {DIFFICULTIES.map((difficulty) => (
                            <Badge
                                key={difficulty}
                                variant={localFilters.difficulty === difficulty ? 'default' : 'outline'}
                                className="cursor-pointer transition-all hover:scale-105"
                                onClick={() => handleDifficultyChange(difficulty)}
                            >
                                {difficulty}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Salary Range Filter */}
                <div>
                    <h4 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-white">
                        Salary Range
                    </h4>
                    <div className="space-y-2">
                        {[
                            { label: 'Any', min: undefined, max: undefined },
                            { label: '$50k - $75k', min: 50000, max: 75000 },
                            { label: '$75k - $100k', min: 75000, max: 100000 },
                            { label: '$100k - $150k', min: 100000, max: 150000 },
                            { label: '$150k+', min: 150000, max: undefined },
                        ].map((range) => (
                            <button
                                key={range.label}
                                onClick={() => handleSalaryChange(range.min, range.max)}
                                className={`w-full rounded-lg border px-4 py-2 text-left text-sm transition-all ${localFilters.minSalary === range.min && localFilters.maxSalary === range.max
                                        ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/20'
                                        : 'border-neutral-200 hover:border-neutral-300 dark:border-dark-border dark:hover:border-neutral-600'
                                    }`}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
