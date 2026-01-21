package middleware

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type DatabaseMiddleware struct {
	jwtSecret []byte
}

func NewDatabaseMiddleware(jwtSecret string) *DatabaseMiddleware {
	return &DatabaseMiddleware{
		jwtSecret: []byte(jwtSecret),
	}
}

func (dm *DatabaseMiddleware) RequireDatabaseAccess() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
			tokenString = tokenString[7:]
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return dm.jwtSecret, nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			c.Abort()
			return
		}

		role, ok := claims["role"].(string)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Role not found in token"})
			c.Abort()
			return
		}

		if role != "admin" && role != "database_admin" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions for database access"})
			c.Abort()
			return
		}

		c.Set("userID", claims["sub"])
		c.Set("userRole", role)
		c.Next()
	}
}

func (dm *DatabaseMiddleware) ValidateDatabaseJSON() gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		if c.Request.Method != "POST" && c.Request.Method != "PUT" && c.Request.Method != "PATCH" {
			c.Next()
			return
		}

		contentType := c.GetHeader("Content-Type")
		if contentType != "application/json" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Content-Type must be application/json"})
			c.Abort()
			return
		}

		c.Next()
	})
}

func (dm *DatabaseMiddleware) RateLimiter() gin.HandlerFunc {
	type client struct {
		limiter  *time.Ticker
		lastSeen time.Time
	}

	clients := make(map[string]*client)

	return func(c *gin.Context) {
		ip := c.ClientIP()
		if _, found := clients[ip]; !found {
			clients[ip] = &client{
				limiter:  time.NewTicker(100 * time.Millisecond),
				lastSeen: time.Now(),
			}
		}

		clientData := clients[ip]
		clientData.lastSeen = time.Now()

		select {
		case <-clientData.limiter.C:
			c.Next()
		default:
			c.JSON(http.StatusTooManyRequests, gin.H{"error": "Rate limit exceeded"})
			c.Abort()
			return
		}
	}
}

func (dm *DatabaseMiddleware) CORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

func (dm *DatabaseMiddleware) ValidateDatabaseOperation() gin.HandlerFunc {
	return func(c *gin.Context) {
		operation := c.Param("operation")
		userRole, exists := c.Get("userRole")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User role not found"})
			c.Abort()
			return
		}

		role, ok := userRole.(string)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user role format"})
			c.Abort()
			return
		}

		if role != "admin" && role != "database_admin" {
			switch operation {
			case "SELECT":
			case "INSERT":
			case "UPDATE":
			case "DELETE":
			default:
				c.JSON(http.StatusForbidden, gin.H{"error": "Operation not permitted"})
				c.Abort()
				return
			}
		}

		c.Next()
	}
}

func (dm *DatabaseMiddleware) LoggingMiddleware() gin.HandlerFunc {
	return gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		return fmt.Sprintf("[%s] %s %s %d %s %s\n",
			param.TimeStamp.Format(time.RFC3339),
			param.Method,
			param.Path,
			param.StatusCode,
			param.Latency,
			param.ClientIP,
		)
	})
}

func (dm *DatabaseMiddleware) SecurityHeaders() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("X-Content-Type-Options", "nosniff")
		c.Header("X-Frame-Options", "DENY")
		c.Header("X-XSS-Protection", "1; mode=block")
		c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
		c.Next()
	}
}
