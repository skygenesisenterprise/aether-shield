<div align="center">

# Aether Shield Docker Infrastructure

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes)
![Container](https://img.shields.io/badge/Container-Ready-2496ED?style=for-the-badge)

**Containerized Deployment Infrastructure for Aether Mailer**

[🎯 Purpose](#-purpose) • [🏗️ Architecture](#️-architecture) • [📁 Structure](#-structure) • [🚀 Deployment](#-deployment) • [⚙️ Configuration](#️-configuration) • [🔧 Development](#️-development)

</div>

---

## 🎯 Purpose

The `/docker/` directory contains **containerization infrastructure** for Aether Mailer, providing production-ready deployment solutions using Docker and Kubernetes.

### 🔄 Role in Ecosystem

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Docker Images │    │   Docker Compose │    │  Kubernetes    │
│   (Build Artifacts)│◄──►│   (Orchestration)│◄──►│  (Production)   │
│  Registry Ready │    │  Multi-Service   │    │  Cluster Ready   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         ▲                       ▲                       ▲
         │                       │                       │
    ┌─────────────────────────────────────────────────────────┐
    │           Aether Mailer Services                │
    │  (Web + API + Core Services)               │
    └─────────────────────────────────────────────────────────┘
```

- **Container Images** - Optimized Docker images for all services
- **Multi-Platform Support** - AMD64, ARM64, RISC-V architectures
- **Production Ready** - Security-hardened and production-optimized
- **Orchestration Ready** - Docker Compose and Kubernetes manifests
- **Configuration Management** - Environment-based configuration system

---

## 🏗️ Architecture

### 📋 Current Implementation Status

> **⚠️ Planning Phase**: Docker infrastructure is in early planning with template structure only.

#### ✅ **Currently Implemented**

- **Manifest Templates** - Multi-architecture Docker manifests
- **Configuration Templates** - Basic app and SSH configuration
- **Multi-Architecture Support** - AMD64, ARM64, RISC-V builds
- **Rootless Support** - Security-focused rootless container variants
- **Tag Management** - Automated version tagging and releases

#### 🔄 **In Development**

- **Dockerfiles** - Optimized container images
- **Docker Compose** - Multi-service orchestration
- **Kubernetes Manifests** - Production deployment configs
- **Security Hardening** - Non-root user, minimal attack surface
- **Health Checks** - Container health monitoring

#### 📋 **Planned Features**

- **Multi-Stage Builds** - Optimized image sizes
- **Base Image Optimization** - Minimal and secure base images
- **CI/CD Integration** - Automated build and deployment
- **Monitoring Integration** - Prometheus metrics and logging
- **Backup/Restore** - Container-based backup solutions

---

## 📁 Directory Structure

```
docker/
├── rootfs/                    # Root filesystem (Linux distro-like)
│   ├── etc/                   # System configuration
│   │   ├── ssh/              # SSH configuration
│   │   │   ├── sshd_config   # SSH daemon configuration
│   │   │   └── banner       # SSH login banner
│   │   ├── pam.d/            # PAM authentication modules
│   │   ├── security/          # Security policies
│   │   ├── hosts             # Hostname resolution
│   │   └── environment        # System environment variables
│   ├── usr/                   # User programs and data
│   │   ├── bin/             # User binaries and scripts
│   │   │   ├── mailer-shell.sh    # CLI shell interface
│   │   │   └── ssh-auth.sh       # Authentication script
│   │   └── local/           # Local software
│   ├── var/                   # Variable data
│   │   └── log/             # System logs
│   │       ├── sshd/         # SSH daemon logs
│   │       └── mailer/       # Application logs
│   ├── opt/                   # Optional add-on software
│   ├── home/                  # User home directories
│   └── tmp/                   # Temporary files
├── config/                     # Build and deployment configs
│   ├── environment/           # Environment-specific variables
│   │   ├── dev.env         # Development environment
│   │   ├── staging.env     # Staging environment
│   │   └── prod.env        # Production environment
│   └── features/             # Optional feature configurations
├── scripts/                    # Build and deployment scripts
├── manifests/                  # Dockerfile and manifests
│   ├── Dockerfile           # Main container image
│   ├── Dockerfile.rootless  # Rootless variant (planned)
│   ├── manifest.tmpl        # Multi-architecture manifest
│   └── manifest.rootless.tmpl
├── tests/                     # Container testing
│   ├── unit/                # Unit tests for container logic
│   ├── integration/         # Integration tests
│   └── security/            # Security scanning
├── docs/                      # Documentation
│   └── architecture.md     # System architecture documentation
├── CODEOWNERS                # Code ownership rules
└── README.md                 # This documentation
```

---

## 🚀 Deployment

### 🐳 **Docker Deployment**

#### **Single Container Deployment**

```bash
# Build image
docker build -t aether-mailer:latest .

# Run container
docker run -d \
  --name aether-mailer \
  -p 8080:8080 \
  -p 25:25 \
  -p 143:143 \
  -p 993:993 \
  -v /var/lib/aether-mailer:/data \
  -v /var/log/aether-mailer:/logs \
  -e DATABASE_URL=postgresql://user:pass@db:5432/aether_mailer \
  aether-mailer:latest
```

#### **Multi-Container Deployment**

```bash
# Using Docker Compose
docker-compose up -d

# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

### ☸️ **Kubernetes Deployment**

#### **Namespace Setup**

```yaml
# kubernetes/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: aether-mailer
  labels:
    name: aether-mailer
    app: aether-mailer
```

#### **Configuration Management**

```yaml
# kubernetes/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: aether-mailer-config
  namespace: aether-mailer
data:
  DATABASE_HOST: "postgres-service"
  DATABASE_PORT: "5432"
  REDIS_HOST: "redis-service"
  REDIS_PORT: "6379"
  LOG_LEVEL: "info"
  NODE_ENV: "production"
```

#### **Application Deployment**

```yaml
# kubernetes/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aether-mailer
  namespace: aether-mailer
  labels:
    app: aether-mailer
spec:
  replicas: 3
  selector:
    matchLabels:
      app: aether-mailer
  template:
    metadata:
      labels:
        app: aether-mailer
    spec:
      containers:
        - name: aether-mailer
          image: skygenesisenterprise/aether-mailer:latest
          ports:
            - containerPort: 8080
              name: http
            - containerPort: 25
              name: smtp
            - containerPort: 143
              name: imap
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: aether-mailer-secrets
                  key: database-url
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          livenessProbe:
            httpGet:
              path: /health
              port: 8080
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /health
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 5
```

---

## ⚙️ Configuration

### 🐳 **Dockerfile Structure**

#### **Multi-Stage Build**

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM alpine:3.18
RUN apk add --no-cache \
    ca-certificates \
    tzdata \
    && rm -rf /var/cache/apk

# Create non-root user
RUN addgroup -g 1001 -S aether && \
    adduser -u 1001 -S aether -G aether

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Set permissions
RUN chown -R aether:aether /app
USER aether

EXPOSE 8080 25 143 993

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

CMD ["node", "dist/server.js"]
```

#### **Rootless Variant**

```dockerfile
FROM alpine:3.18
RUN apk add --no-cache \
    ca-certificates \
    tzdata \
    curl \
    && rm -rf /var/cache/apk

# Create non-root user with minimal permissions
RUN addgroup -g 1001 -S aether && \
    adduser -u 1001 -S aether -G aether

WORKDIR /app
COPY --chown=aether:aether dist/ ./dist
COPY --chown=aether:aether root/etc/ /etc/

USER aether

EXPOSE 8080 25 143 993

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

CMD ["node", "dist/server.js"]
```

### 📋 **Docker Compose Configuration**

#### **Development Environment**

```yaml
# docker-compose.yml
version: "3.8"

services:
  aether-mailer:
    build:
      context: ..
      dockerfile: docker/Dockerfile
    ports:
      - "8080:8080" # API/Web
      - "25:25" # SMTP
      - "143:143" # IMAP
      - "993:993" # IMAPS
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://aether:password@postgres:5432/aether_mailer
      - REDIS_URL=redis://redis:6379
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=aether_mailer
      - POSTGRES_USER=aether
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

#### **Production Environment**

```yaml
# docker-compose.prod.yml
version: "3.8"

services:
  aether-mailer:
    image: skygenesisenterprise/aether-mailer:latest
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: "1.0"
          memory: 1G
        reservations:
          cpus: "0.5"
          memory: 512M
    ports:
      - "8080:8080"
      - "25:25"
      - "143:143"
      - "993:993"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - JWT_SECRET=${JWT_SECRET}
    volumes:
      - aether_data:/app/data
      - aether_logs:/app/logs
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - aether-mailer
    restart: always

volumes:
  aether_data:
    driver: local
  aether_logs:
    driver: local
```

---

## 🔧 Development

### 🛠️ **Build Commands**

```bash
# Build for multiple architectures
docker buildx build \
  --platform linux/amd64,linux/arm64,linux/riscv64 \
  --tag skygenesisenterprise/aether-mailer:latest \
  --push .

# Build specific architecture
docker buildx build \
  --platform linux/amd64 \
  --tag skygenesisenterprise/aether-mailer:amd64 \
  .

# Build rootless variant
docker build \
  -f Dockerfile.rootless \
  --tag skygenesisenterprise/aether-mailer:rootless \
  .
```

### 🚀 **Deployment Scripts**

#### **Multi-Architecture Build Script**

```bash
#!/bin/bash
# scripts/build.sh

set -e

VERSION=${1:-latest}
REGISTRY="skygenesisenterprise/aether-mailer"

echo "Building Aether Mailer Docker images for version: $VERSION"

# Create builder if not exists
docker buildx create --name aether-builder --use || true

# Build for multiple architectures
docker buildx build \
  --builder aether-builder \
  --platform linux/amd64,linux/arm64,linux/riscv64 \
  --tag $REGISTRY:$VERSION \
  --tag $REGISTRY:latest \
  --push \
  .

# Build rootless variants
docker buildx build \
  --builder aether-builder \
  --platform linux/amd64,linux/arm64,linux/riscv64 \
  --tag $REGISTRY:$VERSION-rootless \
  --tag $REGISTRY:latest-rootless \
  --push \
  -f Dockerfile.rootless \
  .

echo "Build completed successfully!"
```

#### **Kubernetes Deployment Script**

```bash
#!/bin/bash
# scripts/deploy.sh

set -e

NAMESPACE=${1:-aether-mailer}
ENVIRONMENT=${2:-production}
VERSION=${3:-latest}

echo "Deploying Aether Mailer to namespace: $NAMESPACE"

# Create namespace
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# Apply configurations
kubectl apply -f kubernetes/ -n $NAMESPACE

# Wait for deployment
kubectl rollout status deployment/aether-mailer -n $NAMESPACE --timeout=300s

# Get service URL
SERVICE_URL=$(kubectl get service aether-mailer -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
echo "Deployment completed! Service available at: $SERVICE_URL"
```

### 🧪 **Testing**

#### **Container Testing**

```bash
# Test container locally
docker run --rm \
  -p 8080:8080 \
  -e NODE_ENV=test \
  aether-mailer:latest

# Run integration tests
docker-compose -f docker-compose.test.yml up --abort-on-container-exit

# Security scanning
docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy:latest \
  image skygenesisenterprise/aether-mailer:latest
```

---

## 🔒 Security

### 🛡️ **Security Best Practices**

#### **Container Security**

- **Non-Root User** - All containers run as non-root user
- **Minimal Base Images** - Use Alpine Linux for minimal attack surface
- **Multi-Stage Builds** - Separate build and runtime environments
- **Read-Only Filesystem** - Mount filesystems as read-only where possible
- **Resource Limits** - Set CPU and memory limits
- **Health Checks** - Implement proper health monitoring

#### **Image Security**

- **Vulnerability Scanning** - Regular security scans with Trivy
- **Base Image Updates** - Keep base images updated
- **Minimal Dependencies** - Only include necessary packages
- **Secrets Management** - Use Kubernetes secrets, not environment variables
- **Image Signing** - Sign images for verification

#### **Runtime Security**

```dockerfile
# Security-focused Dockerfile example
FROM alpine:3.18 AS security-base

# Install security updates
RUN apk update && \
    apk upgrade && \
    apk add --no-cache \
        ca-certificates \
        curl && \
    rm -rf /var/cache/apk

# Create non-root user with specific UID/GID
RUN addgroup -g 1001 -S aether && \
    adduser -u 1001 -S aether -G aether && \
    mkdir -p /app/data /app/logs && \
    chown -R aether:aether /app

# Set security-focused permissions
RUN chmod 755 /app && \
    chmod 700 /app/data /app/logs

USER aether
WORKDIR /app
```

---

## 📊 Current Status

| Component                   | Status     | Notes                       |
| --------------------------- | ---------- | --------------------------- |
| **Manifest Templates**      | ✅ Working | Multi-arch support          |
| **Configuration Templates** | ✅ Working | Basic app/SSH configs       |
| **Dockerfiles**             | 📋 Planned | Optimized images            |
| **Docker Compose**          | 📋 Planned | Multi-service orchestration |
| **Kubernetes Manifests**    | 📋 Planned | Production deployment       |
| **Build Scripts**           | 📋 Planned | Multi-arch builds           |
| **Security Hardening**      | 📋 Planned | Non-root, minimal images    |
| **CI/CD Integration**       | 📋 Planned | Automated builds            |
| **Health Checks**           | 📋 Planned | Container monitoring        |

---

## 🚀 Roadmap

### 🎯 **Phase 1: Foundation (Q1 2025)**

- **Dockerfiles** - Optimized multi-stage builds
- **Docker Compose** - Development and production configs
- **Build Scripts** - Multi-architecture build automation
- **Basic Security** - Non-root user, minimal base images
- **Health Checks** - Container health monitoring

### 🚀 **Phase 2: Production Ready (Q2 2025)**

- **Kubernetes Manifests** - Complete deployment configs
- **Security Hardening** - Advanced security practices
- **Monitoring Integration** - Prometheus metrics and logging
- **CI/CD Pipeline** - Automated build and deployment
- **Backup Solutions** - Container-based backup/restore

### ⚙️ **Phase 3: Enterprise Features (Q3 2025)**

- **Multi-Environment** - Dev/staging/prod configurations
- **Auto-Scaling** - Horizontal pod autoscaling
- **Service Mesh** - Istio/Linkerd integration
- **Advanced Security** - Pod security policies, network policies
- **Performance Optimization** - Resource tuning and monitoring

### 🌟 **Phase 4: Cloud Native (Q4 2025)**

- **Cloud Provider Support** - AWS EKS, GCP GKE, Azure AKS
- **GitOps** - ArgoCD/Flux integration
- **Observability** - Full monitoring stack (metrics, logs, traces)
- **Disaster Recovery** - Multi-region deployment
- **Cost Optimization** - Resource usage optimization

---

## 🤝 Contributing

### 🎯 **How to Contribute**

The Docker infrastructure is perfect for contributors with expertise in:

- **Containerization** - Docker optimization and best practices
- **Kubernetes** - Orchestration and deployment strategies
- **DevOps** - CI/CD pipelines and automation
- **Security** - Container security and hardening
- **Infrastructure** - Cloud deployment and monitoring
- **Multi-Architecture** - Cross-platform container builds

### 📝 **Adding New Features**

1. **Update Dockerfiles**

   ```dockerfile
   # Add new security features
   # Optimize layer caching
   # Add health checks
   ```

2. **Update Compose Files**

   ```yaml
   # Add new services
   # Update environment variables
   # Add volume mounts
   ```

3. **Create Kubernetes Manifests**

   ```yaml
   # Define new resources
   # Add security contexts
   # Configure networking
   ```

4. **Update Build Scripts**
   ```bash
   # Add new build targets
   # Update deployment logic
   # Add testing steps
   ```

### 🏗️ **Development Guidelines**

- **Security First** - All containers must be security-hardened
- **Multi-Architecture** - Support AMD64, ARM64, RISC-V
- **Production Ready** - All configs must work in production
- **Documentation** - Update documentation for all changes
- **Testing** - Test all container images and deployments

---

## 📞 Support & Resources

### 📖 **Documentation**

- **[Docker Reference](https://docs.docker.com/)** - Official Docker documentation
- **[Kubernetes Docs](https://kubernetes.io/docs/)** - Kubernetes reference
- **[Docker Compose](https://docs.docker.com/compose/)** - Compose documentation
- **[Container Security](https://snyk.io/blog/)** - Security best practices

### 💬 **Getting Help**

- **GitHub Issues** - Container and deployment issues
- **Discussions** - Infrastructure questions and ideas
- **Development Team** - Contact DevOps maintainers

---

## 📄 License

This Docker infrastructure is part of the Aether Mailer project, licensed under the **MIT License** - see the [LICENSE](../LICENSE) file for details.

---

<div align="center">

### 🐳 **Production-Ready Container Infrastructure for Aether Mailer**

[⭐ Star Project](https://github.com/skygenesisenterprise/aether-mailer) • [🐛 Report Issues](https://github.com/skygenesisenterprise/aether-mailer/issues) • [💡 Start Discussion](https://github.com/skygenesisenterprise/aether-mailer/discussions)

---

**🐳 Currently in Planning Phase - DevOps Engineers Welcome!**

**Made with ❤️ by the [Sky Genesis Enterprise](https://skygenesisenterprise.com) DevOps team**

_Building secure, scalable, and production-ready container infrastructure_

</div>
