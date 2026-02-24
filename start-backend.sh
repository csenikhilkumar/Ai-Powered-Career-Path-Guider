#!/bin/bash

# Career Path Guider - Quick Start Script
# This script helps you get started with the microservices backend

set -e  # Exit on error

echo "🚀 Career Path Guider - Backend Setup"
echo "======================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker and try again.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker is running${NC}"

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}📝 Please edit .env and add your GROK_API_KEY before continuing.${NC}"
    echo -e "${YELLOW}   Get your key from: https://console.x.ai/${NC}"
    read -p "Press Enter once you've added your Grok API key..."
fi

# Check if GROK_API_KEY is set
if ! grep -q "^GROK_API_KEY=.\\+" .env; then
    echo -e "${YELLOW}⚠️  GROK_API_KEY not set in .env file${NC}"
    echo -e "${YELLOW}   The AI service will use mock responses until configured.${NC}"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "🐳 Starting Docker containers..."
docker compose up -d

echo ""
echo "⏳ Waiting for databases to be ready..."
sleep 10

echo ""
echo "📊 Running database migrations..."

# Auth Service
echo "  - Auth Service..."
docker compose exec -T auth-service npx prisma migrate deploy > /dev/null 2>&1 || true
docker compose exec -T auth-service npx prisma generate > /dev/null 2>&1 || true

# User Service
echo "  - User Service..."
docker compose exec -T user-service npx prisma migrate deploy > /dev/null 2>&1 || true
docker compose exec -T user-service npx prisma generate > /dev/null 2>&1 || true

# Career Service
echo "  - Career Service..."
docker compose exec -T career-service npx prisma migrate deploy > /dev/null 2>&1 || true
docker compose exec -T career-service npx prisma generate > /dev/null 2>&1 || true

# AI Service
echo "  - AI Service..."
docker compose exec -T ai-service npx prisma migrate deploy > /dev/null 2>&1 || true
docker compose exec -T ai-service npx prisma generate > /dev/null 2>&1 || true

echo ""
echo "🔍 Checking service health..."
sleep 5

# Function to check service health
check_service() {
    local service_name=$1
    local port=$2
    local endpoint=$3
    
    if curl -s -f "http://localhost:${port}${endpoint}" > /dev/null; then
        echo -e "  ${GREEN}✓ ${service_name} (port ${port})${NC}"
        return 0
    else
        echo -e "  ${RED}✗ ${service_name} (port ${port}) - Not responding${NC}"
        return 1
    fi
}

check_service "API Gateway" "3000" "/health"
check_service "Auth Service" "3001" "/health"
check_service "User Service" "3002" "/health"
check_service "Career Service" "3003" "/health"
check_service "AI Service" "3004" "/ai/health"

echo ""
echo "======================================"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo "📌 Quick Reference:"
echo "  - API Gateway:    http://localhost:3000"
echo "  - Auth Service:   http://localhost:3001"
echo "  - User Service:   http://localhost:3002"
echo "  - Career Service: http://localhost:3003"
echo "  - AI Service:     http://localhost:3004"
echo ""
echo "📚 Next Steps:"
echo "  1. Test the API: curl http://localhost:3000/health"
echo "  2. View logs: docker compose logs -f"
echo "  3. See BACKEND_README.md for API documentation"
echo ""
echo "🛑 To stop services: docker compose down"
echo "🔄 To restart: docker compose restart"
echo ""
