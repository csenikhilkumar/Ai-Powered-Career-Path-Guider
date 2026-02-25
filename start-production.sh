#!/bin/sh

echo "Starting deployment script..."

# 1. Run Prisma Migrations
echo "Running Prisma migrations for auth-service..."
# We run migrations from one of the services since they connect to the same DB
cd /app/apps/api/auth-service
npx prisma migrate deploy

# 2. Start Microservices in the background
echo "Starting Auth Service..."
cd /app/apps/api/auth-service
node dist/index.js &

echo "Starting User Service..."
cd /app/apps/api/user-service
node dist/index.js &

echo "Starting Career Service..."
cd /app/apps/api/career-service
node dist/index.js &

echo "Starting AI Service..."
cd /app/apps/api/ai-service
node dist/index.js &

# 3. Start API Gateway in the foreground (this keeps the container alive)
echo "Starting API Gateway..."
cd /app/apps/api/api-gateway
node dist/index.js
