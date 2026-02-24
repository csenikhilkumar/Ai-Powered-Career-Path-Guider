import { Card } from '@/components/ui/Card';
import { MoreHorizontal } from 'lucide-react';

const courses = [
    {
        title: 'Figma Pro',
        desc: 'Advanced prototyping techniques',
        bg: 'bg-pink-50 dark:bg-pink-900/10',
        icon: '🎨',
        tags: ['Design', 'Prototyping']
    },
    {
        title: 'UI Design',
        desc: 'Design interfaces that engage',
        bg: 'bg-purple-50 dark:bg-purple-900/10',
        icon: '✨',
        tags: ['UI', 'Graphics']
    },
    {
        title: 'Sketch Advance',
        desc: 'Unlock the power of symbols',
        bg: 'bg-yellow-50 dark:bg-yellow-900/10',
        icon: '💎',
        tags: ['Sketch', 'Vector']
    }
];

export function CourseRail() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-neutral-900 dark:text-white">Course Recommendations</h3>
                <button className="text-xs font-medium text-blue-500">View all</button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map(course => (
                    <Card key={course.title} className={`${course.bg} border-none p-5 transition-transform hover:scale-[1.02]`}>
                        <div className="mb-3 flex items-start justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl shadow-sm dark:bg-dark-surface">
                                {course.icon}
                            </div>
                            <button className="text-neutral-400 hover:text-neutral-600">
                                <MoreHorizontal className="h-5 w-5" />
                            </button>
                        </div>

                        <h4 className="font-bold text-neutral-900 dark:text-white">{course.title}</h4>
                        <p className="mb-4 text-xs text-neutral-500 dark:text-neutral-400">{course.desc}</p>

                        <div className="flex gap-2">
                            {course.tags.map(tag => (
                                <span key={tag} className="rounded-md bg-white/60 px-2 py-1 text-[10px] font-bold text-neutral-600 dark:bg-black/20 dark:text-neutral-300">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
