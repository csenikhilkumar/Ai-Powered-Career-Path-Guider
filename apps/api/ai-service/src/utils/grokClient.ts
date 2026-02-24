import OpenAI from 'openai';
import logger from './logger';
import { adzunaClient } from './adzunaClient';

interface GrokConfig {
    apiKey: string;
    baseURL?: string;
    timeout?: number;
}

interface InsightRequest {
    userId: string;
    skills: Array<{ skillName: string; proficiency: string; yearsExp: number }>;
    interests: Array<{ interestName: string; priority: number }>;
    careerGoals?: string;
}

interface RoadmapRequest {
    userId: string;
    careerPathTitle: string;
    currentSkills: Array<{ skillName: string; proficiency: string }>;
    targetSkills: string[];
    timeframe: string;
}

interface ExplanationRequest {
    userId: string;
    careerPathTitle: string;
    careerDescription: string;
    userSkills: string[];
    userInterests: string[];
    matchScore: number;
}

interface ResourceRequest {
    userId: string;
    careerPathTitle: string;
    currentStage: string; // e.g., "Beginner", "Learning React"
    interests: string[];
}

/**
 * Grok API Client for AI-powered career guidance
 * Uses ApiFreeLLM or compatible provider
 */
export class GrokClient {
    private apiKey: string;
    private baseURL: string;
    private readonly model: string = process.env.GROK_MODEL || 'apifreellm';
    private readonly maxRetries: number = 3;

    constructor(config?: GrokConfig) {
        this.apiKey = config?.apiKey ||
            process.env.GROK_API_KEY ||
            process.env.XAI_API_KEY ||
            'dummy_key';

        this.baseURL = config?.baseURL || process.env.GROK_API_URL || 'https://apifreellm.com/api/v1/chat';
    }

    /**
     * Check if Grok API is properly configured
     */
    isConfigured(): boolean {
        return this.apiKey !== 'dummy_key';
    }

    /**
     * Generate personalized career insights based on user profile
     */
    async generateInsights(request: InsightRequest): Promise<any> {
        if (!this.isConfigured()) {
            return this.getMockInsights(request);
        }

        const prompt = `
You are an expert career counselor. Analyze the user profile and recommend the top 3 best-fit career paths.

User Profile:
- Skills: ${JSON.stringify(request.skills)}
- Interests: ${JSON.stringify(request.interests)}
- Career Goals: ${request.careerGoals || 'Not specified'}

Return a JSON array of "CareerRecommendation" objects. Each object must have:
- "matchScore" (0-100)
- "reasoning" (Why it fits)
- "careerPath": {
    "title" (string),
    "description" (string),
    "category" (string),
    "avgSalary" (number),
    "growthRate" (number),
    "difficulty" ("Beginner"|"Intermediate"|"Advanced"|"Expert"),
    "requiredSkills" (string array)
}

Example format:
[
  {
    "matchScore": 95,
    "reasoning": "...",
    "careerPath": { ... }
  }
]
`;

        try {
            return await this.makeRequest(prompt, 0.7);
        } catch (error) {
            console.error('Failed to generate insights from AI, falling back to mock data:', error);
            return this.getMockInsights(request);
        }
    }

    /**
     * Explain why a career path matches user's profile
     */
    async explainRecommendation(request: ExplanationRequest): Promise<any> {
        if (!this.isConfigured()) {
            return this.getMockExplanation(request);
        }

        const prompt = `
You are an expert career advisor. Explain why the following career path is a good match for this user.

Career Path: ${request.careerPathTitle}
Description: ${request.careerDescription}
Match Score: ${request.matchScore}%

User Profile:
- Skills: ${request.userSkills.join(', ')}
- Interests: ${request.userInterests.join(', ')}

Provide a detailed explanation in JSON format:
{
  "summary": "One-paragraph summary of why this is a good match",
  "strengths": [
    {
      "aspect": "What user strength applies",
      "relevance": "How it relates to this career",
      "impact": "Why it matters"
    }
  ],
  "areasForGrowth": [
    {
      "skill": "Skill to develop",
      "importance": "Why it's needed",
      "timeline": "Estimated time to develop",
      "resources": ["Resource 1", "Resource 2"]
    }
  ],
  "marketOutlook": {
    "demand": "Current market demand",
    "growth": "Growth projections",
    "salary": "Salary range information"
  },
  "nextSteps": ["Step 1", "Step 2", "Step 3"]
}

Be encouraging but realistic. Provide actionable insights.
`;

        try {
            return await this.makeRequest(prompt, 0.6);
        } catch (error) {
            console.error('Failed to explain recommendation from AI, falling back to mock data:', error);
            return this.getMockExplanation(request);
        }
    }

    /**
     * Generate personalized learning resources (Videos, Jobs, News)
     */
    async generateLearningResources(request: ResourceRequest): Promise<any> {
        if (!this.isConfigured()) {
            return this.getMockLearningResources(request);
        }

        const prompt = `
        You are a career mentor. Based on the user's career path "${request.careerPathTitle}" and current stage "${request.currentStage}", suggest relevant learning resources.

        Return a JSON object with exactly these 3 arrays:
        {
          "youtubeVideos": [
            { "title": "Specific Video Title or Topic", "channel": "Recommended Channel", "reason": "Why watch this", "url": "Full YouTube URL" }
          ],
          "jobSearchQueries": [
            { "query": "Job Title or Keyword", "platform": "LinkedIn" | "Indeed" | "Glassdoor", "reason": "Why search this" }
          ],
          "newsTopics": [
            { "topic": "Recent Industry Trend or News Headline", "source": "TechCrunch" | "HackerNews" | "Industry Blog", "context": "Why it matters", "url": "News Article URL (optional)" }
          ]
        }
        Provide 3-4 items for each category. For YouTube videos, provide a valid URL if possible, otherwise a precise search query.
        `;

        try {
            const aiResponse = await this.makeRequest(prompt, 0.6);

            // Enhance with real Adzuna jobs if configured
            if (adzunaClient.isConfigured() && aiResponse.jobSearchQueries) {
                try {
                    // Take the first query or the career title
                    const query = request.careerPathTitle;
                    const realJobs = await adzunaClient.searchJobs(query);

                    if (realJobs.length > 0) {
                        // Replace or prepend AI suggestions with real jobs
                        // We map Adzuna results to the expected format
                        // AdzunaClient.searchJobs already returns [{ query, platform, reason, url, description }]
                        // We'll use these real jobs
                        aiResponse.jobSearchQueries = realJobs;
                    }
                } catch (err) {
                    console.error('Failed to fetch Adzuna jobs:', err);
                    // Fallback to AI suggestions
                }
            }

            return aiResponse;
        } catch (error) {
            console.error('Failed to generate resources from AI, falling back to mock data:', error);
            return this.getMockLearningResources(request);
        }
    }

    /**
     * Generate a personalized learning roadmap
     */
    async generatePersonalizedRoadmap(request: RoadmapRequest): Promise<any> {
        if (!this.isConfigured()) {
            return this.getMockRoadmap(request);
        }

        const prompt = `
        You are an expert technical career coach. Create a learning roadmap for a BEGINNER.

        Target: ${request.careerPathTitle} (${request.timeframe})
        Skills: ${JSON.stringify(request.currentSkills)} -> ${request.targetSkills.join(', ')}

        Requirements:
        1. Generate 8-10 distinct phases.
        2. Each phase must have a title, duration, focus, and description.
        3. Include 1 key topic per phase with 1 resource.

        [STRICT: JSON ONLY. NO PREAMBLE.]

        Response Format (JSON):
        {
          "roadmap": {
            "title": "Mastering ${request.careerPathTitle}",
            "totalDuration": "${request.timeframe}",
            "difficulty": "Beginner",
            "phases": [
              {
                "phase": 1,
                "title": "...",
                "duration": "...",
                "focus": "...",
                "description": "...",
                "topics": [
                  {
                    "name": "...",
                    "description": "...",
                    "resources": [
                       { "title": "...", "type": "...", "url": "..." }
                    ]
                  }
                ]
              }
            ]
          }
        }
        `;

        try {
            return await this.makeRequest(prompt, 0.5);
        } catch (error) {
            console.error('Failed to generate roadmap from AI, falling back to mock data:', error);
            return this.getMockRoadmap(request);
        }
    }

    /**
     * Chat with AI assistant
     */
    async chat(message: string): Promise<string> {
        if (!this.isConfigured()) {
            return "I am running in mock mode. Please configure the AI API to chat with me.";
        }

        try {
            // Just pass the message directly or wrap it?
            // ApiFreeLLM acts as a completion engine usually. 
            // A simple prompt wrapper enables better chat experience.
            const prompt = `You are a helpful Career Guide Assistant. Answer the user's question concisely.\nUser: ${message}\nAssistant:`;
            return await this.makeRequest(prompt, 0.7, false, 0, 1000);
        } catch (error) {
            console.error('Chat error:', error);
            throw error;
        }
    }

    /**
     * Generate career path analysis from survey answers
     */
    async analyzeCareerPath(answers: any): Promise<any> {
        if (!this.isConfigured()) {
            return this.getMockCareerAnalysis(answers);
        }

        const prompt = `
        Analyze the following user profile and survey answers to suggest the best career paths.

        User Profile: ${JSON.stringify(answers)}

        The user has answered detailed questions about their psychology and preferences.
        1. Analyze their "Psychological Profile" based onwork style, problem solving, risk tolerance, and core motivation.
        2. Consider their specific interests (e.g., Web3, Gaming, Bio).

        Return a JSON object with this structure:
        {
          "analysis": "Analysis of why these careers fit.",
          "recommendations": [
            {
              "id": "generated-id-1",
              "title": "Job Title",
              "description": "Role description.",
              "category": "Technology" | "Creative" | "Business" | "Science",
              "avgSalary": 120000,
              "growthRate": 25,
              "difficulty": "Beginner" | "Intermediate" | "Advanced",
              "matchScore": 95,
              "reason": "Reason for fit",
              "growthSpeed": "Accelerated" | "Steady" | "Slow",
              "requiredSkills": ["Skill 1", "Skill 2"]
            }
          ],
          "marketTrends": {
            "demand": "Market demand",
            "growth": "Growth projections",
            "emergingRoles": ["Role 1"]
          },
          "developmentPriorities": [
            {
              "skill": "Skill name",
              "priority": "High" | "Medium",
              "reason": "Reason"
            }
          ]
        }
        `;

        try {
            return await this.makeRequest(prompt, 0.7);
        } catch (error) {
            console.error('Failed to analyze career path from AI, falling back to mock data:', error);
            return this.getMockCareerAnalysis(answers);
        }
    }

    /**
     * Make a request to ApiFreeLLM API with retry logic
     */
    private async makeRequest(prompt: string, temperature: number = 0.7, expectJson: boolean = true, retries: number = 0, maxTokens: number = 3000): Promise<any> {
        try {
            // ApiFreeLLM Custom Format
            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    message: prompt,
                    model: this.model,
                    temperature: temperature,
                    max_tokens: maxTokens
                })
            });

            if (!response.ok) {
                const errorText = await response.text();

                // Handle Rate Limiting (429)
                if (response.status === 429) {
                    console.warn(`API Rate Limit Exceeded: ${errorText}`);

                    let retryAfter = 5; // Enforce minimum 5s wait
                    try {
                        const errorJson = JSON.parse(errorText);
                        if (errorJson.retryAfter) {
                            const apiWait = parseInt(errorJson.retryAfter, 10);
                            retryAfter = Math.max(5, apiWait + 2); // Use API wait + 2s, but minimum 5s
                        }
                    } catch (e) {
                        // ignore parsing error
                    }

                    if (retries < 7) { // Increase max retries to 7
                        console.log(`Waiting ${retryAfter}s before retrying (Attempt ${retries + 1}/7)...`);
                        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
                        return this.makeRequest(prompt, temperature, expectJson, retries + 1, maxTokens);
                    }
                }

                console.error(`API Error (${response.status}):`, errorText);
                if (response.status === 403) {
                    console.warn('ApiFreeLLM returned 403 Forbidden. Check usage limits.');
                }
                throw new Error(`API returned status ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            const content = data.response;
            logger.info('--- DEBUG: RAW AI RESPONSE START ---');
            logger.info(content);
            logger.info('--- DEBUG: RAW AI RESPONSE END ---');

            if (!content) {
                console.error('Empty response from AI API. Full data:', JSON.stringify(data));
                throw new Error('Empty response from AI API');
            }

            if (!expectJson) {
                return content;
            }

            return this.safeJsonParse(content);

        } catch (error: any) {
            console.error(`AI API error (attempt ${retries + 1}):`, error.message || error);

            // Retry on Network Errors (fetch failed) or 5xx Server Errors
            const isNetworkError = (error.message && (error.message.includes('fetch failed') || error.message.includes('ETIMEDOUT') || error.message.includes('ECONNREFUSED')));

            if (retries < 7) {
                // Exponential backoff for errors
                const delay = Math.pow(2, retries) * 2000 + 1000; // 3s, 5s, 9s, 17s...
                console.log(`Retrying after error in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.makeRequest(prompt, temperature, expectJson, retries + 1, maxTokens);
            }

            console.warn('All AI API retries failed, using mock response');
            throw error;
        }
    }

    /**
     * Safely parse JSON from AI response, handling markdown fences
     */
    private safeJsonParse(raw: string): any {
        try {
            const trimmed = raw.trim();

            // Remove markdown code fences
            const withoutFences = trimmed
                .replace(/^```(?:json)?\s*/i, '')
                .replace(/\s*```$/i, '')
                .trim();

            try {
                return JSON.parse(withoutFences);
            } catch {
                // Try to extract JSON object if embedded in text or prefixed with "Response: "
                const firstBrace = withoutFences.indexOf('{');
                const lastBrace = withoutFences.lastIndexOf('}');

                if (firstBrace >= 0 && lastBrace > firstBrace) {
                    const candidate = withoutFences.slice(firstBrace, lastBrace + 1);
                    return JSON.parse(candidate);
                }

                // If no braces, maybe it's "Response: { ... }" but firstBrace should caught that
                // Just in case, try removing common prefixes
                const cleaned = withoutFences
                    .replace(/^Response:\s*/i, '')
                    .trim();

                if (cleaned !== withoutFences) {
                    return JSON.parse(cleaned);
                }

                throw new Error('No valid JSON found in response');
            }
        } catch (error) {
            logger.error('JSON parsing failed:', error);
            logger.error('Raw response content length: ' + (raw ? raw.length : 0));
            return { error: 'Failed to parse AI response', raw };
        }
    }

    // Mock responses for when API is not configured or fails

    private getMockInsights(request: InsightRequest) {
        // Return structured CareerRecommendation[] based on frontend type
        return [
            {
                id: 'rec-1',
                matchScore: 92,
                reasoning: 'Your strong technical skills in JavaScript and React make you a perfect fit for Full Stack Development. You have 4/5 required skills.',
                status: 'active',
                createdAt: new Date().toISOString(),
                careerPath: {
                    id: '1',
                    title: 'Full Stack Developer',
                    description: 'Build complete web applications managing both frontend and backend.',
                    category: 'Technology',
                    avgSalary: 110000,
                    growthRate: 15,
                    difficulty: 'Intermediate',
                    requiredSkills: ['JavaScript', 'React', 'Node.js', 'SQL'],
                    matchScore: 92,
                    salary: '$90k - $130k',
                    growth: 'High',
                    demand: 'Very High'
                }
            },
            {
                id: 'rec-2',
                matchScore: 85,
                reasoning: 'Your analytical mindset aligns well with Data Science, though you may need to pick up some Python and Machine Learning skills.',
                status: 'active',
                createdAt: new Date().toISOString(),
                careerPath: {
                    id: '2',
                    title: 'Data Scientist',
                    description: 'Analyze complex data sets to help businesses make better decisions.',
                    category: 'Technology',
                    avgSalary: 125000,
                    growthRate: 22,
                    difficulty: 'Advanced',
                    requiredSkills: ['Python', 'Machine Learning', 'Statistics', 'SQL'],
                    matchScore: 85,
                    salary: '$110k - $160k',
                    growth: 'Very High',
                    demand: 'High'
                }
            }
        ];
    }

    private getMockExplanation(request: ExplanationRequest) {
        return {
            summary: `${request.careerPathTitle} is an excellent match (${request.matchScore}% compatibility) based on your skills and interests. Your background aligns well with the core requirements of this role.`,
            strengths: [
                {
                    aspect: 'Technical Skills',
                    relevance: 'Your skills directly match the key requirements for this role',
                    impact: 'This gives you a competitive advantage and faster onboarding'
                },
                {
                    aspect: 'Interest Alignment',
                    relevance: 'Your interests align with the day-to-day work in this career',
                    impact: 'Higher job satisfaction and motivation for continuous learning'
                }
            ],
            areasForGrowth: [
                {
                    skill: 'Advanced System Design',
                    importance: 'Critical for senior-level positions',
                    timeline: '6-12 months',
                    resources: ['System Design Interview Course', 'Design large-scale systems on paper']
                }
            ],
            marketOutlook: {
                demand: 'Very High - consistent growth across industries',
                growth: '15% projected growth over next 5 years',
                salary: '$80,000 - $150,000 depending on experience and location'
            },
            nextSteps: [
                'Review and update your resume to highlight relevant skills',
                'Build 2-3 portfolio projects in this domain',
                'Connect with professionals in this field on LinkedIn',
                'Start applying to entry-level or junior positions'
            ]
        };
    }

    private getMockRoadmap(request: RoadmapRequest) {
        return {
            roadmap: {
                title: `Mastering ${request.careerPathTitle} (Comprehensive)`,
                totalDuration: request.timeframe,
                difficulty: 'Intermediate',
                phases: Array.from({ length: 15 }, (_, i) => ({
                    phase: i + 1,
                    title: `Step ${i + 1}: ${i === 0 ? 'Introduction to ' : i === 14 ? 'Advanced Mastery of ' : 'Deep Dive into '}${request.careerPathTitle}`,
                    duration: '1-2 weeks',
                    focus: `Core Concept ${i + 1}`,
                    description: i === 0
                        ? 'Starting from zero properly. No previous knowledge required.'
                        : `Building upon previous steps to reach professional level in ${request.careerPathTitle}.`,
                    topics: [
                        { name: `Topic ${i + 1}.1`, description: 'Fundamental explanation.', resources: [{ title: 'Resource', type: 'Doc', url: '#' }] }
                    ]
                }))
            }
        };
    }

    private getMockCareerAnalysis(answers: any) {
        return {
            analysis: 'Based on your profile, you show strong aptitude for technology and problem-solving. Your interests align well with careers in software development and data analysis.',
            recommendations: [
                {
                    id: 'mock-1',
                    title: 'Full-Stack Developer',
                    description: 'Build complete web applications managing both frontend and backend.',
                    category: 'Technology',
                    avgSalary: 100000,
                    growthRate: 15,
                    difficulty: 'Intermediate',
                    matchScore: 92,
                    reason: 'Your technical skills and interest in building complete solutions make this an excellent fit',
                    requiredSkills: ['JavaScript', 'React', 'Node.js', 'SQL']
                },
                {
                    id: 'mock-2',
                    title: 'Data Analyst',
                    description: 'Analyze complex data sets to help businesses make better decisions.',
                    category: 'Data Science',
                    avgSalary: 85000,
                    growthRate: 20,
                    difficulty: 'Beginner',
                    matchScore: 85,
                    reason: 'Your analytical thinking and interest in insights align well with this role',
                    requiredSkills: ['Python', 'SQL', 'Excel', 'Tableau']
                }
            ],
            marketTrends: {
                demand: 'Very high demand for software professionals, with shortage of qualified candidates',
                growth: '22% projected growth for software developers through 2030',
                emergingRoles: ['AI/ML Engineer', 'Cloud Architect', 'DevOps Engineer']
            },
            developmentPriorities: [
                {
                    skill: 'Cloud Technologies',
                    priority: 'High',
                    reason: 'Essential for modern software development and highly valued by employers'
                },
                {
                    skill: 'System Design',
                    priority: 'Medium',
                    reason: 'Important for senior roles and technical interviews'
                }
            ]
        };
    }
    private getMockLearningResources(request: ResourceRequest) {
        return {
            youtubeVideos: [
                { title: `Introduction to ${request.careerPathTitle}`, channel: "Traversy Media", reason: "Best for beginners", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
                { title: `Mastering ${request.careerPathTitle} in 2024`, channel: "Fireship", reason: "Quick overview of latest trends", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
                { title: `Day in the Life of a ${request.careerPathTitle}`, channel: "TechLead", reason: "Realistic expectations", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
            ],
            jobSearchQueries: [
                { query: `${request.careerPathTitle} Junior`, platform: "LinkedIn", reason: "Entry level opportunities" },
                { query: `${request.careerPathTitle} Remote`, platform: "Indeed", reason: "Flexible work options" },
                { query: `${request.careerPathTitle} Internship`, platform: "Glassdoor", reason: "Getting started" }
            ],
            newsTopics: [
                { topic: `Future of ${request.careerPathTitle}`, source: "TechCrunch", context: "Market trends", url: "https://techcrunch.com" },
                { topic: `Top tools for ${request.careerPathTitle}`, source: "HackerNews", context: "Tooling landscape", url: "https://news.ycombinator.com" },
                { topic: `Salary trends for ${request.careerPathTitle}`, source: "Industry Blog", context: "Career growth", url: "https://example.com" }
            ]
        };
    }
}

export default GrokClient;
