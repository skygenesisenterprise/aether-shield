# Aether Shield Next.js App Makefile
# 
# This Makefile provides commands for developing and building the Next.js application
# with support for both direct execution and Docker-based development.

# Configuration
APP_NAME := aether-shield-app
DOCKER_COMPOSE := docker compose
DOCKER_COMPOSE_FILE := docker-compose.dev.yml
DOCKERFILE := Dockerfile.dev
PORT := 3000

# Colors for better output
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[1;33m
BLUE := \033[0;34m
RESET := \033[0m

# ----------------------------
# Direct development commands
# ----------------------------

.PHONY: dev
dev:
	@echo "$(BLUE)Starting Next.js development server directly...$(RESET)"
	@pnpm dev

.PHONY: build
build:
	@echo "$(BLUE)Building Next.js application...$(RESET)"
	@pnpm build

.PHONY: start
start:
	@echo "$(BLUE)Starting Next.js production server...$(RESET)"
	@pnpm start

.PHONY: lint
lint:
	@echo "$(BLUE)Running ESLint...$(RESET)"
	@pnpm lint

.PHONY: typecheck
typecheck:
	@echo "$(BLUE)Running TypeScript type checking...$(RESET)"
	@pnpm typecheck

# ----------------------------
# Docker-based development
# ----------------------------

.PHONY: docker-dev
docker-dev:
	@echo "$(BLUE)Starting Next.js development with Docker...$(RESET)"
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) up --build

.PHONY: docker-build
docker-build:
	@echo "$(BLUE)Building Docker image for development...$(RESET)"
	@docker build -t $(APP_NAME)-dev -f $(DOCKERFILE) .

.PHONY: docker-up
docker-up:
	@echo "$(BLUE)Starting Docker containers...$(RESET)"
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) up -d --force-recreate

.PHONY: docker-down
docker-down:
	@echo "$(BLUE)Stopping Docker containers...$(RESET)"
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) down

.PHONY: docker-logs
docker-logs:
	@echo "$(BLUE)Showing Docker logs...$(RESET)"
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) logs -f

.PHONY: docker-rebuild
docker-rebuild:
	@echo "$(BLUE)Rebuilding and restarting Docker containers...$(RESET)"
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) down && \
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) up --build -d

# ----------------------------
# Utility commands
# ----------------------------

.PHONY: install
install:
	@echo "$(BLUE)Installing dependencies...$(RESET)"
	@pnpm install

.PHONY: clean
clean:
	@echo "$(BLUE)Cleaning build artifacts...$(RESET)"
	@rm -rf .next node_modules

.PHONY: status
status:
	@echo "$(GREEN)=== Aether Shield Next.js App Status ===$(RESET)"
	@echo "$(BLUE)Node version:$(RESET) $(shell node --version)"
	@echo "$(BLUE)pnpm version:$(RESET) $(shell pnpm --version)"
	@echo "$(BLUE)Docker status:$(RESET) $(shell docker info > /dev/null 2>&1 && echo "Running" || echo "Not running")"
	@echo "$(BLUE)Docker Compose status:$(RESET) $(shell $(DOCKER_COMPOSE) version > /dev/null 2>&1 && echo "Available" || echo "Not available")"

.PHONY: help
help:
	@echo "$(GREEN)=== Aether Shield Next.js App Makefile Help ===$(RESET)"
	@echo "$(YELLOW)Direct Development (using pnpm):$(RESET)"
	@echo "  make dev              - Start development server"
	@echo "  make build            - Build production application"
	@echo "  make start            - Start production server"
	@echo "  make lint             - Run ESLint"
	@echo "  make typecheck        - Run TypeScript type checking"
	@echo "  make install          - Install dependencies"
	@echo "  make clean            - Clean build artifacts"
	@echo ""
	@echo "$(YELLOW)Docker Development:$(RESET)"
	@echo "  make docker-dev       - Start development with Docker"
	@echo "  make docker-build     - Build Docker image"
	@echo "  make docker-up        - Start Docker containers"
	@echo "  make docker-down      - Stop Docker containers"
	@echo "  make docker-logs      - Show Docker logs"
	@echo "  make docker-rebuild   - Rebuild and restart containers"
	@echo ""
	@echo "$(YELLOW)Utility:$(RESET)"
	@echo "  make status           - Show system status"
	@echo "  make help             - Show this help message"

# Default target
.PHONY: default
default: help
