# Infrastructure Docker Makefile
#
# This Makefile provides commands for managing Docker infrastructure services
# including development, production, and utility operations.

# Configuration
COMPOSE_FILE := docker-compose.yml
COMPOSE_FILE_DEV := docker-compose.dev.yml
DOCKER_COMPOSE := docker compose
PORT := 8080

# Colors for better output
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[1;33m
BLUE := \033[0;34m
RESET := \033[0m

# ----------------------------
# Development commands
# ----------------------------

.PHONY: dev
dev:
	@echo "$(BLUE)Starting infrastructure services in development mode...$(RESET)"
	@$(DOCKER_COMPOSE) -f $(COMPOSE_FILE_DEV) up --build

.PHONY: dev-up
dev-up:
	@echo "$(BLUE)Starting development containers...$(RESET)"
	@$(DOCKER_COMPOSE) -f $(COMPOSE_FILE_DEV) up -d --force-recreate

.PHONY: dev-down
dev-down:
	@echo "$(BLUE)Stopping development containers...$(RESET)"
	@$(DOCKER_COMPOSE) -f $(COMPOSE_FILE_DEV) down

.PHONY: dev-logs
dev-logs:
	@echo "$(BLUE)Showing development container logs...$(RESET)"
	@$(DOCKER_COMPOSE) -f $(COMPOSE_FILE_DEV) logs -f

.PHONY: dev-rebuild
dev-rebuild:
	@echo "$(BLUE)Rebuilding development containers...$(RESET)"
	@$(DOCKER_COMPOSE) -f $(COMPOSE_FILE_DEV) down && \
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE_DEV) up --build -d

# ----------------------------
# Production commands
# ----------------------------

.PHONY: up
up:
	@echo "$(BLUE)Starting production containers...$(RESET)"
	@$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) up -d --force-recreate

.PHONY: down
down:
	@echo "$(BLUE)Stopping production containers...$(RESET)"
	@$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) down

.PHONY: logs
logs:
	@echo "$(BLUE)Showing production container logs...$(RESET)"
	@$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) logs -f

.PHONY: restart
restart:
	@echo "$(BLUE)Restarting production containers...$(RESET)"
	@$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) restart

.PHONY: rebuild
rebuild:
	@echo "$(BLUE)Rebuilding production containers...$(RESET)"
	@$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) down && \
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) up --build -d

# ----------------------------
# Build commands
# ----------------------------

.PHONY: build
build:
	@echo "$(BLUE)Building Docker images...$(RESET)"
	@docker build -t aether-infrastructure -f Dockerfile .

.PHONY: build-dev
build-dev:
	@echo "$(BLUE)Building development Docker images...$(RESET)"
	@docker build -t aether-infrastructure-dev -f Dockerfile.dev .

# ----------------------------
# Utility commands
# ----------------------------

.PHONY: ps
ps:
	@echo "$(BLUE)Listing running containers...$(RESET)"
	@$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) ps

.PHONY: ps-dev
ps-dev:
	@echo "$(BLUE)Listing running development containers...$(RESET)"
	@$(DOCKER_COMPOSE) -f $(COMPOSE_FILE_DEV) ps

.PHONY: exec
exec:
	@echo "$(BLUE)Executing command in container...$(RESET)"
	@$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) exec $(SERVICE) $(COMMAND)

.PHONY: shell
shell:
	@echo "$(BLUE)Opening shell in container...$(RESET)"
	@$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) exec $(SERVICE) sh

.PHONY: clean
clean:
	@echo "$(BLUE)Cleaning Docker artifacts...$(RESET)"
	@docker system prune -f
	@rm -rf .dockerignore

.PHONY: status
status:
	@echo "$(GREEN)=== Infrastructure Docker Status ===$(RESET)"
	@echo "$(BLUE)Docker version:$(RESET) $(shell docker --version)"
	@echo "$(BLUE)Docker Compose version:$(RESET) $(shell $(DOCKER_COMPOSE) version)"
	@echo "$(BLUE)Running containers:$(RESET) $(shell docker ps -q | wc -l)"
	@echo "$(BLUE)Total images:$(RESET) $(shell docker images -q | wc -l)"

.PHONY: help
help:
	@echo "$(GREEN)=== Infrastructure Docker Makefile Help ===$(RESET)"
	@echo "$(YELLOW)Development Commands:$(RESET)"
	@echo "  make dev              - Start development services"
	@echo "  make dev-up           - Start development containers"
	@echo "  make dev-down         - Stop development containers"
	@echo "  make dev-logs         - Show development logs"
	@echo "  make dev-rebuild      - Rebuild development containers"
	@echo ""
	@echo "$(YELLOW)Production Commands:$(RESET)"
	@echo "  make up               - Start production containers"
	@echo "  make down             - Stop production containers"
	@echo "  make logs             - Show production logs"
	@echo "  make restart          - Restart production containers"
	@echo "  make rebuild          - Rebuild production containers"
	@echo ""
	@echo "$(YELLOW)Build Commands:$(RESET)"
	@echo "  make build            - Build production Docker images"
	@echo "  make build-dev        - Build development Docker images"
	@echo ""
	@echo "$(YELLOW)Utility Commands:$(RESET)"
	@echo "  make ps               - List running containers"
	@echo "  make ps-dev           - List development containers"
	@echo "  make exec             - Execute command in container"
	@echo "  make shell            - Open shell in container"
	@echo "  make clean            - Clean Docker artifacts"
	@echo "  make status           - Show system status"
	@echo "  make help             - Show this help message"
	@echo ""
	@echo "$(YELLOW)Usage examples:$(RESET)"
	@echo "  SERVICE=web COMMAND='ls -la' make exec"
	@echo "  SERVICE=api make shell"

# Default target
.PHONY: default
default: help
