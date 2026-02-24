export const mocks = {
    '/auth/login': {
        token: 'mock-jwt-token',
        user: {
            id: '1',
            email: 'demo@example.com',
            firstName: 'Demo',
            lastName: 'User',
            role: 'student'
        }
    },
    '/auth/register': {
        token: 'mock-jwt-token',
        user: {
            id: '1',
            email: 'demo@example.com',
            firstName: 'Demo',
            lastName: 'User',
            role: 'student'
        }
    },
    '/auth/me': {
        user: {
            id: '1',
            email: 'demo@example.com',
            firstName: 'Demo',
            lastName: 'User',
            role: 'student',
            educationLevel: 'Undergraduate',
            interests: ['AI', 'Web Development'],
            skills: ['JavaScript', 'React']
        }
    },
    '/users/profile': {
        user: {
            id: '1',
            email: 'demo@example.com',
            firstName: 'Demo',
            lastName: 'User',
            role: 'student',
            bio: 'Aspiring Software Engineer',
            location: 'Remote',
            educationLevel: 'Undergraduate',
            currentRole: 'Student',
            skills: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
            interests: ['Artificial Intelligence', 'System Design']
        }
    },
    '/careers/careers': {
        careers: [
            {
                id: '1',
                title: 'Software Engineer',
                description: 'Build and maintain software applications.',
                matchScore: 95,
                salary: '$120k - $180k',
                growth: 'High',
                demand: 'Very High'
            },
            {
                id: '2',
                title: 'Data Scientist',
                description: 'Analyze complex data to help make business decisions.',
                matchScore: 88,
                salary: '$130k - $190k',
                growth: 'High',
                demand: 'High'
            },
            {
                id: '3',
                title: 'Product Manager',
                description: 'Oversee product development from inception to launch.',
                matchScore: 75,
                salary: '$110k - $170k',
                growth: 'Moderate',
                demand: 'High'
            }
        ]
    },
    '/careers/roadmap': {
        roadmap: [
            {
                id: '1',
                title: 'Learn HTML & CSS',
                description: 'Master the building blocks of the web.',
                status: 'completed',
                duration: '2 weeks'
            },
            {
                id: '2',
                title: 'JavaScript Fundamentals',
                description: 'Understand core programming concepts.',
                status: 'current',
                duration: '4 weeks'
            },
            {
                id: '3',
                title: 'React & State Management',
                description: 'Build dynamic user interfaces.',
                status: 'locked',
                duration: '6 weeks'
            }
        ]
    },
    '/ai/analyze': {
        analysis: "Based on your responses, you show a strong aptitude for problem-solving and logical thinking, which aligns well with Software Engineering.",
        recommendations: [
            {
                role: 'Software Engineer',
                match: 95,
                reason: 'Strong logical reasoning and interest in building things.'
            },
            {
                role: 'DevOps Engineer',
                match: 85,
                reason: 'Interest in automation and infrastructure.'
            }
        ]
    }
};

export const getMockData = (url: string, _method: string) => {
    // Exact match
    if (mocks[url as keyof typeof mocks]) {
        return mocks[url as keyof typeof mocks];
    }

    // Pattern match for specific IDs
    if (url.startsWith('/careers/careers/')) {
        return mocks['/careers/careers'].careers[0]; // Return first career as detail
    }

    return null;
};
