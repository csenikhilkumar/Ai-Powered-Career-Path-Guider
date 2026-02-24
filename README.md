# AI-Powered Career Path Guider

An intelligent, full-stack microservices application that provides personalized career guidance, dynamically generating a user's roadmap, offering job matching, and providing actionable insights utilizing Grok AI.

## 🌟 Key Features

- **Dynamic Career Discovery**: Step-by-step interactive wizard to capture user skills and goals, with AI-generated recommended career paths.
- **Microservices Architecture**: Separate, scalable services for Auth, User, Career, and AI functionality, backed by an API Gateway.
- **Containerized Environment**: Fully containerized using Docker and `docker-compose` for reproducible development and seamless deployment.
- **Monorepo Management**: Uses Turborepo to efficiently manage multiple packages and apps.

## 🏗 System Architecture

The project consists of a frontend web application and a suite of backend microservices.

### Backend Services
- **API Gateway (Port 3000)**: Coordinates routing requests from the client to internal microservices.
- **Auth Service (Port 3001)**: Handles user authentication, and issues JWT/refresh tokens.
- **User Service (Port 3002)**: Manages user profiles, preferences, and progress tracking.
- **Career Service (Port 3003)**: Manages career paths, core job data, and roadmap progress tracking.
- **AI Service (Port 3004)**: Interfaces with the Grok AI model to dynamically generate personalized career paths.

Each service uses its own separate PostgreSQL database, connected and managed via Prisma ORM.

### Frontend
- Located in `apps/web`.
- Development server runs on Port `5173`.
- Serves the user interface component library in React/Next.js.

## 🚀 Getting Started

Ensure you have the following installed on your local machine:
- Node.js (v18+)
- Docker and Docker Compose
- `pnpm` (package manager)

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` in the root of the project to configure your database, JWT secrets, and API credentials:
```bash
cp .env.example .env
```
*(Ensure to populate `GROK_API_KEY` for the AI service to function properly, along with the database credentials.)*

### 3. Run the Backend Services
The easiest way to start the backend ecosystem is using the provided bash script. This handles building the containers, starting them up, and running Prisma migrations automatically:

```bash
./start-backend.sh
```
*Note: This command spins up Docker containers. Make sure Docker Desktop/Daemon is running.*

**Quick Verification:**
Test the API Gateway health state:
```bash
curl http://localhost:3000/health
```

### 4. Run the Frontend
In a new terminal, navigate to the web app directory and start the dev server:

```bash
cd apps/web
pnpm dev
```
Navigate to `http://localhost:5173` to interact with the application.

## 🛑 Stopping the Application
To stop the backend microservices, run:
```bash
pnpm run stop
```
(Or run `docker-compose down`)

## 🛠 Tech Stack
- **Frontend**: React, Next.js, Tailwind CSS
- **Backend Architecture**: Node.js, Express, Microservices Structure via Docker
- **Database**: PostgreSQL (Prisma ORM)
- **AI Integration**: xAI (Grok)
- **Build System**: Turborepo

## 🗄 Logs & Debugging
Useful commands to debug specific microservices via Docker logs:

- API Gateway: `docker-compose logs -f api-gateway`
- Auth Service: `docker-compose logs -f auth-service`
- AI Service: `docker-compose logs -f ai-service`
- Career Service: `docker-compose logs -f career-service`
