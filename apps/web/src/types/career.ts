export interface CareerPath {
    // New Fields (Required for new features)
    id: string;
    title: string;
    description: string;
    category: string;
    avgSalary: number;
    growthRate: number;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    requiredSkills: string[];

    // Optional Metadata
    createdAt?: string;
    updatedAt?: string;
    matchScore?: number;

    // Legacy Fields (Optional for backward compatibility)
    salary?: string;
    growth?: string;
    demand?: string;
    skills?: string[];
    resources?: any[];
}

export interface CareerRecommendation {
    id: string;
    careerPath: CareerPath;
    matchScore: number;
    reasoning: string;
    status: 'active' | 'archived';
    createdAt: string;
}

export interface CareerFilters {
    category?: string;
    difficulty?: string;
    minSalary?: number;
    maxSalary?: number;
    searchQuery?: string;
}

export interface LearningRoadmap {
    id: string;
    careerPathId: string;
    title: string;
    description: string;
    durationMonths: number;
    level: string;
    steps: RoadmapStep[];
}

export interface RoadmapStep {
    // New Fields
    order: number;
    title: string;
    description: string;
    resources: string[];
    estimatedHours: number;

    // Legacy Fields (Required by RoadmapTimeline)
    id: string; // Made required to satisfy Step[]? Or check usage.
    status: 'locked' | 'current' | 'completed';
    duration: string;
}
