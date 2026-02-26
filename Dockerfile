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
RUN pnpm install --frozen-lockfile
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
