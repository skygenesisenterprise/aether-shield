package middleware

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type HomeMiddleware struct{}

func NewHomeMiddleware() *HomeMiddleware {
	return &HomeMiddleware{}
}

func (h *HomeMiddleware) RequireAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization token required"})
			c.Abort()
			return
		}

		if len(token) > 7 && token[:7] == "Bearer " {
			token = token[7:]
		}

		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token format"})
			c.Abort()
			return
		}

		c.Set("user_id", "demo-user")
		c.Set("username", "admin")
		c.Set("role", "administrator")

		c.Next()
	}
}

func (h *HomeMiddleware) RateLimiter() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("rate_limit_remaining", "100")
		c.Set("rate_limit_reset", time.Now().Add(time.Hour).Unix())

		c.Next()
	}
}

func (h *HomeMiddleware) RequestLogger() gin.HandlerFunc {
	return gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		return fmt.Sprintf("[%s] %s %s %d %s %s\n",
			param.TimeStamp.Format("2006-01-02 15:04:05"),
			param.Method,
			param.Path,
			param.StatusCode,
			param.Latency,
			param.ClientIP,
		)
	})
}

func (h *HomeMiddleware) CORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization")
		c.Header("Access-Control-Max-Age", "86400")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func (h *HomeMiddleware) ValidateJSON() gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.Method == "POST" || c.Request.Method == "PUT" {
			contentType := c.GetHeader("Content-Type")
			if contentType != "application/json" && contentType != "application/json; charset=utf-8" {
				c.JSON(http.StatusUnsupportedMediaType, gin.H{"error": "Content-Type must be application/json"})
				c.Abort()
				return
			}
		}
		c.Next()
	}
}
