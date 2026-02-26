FROM node:20-slim AS base
# Prisma requires OpenSSL to be installed on Debian slim images
RUN apt-get update -y && apt-get install -y openssl
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Build Stage
FROM base AS builder
WORKDIR /app
COPY . .
# Install all dependencies including workspaces
# Setting PRISMA_GENERATE_DATAPROXY to false ensures the binary is downloaded
ENV PRISMA_GENERATE_DATAPROXY=false
ENV PRISMA_CLI_QUERY_ENGINE_TYPE=library
RUN pnpm install --frozen-lockfile
# Force Prisma to generate its clients explicitly across all packages before TS compilation
RUN pnpm --filter "*-service" exec npx prisma generate
# Generate Prisma clients and build TypeScript code
RUN pnpm run build

# Production Stage
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy all built files and node_modules from builder
# We ALSO need to copy the pnpm store so the symlinks in node_modules stay valid!
COPY --from=builder /pnpm /pnpm
COPY --from=builder /app ./

# Make the startup script executable
RUN chmod +x /app/start-production.sh

# The container will listen on the port Railway provides, typically mapped to PORT env var
EXPOSE $PORT

# Start all services
CMD ["/app/start-production.sh"]
