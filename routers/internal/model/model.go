package model

import "time"

// RoutingIntent represents a user's intent for routing traffic
type RoutingIntent struct {
	ID          string                 `json:"id"`
	Name        string                 `json:"name"`
	Description string                 `json:"description"`
	Source      RoutingIntentEndpoint  `json:"source"`
	Destination RoutingIntentEndpoint  `json:"destination"`
	PolicyID    string                 `json:"policyId"`
	Status      string                 `json:"status"`
	CreatedAt   time.Time              `json:"createdAt"`
	UpdatedAt   time.Time              `json:"updatedAt"`
}

// RoutingIntentEndpoint defines an endpoint for routing
type RoutingIntentEndpoint struct {
	Network   string  `json:"network"`
	CIDR      string  `json:"cidr"`
	Interface string  `json:"interface"`
	VLAN      *int    `json:"vlan,omitempty"`
	VPN       *string `json:"vpn,omitempty"`
}

// RoutingPolicy represents a routing policy
type RoutingPolicy struct {
	ID          string            `json:"id"`
	Name        string            `json:"name"`
	Description string            `json:"description"`
	Rules       []RoutingPolicyRule `json:"rules"`
	Priority    int               `json:"priority"`
	Enabled     bool              `json:"enabled"`
	CreatedAt   time.Time         `json:"createdAt"`
	UpdatedAt   time.Time         `json:"updatedAt"`
}

// RoutingPolicyRule defines a rule within a routing policy
type RoutingPolicyRule struct {
	ID          string           `json:"id"`
	Match       RoutingRuleMatch `json:"match"`
	Action      RoutingRuleAction `json:"action"`
	Priority    int              `json:"priority"`
	Description string           `json:"description"`
}

// RoutingRuleMatch defines matching criteria for a rule
type RoutingRuleMatch struct {
	SourceNetworks   []string `json:"sourceNetworks"`
	DestinationNetworks []string `json:"destinationNetworks"`
	Protocols        []string `json:"protocols"`
	Interfaces       []string `json:"interfaces"`
	VPNs             []string `json:"vpn"`
	Tags             []string `json:"tags"`
}

// RoutingRuleAction defines the action to take when a rule matches
type RoutingRuleAction struct {
	Type      string                 `json:"type"` // "allow", "deny", "redirect", "nat"
	Interface string                 `json:"interface"`
	Gateway   string                 `json:"gateway"`
	Metadata  map[string]interface{} `json:"metadata"`
}

// RoutingTable represents a compiled routing table
type RoutingTable struct {
	ID          string              `json:"id"`
	Name        string              `json:"name"`
	Description string              `json:"description"`
	Entries     []RoutingTableEntry `json:"entries"`
	Version     int                 `json:"version"`
	CompiledAt  time.Time           `json:"compiledAt"`
}

// RoutingTableEntry represents a single entry in a routing table
type RoutingTableEntry struct {
	Destination string   `json:"destination"`
	Gateway     string   `json:"gateway"`
	Interface   string   `json:"interface"`
	Metric      int      `json:"metric"`
	PolicyID    string   `json:"policyId"`
	Source      string   `json:"source"`
	Protocol    string   `json:"protocol"`
	Flags       []string `json:"flags"`
}

// RoutingDecision represents a routing decision
type RoutingDecision struct {
	Source      string                 `json:"source"`
	Destination string                 `json:"destination"`
	Interface   string                 `json:"interface"`
	PolicyID    string                 `json:"policyId"`
	Reason      string                 `json:"reason"`
	Confidence  float64                `json:"confidence"`
	Metadata    map[string]interface{} `json:"metadata"`
}

// CompilationResult represents the result of compiling routing policies
type CompilationResult struct {
	RoutingTable *RoutingTable      `json:"routingTable"`
	Warnings     []string           `json:"warnings"`
	Errors       []CompilationError `json:"errors"`
}

// CompilationError represents an error during compilation
type CompilationError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	Severity string `json:"severity"` // "error", "warning"
}

// ValidationResult represents the result of validating routing policies
type ValidationResult struct {
	Valid    bool              `json:"valid"`
	Errors   []ValidationError `json:"errors"`
	Warnings []string          `json:"warnings"`
	Score    float64           `json:"score"`
}

// ValidationError represents an error during validation
type ValidationError struct {
	Code    string      `json:"code"`
	Message string      `json:"message"`
	Severity string      `json:"severity"`
	Field   string      `json:"field"`
	Value   interface{} `json:"value"`
}

// SimulationResult represents the result of a simulation
type SimulationResult struct {
	ID         string               `json:"id"`
	ScenarioID string               `json:"scenarioId"`
	Status     string               `json:"status"` // "passed", "failed", "error"
	StartTime  time.Time            `json:"startTime"`
	EndTime    time.Time            `json:"endTime"`
	Duration   time.Duration        `json:"duration"`
	Results    []SimulationTestResult `json:"results"`
}

// SimulationTestResult represents the result of a single test in a simulation
type SimulationTestResult struct {
	TestID      string                 `json:"testId"`
	Name        string                 `json:"name"`
	Status      string                 `json:"status"`
	Description string                 `json:"description"`
	Details     map[string]interface{} `json:"details"`
}
