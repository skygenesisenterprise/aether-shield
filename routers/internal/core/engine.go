package core

import (
	"context"
	"sync"

	"github.com/skygenesisenterprise/aether-shield/routers/internal/model"
	"github.com/skygenesisenterprise/aether-shield/routers/internal/policy"
	"github.com/skygenesisenterprise/aether-shield/routers/internal/validator"
	"github.com/skygenesisenterprise/aether-shield/routers/internal/compiler"
	"github.com/skygenesisenterprise/aether-shield/routers/internal/simulator"
	"github.com/skygenesisenterprise/aether-shield/routers/internal/integration"
)

// RoutingEngine is the main routing decision engine
type RoutingEngine struct {
	policyEngine    *policy.Engine
	validator       *validator.Validator
	compiler        *compiler.Compiler
	simulator       *simulator.Simulator
	integrationBus  *integration.Bus
	metrics         *Metrics
	mu              sync.RWMutex
	activePolicies  map[string]*model.RoutingPolicy
	routingTables   map[string]*model.RoutingTable
}

// NewRoutingEngine creates a new routing engine
func NewRoutingEngine(
	policyStore policy.Store,
	integrationBus *integration.Bus,
) *RoutingEngine {
	return &RoutingEngine{
		policyEngine:   policy.NewEngine(policyStore),
		validator:      validator.NewValidator(policyStore),
		compiler:       compiler.NewCompiler(),
		simulator:      simulator.NewSimulator(),
		integrationBus: integrationBus,
		metrics:        NewMetrics(),
		activePolicies: make(map[string]*model.RoutingPolicy),
		routingTables:  make(map[string]*model.RoutingTable),
	}
}

// Start initializes the routing engine
func (e *RoutingEngine) Start(ctx context.Context) error {
	// Load active policies
	policies, err := e.policyEngine.ListPolicies()
	if err != nil {
		return err
	}

	e.mu.Lock()
	for _, p := range policies {
		if p.Enabled {
			e.activePolicies[p.ID] = p
		}
	}
	e.mu.Unlock()

	// Start integration bus
	if e.integrationBus != nil {
		e.integrationBus.Start(ctx)
	}

	return nil
}

// MakeDecision makes a routing decision based on the given parameters
func (e *RoutingEngine) MakeDecision(
	ctx context.Context,
	source, destination string,
	interfaceName string,
) (*model.RoutingDecision, error) {
	e.metrics.Decisions.Inc()
	startTime := e.metrics.Decisions.StartTimer()
	defer startTime.Stop()

	e.mu.RLock()
	defer e.mu.RUnlock()

	// Find matching policy
	for _, policy := range e.activePolicies {
		for _, rule := range policy.Rules {
			if e.matchesRule(rule, source, destination, interfaceName) {
				decision := &model.RoutingDecision{
					Source:      source,
					Destination: destination,
					Interface:   rule.Action.Interface,
					PolicyID:    policy.ID,
					Reason:      "Policy rule matched",
					Confidence:  1.0,
					Metadata: map[string]interface{}{
						"policyName": policy.Name,
						"ruleID":     rule.ID,
					},
				}

				// Notify integration bus
				if e.integrationBus != nil {
					e.integrationBus.PublishDecision(decision)
				}

				return decision, nil
			}
		}
	}

	// Default deny
	return nil, &RoutingError{
		Code:    "no_policy_match",
		Message: "No routing policy matched the request",
		Source:      source,
		Destination: destination,
	}
}

// CompilePolicies compiles all active policies into routing tables
func (e *RoutingEngine) CompilePolicies(ctx context.Context) (*model.CompilationResult, error) {
	e.metrics.Compilations.Inc()
	startTime := e.metrics.Compilations.StartTimer()
	defer startTime.Stop()

	e.mu.RLock()
	policies := make([]*model.RoutingPolicy, 0, len(e.activePolicies))
	for _, p := range e.activePolicies {
		policies = append(policies, p)
	}
	e.mu.RUnlock()

	return e.compiler.Compile(ctx, policies)
}

// ValidateIntent validates a routing intent
func (e *RoutingEngine) ValidateIntent(ctx context.Context, intent *model.RoutingIntent) *model.ValidationResult {
	e.metrics.Validations.Inc()
	startTime := e.metrics.Validations.StartTimer()
	defer startTime.Stop()

	return e.validator.ValidateIntent(intent)
}

// Simulate runs a simulation with the given scenario
func (e *RoutingEngine) Simulate(ctx context.Context, scenario *simulator.Scenario) (*model.SimulationResult, error) {
	e.metrics.Simulations.Inc()
	startTime := e.metrics.Simulations.StartTimer()
	defer startTime.Stop()

	return e.simulator.Run(ctx, scenario)
}

// GetStatus returns the current status of the routing engine
func (e *RoutingEngine) GetStatus() map[string]interface{} {
	e.mu.RLock()
	defer e.mu.RUnlock()

	return map[string]interface{}{
		"activePolicies": len(e.activePolicies),
		"routingTables":  len(e.routingTables),
		"status":         "running",
	}
}

// matchesRule checks if a rule matches the given parameters
func (e *RoutingEngine) matchesRule(
	rule *model.RoutingPolicyRule,
	source, destination, interfaceName string,
) bool {
	// Check interface match
	if len(rule.Match.Interfaces) > 0 {
		found := false
		for _, iface := range rule.Match.Interfaces {
			if iface == interfaceName {
				found = true
				break
			}
		}
		if !found {
			return false
		}
	}

	// Check source networks
	if len(rule.Match.SourceNetworks) > 0 {
		found := false
		for _, network := range rule.Match.SourceNetworks {
			if source == network {
				found = true
				break
			}
		}
		if !found {
			return false
		}
	}

	// Check destination networks
	if len(rule.Match.DestinationNetworks) > 0 {
		found := false
		for _, network := range rule.Match.DestinationNetworks {
			if destination == network {
				found = true
				break
			}
		}
		if !found {
			return false
		}
	}

	return true
}

// RoutingError represents a routing error
type RoutingError struct {
	Code         string
	Message      string
	Source       string
	Destination  string
}

func (e *RoutingError) Error() string {
	return e.Message
}

// IsRoutingError checks if an error is a routing error
func IsRoutingError(err error) bool {
	_, ok := err.(*RoutingError)
	return ok
}
