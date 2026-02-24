#!/bin/bash

BASE_URL="http://localhost:3004/ai"
echo "Testing AI Service at $BASE_URL..."

# 1. Health Check
echo "----------------------------------------"
echo "1. Testing Health Endpoint..."
curl -s "$BASE_URL/health" | jq .

# 2. Analyze Career Path (Expanded Profile)
echo "----------------------------------------"
echo "2. Testing Analyze Career Path (Psychological Profile)..."
# ANALYZE_PAYLOAD='{
#   "answers": {
#     "interests": "Blockchain, Cryptography, Systems",
#     "work_style": "Autonomous, Remote",
#     "problem_solving": "Logical, First Principles",
#     "risk_tolerance": "High Risk, Startup",
#     "motivation": "Technical Complexity and Impact"
#   }
# }'
# curl -s -X POST "$BASE_URL/analyze" \
#   -H "Content-Type: application/json" \
#   -d "$ANALYZE_PAYLOAD" | jq .

# 3. Generate Roadmap
echo "----------------------------------------"
echo "3. Testing Generate Roadmap..."
ROADMAP_PAYLOAD='{
  "userId": "test-user",
  "careerPathTitle": "Blockchain Architect",
  "currentSkills": ["JavaScript", "Go"],
  "targetSkills": ["Solidity", "EVM", "Rust"],
  "timeframe": "6 months"
}'
curl -s -X POST "$BASE_URL/roadmap" \
  -H "Content-Type: application/json" \
  -H "x-user-id: test-user" \
  -d "$ROADMAP_PAYLOAD" | jq .

echo "----------------------------------------"
echo "Done."
