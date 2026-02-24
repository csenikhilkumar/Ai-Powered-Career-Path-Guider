<div align="center">
  <h1>🚀 AI-Powered Career Path Guider</h1>
  <p>An intelligent, full-stack microservices ecosystem that provides personalized career guidance, dynamically generating user roadmaps, offering job matching, and providing actionable insights utilizing Grok AI.</p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/Node.js-18.x-green.svg" alt="Node.js version" />
    <img src="https://img.shields.io/badge/Next.js-React-blue.svg" alt="Next.js" />
    <img src="https://img.shields.io/badge/Docker-Containerized-2496ED.svg" alt="Docker" />
    <img src="https://img.shields.io/badge/Prisma-ORM-2D3748.svg" alt="Prisma" />
    <img src="https://img.shields.io/badge/xAI-Grok-black.svg" alt="xAI Grok" />
  </p>
</div>

---

## 📖 Table of Contents
- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Setup](#local-setup)
  - [Environment Variables](#environment-variables)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## 🌟 About the Project
Choosing a career path and understanding the exact steps to succeed in it can be overwhelming. The **AI-Powered Career Path Guider** solves this by generating tailored, step-by-step career roadmaps based on a user's skills, interests, and background. By integrating **xAI's Grok Model**, the application provides real-time, personalized, and actionable career steps.

---

## ✨ Key Features
- **🧠 Dynamic Career Discovery Wizard**: A step-by-step interactive onboarding process to capture user skills, experience levels, and goals.
- **🗺️ AI-Generated Roadmaps**: Produces visually appealing, customized timelines and skill trees utilizing the Grok AI model.
- **💼 Job & Internship Matching**: Recommends relevant job opportunities tailored to the generated career path.
- **🔐 Secure Authentication**: Robust JWT-based authentication system with refresh token rotation.
- **📦 Microservices Architecture**: Highly scalable backend divided into independently deployable services (Auth, User, Career, and AI).
- **🐳 Fully Containerized**: Seamless local development and production deployments using Docker and Docker Compose.

---

## 🏗 System Architecture
The application follows a robust microservices pattern, routed through an API Gateway.

### Backend Microservices
- **API Gateway (Port 3000)**: The single entry point for the frontend frontend. Coordinates routing, validates JWT tokens, and handles rate limiting.
- **Auth Service (Port 3001)**: Manages user registration, login, JWT issuance, and secure refresh token handling.
- **User Service (Port 3002)**: Handles user profile creation, stores assessment data, and tracks user progress.
- **Career Service (Port 3003)**: Manages static career paths, job opportunity data, and roadmap progress tracking.
- **AI Service (Port 3004)**: Interfaces directly with the Grok API to dynamically contextualize user data and generate tailored HTML/JSON career roadmaps.

### Database Strategy
Each microservice has its own isolated **PostgreSQL** database (connected via Prisma ORM) to enforce data decoupling and domain-driven design. **Redis** is used at the gateway layer for aggressive rate limiting and caching.

---

## 💻 Tech Stack
| Category | Technologies |
|---|---|
| **Frontend** | React, Next.js, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express.js, TypeScript |
| **Databases** | PostgreSQL (Neon DB), Redis |
| **ORM** | Prisma |
| **AI Integration**| xAI (Grok API) |
| **DevOps / Build**| Docker, Docker Compose, Turborepo, pnpm |

---

## 📁 Project Structure
This repository is managed as a monorepo using **Turborepo**.

```text
├── apps/
│   ├── api/
│   │   ├── api-gateway/      # API routing & rate limiting
│   │   ├── auth-service/     # Authentication & JWTs
│   │   ├── user-service/     # User profile management
│   │   ├── career-service/   # Career metadata & jobs
│   │   └── ai-service/       # Grok AI integration
│   └── web/                  # Next.js/React Frontend App
├── packages/
│   ├── eslint-config/        # Shared ESLint rules
│   ├── typescript-config/    # Shared TS configs
│   └── ui/                   # Shared UI components
├── docker-compose.yml        # Multi-container orchestration
├── start-backend.sh          # Automated startup script
└── package.json              # Monorepo dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites
Ensure you have the following installed on your local machine:
1. [Node.js](https://nodejs.org/) (v18 or higher)
2. [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Running)
3. [pnpm](https://pnpm.io/installation) (`npm install -g pnpm`)

### Local Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/csenikhilkumar/Ai-Powered-Career-Path-Guider-.git
   cd Ai-Powered-Career-Path-Guider-
   ```

2. **Install dependencies across the monorepo:**
   ```bash
   pnpm install
   ```

### Environment Variables
You need to set up the environment variables for the backend and frontend to communicate securely. 

1. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
2. Open the `.env` file and populate the required keys. **Crucially, you must provide your Grok AI key:**
   ```env
   GROK_API_KEY=your_xai_api_key_here
   GROK_API_URL=https://api.x.ai/v1/chat/completions
   GROK_MODEL=grok-2-latest
   ```
*(Note: Database URLs are pre-configured to utilize the containerized PostgreSQL instances locally, but can be swapped out for cloud instances like Neon/Supabase)*.

---

## 🏃 Running the Application

### 1. Boot up the Microservices
The backend utilizes Docker Compose to spin up 4 databases, a Redis cache, and 5 Node.js services. Run the provided helper script from the root directory:

```bash
./start-backend.sh
```
*This script will build the Docker images, start the containers, and automatically run Prisma database migrations for all services.*

**Verify Backend:**
```bash
curl http://localhost:3000/health
```

### 2. Start the Frontend Web Application
Open a new terminal window, navigate into the web application directory, and start the development server:
```bash
cd apps/web
pnpm dev
```
Navigate your browser to **[http://localhost:5173](http://localhost:5173)** to interact with the application.

### Stopping the Services
To gracefully shut down all Docker containers, run:
```bash
pnpm run stop
# or
docker-compose down
```

---

## � Troubleshooting
- **Docker Port Conflict (Port 5432)**: If your local machine already relies on PostgreSQL, the default `5432` port might be occupied. We have intentionally bound the internal `.yml` databases to proxy ports (e.g., `5436`) to prevent conflicts. 
- **Missing `@prisma/client` errors**: If you see TypeScript errors complaining about Prisma clients in the terminal, run `pnpm install` again, or manually generate the clients via `npx prisma generate` inside the specific microservice folder (`apps/api/<service>`).
- **Viewing Docker Logs**: Need to see why a service is failing? 
  ```bash
  docker-compose logs -f api-gateway
  docker-compose logs -f ai-service
  ```

---

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
<div align="center">
  <i>Built to empower the next generation of professionals. 🚀</i>
</div>
