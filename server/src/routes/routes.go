package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/skygenesisenterprise/aether-shield/server/src/controllers"
	"github.com/skygenesisenterprise/aether-shield/server/src/middleware"
)

func SetupRoutes(router *gin.Engine, authController *controllers.AuthController, homeController *controllers.HomeController, authMiddleware *middleware.AuthMiddleware, homeMiddleware *middleware.HomeMiddleware) {
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
			home.Use(homeMiddleware.RateLimiter())
			home.Use(homeMiddleware.CORS())

			home.GET("/dashboard/system-info", homeController.GetSystemInfo)
			home.GET("/dashboard/cpu-info", homeController.GetCpuInfo)
			home.GET("/dashboard/memory-info", homeController.GetMemoryInfo)
			home.GET("/dashboard/disk-info", homeController.GetDiskInfo)
			home.GET("/dashboard/interface-stats", homeController.GetInterfaceStats)
			home.GET("/dashboard/firewall-info", homeController.GetFirewallInfo)
			home.GET("/dashboard/services", homeController.GetServices)
			home.GET("/dashboard/announcements", homeController.GetAnnouncements)
			home.GET("/dashboard/traffic-data", homeController.GetTrafficData)
			home.GET("/license/info", homeController.GetLicenseInfo)
			home.PUT("/password/change", homeMiddleware.ValidateJSON(), homeController.ChangePassword)
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
