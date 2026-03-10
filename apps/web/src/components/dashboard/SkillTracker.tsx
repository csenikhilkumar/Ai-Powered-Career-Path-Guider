import { Card } from '@/components/ui/Card';

interface Skill {
    name: string;
    percent: number;
    color: string;
}

const defaultSkills = [
    { name: 'Design', percent: 46, color: 'bg-emerald-400' },
    { name: 'Management', percent: 12, color: 'bg-blue-400' },
    { name: 'Software', percent: 27, color: 'bg-yellow-400' },
];

export function SkillTracker({ skills = defaultSkills }: { skills?: Skill[] }) {
    return (
        <Card className="p-6 bg-white/5 border-none dark:bg-black/20 text-white">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="font-bold text-white">Skill tracker</h3>
            </div>

            <div className="space-y-6">
                {skills.map((skill) => (
                    <div key={skill.name} className="flex items-center gap-4">
                        <div className="w-24 text-sm font-medium text-neutral-300">
                            {skill.name}
                        </div>
                        <div className="flex-1">
                            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10 dark:bg-white/5">
                                <div
                                    className={`h-full rounded-full ${skill.color}`}
                                    style={{ width: `${skill.percent}%` }}
                                />
                            </div>
                        </div>
                        <div className="w-8 text-right text-xs font-bold text-white">
                            {skill.percent}%
                        </div>
                    </div>
                ))}
            </div>

            <button className="mt-6 w-full text-center text-xs font-medium text-blue-500 hover:text-blue-600">
                + view all skills
            </button>
        </Card>
    );
}
