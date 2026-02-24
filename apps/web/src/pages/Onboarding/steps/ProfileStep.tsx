import { Input } from '@/components/ui/Input';
import { User, MapPin, Briefcase, GraduationCap } from 'lucide-react';

interface ProfileData {
    fullname: string;
    location: string;
    currentRole: string;
    education: string;
}

interface ProfileStepProps {
    data: ProfileData;
    updateData: (data: Partial<ProfileData>) => void;
}

export function ProfileStep({ data, updateData }: ProfileStepProps) {
    return (
        <div className="space-y-6">
            <Input
                label="Full Name"
                placeholder="e.g. Alex Morgan"
                icon={<User className="h-4 w-4" />}
                value={data.fullname}
                onChange={(e) => updateData({ fullname: e.target.value })}
            />
            <Input
                label="Current Location"
                placeholder="e.g. San Francisco, CA"
                icon={<MapPin className="h-4 w-4" />}
                value={data.location}
                onChange={(e) => updateData({ location: e.target.value })}
            />
            <div className="grid gap-6 md:grid-cols-2">
                <Input
                    label="Current Role"
                    placeholder="e.g. Student / Developer"
                    icon={<Briefcase className="h-4 w-4" />}
                    value={data.currentRole}
                    onChange={(e) => updateData({ currentRole: e.target.value })}
                />
                <Input
                    label="Education Level"
                    placeholder="e.g. Bachelor's Degree"
                    icon={<GraduationCap className="h-4 w-4" />}
                    value={data.education}
                    onChange={(e) => updateData({ education: e.target.value })}
                />
            </div>
        </div>
    );
}
