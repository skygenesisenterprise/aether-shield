package core

import (
	"time"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

// Metrics holds all the metrics for the routing engine
type Metrics struct {
	Decisions prometheus.Counter
	Compilations prometheus.Counter
	Validations prometheus.Counter
	Simulations prometheus.Counter
	DecisionLatency prometheus.Histogram
	CompilationLatency prometheus.Histogram
	ValidationLatency prometheus.Histogram
	SimulationLatency prometheus.Histogram
}

// NewMetrics creates a new metrics instance
func NewMetrics() *Metrics {
	return &Metrics{
		Decisions: promauto.NewCounter(prometheus.CounterOpts{
			Name: "routing_engine_decisions_total",
			Help: "Total number of routing decisions made",
		}),
		Compilations: promauto.NewCounter(prometheus.CounterOpts{
			Name: "routing_engine_compilations_total",
			Help: "Total number of policy compilations",
		}),
		Validations: promauto.NewCounter(prometheus.CounterOpts{
			Name: "routing_engine_validations_total",
			Help: "Total number of validations performed",
		}),
		Simulations: promauto.NewCounter(prometheus.CounterOpts{
			Name: "routing_engine_simulations_total",
			Help: "Total number of simulations run",
		}),
		DecisionLatency: promauto.NewHistogram(prometheus.HistogramOpts{
			Name: "routing_engine_decision_latency_seconds",
			Help: "Latency of routing decisions in seconds",
			Buckets: prometheus.DefBuckets,
		}),
		CompilationLatency: promauto.NewHistogram(prometheus.HistogramOpts{
			Name: "routing_engine_compilation_latency_seconds",
			Help: "Latency of policy compilations in seconds",
			Buckets: prometheus.DefBuckets,
		}),
		ValidationLatency: promauto.NewHistogram(prometheus.HistogramOpts{
			Name: "routing_engine_validation_latency_seconds",
			Help: "Latency of validations in seconds",
			Buckets: prometheus.DefBuckets,
		}),
		SimulationLatency: promauto.NewHistogram(prometheus.HistogramOpts{
			Name: "routing_engine_simulation_latency_seconds",
			Help: "Latency of simulations in seconds",
			Buckets: prometheus.DefBuckets,
		}),
	}
}

// Timer is a helper for timing operations
type Timer struct {
	histogram prometheus.Observer
	start     time.Time
}

// StartTimer starts a new timer
func (m *Metrics) StartTimer(histogram prometheus.Observer) *Timer {
	return &Timer{
		histogram: histogram,
		start:     time.Now(),
	}
}

// Stop stops the timer and records the duration
func (t *Timer) Stop() {
	if t.histogram != nil {
		duration := time.Since(t.start).Seconds()
		t.histogram.Observe(duration)
	}
}
