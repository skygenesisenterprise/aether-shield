# Aether Shield Infrastructure Dockerfile
# This Dockerfile creates a production-ready infrastructure environment
# for the Aether Shield platform

# ============================================
# Production Environment
# ============================================

FROM node:20-alpine as builder

# Install build dependencies
RUN apk add --no-cache \
    git \
    curl \
    bash \
    build-base \
    go \
    && rm -rf /var/cache/apk/*

# Enable Corepack and pnpm
RUN corepack enable && corepack prepare pnpm@10.28.1 --activate

# Set working directory
WORKDIR /app

# Copy source files from project root
COPY ../../app/package.json ../../app/pnpm-lock.yaml ./
COPY ../../app ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build Next.js application
RUN pnpm build

# ============================================
# Runtime Environment
# ============================================

FROM node:20-alpine

# Install runtime dependencies
RUN apk add --no-cache \
    bash \
    curl \
    && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Copy built application from builder
COPY --from=builder /app/.next ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Copy server files
COPY ../../server ./

# Environment variables
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Expose ports
EXPOSE 3000 8080

# Start script
COPY infrastructure/docker/start.sh /start.sh
RUN chmod +x /start.sh

# Start production server
CMD ["/start.sh"]
