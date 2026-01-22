# This Dockerfile serves as the central entry point for the Aether Shield project
# It provides a multi-stage build that can handle all services and components
#
# Usage:
# - docker build -t aether-shield/base -f infrastructure/docker/Dockerfile .
# - docker build -t aether-shield/app -f infrastructure/docker/Dockerfile --build-arg SERVICE=app .
# - docker build -t aether-shield/server -f infrastructure/docker/Dockerfile --build-arg SERVICE=server .
#
# Supported build arguments:
# - SERVICE: Specify which service to build (app, server, cli, etc.)
# - VERSION: Version tag for the image
# - ENV: Environment type (dev, staging, prod)
# - NODE_VERSION: Node.js version (default: 18)
# - GO_VERSION: Go version (default: 1.21)
# - PNPM_VERSION: pnpm version (default: latest)
#
# =====================================
# Aether Shield Central Dockerfile
# =====================================
# This Dockerfile serves as the central entry point for the Aether Shield project
# It provides a multi-stage build that can handle all services and components
#
# Usage with docker-compose:
# - docker-compose build app
# - docker-compose build server
# - docker-compose build cli
#
# Usage with docker build:
# - docker build -t aether-shield/app -f infrastructure/docker/Dockerfile --target app-production .
# - docker build -t aether-shield/server -f infrastructure/docker/Dockerfile --target server-production .
# - docker build -t aether-shield/cli -f infrastructure/docker/Dockerfile --target cli-production .
#
# Supported build arguments:
# - SERVICE: Specify which service to build (app, server, cli, etc.)
# - VERSION: Version tag for the image
# - ENV: Environment type (dev, staging, prod)
# - NODE_VERSION: Node.js version (default: 18)
# - GO_VERSION: Go version (default: 1.21)
# - PNPM_VERSION: pnpm version (default: latest)
#
# ==========================================================================
# This Dockerfile serves as the central entry point for the Aether Shield project
# It provides a multi-stage build that can handle all services and components
#
# Usage:
# - docker build -t aether-shield/base -f infrastructure/docker/Dockerfile .
# - docker build -t aether-shield/app -f infrastructure/docker/Dockerfile --build-arg SERVICE=app .
# - docker build -t aether-shield/server -f infrastructure/docker/Dockerfile --build-arg SERVICE=server .
#
# Supported build arguments:
# - SERVICE: Specify which service to build (app, server, cli, etc.)
# - VERSION: Version tag for the image
# - ENV: Environment type (dev, staging, prod)
# - NODE_VERSION: Node.js version (default: 18)
# - GO_VERSION: Go version (default: 1.21)
# - PNPM_VERSION: pnpm version (default: latest)
#
# =====================================

# --- Base Stage ---
# This stage provides the foundation for all builds
# It includes all necessary tools and dependencies

FROM docker.io/library/node:18-alpine AS base

# Set environment variables
ENV NODE_ENV=production \
    PNPM_VERSION=latest \
    GO_VERSION=1.21 \
    SERVICE=app \
    VERSION=latest \
    ENV=prod

# Install common dependencies
RUN apk add --no-cache \
    git \
    curl \
    bash \
    ca-certificates \
    tzdata \
    python3 \
    py3-pip \
    build-base \
    && pip3 install --upgrade pip \
    && rm -rf /var/cache/apk/*

# Install Go
RUN curl -L https://golang.org/dl/go${GO_VERSION}.linux-amd64.tar.gz | tar -C /usr/local -xz
ENV PATH=/usr/local/go/bin:${PATH}

# Install pnpm
RUN npm install -g pnpm@${PNPM_VERSION}

# Set working directory
WORKDIR /app

# --- Development Stage ---
# Extended base with development tools

FROM base AS development

# Install development dependencies
RUN apk add --no-cache \
    docker-cli \
    openssl \
    netcat-openbsd \
    && rm -rf /var/cache/apk/*

# Install husky for git hooks
RUN pnpm add -g husky

# --- Production Stage ---
# Optimized for production deployment

FROM base AS production

# Install production dependencies
RUN apk add --no-cache \
    openssl \
    && rm -rf /var/cache/apk/*

# --- Service Builders ---
# These stages build specific services

# App Service (Next.js Frontend)
FROM production AS app-builder

# Set environment for app build
ENV SERVICE=app \
    NEXT_PUBLIC_ENVIRONMENT=production

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile --prod=false

# Copy app source
COPY app/ ./app/

# Build the application
RUN pnpm --filter app run build

# Server Service (Go Backend)
FROM production AS server-builder

# Set environment for server build
ENV SERVICE=server \
    GO111MODULE=on \
    CGO_ENABLED=0

# Copy server source
COPY server/ ./server/

# Build the Go server
WORKDIR /app/server
RUN go build -o /app/server/aether-shield-server ./cmd/server/main.go

# CLI Service (Node.js CLI)
FROM production AS cli-builder

# Set environment for CLI build
ENV SERVICE=cli

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile --prod=false

# Copy CLI source
COPY cli/ ./cli/

# Build the CLI
RUN pnpm --filter cli run build

# --- Final Stages ---
# These stages create the final optimized images

# App Production Image
FROM node:18-alpine AS app-production

# Set environment
ENV NODE_ENV=production \
    PORT=3000 \
    NEXT_PUBLIC_API_URL=http://localhost:3000/api \
    NEXT_PUBLIC_WS_URL=ws://localhost:3000/ws

# Install only production dependencies
COPY --from=app-builder /app/package.json /app/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# Copy built app
COPY --from=app-builder /app/app/.next ./.next
COPY --from=app-builder /app/app/public ./public
COPY --from=app-builder /app/app/package.json ./package.json

# Expose port
EXPOSE 3000

# Start command
CMD ["node", "server.js"]

# Server Production Image
FROM alpine:latest AS server-production

# Install runtime dependencies
RUN apk add --no-cache \
    ca-certificates \
    tzdata \
    && rm -rf /var/cache/apk/*

# Copy built server
COPY --from=server-builder /app/server/aether-shield-server /usr/local/bin/aether-shield-server

# Copy configuration files
COPY --from=server-builder /app/server/config /etc/aether-shield/config

# Set working directory
WORKDIR /var/lib/aether-shield

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Start command
CMD ["aether-shield-server"]

# CLI Production Image
FROM node:18-alpine AS cli-production

# Set environment
ENV NODE_ENV=production

# Install only production dependencies
COPY --from=cli-builder /app/package.json /app/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# Copy built CLI
COPY --from=cli-builder /app/cli/dist ./dist

# Set working directory
WORKDIR /app

# Start command
CMD ["node", "dist/index.js"]

# --- Multi-Service Image ---
# This image contains all services for development

FROM node:18-alpine AS multi-service

# Install build dependencies
RUN apk add --no-cache \
    git \
    curl \
    bash \
    ca-certificates \
    python3 \
    py3-pip \
    build-base \
    docker-cli \
    openssl \
    netcat-openbsd \
    && pip3 install --upgrade pip \
    && rm -rf /var/cache/apk/*

# Install Go
RUN curl -L https://golang.org/dl/go${GO_VERSION}.linux-amd64.tar.gz | tar -C /usr/local -xz
ENV PATH=/usr/local/go/bin:${PATH}

# Install pnpm
RUN npm install -g pnpm@${PNPM_VERSION}

# Install husky for git hooks
RUN pnpm add -g husky

# Copy entire project
COPY . ./

# Set working directory
WORKDIR /app

# Build all services
RUN pnpm install --frozen-lockfile && \
    pnpm --filter app run build && \
    cd server && go build -o /app/server/aether-shield-server ./cmd/server/main.go && \
    cd /app && pnpm --filter cli run build

# Expose all necessary ports
EXPOSE 3000 8080 80 443

# Start all services (for development)
CMD ["./scripts/start-all.sh"]

# --- Entry Point ---
# This is the default target when building without --target

FROM multi-service
