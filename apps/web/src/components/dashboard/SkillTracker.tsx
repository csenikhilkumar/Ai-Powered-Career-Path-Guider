import { Card } from '@/components/ui/Card';

const skills = [
    { name: 'Design', percent: 46, color: 'bg-emerald-400' },
    { name: 'Management', percent: 12, color: 'bg-blue-400' },
    { name: 'Software', percent: 27, color: 'bg-yellow-400' },
];

export function SkillTracker() {
    return (
        <Card className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="font-bold text-neutral-900 dark:text-white">Skill tracker</h3>
            </div>

            <div className="space-y-6">
                {skills.map((skill) => (
                    <div key={skill.name} className="flex items-center gap-4">
                        <div className="w-24 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                            {skill.name}
                        </div>
                        <div className="flex-1">
                            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-dark-hover">
                                <div
                                    className={`h-full rounded-full ${skill.color}`}
                                    style={{ width: `${skill.percent}%` }}
                                />
                            </div>
                        </div>
                        <div className="w-8 text-right text-xs font-bold text-neutral-900 dark:text-white">
                            {skill.percent}%
                        </div>
                    </div>
                ))}
            </div>

            <button className="mt-6 w-full text-center text-xs font-medium text-blue-500 hover:text-blue-600">
                + view 3 more skills
            </button>
        </Card>
    );
}
