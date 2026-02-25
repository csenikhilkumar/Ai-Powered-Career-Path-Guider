---
description: How to deploy the Career Path Guider to Railway
---

# Deploying to Railway

This project is a monorepo consisting of a React frontend and multiple Node.js microservices. Railway is an excellent platform for this as it supports monorepos and managed databases out of the box.

## Prerequisites
1. A GitHub account with the project repository pushed to it.
2. A [Railway](https://railway.app/) account (linked to your GitHub).
3. Your external API keys (Grok AI) and Firebase configuration.

## Step 1: Set up Databases in Railway
1. Go to your Railway dashboard and create a **New Project**.
2. Click **Add a Service** -> **Database** -> **Add PostgreSQL**.
3. Click **Add a Service** -> **Database** -> **Add Redis**.
4. Once deployed, click on the PostgreSQL service -> **Connect** tab. Copy the `DATABASE_URL`. You will use this for the microservices.
5. Do the same for Redis to get the `REDIS_URL`.

## Step 2: Deploy the Backend Microservices
Since this is a monorepo, you will deploy the repository multiple times, configuring each deployment to run a different service. You need to deploy the following services: `api-gateway`, `auth-service`, `user-service`, `career-service`, and `ai-service`.

> **Note:** For a production environment, you might consider dockerizing the entire stack into a single container or using docker-compose on a VPS to save costs, but for Railway's managed service, individual deployments are standard.

For **each** service, repeat these steps:

1. Click **Add a Service** -> **GitHub Repo** and select your repository.
2. Click on the newly created service and go to **Settings**.
3. Under **Service -> Root Directory**, enter the path to the specific service:
   - `apps/api/auth-service`
   - `apps/api/user-service`
   - `apps/api/career-service`
   - `apps/api/ai-service`
   - `apps/api/api-gateway`
4. Under **Build -> Build Command**, use: `pnpm run build`
   *(Railway typically detects pnpm automatically via the lockfile)*
5. Under **Deploy -> Start Command**, use: `node dist/index.js` (or whatever the start script is in the respective package.json).

### Environment Variables for Backend Services
For **every** backend service (and the API gateway), go to the **Variables** tab and add:
- `DATABASE_URL`: The URL copied from your Railway PostgreSQL database.
- `REDIS_URL`: The URL from your Railway Redis service.
- `PORT`: Set this to `3000` (Railway will map the internal port automatically).

**Service-Specific Variables to Add:**
- **auth-service**:
  - `JWT_SECRET`: A secure random string (e.g., generate with `openssl rand -hex 32`).
  - `JWT_REFRESH_SECRET`: Another secure random string.
- **ai-service**:
  - `GROK_API_KEY`: Your xAI Grok API key.
- **api-gateway**:
  - *Wait until the other 4 services are deployed so Railway generates domains for them.*
  - Generate a public domain for each of the 4 microservices (in their Settings -> Networking tab). Let's say Railway assigns them URLs ending in `up.railway.app`.
  - In the API Gateway variables, add:
    - `AUTH_SERVICE_URL`: The internal/public URL of your auth-service.
    - `USER_SERVICE_URL`: The URL of your user-service.
    - `CAREER_SERVICE_URL`: The URL of your career-service.
    - `AI_SERVICE_URL`: The URL of your ai-service.

## Step 3: Run Database Migrations
Prisma migrations need to run against your production database so the tables exist.

**The easiest way (from your local terminal):**
1. Copy the Railway PostgreSQL `DATABASE_URL`.
2. Locally, temporarily set your `.env` files in each service to use the Railway `DATABASE_URL` instead of localhost.
3. In each backend service directory (`apps/api/auth-service`, etc.), run:
   ```bash
   npx prisma migrate deploy
   ```
4. **Important**: Change your local `.env` files back to `localhost` afterward so you don't corrupt production data while developing.

## Step 4: Deploy the Frontend (Vite/React)
1. In your Railway project, click **Add a Service** -> **GitHub Repo** and select the repository again.
2. Go to **Settings**.
3. Under **Service -> Root Directory**, enter: `apps/web`
4. Go to the **Variables** tab and add your frontend environment variables. Ensure you prefix them with `VITE_`:
   - `VITE_API_URL`: The public domain of your deployed **api-gateway** + `/api/v1` (e.g., `https://api-gateway-web-production.up.railway.app/api/v1`).
   - `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, etc., from your Firebase setup.
5. Railway should automatically detect it's a static site built with Vite and run `pnpm run build`.

## Step 5: Verify Deployment
1. Go to the **Settings** -> **Networking** tab for your `apps/web` service and generate a public domain.
2. Visit the domain. The application should load.
3. Attempt to register or log in. This tests the flow from Frontend -> API Gateway -> Auth Service -> Database.
