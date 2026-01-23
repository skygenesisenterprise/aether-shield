# Aether Shield Development Dockerfile
# This Dockerfile creates a development environment with hot-reload
# for both Go backend and Next.js frontend
#
# Usage:
# - docker build -t aether-shield-dev -f infrastructure/docker/Dockerfile .
# - docker run -it --rm -p 3000:3000 -p 8080:8080 -v $(pwd):/app -v /app/node_modules aether-shield-dev
#
# Supported build arguments:
# - NODE_VERSION: Node.js version (default: 18)
# - GO_VERSION: Go version (default: 1.21)
# - PNPM_VERSION: pnpm version (default: latest)
#
# =====================================
# Development Environment
# =====================================

FROM docker.io/library/node:18-alpine

# Set environment variables
ARG NODE_VERSION=18
ARG GO_VERSION=1.21
ARG PNPM_VERSION=latest

ENV NODE_ENV=development \
    PNPM_VERSION=${PNPM_VERSION} \
    GO_VERSION=${GO_VERSION} \
    PORT=3000 \
    API_PORT=8080

# Install dependencies
RUN apk add --no-cache \
    git \
    curl \
    bash \
    ca-certificates \
    tzdata \
    python3 \
    py3-pip \
    build-base \
    openssl \
    postgresql-dev \
    && pip3 install --upgrade pip \
    && rm -rf /var/cache/apk/*

# Install Go
RUN curl -L https://golang.org/dl/go${GO_VERSION}.linux-amd64.tar.gz | tar -C /usr/local -xz
ENV PATH=/usr/local/go/bin:${PATH}

# Install pnpm
RUN npm install -g pnpm@${PNPM_VERSION}

# Install watchman for better file watching
RUN npm install -g watchman

# Set working directory
WORKDIR /app

# Copy all source files
COPY . ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Generate Prisma client
RUN cd prisma && npx prisma generate

# Expose ports
EXPOSE 3000 8080

# Start script
COPY infrastructure/docker/start-dev.sh /start-dev.sh
RUN chmod +x /start-dev.sh

# Start development servers
CMD ["/start-dev.sh"]
