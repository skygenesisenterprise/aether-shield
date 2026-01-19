package middleware

import (
	"fmt"
	"net"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/skygenesisenterprise/aether-shield/server/src/model"
)

type ServicesMiddleware struct {
	// In-memory rate limiter store
	rateLimiters map[string]*RateLimiter
	mutex        sync.RWMutex
	// Allowed CORS origins
	allowedOrigins []string
}

type RateLimiter struct {
	requests []time.Time
	mutex    sync.Mutex
}

func NewServicesMiddleware() *ServicesMiddleware {
	return &ServicesMiddleware{
		rateLimiters: make(map[string]*RateLimiter),
		allowedOrigins: []string{
			"http://localhost:3000",
			"http://localhost:8080",
			"https://localhost:3000",
			"https://localhost:8080",
		},
	}
}

// ValidateServicesAccess checks if the user has access to services management
func (m *ServicesMiddleware) ValidateServicesAccess() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// Get user from context (set by auth middleware)
		user, exists := ctx.Get("user")
		if !exists {
			ctx.JSON(http.StatusUnauthorized, model.APIResponse{
				Success: false,
				Error:   "User not authenticated",
			})
			ctx.Abort()
			return
		}

		// Role-based access control implementation
		userModel, ok := user.(model.User)
		if !ok {
			ctx.JSON(http.StatusInternalServerError, model.APIResponse{
				Success: false,
				Error:   "Invalid user context",
			})
			ctx.Abort()
			return
		}

		// Define role hierarchy and permissions
		roleHierarchy := map[string]int{
			"admin":    3,
			"manager":  2,
			"operator": 1,
			"user":     0,
		}

		// Define required permissions for services management
		requiredPermissions := []string{
			"services:manage",
			"services:read",
			"services:write",
			"services:delete",
		}

		// Check user role and permissions
		userRole := userModel.Role
		userRoleLevel, hasRole := roleHierarchy[userRole]

		// Admin role has all permissions
		if userRole == "admin" {
			ctx.Next()
			return
		}

		// Check if user has required permissions based on role
		hasPermission := false
		if hasRole && userRoleLevel >= 1 { // operator and above
			for _, permission := range userModel.Permissions {
				for _, required := range requiredPermissions {
					if permission == required || permission == "admin" {
						hasPermission = true
						break
					}
				}
				if hasPermission {
					break
				}
			}
		}

		if !hasPermission {
			ctx.JSON(http.StatusForbidden, model.APIResponse{
				Success: false,
				Error:   fmt.Sprintf("Insufficient permissions for services management. Required role: operator or above, current role: %s", userRole),
			})
			ctx.Abort()
			return
		}

		ctx.Next()
	}
}

// ValidateJSON validates JSON request body
func (m *ServicesMiddleware) ValidateJSON() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// Check if content type is JSON
		contentType := ctx.GetHeader("Content-Type")
		if !strings.Contains(contentType, "application/json") {
			ctx.JSON(http.StatusBadRequest, model.APIResponse{
				Success: false,
				Error:   "Content-Type must be application/json",
			})
			ctx.Abort()
			return
		}

		// Validate JSON body size (max 10MB)
		if ctx.Request.ContentLength > 10*1024*1024 {
			ctx.JSON(http.StatusRequestEntityTooLarge, model.APIResponse{
				Success: false,
				Error:   "Request body too large (max 10MB)",
			})
			ctx.Abort()
			return
		}

		ctx.Next()
	}
}

// ValidateDHCPConfig validates DHCP configuration
func (m *ServicesMiddleware) ValidateDHCPConfig() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var config model.DHCPv4Service
		if err := ctx.ShouldBindJSON(&config); err != nil {
			ctx.JSON(http.StatusBadRequest, model.APIResponse{
				Success: false,
				Error:   "Invalid DHCP configuration: " + err.Error(),
			})
			ctx.Abort()
			return
		}

		// Validate IP range format
		if config.Range != "" && !m.isValidIPRange(config.Range) {
			ctx.JSON(http.StatusBadRequest, model.APIResponse{
				Success: false,
				Error:   "Invalid IP range format",
			})
			ctx.Abort()
			return
		}

		// Validate lease time
		if config.LeaseTime != "" && !m.isValidLeaseTime(config.LeaseTime) {
			ctx.JSON(http.StatusBadRequest, model.APIResponse{
				Success: false,
				Error:   "Invalid lease time format",
			})
			ctx.Abort()
			return
		}

		ctx.Set("dhcpConfig", config)
		ctx.Next()
	}
}

// ValidateDNSConfig validates DNS configuration
func (m *ServicesMiddleware) ValidateDNSConfig() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var config model.UnboundSettings
		if err := ctx.ShouldBindJSON(&config); err != nil {
			ctx.JSON(http.StatusBadRequest, model.APIResponse{
				Success: false,
				Error:   "Invalid DNS configuration: " + err.Error(),
			})
			ctx.Abort()
			return
		}

		// Validate port range
		if config.ListenPort < 1 || config.ListenPort > 65535 {
			ctx.JSON(http.StatusBadRequest, model.APIResponse{
				Success: false,
				Error:   "Invalid port number (must be 1-65535)",
			})
			ctx.Abort()
			return
		}

		// Validate cache size
		if config.CacheSize < 1 || config.CacheSize > 1024 {
			ctx.JSON(http.StatusBadRequest, model.APIResponse{
				Success: false,
				Error:   "Invalid cache size (must be 1-1024 MB)",
			})
			ctx.Abort()
			return
		}

		// Validate forward servers
		for _, server := range config.ForwardServers {
			if !m.isValidIP(server) {
				ctx.JSON(http.StatusBadRequest, model.APIResponse{
					Success: false,
					Error:   "Invalid forward server IP: " + server,
				})
				ctx.Abort()
				return
			}
		}

		ctx.Set("dnsConfig", config)
		ctx.Next()
	}
}

// ValidateStaticMapping validates DHCP static mapping
func (m *ServicesMiddleware) ValidateStaticMapping() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var mapping model.DHCPv4Static
		if err := ctx.ShouldBindJSON(&mapping); err != nil {
			ctx.JSON(http.StatusBadRequest, model.APIResponse{
				Success: false,
				Error:   "Invalid static mapping: " + err.Error(),
			})
			ctx.Abort()
			return
		}

		// Validate IP address
		if !m.isValidIP(mapping.IP) {
			ctx.JSON(http.StatusBadRequest, model.APIResponse{
				Success: false,
				Error:   "Invalid IP address",
			})
			ctx.Abort()
			return
		}

		// Validate MAC address
		if !m.isValidMAC(mapping.MAC) {
			ctx.JSON(http.StatusBadRequest, model.APIResponse{
				Success: false,
				Error:   "Invalid MAC address",
			})
			ctx.Abort()
			return
		}

		// Validate hostname
		if !m.isValidHostname(mapping.Hostname) {
			ctx.JSON(http.StatusBadRequest, model.APIResponse{
				Success: false,
				Error:   "Invalid hostname",
			})
			ctx.Abort()
			return
		}

		ctx.Set("staticMapping", mapping)
		ctx.Next()
	}
}

// RateLimiter implements rate limiting for services endpoints
func (m *ServicesMiddleware) RateLimiter() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		clientIP := ctx.ClientIP()

		m.mutex.RLock()
		limiter, exists := m.rateLimiters[clientIP]
		m.mutex.RUnlock()

		if !exists {
			m.mutex.Lock()
			limiter = &RateLimiter{
				requests: make([]time.Time, 0),
			}
			m.rateLimiters[clientIP] = limiter
			m.mutex.Unlock()
		}

		limiter.mutex.Lock()
		now := time.Now()

		// Remove old requests (older than 1 minute)
		validRequests := make([]time.Time, 0)
		for _, req := range limiter.requests {
			if now.Sub(req) < time.Minute {
				validRequests = append(validRequests, req)
			}
		}

		// Check if rate limit exceeded (max 60 requests per minute)
		if len(validRequests) >= 60 {
			limiter.mutex.Unlock()
			ctx.JSON(http.StatusTooManyRequests, model.APIResponse{
				Success: false,
				Error:   "Rate limit exceeded (60 requests per minute)",
			})
			ctx.Abort()
			return
		}

		// Add current request
		validRequests = append(validRequests, now)
		limiter.requests = validRequests
		limiter.mutex.Unlock()

		ctx.Next()
	}
}

// CORS handles Cross-Origin Resource Sharing
func (m *ServicesMiddleware) CORS() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		origin := ctx.GetHeader("Origin")

		// Check if origin is allowed
		allowed := false
		for _, allowedOrigin := range m.allowedOrigins {
			if origin == allowedOrigin {
				allowed = true
				break
			}
		}

		// If no origin header or in development, allow it
		if origin == "" || strings.Contains(origin, "localhost") {
			allowed = true
		}

		if allowed {
			ctx.Header("Access-Control-Allow-Origin", origin)
		} else {
			// Return specific allowed origins instead of the requested one
			if len(m.allowedOrigins) > 0 {
				ctx.Header("Access-Control-Allow-Origin", strings.Join(m.allowedOrigins, ", "))
			}
		}

		ctx.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		ctx.Header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
		ctx.Header("Access-Control-Allow-Credentials", "true")
		ctx.Header("Access-Control-Max-Age", "86400")

		if ctx.Request.Method == "OPTIONS" {
			ctx.AbortWithStatus(http.StatusNoContent)
			return
		}

		ctx.Next()
	}
}

// Helper validation functions
func (m *ServicesMiddleware) isValidIP(ip string) bool {
	return net.ParseIP(ip) != nil
}

func (m *ServicesMiddleware) isValidIPRange(rangeStr string) bool {
	// IP range validation (e.g., 192.168.1.100-192.168.1.200 or 192.168.1.0/24)
	if !strings.Contains(rangeStr, "-") && !strings.Contains(rangeStr, "/") {
		return false
	}

	// Handle CIDR notation (e.g., 192.168.1.0/24)
	if strings.Contains(rangeStr, "/") {
		parts := strings.Split(rangeStr, "/")
		if len(parts) != 2 {
			return false
		}

		ip := net.ParseIP(parts[0])
		if ip == nil {
			return false
		}

		prefixLen, err := strconv.Atoi(parts[1])
		if err != nil || prefixLen < 0 || prefixLen > 32 {
			return false
		}

		return true
	}

	// Handle range notation (e.g., 192.168.1.100-192.168.1.200)
	parts := strings.Split(rangeStr, "-")
	if len(parts) != 2 {
		return false
	}

	startIP := net.ParseIP(strings.TrimSpace(parts[0]))
	endIP := net.ParseIP(strings.TrimSpace(parts[1]))

	if startIP == nil || endIP == nil {
		return false
	}

	// Convert to 4-byte representation for comparison
	startIP4 := startIP.To4()
	endIP4 := endIP.To4()

	if startIP4 == nil || endIP4 == nil {
		return false
	}

	// Check if start IP is less than or equal to end IP
	for i := 0; i < 4; i++ {
		if startIP4[i] < endIP4[i] {
			return true
		} else if startIP4[i] > endIP4[i] {
			return false
		}
	}

	return true
}

func (m *ServicesMiddleware) isValidLeaseTime(leaseTime string) bool {
	// Lease time validation (seconds or human-readable format)
	if leaseTime == "" {
		return false
	}

	// Check if it's a pure number (seconds)
	if seconds, err := strconv.Atoi(leaseTime); err == nil {
		return seconds > 0 && seconds <= 86400 // Max 24 hours
	}

	// Check human-readable formats (e.g., "1h", "30m", "2d")
	timeUnits := map[string]int{
		"s": 1,
		"m": 60,
		"h": 3600,
		"d": 86400,
	}

	// Regular expression to match time format (number + unit)
	re := regexp.MustCompile(`^(\d+)([smhd])$`)
	matches := re.FindStringSubmatch(strings.ToLower(leaseTime))

	if len(matches) != 3 {
		return false
	}

	value, err := strconv.Atoi(matches[1])
	if err != nil {
		return false
	}

	unit := matches[2]
	multiplier, exists := timeUnits[unit]
	if !exists {
		return false
	}

	totalSeconds := value * multiplier
	return totalSeconds > 0 && totalSeconds <= 86400 // Max 24 hours
}

func (m *ServicesMiddleware) isValidMAC(mac string) bool {
	// MAC address validation (supports multiple formats)
	if mac == "" {
		return false
	}

	// Remove any whitespace
	mac = strings.TrimSpace(mac)

	// Regular expressions for different MAC address formats
	patterns := []string{
		`^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$`, // XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX
		`^([0-9A-Fa-f]{4}\.){2}([0-9A-Fa-f]{4})$`,   // XXXX.XXXX.XXXX (Cisco format)
		`^[0-9A-Fa-f]{12}$`,                         // XXXXXXXXXXXX (no separators)
	}

	for _, pattern := range patterns {
		if matched, _ := regexp.MatchString(pattern, mac); matched {
			// Additional validation: check if it's not a broadcast or multicast address
			normalized := strings.ReplaceAll(strings.ReplaceAll(mac, ":", ""), "-", ".")
			if len(normalized) == 12 {
				// Check first byte for broadcast/multicast
				firstByte, err := strconv.ParseInt(normalized[:2], 16, 64)
				if err == nil {
					// 0xFF is broadcast, first bit set (0x01) is multicast
					if firstByte == 0xFF || (firstByte&0x01) == 1 {
						return false
					}
				}
			}
			return true
		}
	}

	return false
}

func (m *ServicesMiddleware) isValidHostname(hostname string) bool {
	// Hostname validation according to RFC 1123
	if hostname == "" || len(hostname) > 253 {
		return false
	}

	// Remove trailing dot if present
	hostname = strings.TrimSuffix(hostname, ".")

	// Check if hostname is valid IP address (should not be)
	if net.ParseIP(hostname) != nil {
		return false
	}

	// Regular expression for hostname validation
	// - Can contain letters, digits, and hyphens
	// - Must start and end with letter or digit
	// - Hyphens cannot be at the beginning or end
	// - Each label max 63 characters
	pattern := `^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$`

	matched, err := regexp.MatchString(pattern, hostname)
	if err != nil {
		return false
	}

	if !matched {
		return false
	}

	// Additional validation: check each label length
	labels := strings.Split(hostname, ".")
	for _, label := range labels {
		if len(label) > 63 {
			return false
		}
	}

	// Check for invalid sequences
	if strings.Contains(hostname, "..") {
		return false
	}

	return true
}

// Logging middleware for services
func (m *ServicesMiddleware) Logger() gin.HandlerFunc {
	return gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		return fmt.Sprintf("[SERVICES] %s - [%s] \"%s %s %d %s \"%s\" %s\"\n",
			param.ClientIP,
			param.TimeStamp.Format("02/Jan/2006:15:04:05 -0700"),
			param.Method,
			param.Path,
			param.StatusCode,
			param.Latency,
			param.Request.UserAgent(),
			param.ErrorMessage,
		)
	})
}

// Security headers middleware
func (m *ServicesMiddleware) SecurityHeaders() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		ctx.Header("X-Content-Type-Options", "nosniff")
		ctx.Header("X-Frame-Options", "DENY")
		ctx.Header("X-XSS-Protection", "1; mode=block")
		ctx.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
		ctx.Next()
	}
}
