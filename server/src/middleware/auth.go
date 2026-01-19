package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"

	"github.com/skygenesisenterprise/aether-shield/server/src/services"
)

type AuthMiddleware struct {
	authService *services.AuthService
}

func NewAuthMiddleware(authService *services.AuthService) *AuthMiddleware {
	return &AuthMiddleware{
		authService: authService,
	}
}

func (m *AuthMiddleware) RequireAuth() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		authHeader := ctx.GetHeader("Authorization")
		if authHeader == "" {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			ctx.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Bearer token required"})
			ctx.Abort()
			return
		}

		token, err := m.authService.ValidateToken(tokenString)
		if err != nil || !token.Valid {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			ctx.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			ctx.Abort()
			return
		}

		userID, ok := claims["user_id"].(string)
		if !ok {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in token"})
			ctx.Abort()
			return
		}

		username, ok := claims["username"].(string)
		if !ok {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Username not found in token"})
			ctx.Abort()
			return
		}

		ctx.Set("user_id", userID)
		ctx.Set("username", username)
		ctx.Next()
	}
}

func (m *AuthMiddleware) RequireRole(requiredRole string) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		m.RequireAuth()(ctx)

		userID, exists := ctx.Get("user_id")
		if !exists {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
			ctx.Abort()
			return
		}

		user, err := m.authService.GetMe(userID.(string))
		if err != nil {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			ctx.Abort()
			return
		}

		if user.Role != requiredRole && user.Role != "admin" {
			ctx.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions"})
			ctx.Abort()
			return
		}

		ctx.Set("user_role", user.Role)
		ctx.Set("user_permissions", user.Permissions)
		ctx.Next()
	}
}

func (m *AuthMiddleware) RequirePermission(permission string) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		m.RequireAuth()(ctx)

		userID, exists := ctx.Get("user_id")
		if !exists {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
			ctx.Abort()
			return
		}

		user, err := m.authService.GetMe(userID.(string))
		if err != nil {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			ctx.Abort()
			return
		}

		hasPermission := false
		for _, p := range user.Permissions {
			if p == permission || p == "admin" {
				hasPermission = true
				break
			}
		}

		if !hasPermission {
			ctx.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions"})
			ctx.Abort()
			return
		}

		ctx.Set("user_role", user.Role)
		ctx.Set("user_permissions", user.Permissions)
		ctx.Next()
	}
}

func (m *AuthMiddleware) OptionalAuth() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		authHeader := ctx.GetHeader("Authorization")
		if authHeader == "" {
			ctx.Next()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			ctx.Next()
			return
		}

		token, err := m.authService.ValidateToken(tokenString)
		if err != nil || !token.Valid {
			ctx.Next()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			ctx.Next()
			return
		}

		userID, ok := claims["user_id"].(string)
		if !ok {
			ctx.Next()
			return
		}

		username, ok := claims["username"].(string)
		if !ok {
			ctx.Next()
			return
		}

		ctx.Set("user_id", userID)
		ctx.Set("username", username)
		ctx.Next()
	}
}
