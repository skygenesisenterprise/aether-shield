package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/skygenesisenterprise/aether-shield/server/src/controllers"
	"github.com/skygenesisenterprise/aether-shield/server/src/middleware"
)

func SetupRoutes(router *gin.Engine, authController *controllers.AuthController, homeController *controllers.HomeController, systemController *controllers.SystemController, authMiddleware *middleware.AuthMiddleware, homeMiddleware *middleware.HomeMiddleware, systemMiddleware *middleware.SystemMiddleware) {
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
			system.Use(systemMiddleware.ValidateSystemAccess())

			// Access Management
			access := system.Group("/access")
			{
				access.GET("/users", systemController.GetUsers)
				access.POST("/users", systemMiddleware.ValidateSystemJSON(), systemController.CreateUser)
				access.PUT("/users/:id", systemMiddleware.ValidateSystemJSON(), systemController.UpdateUser)
				access.DELETE("/users/:id", systemController.DeleteUser)
				access.GET("/groups", systemController.GetGroups)
				access.POST("/groups", systemMiddleware.ValidateSystemJSON(), systemController.CreateGroup)
				access.PUT("/groups/:id", systemMiddleware.ValidateSystemJSON(), systemController.UpdateGroup)
				access.DELETE("/groups/:id", systemController.DeleteGroup)
				access.GET("/privileges", systemController.GetPrivileges)
				access.GET("/servers", systemController.GetServers)
				access.GET("/testers", systemController.GetTesters)
			}

			// Configuration
			config := system.Group("/config")
			{
				config.Use(systemMiddleware.ValidateConfigAccess())
				config.GET("/backup", systemController.GetBackupConfig)
				config.POST("/backup", systemMiddleware.ValidateSystemJSON(), systemController.CreateBackup)
				config.GET("/default", systemController.GetDefaultConfig)
				config.GET("/history", systemController.GetConfigHistory)
				config.GET("/wizard", systemController.GetConfigWizard)
			}

			// Diagnostics
			diagnostics := system.Group("/diagnostics")
			{
				diagnostics.GET("/activity", systemController.GetActivity)
				diagnostics.GET("/services", systemController.GetServices)
				diagnostics.GET("/statistics", systemController.GetStatistics)
			}

			// Firmware
			firmware := system.Group("/firmware")
			{
				firmware.GET("/changelog", systemController.GetChangelog)
				firmware.GET("/packages", systemController.GetPackages)
				firmware.GET("/plugins", systemController.GetPlugins)
				firmware.GET("/settings", systemController.GetFirmwareSettings)
				firmware.GET("/status", systemController.GetFirmwareStatus)
				firmware.POST("/updates", systemController.CheckUpdates)
			}

			// Gateways
			gateways := system.Group("/gateways")
			{
				gateways.GET("/configs", systemController.GetGatewayConfigs)
				gateways.GET("/groups", systemController.GetGatewayGroups)
				gateways.GET("/log", systemController.GetGatewayLog)
			}

			// High Availability
			ha := system.Group("/high-availability")
			{
				ha.GET("/status", systemController.GetHAStatus)
				ha.GET("/settings", systemController.GetHASettings)
				ha.PUT("/settings", systemMiddleware.ValidateSystemJSON(), systemController.UpdateHASettings)
			}

			// Routes
			routes := system.Group("/routes")
			{
				routes.GET("/configs", systemController.GetRouteConfigs)
				routes.GET("/log", systemController.GetRouteLog)
				routes.GET("/status", systemController.GetRouteStatus)
			}

			// Settings
			settings := system.Group("/settings")
			{
				settings.GET("/admin", systemController.GetAdminSettings)
				settings.PUT("/admin", systemMiddleware.ValidateSystemJSON(), systemController.UpdateAdminSettings)
				settings.GET("/cron", systemController.GetCronSettings)
				settings.PUT("/cron", systemMiddleware.ValidateSystemJSON(), systemController.UpdateCronSettings)
				settings.GET("/general", systemController.GetGeneralSettings)
				settings.PUT("/general", systemMiddleware.ValidateSystemJSON(), systemController.UpdateGeneralSettings)
				settings.GET("/logging", systemController.GetLoggingSettings)
				settings.PUT("/logging", systemMiddleware.ValidateSystemJSON(), systemController.UpdateLoggingSettings)
				settings.GET("/miscellaneous", systemController.GetMiscSettings)
				settings.PUT("/miscellaneous", systemMiddleware.ValidateSystemJSON(), systemController.UpdateMiscSettings)
				settings.GET("/tunables", systemController.GetTunables)
				settings.PUT("/tunables", systemMiddleware.ValidateSystemJSON(), systemController.UpdateTunables)
			}

			// Trust & Certificates
			trust := system.Group("/trust")
			{
				trust.Use(systemMiddleware.ValidateTrustAccess())
				trust.GET("/authorities", systemController.GetAuthorities)
				trust.POST("/authorities", systemMiddleware.ValidateSystemJSON(), systemController.CreateAuthority)
				trust.GET("/certificates", systemController.GetCertificates)
				trust.POST("/certificates", systemMiddleware.ValidateSystemJSON(), systemController.CreateCertificate)
				trust.GET("/revocation", systemController.GetRevocation)
				trust.GET("/settings", systemController.GetTrustSettings)
			}
		}
	}
}
