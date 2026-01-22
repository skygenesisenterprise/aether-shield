<div align="center">

# 🧪 Aether Shield Test Suite

[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](https://github.com/skygenesisenterprise/aether-shield/blob/main/LICENSE) [![Go](https://img.shields.io/badge/Go-1.21+-blue?style=for-the-badge&logo=go)](https://golang.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/) [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/) [![React](https://img.shields.io/badge/React-19.2.1-blue?style=for-the-badge&logo=react)](https://react.dev/)

**🧪 Comprehensive Test Suite for Aether Shield - Ensuring Quality Across All Components**

A complete testing framework for the Aether Shield project, covering unit tests, integration tests, end-to-end tests, and performance testing across all components including Go backend, TypeScript frontend, and the package ecosystem.

[🚀 Quick Start](#-quick-start) • [📋 Test Structure](#-test-structure) • [🛠️ Test Types](#️-test-types) • [📊 Test Coverage](#-test-coverage) • [🔧 Running Tests](#-running-tests) • [🤝 Contributing](#-contributing)

[![GitHub stars](https://img.shields.io/github/stars/skygenesisenterprise/aether-shield?style=social)](https://github.com/skygenesisenterprise/aether-shield/stargazers) [![GitHub forks](https://img.shields.io/github/forks/skygenesisenterprise/aether-shield?style=social)](https://github.com/skygenesisenterprise/aether-shield/network) [![GitHub issues](https://img.shields.io/github/issues/github/skygenesisenterprise/aether-shield)](https://github.com/skygenesisenterprise/aether-shield/issues)

</div>

---

## 🌟 What is the Aether Shield Test Suite?

**Aether Shield Test Suite** is a comprehensive testing framework designed to ensure the quality, reliability, and performance of the Aether Shield project across all its components:

- **Go Backend** - Unit tests, integration tests, and performance tests
- **TypeScript Frontend** - Component tests, page tests, and interaction tests
- **Package Ecosystem** - SDK tests, CLI tests, and integration tests
- **Database Layer** - Migration tests, query tests, and data integrity tests
- **API Endpoints** - End-to-end tests, security tests, and load tests

### 🎯 Our Testing Vision

- **📈 High Coverage** - Aim for 90%+ test coverage across all components
- **🔄 Continuous Integration** - Automated testing on every commit and pull request
- **🛡️ Quality Assurance** - Comprehensive validation of all features and edge cases
- **⚡ Performance Testing** - Load testing and benchmarking for production readiness
- **🔒 Security Testing** - Vulnerability scanning and security validation
- **📊 Detailed Reporting** - Clear test reports with actionable insights

---

## 📋 Test Structure

The test suite follows a modular structure that mirrors the project architecture:

```
tests/
├── e2e/                     # End-to-End Tests
│   ├── api/                 # API Endpoint Tests
│   ├── authentication/      # Authentication Flow Tests
│   ├── components/          # Component Interaction Tests
│   ├── pages/               # Page Navigation Tests
│   └── scenarios/           # User Scenario Tests
├── integration/             # Integration Tests
│   ├── backend/             # Backend Integration Tests
│   ├── frontend/            # Frontend Integration Tests
│   ├── database/            # Database Integration Tests
│   └── package/             # Package Integration Tests
├── unit/                    # Unit Tests
│   ├── backend/             # Go Backend Unit Tests
│   │   ├── controllers/      # Controller Unit Tests
│   │   ├── services/         # Service Unit Tests
│   │   ├── models/           # Model Unit Tests
│   │   └── utils/            # Utility Unit Tests
│   ├── frontend/            # Frontend Unit Tests
│   │   ├── components/       # Component Unit Tests
│   │   ├── hooks/            # Hook Unit Tests
│   │   ├── context/          # Context Unit Tests
│   │   └── utils/            # Utility Unit Tests
│   └── package/             # Package Unit Tests
│       ├── github/          # GitHub App Tests
│       ├── golang/          # Go SDK Tests
│       └── node/            # Node.js SDK Tests
├── performance/             # Performance Tests
│   ├── load/                # Load Testing
│   ├── benchmark/           # Benchmark Tests
│   └── stress/              # Stress Testing
├── security/                # Security Tests
│   ├── vulnerability/       # Vulnerability Scanning
│   ├── penetration/         # Penetration Testing
│   └── compliance/          # Compliance Testing
└── utils/                   # Test Utilities
    ├── fixtures/            # Test Data Fixtures
    ├── mocks/               # Mock Implementations
    ├── helpers/             # Test Helpers
    └── reporters/           # Custom Reporters
```

---

## 🛠️ Test Types

### 🔍 Unit Tests

**Purpose**: Test individual components in isolation

**Technologies**:

- **Go**: `testing` package with `testify` assertions
- **TypeScript**: Jest + React Testing Library
- **Coverage**: 90%+ target for critical components

**Examples**:

```go
// Go Backend Unit Test
func TestUserService_CreateUser(t *testing.T) {
    mockDB := NewMockDatabase()
    service := NewUserService(mockDB)

    user := models.User{Name: "Test User", Email: "test@example.com"}
    createdUser, err := service.CreateUser(user)

    assert.NoError(t, err)
    assert.Equal(t, user.Name, createdUser.Name)
}
```

```typescript
// TypeScript Frontend Unit Test
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from '@/components/login-form';

test('renders login form', () => {
  render(<LoginForm />);
  expect(screen.getByLabelText('Email')).toBeInTheDocument();
  expect(screen.getByLabelText('Password')).toBeInTheDocument();
});
```

### 🔗 Integration Tests

**Purpose**: Test interactions between components

**Technologies**:

- **Go**: `testing` with real database connections
- **TypeScript**: Jest with API mocking
- **Coverage**: 80%+ target for integration paths

**Examples**:

```go
// Go Backend Integration Test
func TestUserController_CreateUser(t *testing.T) {
    db := SetupTestDatabase()
    router := SetupTestRouter(db)

    body := `{"name":"Test User","email":"test@example.com","password":"secret"}`
    req, _ := http.NewRequest("POST", "/api/users", bytes.NewBufferString(body))
    req.Header.Set("Content-Type", "application/json")

    w := httptest.NewRecorder()
    router.ServeHTTP(w, req)

    assert.Equal(t, http.StatusCreated, w.Code)
}
```

```typescript
// TypeScript Frontend Integration Test
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '@/app/login/page';

test('login with valid credentials', async () => {
  render(<LoginPage />);

  userEvent.type(screen.getByLabelText('Email'), 'user@example.com');
  userEvent.type(screen.getByLabelText('Password'), 'password123');
  userEvent.click(screen.getByRole('button', { name: /login/i }));

  await waitFor(() => {
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
```

### 🌐 End-to-End Tests

**Purpose**: Test complete user flows

**Technologies**:

- **Playwright** - Browser automation
- **Cypress** - Alternative E2E testing
- **Coverage**: 70%+ target for critical user journeys

**Examples**:

```typescript
// Playwright E2E Test
import { test, expect } from "@playwright/test";

test("user can complete registration flow", async ({ page }) => {
  await page.goto("/register");

  await page.fill('input[name="name"]', "Test User");
  await page.fill('input[name="email"]', "test@example.com");
  await page.fill('input[name="password"]', "password123");
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL("/dashboard");
  await expect(page.getByText("Welcome, Test User")).toBeVisible();
});
```

### ⚡ Performance Tests

**Purpose**: Measure system performance under load

**Technologies**:

- **k6** - Load testing
- **JMeter** - Alternative load testing
- **Go Benchmark** - Micro-benchmarking

**Examples**:

```javascript
// k6 Load Test
import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 100,
  duration: "30s",
};

export default function () {
  const res = http.get("http://localhost:8080/api/users");
  check(res, {
    "status is 200": (r) => r.status === 200,
  });
  sleep(1);
}
```

```go
// Go Benchmark Test
func BenchmarkUserService_CreateUser(b *testing.B) {
    db := SetupBenchmarkDatabase()
    service := NewUserService(db)

    user := models.User{Name: "Test User", Email: "test@example.com"}

    b.ResetTimer()
    for i := 0; i < b.N; i++ {
        _, _ = service.CreateUser(user)
    }
}
```

### 🔒 Security Tests

**Purpose**: Identify security vulnerabilities

**Technologies**:

- **OWASP ZAP** - Web application security scanning
- **Trivy** - Container vulnerability scanning
- **Dependabot** - Dependency vulnerability monitoring

**Examples**:

```bash
# OWASP ZAP Scan
zap-baseline.py -t http://localhost:3000 -r zap-report.html

# Trivy Scan
trivy image aether-shield:latest

# Dependabot (automated)
# Configured in .github/dependabot.yml
```

---

## 📊 Test Coverage

### 🎯 Coverage Goals

| Component           | Target Coverage | Current Coverage | Status         |
| ------------------- | --------------- | ---------------- | -------------- |
| Go Backend          | 90%             | 85%              | 🟡 In Progress |
| TypeScript Frontend | 85%             | 80%              | 🟡 In Progress |
| Package Ecosystem   | 80%             | 75%              | 🟡 In Progress |
| Database Layer      | 95%             | 92%              | 🟢 Good        |
| API Endpoints       | 90%             | 88%              | 🟡 In Progress |
| Overall             | 88%             | 83%              | 🟡 In Progress |

### 📈 Coverage Reports

Coverage reports are generated for each test run and can be viewed in:

- **HTML Reports**: `tests/coverage/html/index.html`
- **LCOV Reports**: `tests/coverage/lcov.info`
- **CI Reports**: Available in GitHub Actions artifacts

---

## 🚀 Quick Start

### 📋 Prerequisites

- **Node.js** 18.0.0 or higher (for frontend tests)
- **pnpm** 9.0.0 or higher (recommended package manager)
- **Go** 1.21.0 or higher (for backend tests)
- **PostgreSQL** 14.0 or higher (for database tests)
- **Docker** (optional, for containerized testing)
- **Make** (for command shortcuts)

### 🔧 Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/skygenesisenterprise/aether-shield.git
   cd aether-shield
   ```

2. **Install dependencies**

   ```bash
   make install
   ```

3. **Setup test environment**

   ```bash
   make test-env
   ```

4. **Run all tests**

   ```bash
   make test
   ```

### 🌐 Access Test Reports

After running tests, you can view the coverage reports:

- **HTML Coverage**: Open `tests/coverage/html/index.html` in your browser
- **LCOV Report**: View `tests/coverage/lcov.info`
- **Test Results**: View `tests/results/junit.xml`

---

## 🔧 Running Tests

### 🎯 Make Commands

```bash
# 🧪 Run All Tests
make test                # Run all tests
make test-unit           # Run unit tests only
make test-integration    # Run integration tests only
make test-e2e            # Run end-to-end tests only
make test-performance    # Run performance tests
make test-security       # Run security tests

# 📊 Coverage Reports
make coverage            # Generate coverage reports
make coverage-html       # Generate HTML coverage report
make coverage-lcov       # Generate LCOV coverage report

# 🔧 Go Backend Tests
make go-test             # Run Go backend tests
make go-test-cover       # Run Go tests with coverage
make go-benchmark        # Run Go benchmarks

# 🏗️ TypeScript Frontend Tests
make ts-test             # Run TypeScript tests
make ts-test-cover       # Run TypeScript tests with coverage
make ts-test-watch       # Run TypeScript tests in watch mode

# 📦 Package Tests
make test-packages       # Run all package tests
make test-github         # Run GitHub App tests
make test-golang         # Run Go SDK tests
make test-node           # Run Node.js SDK tests

# 🗄️ Database Tests
make db-test             # Run database tests
make db-migrate-test     # Run migration tests
make db-seed-test        # Run seed tests

# 🔄 Continuous Integration
make ci-test             # Run CI test suite
make ci-test-quick       # Run quick CI test suite

# 📋 Test Utilities
make test-fix            # Auto-fix test files
make test-lint           # Lint test files
make test-format         # Format test files
```

### 📋 Detailed Test Commands

#### 🔧 Go Backend Tests

```bash
# Run all Go tests
cd server && go test ./...

# Run tests with coverage
cd server && go test -coverprofile=coverage.out ./...

# Run specific package tests
cd server && go test ./controllers/...

# Run benchmarks
cd server && go test -bench=. ./...

# Run tests with race detector
cd server && go test -race ./...
```

#### 🏗️ TypeScript Frontend Tests

```bash
# Run all TypeScript tests
pnpm test

# Run tests with coverage
pnpm test -- --coverage

# Run tests in watch mode
pnpm test -- --watch

# Run specific test file
pnpm test -- components/login-form.test.tsx

# Run E2E tests
pnpm test:e2e
```

#### 📦 Package Tests

```bash
# Run all package tests
make test-packages

# Run GitHub App tests
cd package/github && pnpm test

# Run Go SDK tests
cd package/golang && go test ./...

# Run Node.js SDK tests
cd package/node && pnpm test
```

#### 🗄️ Database Tests

```bash
# Run database tests
make db-test

# Run migration tests
make db-migrate-test

# Run seed tests
make db-seed-test

# Run with test database
TEST_DB_URL=postgresql://test:test@localhost:5432/test make db-test
```

#### 🌐 End-to-End Tests

```bash
# Run Playwright tests
pnpm test:e2e

# Run Playwright tests in headed mode
pnpm test:e2e -- --headed

# Run specific E2E test
pnpm test:e2e -- --grep "login"

# Generate E2E test report
pnpm test:e2e -- --reporter=html
```

#### ⚡ Performance Tests

```bash
# Run k6 load tests
k6 run tests/performance/load/test.js

# Run Go benchmarks
make go-benchmark

# Run stress tests
k6 run tests/performance/stress/test.js
```

#### 🔒 Security Tests

```bash
# Run OWASP ZAP scan
zap-baseline.py -t http://localhost:3000 -r zap-report.html

# Run Trivy scan
trivy image aether-shield:latest

# Run dependency audit
pnpm audit
```

---

## 📋 Test Development Guidelines

### 🎯 Best Practices

1. **Test Naming**: Use descriptive test names that explain what is being tested
2. **Test Isolation**: Each test should be independent and not depend on other tests
3. **Test Data**: Use fixtures and mocks to avoid test pollution
4. **Assertions**: Make assertions clear and specific
5. **Setup/Cleanup**: Properly set up and clean up test state
6. **Performance**: Keep tests fast and avoid unnecessary operations
7. **Documentation**: Document complex test scenarios

### 📝 Test Structure

```typescript
// TypeScript Test Structure
describe('Component Name', () => {
  beforeEach(() => {
    // Setup test state
  });

  afterEach(() => {
    // Clean up test state
  });

  it('should do something when something happens', () => {
    // Arrange
    const mockData = { ... };

    // Act
    render(<Component data={mockData} />);
    fireEvent.click(screen.getByRole('button'));

    // Assert
    expect(screen.getByText('Expected Result')).toBeInTheDocument();
  });
});
```

```go
// Go Test Structure
func TestComponent_Name(t *testing.T) {
    // Setup
    mockDB := NewMockDatabase()
    service := NewService(mockDB)

    // Test Cases
    tests := []struct {
        name     string
        input    interface{}
        expected interface{}
        wantErr  bool
    }{
        {
            name:     "happy path",
            input:    validInput,
            expected: expectedResult,
            wantErr:  false,
        },
        {
            name:     "error case",
            input:    invalidInput,
            expected: nil,
            wantErr:  true,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result, err := service.Method(tt.input)

            if (err != nil) != tt.wantErr {
                t.Errorf("unexpected error: %v", err)
            }

            if !reflect.DeepEqual(result, tt.expected) {
                t.Errorf("got %v, want %v", result, tt.expected)
            }
        })
    }
}
```

### 🔧 Test Utilities

#### Fixtures

```typescript
// tests/utils/fixtures/users.ts
import { User } from "@/types/user";

export const mockUser: User = {
  id: "1",
  name: "Test User",
  email: "test@example.com",
  role: "user",
};

export const mockAdminUser: User = {
  id: "2",
  name: "Admin User",
  email: "admin@example.com",
  role: "admin",
};
```

```go
// tests/utils/fixtures/users.go
package fixtures

import "github.com/skygenesisenterprise/aether-shield/server/models"

var MockUser = models.User{
    ID:    "1",
    Name:  "Test User",
    Email: "test@example.com",
    Role:  "user",
}

var MockAdminUser = models.User{
    ID:    "2",
    Name:  "Admin User",
    Email: "admin@example.com",
    Role:  "admin",
}
```

#### Mocks

```typescript
// tests/utils/mocks/api.ts
import { vi } from "vitest";

export const mockApiClient = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};
```

```go
// tests/utils/mocks/database.go
package mocks

import "github.com/stretchr/testify/mock"

type MockDatabase struct {
    mock.Mock
}

func (m *MockDatabase) GetUser(id string) (*models.User, error) {
    args := m.Called(id)
    return args.Get(0).(*models.User), args.Error(1)
}

func (m *MockDatabase) CreateUser(user models.User) (*models.User, error) {
    args := m.Called(user)
    return args.Get(0).(*models.User), args.Error(1)
}
```

#### Helpers

```typescript
// tests/utils/helpers/render.ts
import { render as rtlRender } from '@testing-library/react';
import { JwtAuthProvider } from '@/context/JwtAuthContext';

export function renderWithAuth(ui: React.ReactElement, authState = {}) {
  return rtlRender(
    <JwtAuthProvider initialState={authState}>
      {ui}
    </JwtAuthProvider>
  );
}
```

```go
// tests/utils/helpers/testdb.go
package helpers

import (
    "github.com/skygenesisenterprise/aether-shield/server/models"
    "gorm.io/gorm"
)

func SetupTestDatabase() *gorm.DB {
    db, _ := gorm.Open(postgres.Open("test_db_url"), &gorm.Config{})
    db.AutoMigrate(&models.User{})
    return db
}
```

---

## 🤝 Contributing to Tests

We welcome contributions to improve our test coverage and quality! Here's how you can help:

### 🎯 How to Get Started

1. **Fork the repository** and create a feature branch
2. **Identify areas** with low coverage or missing tests
3. **Write comprehensive tests** following our guidelines
4. **Run the test suite** to ensure everything passes
5. **Submit a pull request** with your test improvements

### 🏗️ Areas Needing Help

- **Go Backend Tests** - Increase coverage for controllers, services, and utilities
- **TypeScript Frontend Tests** - Add tests for new components and pages
- **Package Tests** - Improve coverage for GitHub App, Go SDK, and Node.js SDK
- **Database Tests** - Add tests for complex queries and migrations
- **E2E Tests** - Create tests for critical user journeys
- **Performance Tests** - Add load and stress tests for production scenarios
- **Security Tests** - Implement vulnerability scanning and penetration tests

### 📝 Test Contribution Process

1. **Choose an area** - Identify components that need test coverage
2. **Read test guidelines** - Understand our testing conventions
3. **Create a branch** with a descriptive name (e.g., `test/authentication`)
4. **Implement tests** following our structure and best practices
5. **Run tests locally** to ensure they pass
6. **Update coverage reports** if needed
7. **Submit a pull request** with clear description and test results
8. **Address feedback** from maintainers

---

## 📞 Support & Community

### 💬 Get Help

- 📖 **[Documentation](docs/)** - Comprehensive guides and API docs
- 🐛 **[GitHub Issues](https://github.com/skygenesisenterprise/aether-shield/issues)** - Bug reports and feature requests
- 💡 **[GitHub Discussions](https://github.com/skygenesisenterprise/aether-shield/discussions)** - General questions and ideas
- 📧 **Email** - support@skygenesisenterprise.com

### 🐛 Reporting Test Issues

When reporting test-related issues, please include:

- Clear description of the problem
- Steps to reproduce
- Environment information (Go version, Node.js version, OS, etc.)
- Test logs or screenshots
- Expected vs actual behavior
- Test file and line number (if applicable)

---

## 📊 Test Status

| Component               | Status         | Coverage Target | Current Coverage | Notes                            |
| ----------------------- | -------------- | --------------- | ---------------- | -------------------------------- |
| **Go Backend**          | 🟡 In Progress | 90%             | 85%              | Controllers, services, models    |
| **TypeScript Frontend** | 🟡 In Progress | 85%             | 80%              | Components, hooks, context       |
| **Package Ecosystem**   | 🟡 In Progress | 80%             | 75%              | GitHub App, Go SDK, Node.js SDK  |
| **Database Layer**      | 🟢 Good        | 95%             | 92%              | Migrations, queries, data models |
| **API Endpoints**       | 🟡 In Progress | 90%             | 88%              | REST API, WebSocket, GraphQL     |
| **E2E Tests**           | 🔄 In Progress | 70%             | 65%              | User flows, scenarios            |
| **Performance Tests**   | 📋 Planned     | 60%             | 50%              | Load, stress, benchmark          |
| **Security Tests**      | 📋 Planned     | 50%             | 40%              | Vulnerability, penetration       |
| **Overall**             | 🟡 In Progress | 88%             | 83%              | Comprehensive test suite         |

---

## 🏆 Sponsors & Partners

**Development led by [Sky Genesis Enterprise](https://skygenesisenterprise.com)**

We're looking for sponsors and partners to help accelerate development of this open-source testing framework.

[🤝 Become a Sponsor](https://github.com/sponsors/skygenesisenterprise)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Sky Genesis Enterprise

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🙏 Acknowledgments

- **Sky Genesis Enterprise** - Project leadership and evolution
- **Go Community** - High-performance programming language and ecosystem
- **Jest Team** - Excellent JavaScript testing framework
- **React Testing Library** - Simple and complete React DOM testing utilities
- **Playwright Team** - Reliable end-to-end testing for modern web apps
- **k6 Team** - Developer-centric load testing
- **OWASP ZAP Team** - Web application security scanning
- **Trivy Team** - Container vulnerability scanning
- **GitHub** - Platform and tools for open-source development
- **Open Source Community** - Tools, libraries, and inspiration

---

<div align="center">

### 🧪 Join Us in Building a Comprehensive Test Suite for Aether Shield!

[⭐ Star This Repo](https://github.com/skygenesisenterprise/aether-shield) • [🐛 Report Issues](https://github.com/skygenesisenterprise/aether-shield/issues) • [💡 Start a Discussion](https://github.com/skygenesisenterprise/aether-shield/discussions)

---

**🧪 Comprehensive Testing - Ensuring Quality Across All Components!**

**Made with ❤️ by the [Sky Genesis Enterprise](https://skygenesisenterprise.com) team**

_Building a robust test suite for enterprise-grade mail server infrastructure_

</div>
