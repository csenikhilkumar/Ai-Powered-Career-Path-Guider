
import dotenv from 'dotenv';
import path from 'path';
import GrokClient from '../apps/api/ai-service/src/utils/grokClient';

// Load env from root
dotenv.config({ path: path.join(__dirname, '../.env') });

async function run() {
    console.log("Initializing GrokClient...");
    console.log("API Key present:", !!process.env.GROK_API_KEY);
    console.log("API Key length:", process.env.GROK_API_KEY?.length);

    const client = new GrokClient();

    const request = {
        userId: "test-user",
        careerPathTitle: "Full Stack Developer",
        currentSkills: [{ skillName: "JavaScript", proficiency: "Intermediate" }],
        targetSkills: ["React", "Node.js", "Docker"],
        timeframe: "6 months"
    };

    console.log("Sending request to AI...", JSON.stringify(request, null, 2));

    try {
        const result = await client.generatePersonalizedRoadmap(request);
        console.log("----------------------------------------");
        console.log("SUCCESS:");
        console.log(JSON.stringify(result, null, 2));
        console.log("----------------------------------------");
    } catch (error) {
        console.error("----------------------------------------");
        console.error("FAILED:");
        console.error(error);
        console.error("----------------------------------------");
    }
}

run();
