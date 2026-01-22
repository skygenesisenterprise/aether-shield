# Aether Shield i18n - Dockerfile
# Multi-stage build for the internationalization system

# ============================================
# Stage 1: Build Stage
# ============================================
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN corepack enable && \
    pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the application
RUN pnpm build

# ============================================
# Stage 2: Production Stage
# ============================================
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN corepack enable && \
    pnpm install --prod --frozen-lockfile

# Copy built application from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Copy translation files
COPY public/locales ./public/locales

# Copy environment variables
COPY .env.production .env

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "./node_modules/next/dist/bin/next", "start", "-p", "3000"]

# ============================================
# Stage 3: Development Stage (optional)
# ============================================
FROM node:18-alpine AS dev

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies
RUN corepack enable && \
    pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Expose the port
EXPOSE 3000

# Command to run in development mode
CMD ["pnpm", "dev"]
