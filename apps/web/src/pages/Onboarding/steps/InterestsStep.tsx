import { cn } from '@/utils/cn';

const INTERESTS = [
    'Web Development',
    'Mobile Apps',
    'Artificial Intelligence',
    'Data Science',
    'Product Design',
    'Cybersecurity',
    'Cloud Computing',
    'Blockchain',
    'Game Development',
    'DevOps',
];

interface InterestsStepProps {
    selectedInterests: string[];
    onChange: (interests: string[]) => void;
}

export function InterestsStep({ selectedInterests, onChange }: InterestsStepProps) {
    const toggleInterest = (interest: string) => {
        if (selectedInterests.includes(interest)) {
            onChange(selectedInterests.filter((i) => i !== interest));
        } else {
            onChange([...selectedInterests, interest]);
        }
    };

    return (
        <div className="space-y-6">
            <p className="text-neutral-600 dark:text-neutral-400">
                What fields are you most interested in exploring?
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {INTERESTS.map((interest) => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                        <button
                            key={interest}
                            onClick={() => toggleInterest(interest)}
                            className={cn(
                                'rounded-xl border p-4 text-sm font-medium transition-all text-left',
                                isSelected
                                    ? 'border-primary-600 bg-primary-50 text-primary-600 dark:border-primary-500 dark:bg-primary-900/20 dark:text-primary-400'
                                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-primary-200 hover:bg-neutral-50 dark:border-dark-border dark:bg-dark-surface dark:text-neutral-400 dark:hover:border-primary-900'
                            )}
                        >
                            {interest}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
