package middleware

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type SystemMiddleware struct {
}

func NewSystemMiddleware() *SystemMiddleware {
	return &SystemMiddleware{}
}

func (sm *SystemMiddleware) ValidateSystemAccess() gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole := c.GetString("role")

		allowedRoles := []string{"admin", "system"}
		hasAccess := false
		for _, role := range allowedRoles {
			if userRole == role {
				hasAccess = true
				break
			}
		}

		if !hasAccess {
			c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient privileges for system access"})
			c.Abort()
			return
		}

		c.Next()
	}
}

func (sm *SystemMiddleware) ValidateConfigAccess() gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole := c.GetString("role")

		if userRole != "admin" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Admin access required for configuration changes"})
			c.Abort()
			return
		}

		c.Next()
	}
}

func (sm *SystemMiddleware) ValidateTrustAccess() gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole := c.GetString("role")

		allowedRoles := []string{"admin", "security"}
		hasAccess := false
		for _, role := range allowedRoles {
			if userRole == role {
				hasAccess = true
				break
			}
		}

		if !hasAccess {
			c.JSON(http.StatusForbidden, gin.H{"error": "Security privileges required for trust management"})
			c.Abort()
			return
		}

		c.Next()
	}
}

func (sm *SystemMiddleware) RateLimitSystem() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("X-RateLimit-Limit", "100")
		c.Header("X-RateLimit-Remaining", "99")
		c.Header("X-RateLimit-Reset", string(rune(time.Now().Add(time.Hour).Unix())))

		c.Next()
	}
}

func (sm *SystemMiddleware) LogSystemActivity() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()

		c.Next()

		duration := time.Since(start)
		user := c.GetString("username")
		if user == "" {
			user = "anonymous"
		}

		status := c.Writer.Status()

		if status >= 400 {
			activity := map[string]interface{}{
				"user":      user,
				"action":    c.Request.Method + " " + c.Request.URL.Path,
				"status":    status,
				"duration":  duration,
				"timestamp": time.Now(),
				"ip":        c.ClientIP(),
				"userAgent": c.GetHeader("User-Agent"),
			}

			c.Set("activity_log", activity)
		}
	}
}

func (sm *SystemMiddleware) ValidateSystemJSON() gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.Method == "POST" || c.Request.Method == "PUT" || c.Request.Method == "PATCH" {
			contentType := c.GetHeader("Content-Type")
			if contentType != "application/json" {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Content-Type must be application/json"})
				c.Abort()
				return
			}
		}

		c.Next()
	}
}

func (sm *SystemMiddleware) CheckSystemMaintenance() gin.HandlerFunc {
	return func(c *gin.Context) {
		inMaintenance := false

		if inMaintenance {
			c.JSON(http.StatusServiceUnavailable, gin.H{
				"error":   "System is currently under maintenance",
				"message": "Please try again later",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

func (sm *SystemMiddleware) AuditSystemChanges() gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.Method == "POST" || c.Request.Method == "PUT" || c.Request.Method == "DELETE" {
			user := c.GetString("username")
			if user == "" {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required for system changes"})
				c.Abort()
				return
			}

			c.Set("audit_user", user)
			c.Set("audit_action", c.Request.Method)
			c.Set("audit_resource", c.Request.URL.Path)
			c.Set("audit_timestamp", time.Now())
		}

		c.Next()
	}
}
