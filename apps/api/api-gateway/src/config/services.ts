export const services = {
  auth: process.env.AUTH_SERVICE_URL || "http://localhost:3001",
  user: process.env.USER_SERVICE_URL || "http://localhost:3002",
  career: process.env.CAREER_SERVICE_URL || "http://localhost:3003",
  ai: process.env.AI_SERVICE_URL || "http://localhost:3004",
};
