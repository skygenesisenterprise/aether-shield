package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// FirewallMiddleware provides firewall-specific middleware functions
type FirewallMiddleware struct {
	// Add configuration, database connections, etc.
}

// NewFirewallMiddleware creates a new firewall middleware instance
func NewFirewallMiddleware() *FirewallMiddleware {
	return &FirewallMiddleware{}
}

// ValidateFirewallAccess validates that the user has firewall access permissions
func (m *FirewallMiddleware) ValidateFirewallAccess() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get user from context (set by auth middleware)
		user, exists := c.Get("user")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
			c.Abort()
			return
		}

		// Check if user has firewall permissions
		// This is a mock implementation - replace with actual permission checking
		if !m.hasFirewallAccess(user) {
			c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions for firewall access"})
			c.Abort()
			return
		}

		c.Next()
	}
}

// ValidateJSON validates that the request body contains valid JSON
func (m *FirewallMiddleware) ValidateJSON() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Check content type
		contentType := c.GetHeader("Content-Type")
		if !strings.Contains(contentType, "application/json") {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Content-Type must be application/json"})
			c.Abort()
			return
		}

		// Validate JSON structure
		var jsonBody map[string]interface{}
		if err := c.ShouldBindJSON(&jsonBody); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON format"})
			c.Abort()
			return
		}

		// Store validated JSON in context for later use
		c.Set("validatedJSON", jsonBody)
		c.Next()
	}
}

// ValidateFirewallRule validates firewall rule specific fields
func (m *FirewallMiddleware) ValidateFirewallRule() gin.HandlerFunc {
	return func(c *gin.Context) {
		var rule struct {
			Action      string `json:"action" binding:"required"`
			Protocol    string `json:"protocol" binding:"required"`
			Source      string `json:"source" binding:"required"`
			Destination string `json:"destination" binding:"required"`
		}

		if err := c.ShouldBindJSON(&rule); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid firewall rule format"})
			c.Abort()
			return
		}

		// Validate action
		validActions := []string{"pass", "block", "reject", "match"}
		if !m.isValidAction(rule.Action, validActions) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid action. Must be one of: pass, block, reject, match"})
			c.Abort()
			return
		}

		// Validate protocol
		validProtocols := []string{"tcp", "udp", "icmp", "any", "tcp/udp"}
		if !m.isValidProtocol(rule.Protocol, validProtocols) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid protocol. Must be one of: tcp, udp, icmp, any, tcp/udp"})
			c.Abort()
			return
		}

		// Store validated rule in context
		c.Set("validatedRule", rule)
		c.Next()
	}
}

// ValidateFirewallAlias validates firewall alias specific fields
func (m *FirewallMiddleware) ValidateFirewallAlias() gin.HandlerFunc {
	return func(c *gin.Context) {
		var alias struct {
			Name    string `json:"name" binding:"required"`
			Type    string `json:"type" binding:"required"`
			Content string `json:"content" binding:"required"`
		}

		if err := c.ShouldBindJSON(&alias); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid firewall alias format"})
			c.Abort()
			return
		}

		// Validate alias type
		validTypes := []string{"host", "network", "port", "url", "geoip", "dynamic"}
		if !m.isValidAliasType(alias.Type, validTypes) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid alias type. Must be one of: host, network, port, url, geoip, dynamic"})
			c.Abort()
			return
		}

		// Store validated alias in context
		c.Set("validatedAlias", alias)
		c.Next()
	}
}

// ValidateNatRule validates NAT rule specific fields
func (m *FirewallMiddleware) ValidateNatRule() gin.HandlerFunc {
	return func(c *gin.Context) {
		var natRule struct {
			Interface   string `json:"interface" binding:"required"`
			Source      string `json:"source" binding:"required"`
			Translation string `json:"translation" binding:"required"`
		}

		if err := c.ShouldBindJSON(&natRule); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid NAT rule format"})
			c.Abort()
			return
		}

		// Validate interface
		validInterfaces := []string{"WAN", "LAN", "OPT1", "OPT2", "OPT3"}
		if !m.isValidInterface(natRule.Interface, validInterfaces) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid interface"})
			c.Abort()
			return
		}

		// Store validated NAT rule in context
		c.Set("validatedNatRule", natRule)
		c.Next()
	}
}

// ValidatePortForward validates port forwarding specific fields
func (m *FirewallMiddleware) ValidatePortForward() gin.HandlerFunc {
	return func(c *gin.Context) {
		var portForward struct {
			ExternalIP   string `json:"externalIp" binding:"required"`
			ExternalPort string `json:"externalPort" binding:"required"`
			InternalIP   string `json:"internalIp" binding:"required"`
			InternalPort string `json:"internalPort" binding:"required"`
			Protocol     string `json:"protocol" binding:"required"`
		}

		if err := c.ShouldBindJSON(&portForward); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid port forward format"})
			c.Abort()
			return
		}

		// Validate protocol
		validProtocols := []string{"tcp", "udp", "tcp/udp"}
		if !m.isValidProtocol(portForward.Protocol, validProtocols) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid protocol. Must be one of: tcp, udp, tcp/udp"})
			c.Abort()
			return
		}

		// Store validated port forward in context
		c.Set("validatedPortForward", portForward)
		c.Next()
	}
}

// ValidateShaperRule validates traffic shaping rule specific fields
func (m *FirewallMiddleware) ValidateShaperRule() gin.HandlerFunc {
	return func(c *gin.Context) {
		var shaperRule struct {
			Queue       string `json:"queue" binding:"required"`
			Source      string `json:"source" binding:"required"`
			Destination string `json:"destination" binding:"required"`
		}

		if err := c.ShouldBindJSON(&shaperRule); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid traffic shaping rule format"})
			c.Abort()
			return
		}

		// Store validated shaper rule in context
		c.Set("validatedShaperRule", shaperRule)
		c.Next()
	}
}

// ValidateSchedule validates firewall schedule specific fields
func (m *FirewallMiddleware) ValidateSchedule() gin.HandlerFunc {
	return func(c *gin.Context) {
		var schedule struct {
			Name      string   `json:"name" binding:"required"`
			StartTime string   `json:"startTime" binding:"required"`
			EndTime   string   `json:"endTime" binding:"required"`
			Days      []string `json:"days" binding:"required"`
		}

		if err := c.ShouldBindJSON(&schedule); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid schedule format"})
			c.Abort()
			return
		}

		// Validate time format (HH:MM)
		if !m.isValidTimeFormat(schedule.StartTime) || !m.isValidTimeFormat(schedule.EndTime) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid time format. Must be HH:MM"})
			c.Abort()
			return
		}

		// Validate days
		validDays := []string{"monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"}
		for _, day := range schedule.Days {
			if !m.isValidDay(day, validDays) {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid day: " + day})
				c.Abort()
				return
			}
		}

		// Store validated schedule in context
		c.Set("validatedSchedule", schedule)
		c.Next()
	}
}

// RateLimitFirewall applies rate limiting specifically for firewall endpoints
func (m *FirewallMiddleware) RateLimitFirewall() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get client IP
		clientIP := c.ClientIP()

		// Mock rate limiting implementation
		// In production, use Redis or similar for distributed rate limiting
		if m.isRateLimited(clientIP) {
			c.JSON(http.StatusTooManyRequests, gin.H{"error": "Rate limit exceeded for firewall operations"})
			c.Abort()
			return
		}

		c.Next()
	}
}

// LogFirewallOperation logs all firewall operations for audit purposes
func (m *FirewallMiddleware) LogFirewallOperation() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get user from context
		user, exists := c.Get("user")
		if !exists {
			c.Next()
			return
		}

		// Log the operation
		m.logOperation(user, c.Request.Method, c.Request.URL.Path, c.ClientIP())

		c.Next()
	}
}

// Helper functions

func (m *FirewallMiddleware) hasFirewallAccess(user interface{}) bool {
	// Mock implementation - replace with actual permission checking
	// Check if user has firewall management permissions
	return true // Allow all for now
}

func (m *FirewallMiddleware) isValidAction(action string, validActions []string) bool {
	for _, validAction := range validActions {
		if action == validAction {
			return true
		}
	}
	return false
}

func (m *FirewallMiddleware) isValidProtocol(protocol string, validProtocols []string) bool {
	for _, validProtocol := range validProtocols {
		if protocol == validProtocol {
			return true
		}
	}
	return false
}

func (m *FirewallMiddleware) isValidAliasType(aliasType string, validTypes []string) bool {
	for _, validType := range validTypes {
		if aliasType == validType {
			return true
		}
	}
	return false
}

func (m *FirewallMiddleware) isValidInterface(interfaceName string, validInterfaces []string) bool {
	for _, validInterface := range validInterfaces {
		if interfaceName == validInterface {
			return true
		}
	}
	return false
}

func (m *FirewallMiddleware) isValidTimeFormat(time string) bool {
	// Simple validation for HH:MM format
	if len(time) != 5 {
		return false
	}

	if time[2] != ':' {
		return false
	}

	// Could add more robust validation here
	return true
}

func (m *FirewallMiddleware) isValidDay(day string, validDays []string) bool {
	for _, validDay := range validDays {
		if day == validDay {
			return true
		}
	}
	return false
}

func (m *FirewallMiddleware) isRateLimited(clientIP string) bool {
	// Mock implementation - replace with actual rate limiting logic
	// In production, use Redis or similar to track request counts
	return false // Allow all for now
}

func (m *FirewallMiddleware) logOperation(user interface{}, method string, path string, clientIP string) {
	// Mock implementation - replace with actual logging
	// Log to file, database, or logging service
	// Include user details, operation type, timestamp, etc.
}
