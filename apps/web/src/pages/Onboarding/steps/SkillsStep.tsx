import { SkillSelector } from '@/components/features/SkillSelector';

const AVAILABLE_SKILLS = [
    { id: 'js', name: 'JavaScript', category: 'Tech' },
    { id: 'ts', name: 'TypeScript', category: 'Tech' },
    { id: 'react', name: 'React', category: 'Tech' },
    { id: 'node', name: 'Node.js', category: 'Tech' },
    { id: 'python', name: 'Python', category: 'Tech' },
    { id: 'design', name: 'UI/UX Design', category: 'Design' },
    { id: 'figma', name: 'Figma', category: 'Design' },
    { id: 'pm', name: 'Project Management', category: 'Business' },
    { id: 'marketing', name: 'Digital Marketing', category: 'Business' },
    { id: 'data', name: 'Data Analysis', category: 'Data' },
    { id: 'sql', name: 'SQL', category: 'Data' },
    { id: 'git', name: 'Git', category: 'Tech' },
];

interface SkillsStepProps {
    selectedSkills: string[];
    onChange: (skills: string[]) => void;
}

export function SkillsStep({ selectedSkills, onChange }: SkillsStepProps) {
    return (
        <div className="space-y-4">
            <p className="text-neutral-600 dark:text-neutral-400">
                Select the skills you already have or are learning.
            </p>
            <SkillSelector
                skills={AVAILABLE_SKILLS}
                selectedSkills={selectedSkills}
                onChange={onChange}
            />
        </div>
    );
}
