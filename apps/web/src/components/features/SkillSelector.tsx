import { cn } from '@/utils/cn';
import { Check, Plus } from 'lucide-react';

interface Skill {
    id: string;
    name: string;
    category: string;
}

interface SkillSelectorProps {
    skills: Skill[];
    selectedSkills: string[];
    onChange: (skills: string[]) => void;
}

export function SkillSelector({ skills, selectedSkills, onChange }: SkillSelectorProps) {
    const toggleSkill = (skillId: string) => {
        if (selectedSkills.includes(skillId)) {
            onChange(selectedSkills.filter((id) => id !== skillId));
        } else {
            onChange([...selectedSkills, skillId]);
        }
    };

    return (
        <div className="flex flex-wrap gap-2">
            {skills.map((skill) => {
                const isSelected = selectedSkills.includes(skill.id);
                return (
                    <button
                        key={skill.id}
                        onClick={() => toggleSkill(skill.id)}
                        className={cn(
                            'group flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all',
                            isSelected
                                ? 'border-primary-600 bg-primary-50 text-primary-600 dark:border-primary-500 dark:bg-primary-900/20 dark:text-primary-400'
                                : 'border-neutral-200 bg-white text-neutral-600 hover:border-primary-200 hover:bg-neutral-50 dark:border-dark-border dark:bg-dark-surface dark:text-neutral-400 dark:hover:border-primary-900'
                        )}
                    >
                        {isSelected ? (
                            <Check className="h-3.5 w-3.5" />
                        ) : (
                            <Plus className="h-3.5 w-3.5 text-neutral-400 transition-colors group-hover:text-primary-500" />
                        )}
                        {skill.name}
                    </button>
                );
            })}
        </div>
    );
}
