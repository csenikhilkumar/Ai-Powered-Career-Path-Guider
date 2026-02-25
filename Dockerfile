# Base Stage
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Dependencies Stage
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/api-gateway/package.json ./apps/api/api-gateway/
COPY apps/api/auth-service/package.json ./apps/api/auth-service/
COPY apps/api/user-service/package.json ./apps/api/user-service/
COPY apps/api/career-service/package.json ./apps/api/career-service/
COPY apps/api/ai-service/package.json ./apps/api/ai-service/
COPY apps/web/package.json ./apps/web/
# Note packages/ config if applicable
RUN pnpm install --frozen-lockfile

# Build Stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generate Prisma clients and build TypeScript code
# Ensure all environment variables needed for build (e.g. VITE_) are provided at build time if this was a standalone build
RUN pnpm run build

# Production Stage
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built files and node_modules from builder
COPY --from=builder /app ./

# Make the startup script executable
RUN chmod +x /app/start-production.sh

# The container will listen on the port Railway provides, typically mapped to PORT env var
EXPOSE $PORT

# Start all services
CMD ["/app/start-production.sh"]
