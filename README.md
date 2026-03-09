# 🚀 AI-Powered Career Path Guider

An intelligent, full-stack microservices application that acts as a personalized career advisor. By analyzing a user's psychology, interests, and work style, the platform generates **dynamic, wavy career roadmaps**, curates high-intensity **learning resources**, and matches them with **real-time job opportunities**.

![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green)
![Database](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20Prisma-blue)
![Docker](https://img.shields.io/badge/Deployment-Docker-blue)

---

## ✨ Key Features

- 🧠 **AI Career Discovery Wizard:** A conversational interface that assesses personality traits to recommend high-growth career paths.
- 🗺️ **Dynamic Wavy Roadmaps:** Beautifully animated, interactive timeline roadmaps tailored to the user's specific skill gaps and goals.
- 📚 **Personalized Learning Hub:** AI-curated YouTube tutorials and industry news tailored to the user's exact coordinate on their roadmap. Responses are heavily cached for blazing-fast performance.
- 💼 **Job & Internship Matching:** Intelligent job queries matched to the user's progress level.
- 📱 **Fully Responsive UI:** Built with Tailwind CSS, featuring glassmorphism cards, animated gradients, and seamless mobile drawer navigation.

---

## 🏗️ Technical Architecture

This application utilizes a highly scalable **Microservices Architecture**:

- **Frontend (`apps/web`):** React, TypeScript, Tailwind CSS, Framer Motion, Vite.
- **API Gateway (`apps/api/api-gateway`):** Unified entry point, rate limiting, and route proxying.
- **Auth Service (`apps/api/auth-service`):** JWT authentication, secure cookie sessions.
- **User Service (`apps/api/user-service`):** Profile management, skill tracking.
- **Career Service (`apps/api/career-service`):** Roadmap storage using PostgreSQL & Prisma.
- **AI Service (`apps/api/ai-service`):** Communicates with X.AI (Grok) API for intelligent roadmap parsing and resource fetching.

---

## 🚀 Getting Started

### Prerequisites
- [Docker & Docker Compose](https://docs.docker.com/get-docker/)
- Node.js (v18+)

### 1. Environment Setup
Copy the example environment file and fill in your X.AI API key.
```bash
cp example.env .env
```
Ensure you set your `GROK_API_KEY` inside `.env`.

### 2. Run with Docker Compose
The easiest way to spin up the entire microservices stack (PostgreSQL + API Gateway + 4 Microservices + Frontend) is via Docker.
```bash
docker compose up --build
```
*Wait approximately 30 seconds for the database to boot and Prisma to push the schema.*

### 3. Access the Application
- **Frontend App:** [http://localhost:5173](http://localhost:5173)
- **API Gateway:** [http://localhost:5000](http://localhost:5000)

---

## 💻 Local Development (Without Docker)

If you prefer to run the services bare-metal:

1. **Start a PostgreSQL Database** and update your local `.env` with a valid `DATABASE_URL`.
2. **Push the Database Schema:**
   ```bash
   cd apps/api/career-service
   npx prisma db push
   cd ../user-service
   npx prisma db push
   ```
3. **Install Dependencies:**
   ```bash
   npm install
   ```
4. **Run the Backend Services & Gateway (in separate terminals):**
   ```bash
   npm run dev:api-gateway
   npm run dev:auth-service
   ... etc
   ```
5. **Run the Frontend:**
   ```bash
   cd apps/web && npm run dev
   ```

---

## 🛠️ Contribution
Developed with ❤️ utilizing modern React practices, advanced CSS techniques (Glassmorphism, animations), and a clean Node.js Microservices pattern. Feel free to fork and open PRs!
