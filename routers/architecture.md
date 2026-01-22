# Aether Shield Routers Architecture

## Overview

This document defines the architecture of the `routers/` module, which serves as the secure routing engine for Aether Shield. This module is responsible for defining authorized logical paths (WAN, VLAN, VPN, transit), making secure routing decisions, validating routing intentions, and providing simulation capabilities for testing configurations before deployment.

## Design Principles

### Core Principles

1. **Security-First**: All routing decisions are policy-driven and intention-based
2. **High Performance**: Minimal overhead, optimized for real-time decision making
3. **Simulation-Native**: No mandatory kernel dependencies, pure Go implementation
4. **Modular Architecture**: Clear separation of concerns with well-defined interfaces
5. **No Circular Dependencies**: Independent from firewall module
6. **Multi-Node Compatible**: Designed for distributed deployments and VPN mesh
7. **Explainability**: All decisions are transparent and auditable

### Non-Goals

- DHCP advanced features
- Wi-Fi management
- Network inventory
- Decorative network configuration
- Direct exposure of routing tables to users

## Module Responsibilities

The `routers/` module is responsible for:

1. **Intent-Based Routing**: Translate user intentions into secure routing policies
2. **Policy Validation**: Ensure all routing configurations comply with security policies
3. **Decision Engine**: Make real-time routing decisions based on policies and network state
4. **Simulation**: Test routing configurations in a sandboxed environment
5. **Explainability**: Provide clear reasoning for routing decisions
6. **Integration**: Work seamlessly with firewall, VPN, and other Aether Shield components

## Architecture Overview

```
routers/
├── cmd/                  # Command-line interface
├── internal/             # Private implementation packages
│   ├── core/             # Core routing engine
│   ├── model/            # Data models
│   ├── policy/           # Policy engine
│   ├── simulator/        # Simulation framework
│   ├── compiler/         # Policy compiler
│   ├── validator/        # Policy validator
│   ├── integration/      # Integration adapters
│   └── utils/            # Utility functions
├── pkg/                  # Public API packages
│   ├── api/              # External API
│   └── types/            # Public types
├── config/               # Configuration management
├── main.go               # Entry point
└── architecture.md       # This document
```

## Package Structure

### 1. Core Package (`internal/core/`)

**Responsibility**: The central routing decision engine

**Components**:

- `engine.go`: Main routing decision engine
- `router.go`: Routing table management
- `decision.go`: Routing decision logic
- `explanation.go`: Decision explainability

**Key Types**:

```go
type RoutingEngine struct {
    policyEngine    *policy.Engine
    validator       *validator.Validator
    compiler        *compiler.Compiler
    simulator       *simulator.Simulator
    integrationBus  *integration.Bus
    metrics         *Metrics
}

type RoutingDecision struct {
    Source      string
    Destination string
    Interface   string
    PolicyID    string
    Reason      string
    Confidence  float64
    Metadata    map[string]interface{}
}
```

### 2. Model Package (`internal/model/`)

**Responsibility**: Define all data models for routing

**Key Types**:

```go
type RoutingIntent struct {
    ID          string                 `json:"id"`
    Name        string                 `json:"name"`
    Description string                 `json:"description"`
    Source      RoutingIntentEndpoint  `json:"source"`
    Destination RoutingIntentEndpoint  `json:"destination"`
    Policy      RoutingPolicy           `json:"policy"`
    Constraints []RoutingConstraint     `json:"constraints"`
    Metadata    map[string]interface{}  `json:"metadata"`
    CreatedAt   time.Time              `json:"createdAt"`
    UpdatedAt   time.Time              `json:"updatedAt"`
}

type RoutingIntentEndpoint struct {
    Network   string   `json:"network"`
    CIDR      string   `json:"cidr"`
    Interface string   `json:"interface"`
    VLAN      *int     `json:"vlan,omitempty"`
    VPN       *string  `json:"vpn,omitempty"`
}

type RoutingPolicy struct {
    ID          string                    `json:"id"`
    Name        string                    `json:"name"`
    Description string                    `json:"description"`
    Rules       []RoutingPolicyRule       `json:"rules"`
    Priority    int                       `json:"priority"`
    Enabled     bool                      `json:"enabled"`
    Metadata    map[string]interface{}   `json:"metadata"`
}

type RoutingPolicyRule struct {
    ID          string                 `json:"id"`
    Match       RoutingRuleMatch       `json:"match"`
    Action      RoutingRuleAction      `json:"action"`
    Priority    int                    `json:"priority"`
    Description string                 `json:"description"`
}

type RoutingRuleMatch struct {
    SourceNetworks   []string              `json:"sourceNetworks"`
    DestinationNetworks []string          `json:"destinationNetworks"`
    Protocols        []string              `json:"protocols"`
    Ports            []PortRange           `json:"ports"`
    Interfaces       []string              `json:"interfaces"`
    VPNs             []string              `json:"vpn"`
    Tags             []string              `json:"tags"`
}

type RoutingRuleAction struct {
    Type        string                 `json:"type"` // "allow", "deny", "redirect", "nat"
    Interface   string                 `json:"interface"`
    Gateway     string                 `json:"gateway"`
    NAT         *NATConfig             `json:"nat,omitempty"`
    Metadata    map[string]interface{}  `json:"metadata"`
}

type RoutingTable struct {
    ID          string                    `json:"id"`
    Name        string                    `json:"name"`
    Description string                    `json:"description"`
    Entries     []RoutingTableEntry       `json:"entries"`
    Version     int                       `json:"version"`
    CompiledAt  time.Time                 `json:"compiledAt"`
}

type RoutingTableEntry struct {
    Destination string                 `json:"destination"`
    Gateway     string                 `json:"gateway"`
    Interface   string                 `json:"interface"`
    Metric      int                    `json:"metric"`
    PolicyID    string                 `json:"policyId"`
    Source      string                 `json:"source"`
    Protocol    string                 `json:"protocol"`
    Flags       []string               `json:"flags"`
}
```

### 3. Policy Package (`internal/policy/`)

**Responsibility**: Policy engine for routing decisions

**Components**:

- `engine.go`: Policy evaluation engine
- `compiler.go`: Policy compilation
- `validator.go`: Policy validation
- `store.go`: Policy storage interface

**Key Types**:

```go
type PolicyEngine struct {
    store        PolicyStore
    compiler     *compiler.Compiler
    validator    *validator.Validator
    cache        *policyCache
}

type PolicyStore interface {
    GetPolicy(id string) (*RoutingPolicy, error)
    ListPolicies() ([]*RoutingPolicy, error)
    CreatePolicy(policy *RoutingPolicy) error
    UpdatePolicy(policy *RoutingPolicy) error
    DeletePolicy(id string) error
}
```

### 4. Simulator Package (`internal/simulator/`)

**Responsibility**: Sandboxed routing simulation

**Components**:

- `simulator.go`: Main simulation engine
- `network.go`: Virtual network modeling
- `scenario.go`: Test scenario management
- `reporter.go`: Simulation results reporting

**Key Types**:

```go
type Simulator struct {
    networkModel   *VirtualNetwork
    policyEngine   *policy.Engine
    scenarioStore  ScenarioStore
    reporter       Reporter
}

type VirtualNetwork struct {
    interfaces    map[string]*VirtualInterface
    routes        []VirtualRoute
    policies      []*RoutingPolicy
    connections   []VirtualConnection
}

type SimulationResult struct {
    ID          string                    `json:"id"`
    ScenarioID  string                    `json:"scenarioId"`
    Status      string                    `json:"status"` // "passed", "failed", "error"
    StartTime   time.Time                 `json:"startTime"`
    EndTime     time.Time                 `json:"endTime"`
    Duration    time.Duration             `json:"duration"`
    Results     []SimulationTestResult    `json:"results"`
    Metrics     SimulationMetrics        `json:"metrics"`
}

type SimulationTestResult struct {
    TestID      string                 `json:"testId"`
    Name        string                 `json:"name"`
    Status      string                 `json:"status"`
    Description string                 `json:"description"`
    Details     map[string]interface{}  `json:"details"`
}
```

### 5. Compiler Package (`internal/compiler/`)

**Responsibility**: Compile routing intentions into executable policies

**Components**:

- `compiler.go`: Main compilation logic
- `optimizer.go`: Policy optimization
- `validator.go`: Compilation validation

**Key Types**:

```go
type Compiler struct {
    validator    *validator.Validator
    optimizer    *Optimizer
}

type CompilationResult struct {
    RoutingTable  *RoutingTable          `json:"routingTable"`
    Warnings      []string               `json:"warnings"`
    Errors        []CompilationError      `json:"errors"`
    Statistics    CompilationStatistics   `json:"statistics"`
}

type CompilationError struct {
    Code        string                 `json:"code"`
    Message     string                 `json:"message"`
    Severity    string                 `json:"severity"` // "error", "warning"
    Location    CompilationLocation    `json:"location"`
}

type CompilationLocation struct {
    PolicyID    string                 `json:"policyId"`
    RuleID      string                 `json:"ruleId"`
    Field       string                 `json:"field"`
}
```

### 6. Validator Package (`internal/validator/`)

**Responsibility**: Validate routing intentions and policies

**Components**:

- `validator.go`: Main validation logic
- `rules.go`: Validation rules
- `report.go`: Validation reporting

**Key Types**:

```go
type Validator struct {
    rules        []ValidationRule
    policyStore  PolicyStore
}

type ValidationResult struct {
    Valid        bool                      `json:"valid"`
    Errors       []ValidationError        `json:"errors"`
    Warnings     []ValidationWarning      `json:"warnings"`
    Score        float64                   `json:"score"`
}

type ValidationError struct {
    Code        string                 `json:"code"`
    Message     string                 `json:"message"`
    Severity    string                 `json:"severity"`
    Field       string                 `json:"field"`
    Value       interface{}            `json:"value"`
}
```

### 7. Integration Package (`internal/integration/`)

**Responsibility**: Integration with other Aether Shield components

**Components**:

- `bus.go`: Integration message bus
- `firewall.go`: Firewall integration adapter
- `vpn.go`: VPN integration adapter
- `labs.go`: Labs integration adapter
- `backend.go`: Console backend adapter

**Key Types**:

```go
type IntegrationBus struct {
    firewallAdapter  *FirewallAdapter
    vpnAdapter       *VPNAdapter
    labsAdapter      *LabsAdapter
    backendAdapter   *BackendAdapter
    eventBus         chan IntegrationEvent
}

type IntegrationEvent struct {
    Type        string                 `json:"type"`
    Source      string                 `json:"source"`
    Payload     map[string]interface{}  `json:"payload"`
    Timestamp   time.Time              `json:"timestamp"`
}

type FirewallAdapter struct {
    client       FirewallClient
    cache        *firewallCache
}

type VPNAdapter struct {
    client       VPNClient
    cache        *vpnCache
}
```

### 8. Public API Package (`pkg/api/`)

**Responsibility**: External API for routing management

**Components**:

- `router.go`: API router setup
- `handlers.go`: HTTP handlers
- `models.go`: API models

**Key Endpoints**:

```
GET    /api/v1/routers/intents
POST   /api/v1/routers/intents
GET    /api/v1/routers/intents/:id
PUT    /api/v1/routers/intents/:id
DELETE /api/v1/routers/intents/:id

GET    /api/v1/routers/policies
POST   /api/v1/routers/policies
GET    /api/v1/routers/policies/:id
PUT    /api/v1/routers/policies/:id
DELETE /api/v1/routers/policies/:id

POST   /api/v1/routers/compile
GET    /api/v1/routers/compiled

POST   /api/v1/routers/simulate
GET    /api/v1/routers/simulations/:id

GET    /api/v1/routers/decision
POST   /api/v1/routers/decision/explain

GET    /api/v1/routers/status
GET    /api/v1/routers/metrics
```

### 9. Public Types Package (`pkg/types/`)

**Responsibility**: Publicly exported types for external consumption

**Key Types**:

```go
type PublicRoutingIntent struct {
    ID          string                 `json:"id"`
    Name        string                 `json:"name"`
    Description string                 `json:"description"`
    Source      PublicEndpoint          `json:"source"`
    Destination PublicEndpoint          `json:"destination"`
    PolicyID    string                 `json:"policyId"`
    Status      string                 `json:"status"`
    CreatedAt   time.Time              `json:"createdAt"`
    UpdatedAt   time.Time              `json:"updatedAt"`
}

type PublicRoutingDecision struct {
    Source      string                 `json:"source"`
    Destination string                 `json:"destination"`
    Interface   string                 `json:"interface"`
    PolicyID    string                 `json:"policyId"`
    Reason      string                 `json:"reason"`
    Confidence  float64                `json:"confidence"`
}
```

## Decision Pipeline

The routing decision pipeline follows this flow:

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                            ROUTING DECISION PIPELINE                          │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐    ┌─────────────┐  │
│  │             │    │             │    │                 │    │             │  │
│  │  Intent     │───▶│  Validator  │───▶│  Policy Engine  │───▶│  Decision   │  │
│  │  Received   │    │  Validate    │    │  Evaluate       │    │  Made       │  │
│  │             │    │             │    │                 │    │             │  │
│  └─────────────┘    └─────────────┘    └─────────────────┘    └─────────────┘  │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                         │  │
│  │  ┌─────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────┐  │  │
│  │  │             │    │                 │    │                 │    │     │  │  │
│  │  │  Compiler   │───▶│  Integration    │───▶│  Firewall/VPN   │───▶│ ... │  │  │
│  │  │  Compile    │    │  Bus            │    │  Sync           │    │     │  │  │
│  │  │             │    │                 │    │                 │    └─────┘  │  │
│  │  └─────────────┘    └─────────────────┘    └─────────────────┘          │  │
│  │                                                                         │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

### Detailed Flow

1. **Intent Reception**: Routing intent is received from the API or backend
2. **Validation**: Intent is validated against security and business rules
3. **Policy Evaluation**: Policy engine evaluates applicable policies
4. **Decision Making**: Routing decision is made based on policies and network state
5. **Compilation**: Decision is compiled into routing table entries
6. **Integration**: Decision is synchronized with firewall, VPN, and other components
7. **Explainability**: Decision reasoning is captured for audit and debugging

## Simulation Workflow

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                            SIMULATION WORKFLOW                               │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐    ┌─────────────┐  │
│  │             │    │             │    │                 │    │             │  │
│  │  Scenario   │───▶│  Validator  │───▶│  Virtual        │───▶│  Execute    │  │
│  │  Definition  │    │  Validate    │    │  Network        │    │  Tests      │  │
│  │             │    │             │    │  Model          │    │             │  │
│  └─────────────┘    └─────────────┘    └─────────────────┘    └─────────────┘  │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                         │  │
│  │  ┌─────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────┐  │  │
│  │  │             │    │                 │    │                 │    │     │  │  │
│  │  │  Policy      │───▶│  Simulation     │───▶│  Results        │───▶│ ... │  │  │
│  │  │  Engine      │    │  Execution      │    │  Collection     │    │     │  │  │
│  │  │  Evaluate    │    │                 │    │                 │    └─────┘  │  │
│  │  │             │    └─────────────────┘    └─────────────────┘          │  │
│  │                                                                         │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

### Simulation Steps

1. **Scenario Definition**: Define test scenario with network topology and test cases
2. **Validation**: Validate scenario configuration
3. **Virtual Network Modeling**: Create virtual network model
4. **Policy Evaluation**: Evaluate policies in virtual environment
5. **Test Execution**: Execute test cases
6. **Results Collection**: Collect and analyze results
7. **Reporting**: Generate simulation report

## Integration Points

### 1. Firewall Integration

**Purpose**: Synchronize routing decisions with firewall rules

**Mechanism**:

- Event-based synchronization via integration bus
- Firewall adapter translates routing decisions to firewall rules
- Bidirectional communication for policy conflicts

**Data Flow**:

```
Routing Decision → Firewall Adapter → Firewall Rules → Firewall Engine
```

### 2. VPN Integration

**Purpose**: Ensure VPN routes are properly integrated with routing decisions

**Mechanism**:

- VPN adapter monitors VPN connections
- Routing decisions include VPN-specific rules
- VPN state changes trigger routing decision re-evaluation

**Data Flow**:

```
VPN Connection State → VPN Adapter → Routing Decision → Updated Routes
```

### 3. Labs Integration

**Purpose**: Provide simulation capabilities for testing configurations

**Mechanism**:

- Labs adapter exposes simulation API
- Simulation results are available in Labs interface
- Test scenarios can be imported from Labs

**Data Flow**:

```
Test Scenario (Labs) → Simulation Engine → Results (Labs)
```

### 4. Console Backend Integration

**Purpose**: Provide API for console UI and management

**Mechanism**:

- REST API for CRUD operations on routing intents and policies
- WebSocket for real-time routing decision updates
- Metrics and monitoring endpoints

**Data Flow**:

```
Console UI → REST API → Routing Engine → Response → Console UI
```

## Data Flow Diagram

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                            DATA FLOW DIAGRAM                                 │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────┐  │
│  │             │    │                 │    │                 │    │         │  │
│  │  Console    │───▶│  API Gateway    │───▶│  Routing        │───▶│  ...   │  │
│  │  UI         │    │                 │    │  Engine         │    │         │  │
│  └─────────────┘    └─────────────────┘    └─────────────────┘    └─────────┘  │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                         │  │
│  │  ┌─────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────┐  │  │
│  │  │             │    │                 │    │                 │    │     │  │  │
│  │  │  Policy     │    │  Integration    │    │  Firewall/VPN   │    │ ... │  │  │
│  │  │  Store      │    │  Bus            │    │  Sync           │    │     │  │  │
│  │  │             │    │                 │    │                 │    └─────┘  │  │
│  │  └─────────────┘    └─────────────────┘    └─────────────────┘          │  │
│  │                                                                         │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

## Security Considerations

### 1. Policy-Driven Security

- All routing decisions are based on explicit policies
- Default deny approach for unknown destinations
- Policy validation ensures no security violations

### 2. Intent-Based Validation

- User intentions are validated before execution
- Automatic detection of potentially dangerous configurations
- Warning system for risky routing patterns

### 3. Audit and Explainability

- All routing decisions are logged with reasoning
- Decision explanations available for audit
- Change tracking for all routing configurations

### 4. Integration Security

- Secure communication with firewall and VPN components
- Mutual authentication for inter-module communication
- Encrypted data in transit between components

## Performance Considerations

### 1. Real-Time Decision Making

- Optimized policy evaluation engine
- Caching of frequently accessed policies
- Asynchronous compilation for non-critical paths

### 2. Simulation Performance

- Virtual network modeling optimized for speed
- Parallel test execution where possible
- Resource limits for simulations to prevent overload

### 3. Memory Management

- Efficient data structures for routing tables
- Garbage collection tuning for long-running processes
- Connection pooling for external integrations

## Monitoring and Metrics

### Key Metrics

1. **Decision Metrics**:
   - Decisions per second
   - Average decision latency
   - Decision success/failure rate

2. **Policy Metrics**:
   - Active policies count
   - Policy evaluation time
   - Policy validation errors

3. **Simulation Metrics**:
   - Simulations per hour
   - Average simulation duration
   - Simulation success rate

4. **Integration Metrics**:
   - Firewall sync latency
   - VPN sync latency
   - Backend API response times

### Monitoring Endpoints

```
GET    /api/v1/routers/status          # Overall status
GET    /api/v1/routers/metrics         # Detailed metrics
GET    /api/v1/routers/health          # Health checks
GET    /api/v1/routers/logs            # Recent logs
```

## Error Handling

### Error Classification

1. **Validation Errors**: Intent or policy validation failures
2. **Compilation Errors**: Policy compilation failures
3. **Integration Errors**: Issues with external components
4. **Runtime Errors**: Unexpected errors during operation

### Error Recovery

- Automatic retry for transient errors
- Fallback to safe defaults when possible
- Graceful degradation for non-critical failures
- Comprehensive error logging for debugging

## Development Guidelines

### Code Style

- Follow Go conventions and best practices
- Use `gofmt` and `golangci-lint` for formatting and linting
- Comprehensive error handling with context
- Clear and descriptive function and variable names

### Testing

- Unit tests for all core functionality
- Integration tests for external dependencies
- Simulation tests for routing scenarios
- Performance tests for critical paths

### Documentation

- Clear inline documentation for all public APIs
- Comprehensive examples in documentation
- Architecture diagrams and flow charts
- Change log for significant updates

## Future Enhancements

### Short-Term

1. **Advanced Policy Features**:
   - Time-based policies
   - Geolocation-based routing
   - Traffic shaping integration

2. **Improved Simulation**:
   - More realistic network modeling
   - Support for complex scenarios
   - Performance optimization

3. **Enhanced Monitoring**:
   - Real-time dashboards
   - Alerting for critical events
   - Historical trend analysis

### Long-Term

1. **Machine Learning**:
   - Anomaly detection in routing patterns
   - Predictive routing optimization
   - Automated policy suggestions

2. **Distributed Routing**:
   - Multi-node routing coordination
   - VPN mesh optimization
   - Geographic load balancing

3. **Advanced Security**:
   - Automated threat detection
   - Adaptive routing for DDoS mitigation
   - Zero-trust routing enforcement

## Conclusion

This architecture provides a solid foundation for the `routers/` module, focusing on security, performance, and modularity. The design ensures that routing decisions are always policy-driven and intention-based, while providing the flexibility to adapt to changing requirements and integrate with other Aether Shield components.

The implementation should follow the principles outlined in this document, with a strong emphasis on security, explainability, and performance. The modular structure allows for easy maintenance and extension as new features are added.
