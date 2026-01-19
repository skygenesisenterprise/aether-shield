package routes

import (
	"github.com/skygenesisenterprise/aether-shield/server/src/controllers"
	"github.com/skygenesisenterprise/aether-shield/server/src/middleware"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine, authController *controllers.AuthController, authMiddleware *middleware.AuthMiddleware) {
	api := router.Group("/api/v1")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/login", authController.Login)
			auth.POST("/logout", authController.Logout)
			auth.POST("/refresh", authController.RefreshToken)
			auth.GET("/me", authMiddleware.RequireAuth(), authController.GetMe)
			auth.POST("/forgot-password", authController.ForgotPassword)
			auth.POST("/reset-password", authController.ResetPassword)
			auth.GET("/oauth/authorize", authController.OAuthAuthorize)
		}

		home := api.Group("/home")
		{
			home.Use(authMiddleware.RequireAuth())
			home.GET("/dashboard/system-info", func(c *gin.Context) {
				c.JSON(200, gin.H{"message": "System info endpoint"})
			})
		}

		system := api.Group("/system")
		{
			system.Use(authMiddleware.RequireAuth())
			system.GET("/access/users", func(c *gin.Context) {
				c.JSON(200, gin.H{"message": "Users endpoint"})
			})
		}
	}
}
