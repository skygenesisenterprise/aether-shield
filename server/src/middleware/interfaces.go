package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type InterfaceMiddleware struct {
}

func NewInterfaceMiddleware() *InterfaceMiddleware {
	return &InterfaceMiddleware{}
}

func (m *InterfaceMiddleware) ValidateInterfaceAccess() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		userRole := ctx.GetString("userRole")

		if userRole != "admin" && userRole != "network_admin" {
			ctx.JSON(http.StatusForbidden, gin.H{
				"error": "Insufficient privileges to access interface management",
			})
			ctx.Abort()
			return
		}

		ctx.Next()
	}
}

func (m *InterfaceMiddleware) ValidateJSON() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		if ctx.GetHeader("Content-Type") != "application/json" {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "Content-Type must be application/json",
			})
			ctx.Abort()
			return
		}

		ctx.Next()
	}
}
