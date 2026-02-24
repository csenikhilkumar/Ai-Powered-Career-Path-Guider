FROM node:18-slim AS base

# Install pnpm and typescript
RUN npm install -g pnpm typescript

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy root workspace config
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy packages and apps folders
COPY packages ./packages
COPY apps ./apps

# Install dependencies for the whole workspace
RUN pnpm install --frozen-lockfile

# Build argument to specify which service to build/start
ARG SERVICE_NAME
ENV SERVICE_NAME=${SERVICE_NAME}

# Explicitly build the specific service
# Note: We filter by the package name. Assuming package.json name matches the folder or filter logic.
# If unsure of package names, we can try to just install and let the dev command run.
# But for better reliability, we should build dependencies.

RUN cd apps/api/${SERVICE_NAME} && pnpm build

EXPOSE 3000 3001 3002 3003 3004

# Use a custom start command based on the service name
# We can't put a dynamic CMD easily without a script, but we can rely on the docker-compose command override.
# The default CMD here simulates a start for safety.
CMD pnpm --filter ${SERVICE_NAME} start
