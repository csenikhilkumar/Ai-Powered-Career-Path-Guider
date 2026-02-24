#!/bin/bash
set -e

echo "Generating Prisma Clients..."

echo "--- Auth Service ---"
cd apps/api/auth-service
npx prisma generate
cd ../../..

echo "--- User Service ---"
cd apps/api/user-service
npx prisma generate
cd ../../..

echo "--- Career Service ---"
cd apps/api/career-service
npx prisma generate
cd ../../..

echo "--- AI Service ---"
cd apps/api/ai-service
npx prisma generate
cd ../../..

echo "All clients generated successfully."
