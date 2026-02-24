import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface JobCardProps {
    title?: string;
    company?: string;
    location?: string;
    salary?: string;
    type?: string;
}

export function JobCard({
    title = "Senior Product Designer",
    company = "Google",
    location = "Remote",
    salary = "$120k-160k",
    type = "Full-time"
}: JobCardProps) {
    return (
        <Card className="relative overflow-hidden bg-neutral-900 p-6 text-white dark:bg-black">
            <div className="mb-4 flex justify-between">
                <span className="text-xs font-medium opacity-60">Job Feed</span>
                <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-medium">New</span>
            </div>

            <div className="mb-6 flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white p-2 text-black">
                    <span className="font-bold">{company.charAt(0)}</span>
                </div>
                <div>
                    <h3 className="font-bold leading-tight">{title}</h3>
                    <p className="text-sm opacity-60">{company} • {location}</p>
                </div>
            </div>

            <div className="mb-6 flex gap-2">
                <span className="rounded-full border border-white/20 px-3 py-1 text-xs">{salary}</span>
                <span className="rounded-full border border-white/20 px-3 py-1 text-xs">{type}</span>
            </div>

            <Button className="w-full bg-white text-black hover:bg-neutral-200">
                Apply Now
            </Button>
        </Card>
    );
}
