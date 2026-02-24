import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, TrendingUp, DollarSign, Users, BookOpen, Clock, Sparkles } from 'lucide-react';
import { WavyRoadmap } from '@/components/features/WavyRoadmap';
import { careerApi, CareerPath as Career, RoadmapStep } from '@/api/career';

// Mock data for fallback
const MOCK_CAREER: Career = {
    id: 'mock-career',
    title: 'Senior Frontend Engineer',
    description: 'Lead frontend architecture and build scalable user interfaces using React and TypeScript. You will be responsible for setting technical direction, mentoring junior developers, and ensuring high performance and accessibility standards.',
    matchScore: 92,
    salary: '$120k - $160k',
    growth: 'High',
    demand: 'Very High',
    skills: ['React', 'TypeScript', 'System Design', 'Performance', 'Testing'],
    resources: [
        { title: 'Advanced React Patterns', type: 'Course', duration: '6h 30m' },
        { title: 'System Design Interview Guide', type: 'Book', duration: '350 pages' },
        { title: 'Web Performance Optimization', type: 'Workshop', duration: '4h' }
    ],
    // New fields
    category: 'Technology',
    avgSalary: 140000,
    growthRate: 18,
    difficulty: 'Advanced',
    requiredSkills: ['React', 'TypeScript', 'System Design', 'Performance', 'Testing']
};

const MOCK_ROADMAP: RoadmapStep[] = [
    {
        id: '1',
        order: 1,
        title: 'Master React Fundamentals',
        description: 'Hooks, Context, and Component patterns',
        status: 'completed',
        duration: '2 weeks',
        resources: ['React Documentation'],
        estimatedHours: 20
    },
    {
        id: '2',
        order: 2,
        title: 'Advanced TypeScript',
        description: 'Generics, Utility types, and Type inference',
        status: 'current',
        duration: '3 weeks',
        resources: ['TypeScript Handbook'],
        estimatedHours: 35
    },
    {
        id: '3',
        order: 3,
        title: 'System Design',
        description: 'Scalability, Performance and Architecture',
        status: 'locked',
        duration: '4 weeks',
        resources: ['System Design Primer'],
        estimatedHours: 40
    },
];

export default function CareerDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [career, setCareer] = useState<Career | null>(null);
    const [roadmap, setRoadmap] = useState<RoadmapStep[]>([]);
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Try to fetch real data
                if (id) {
                    try {
                        const careerData = await careerApi.getCareerById(id);
                        const roadmapData = await careerApi.getRoadmap(id);
                        setCareer({ ...MOCK_CAREER, ...careerData });
                        setRoadmap(roadmapData.length > 0 ? roadmapData : MOCK_ROADMAP);
                    } catch (err) {
                        console.warn('API fetch failed, falling back to mock data', err);
                        setCareer(MOCK_CAREER);
                        setRoadmap(MOCK_ROADMAP);
                    }
                } else {
                    setCareer(MOCK_CAREER);
                    setRoadmap(MOCK_ROADMAP);
                }
            } catch (error) {
                console.error("Error loading career details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleGenerateRoadmap = async () => {
        if (!career) return;
        setIsGenerating(true);

        try {
            // 1. Get user profile for personalization
            let userSkills: any[] = [];
            try {
                const { userApi } = await import('@/api/user');
                const profile = await userApi.getProfile();
                userSkills = profile.skills?.map(s => ({ skillName: s, proficiency: 'Beginner' })) || [];
            } catch (e) {
                console.warn("Could not fetch user profile for personalization", e);
            }

            // 2. Generate roadmap via AI
            const { AiInteraction } = await import('@/api/ai');
            const roadmapData = await AiInteraction.generateRoadmap({
                careerPathTitle: career.title,
                currentSkills: userSkills,
                targetSkills: career.skills || [],
                timeframe: '6 months' // Default
            });

            // 3. Navigate to roadmap page
            navigate('/dashboard/career-roadmap', {
                state: {
                    result: roadmapData,
                    careerTitle: career.title,
                    careerRecommendation: career,
                    userProfile: { name: 'User' } // Minimal fallback or use profile name
                }
            });

        } catch (error) {
            console.error("Failed to generate AI roadmap", error);
            // Ideally show error toast
        } finally {
            setIsGenerating(false);
        }
    };



    if (loading) {
        return <div className="p-8 text-center">Loading career path...</div>;
    }

    if (!career) {
        return <div className="p-8 text-center">Career not found</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">{career.title}</h1>
                    <p className="text-neutral-500">Career Path Details</p>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Main Content */}
                <div className="space-y-8 lg:col-span-2">
                    {/* Overview Card */}
                    <Card className="p-6">
                        <h2 className="mb-4 text-xl font-bold">Overview</h2>
                        <p className="leading-relaxed text-neutral-600 dark:text-neutral-400">
                            {career.description}
                        </p>

                        <div className="mt-8 grid grid-cols-3 gap-4">
                            <div className="rounded-xl bg-neutral-50 p-4 text-center dark:bg-dark-hover">
                                <DollarSign className="mx-auto mb-2 h-6 w-6 text-primary-600" />
                                <p className="font-semibold text-neutral-900 dark:text-white">{career.salary}</p>
                                <p className="text-sm text-neutral-500">Avg. Salary</p>
                            </div>
                            <div className="rounded-xl bg-neutral-50 p-4 text-center dark:bg-dark-hover">
                                <TrendingUp className="mx-auto mb-2 h-6 w-6 text-green-600" />
                                <p className="font-semibold text-neutral-900 dark:text-white">{career.growth}</p>
                                <p className="text-sm text-neutral-500">Growth Rate</p>
                            </div>
                            <div className="rounded-xl bg-neutral-50 p-4 text-center dark:bg-dark-hover">
                                <Users className="mx-auto mb-2 h-6 w-6 text-blue-600" />
                                <p className="font-semibold text-neutral-900 dark:text-white">{career.demand}</p>
                                <p className="text-sm text-neutral-500">Market Demand</p>
                            </div>
                        </div>
                    </Card>

                    {/* Structured Roadmap */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <h2 className="text-xl font-bold">Learning Path</h2>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleGenerateRoadmap}
                                    disabled={isGenerating}
                                    className="ml-auto bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border-purple-500/30"
                                >
                                    <Sparkles className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-pulse' : ''}`} />
                                    {isGenerating ? 'Generating Roadmap...' : 'Personalize with AI'}
                                </Button>
                            </div>
                            <p className="text-xs text-neutral-500 italic mb-4">Click AI button to build your high-quality roadmap</p>
                        </div>
                        {/* We need to pass validation or handler if RoadmapTimeline supported it, 
                            for now we just pass the steps which update via state re-render */}
                        <div>
                            <WavyRoadmap
                                steps={roadmap.map(step => ({
                                    id: step.id,
                                    title: step.title,
                                    description: step.description || '',
                                    status: step.status as any,
                                    duration: step.duration
                                }))}
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Match Score */}
                    <Card className="p-6 text-center bg-gradient-to-br from-primary-600 to-accent-purple text-white border-none">
                        <p className="text-lg font-medium opacity-90">Match Score</p>
                        <div className="my-4 text-5xl font-bold">{career.matchScore}%</div>
                        <p className="text-sm opacity-80">Based on your skills & interests</p>
                    </Card>

                    {/* Required Skills */}
                    <Card className="p-6">
                        <h3 className="mb-4 font-bold">Key Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {career.skills?.map((skill: string) => (
                                <span key={skill} className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-600 dark:bg-dark-hover dark:text-neutral-400">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </Card>

                    {/* Resources */}
                    <Card className="p-6">
                        <h3 className="mb-4 font-bold">Recommended Resources</h3>
                        <div className="space-y-4">
                            {career.resources?.map((res: any, i: number) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="mt-1 rounded-full bg-primary-50 p-1.5 dark:bg-primary-900/20">
                                        <BookOpen className="h-4 w-4 text-primary-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{res.title}</p>
                                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                                            <span>{res.type}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {res.duration}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="mt-4 w-full text-xs h-9">View Library</Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
