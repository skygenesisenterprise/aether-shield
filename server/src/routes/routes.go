package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/skygenesisenterprise/aether-shield/server/src/controllers"
	"github.com/skygenesisenterprise/aether-shield/server/src/middleware"
)

func SetupRoutes(router *gin.Engine, authController *controllers.AuthController, homeController *controllers.HomeController, systemController *controllers.SystemController, interfaceController *controllers.InterfaceController, firewallController *controllers.FirewallController, vpnController *controllers.VPNController, servicesController *controllers.ServicesController, databaseController *controllers.DatabaseController, routersController *controllers.RouterController, authMiddleware *middleware.AuthMiddleware, homeMiddleware *middleware.HomeMiddleware, systemMiddleware *middleware.SystemMiddleware, interfaceMiddleware *middleware.InterfaceMiddleware, firewallMiddleware *middleware.FirewallMiddleware, vpnMiddleware *middleware.VPNMiddleware, servicesMiddleware *middleware.ServicesMiddleware, databaseMiddleware *middleware.DatabaseMiddleware, routersMiddleware *middleware.RouterMiddleware) {
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

		interfaces := api.Group("/interfaces")
		{
			interfaces.Use(authMiddleware.RequireAuth())
			interfaces.Use(interfaceMiddleware.ValidateInterfaceAccess())

			interfaces.GET("/assignments", interfaceController.GetAssignments)
			interfaces.PUT("/assignments", interfaceMiddleware.ValidateJSON(), interfaceController.UpdateAssignments)
			interfaces.GET("/devices", interfaceController.GetDevices)
			interfaces.GET("/devices/gif", interfaceController.GetGifDevices)
			interfaces.GET("/devices/gre", interfaceController.GetGreDevices)
			interfaces.GET("/devices/lagg", interfaceController.GetLaggDevices)
			interfaces.GET("/devices/vlan", interfaceController.GetVlanDevices)
			interfaces.GET("/devices/vxlan", interfaceController.GetVxlanDevices)
			interfaces.GET("/devices/loopback", interfaceController.GetLoopbackDevices)
			interfaces.GET("/devices/point-to-point", interfaceController.GetPointToPointDevices)
			interfaces.GET("/devices/bridges", interfaceController.GetBridgeDevices)

			// Diagnostics
			diagnostics := interfaces.Group("/diagnostics")
			{
				diagnostics.GET("/ping", interfaceController.GetPing)
				diagnostics.POST("/ping", interfaceMiddleware.ValidateJSON(), interfaceController.ExecutePing)
				diagnostics.GET("/traceroute", interfaceController.GetTraceroute)
				diagnostics.POST("/traceroute", interfaceMiddleware.ValidateJSON(), interfaceController.ExecuteTraceroute)
				diagnostics.GET("/netstat", interfaceController.GetNetstat)
				diagnostics.GET("/dns-lookup", interfaceController.GetDNSLookup)
				diagnostics.POST("/dns-lookup", interfaceMiddleware.ValidateJSON(), interfaceController.ExecuteDNSLookup)
				diagnostics.GET("/packet-capture", interfaceController.GetPacketCapture)
				diagnostics.POST("/packet-capture", interfaceMiddleware.ValidateJSON(), interfaceController.ExecutePacketCapture)
				diagnostics.GET("/arp-tables", interfaceController.GetArpTables)
				diagnostics.GET("/portprobe", interfaceController.GetPortprobe)
				diagnostics.POST("/portprobe", interfaceMiddleware.ValidateJSON(), interfaceController.ExecutePortprobe)
			}

			interfaces.GET("/neighbors", interfaceController.GetNeighbors)
			interfaces.GET("/overview", interfaceController.GetOverview)
			interfaces.GET("/settings", interfaceController.GetSettings)
			interfaces.PUT("/settings", interfaceMiddleware.ValidateJSON(), interfaceController.UpdateSettings)

			// Virtual IPs
			virtualIps := interfaces.Group("/virtual-ips")
			{
				virtualIps.GET("/status", interfaceController.GetVirtualIPStatus)
				virtualIps.GET("/settings", interfaceController.GetVirtualIPSettings)
				virtualIps.PUT("/settings", interfaceMiddleware.ValidateJSON(), interfaceController.UpdateVirtualIPSettings)
			}

			interfaces.GET("/wan", interfaceController.GetWan)
			interfaces.PUT("/wan", interfaceMiddleware.ValidateJSON(), interfaceController.UpdateWan)
			interfaces.GET("/wireless/devices", interfaceController.GetWirelessDevices)
		}

		firewall := api.Group("/firewall")
		{
			firewall.Use(authMiddleware.RequireAuth())
			firewall.Use(firewallMiddleware.ValidateFirewallAccess())

			// Rules & Aliases
			rules := firewall.Group("/rules")
			{
				rules.GET("/wan", firewallController.GetWanRules)
				rules.GET("/floating", firewallController.GetFloatingRules)
				rules.POST("", firewallMiddleware.ValidateJSON(), firewallController.CreateRule)
				rules.PUT("/:id", firewallMiddleware.ValidateJSON(), firewallController.UpdateRule)
				rules.DELETE("/:id", firewallController.DeleteRule)
			}

			firewall.GET("/aliases", firewallController.GetAliases)
			firewall.POST("/aliases", firewallMiddleware.ValidateJSON(), firewallController.CreateAlias)
			firewall.PUT("/aliases/:id", firewallMiddleware.ValidateJSON(), firewallController.UpdateAlias)
			firewall.DELETE("/aliases/:id", firewallController.DeleteAlias)
			firewall.GET("/categories", firewallController.GetCategories)
			firewall.GET("/groups", firewallController.GetGroups)

			// Automation
			automation := firewall.Group("/automation")
			{
				automation.GET("/filter", firewallController.GetAutomationFilter)
				automation.GET("/source-nat", firewallController.GetAutomationSourceNat)
			}

			// NAT
			nat := firewall.Group("/nat")
			{
				nat.GET("/one-to-one", firewallController.GetOneToOneNat)
				nat.GET("/outbound", firewallController.GetOutboundNat)
				nat.GET("/port-forward", firewallController.GetPortForward)
				nat.GET("/nptv6", firewallController.GetNptv6Nat)
			}

			// Traffic Shaping
			shaper := firewall.Group("/shaper")
			{
				shaper.GET("/queues", firewallController.GetQueues)
				shaper.GET("/rules", firewallController.GetShaperRules)
				shaper.GET("/pipes", firewallController.GetPipes)
				shaper.GET("/status", firewallController.GetShaperStatus)
			}

			// Settings & Logs
			settings := firewall.Group("/settings")
			{
				settings.GET("/advanced", firewallController.GetAdvancedSettings)
				settings.PUT("/advanced", firewallMiddleware.ValidateJSON(), firewallController.UpdateAdvancedSettings)
				settings.GET("/normalization", firewallController.GetNormalizationSettings)
				settings.PUT("/normalization", firewallMiddleware.ValidateJSON(), firewallController.UpdateNormalizationSettings)
				settings.GET("/schedules", firewallController.GetSchedules)
				settings.PUT("/schedules", firewallMiddleware.ValidateJSON(), firewallController.UpdateSchedules)
			}

			log := firewall.Group("/log")
			{
				log.GET("/general", firewallController.GetGeneralLog)
				log.GET("/live", firewallController.GetLiveLog)
				log.GET("/overview", firewallController.GetLogOverview)
				log.GET("/plain-view", firewallController.GetPlainViewLog)
			}

			// Diagnostics
			diagnostics := firewall.Group("/diagnostics")
			{
				diagnostics.GET("/statistics", firewallController.GetStatistics)
				diagnostics.GET("/states", firewallController.GetStates)
				diagnostics.GET("/aliases", firewallController.GetAliasDiagnostics)
				diagnostics.GET("/sessions", firewallController.GetSessions)
			}
		}

		vpn := api.Group("/vpn")
		{
			vpn.Use(authMiddleware.RequireAuth())
			vpn.Use(vpnMiddleware.ValidateVPNAccess())

			// OpenVPN
			openvpn := vpn.Group("/openvpn")
			{
				openvpn.GET("/instances", vpnController.GetOpenVPNInstances)
				openvpn.POST("/instances", vpnMiddleware.ValidateJSON(), vpnController.CreateOpenVPNInstance)
				openvpn.PUT("/instances/:id", vpnMiddleware.ValidateJSON(), vpnController.UpdateOpenVPNInstance)
				openvpn.DELETE("/instances/:id", vpnController.DeleteOpenVPNInstance)
				openvpn.GET("/status", vpnController.GetOpenVPNStatus)
				openvpn.GET("/log", vpnController.GetOpenVPNLog)
				openvpn.GET("/export", vpnController.GetOpenVPNExport)
				openvpn.GET("/client-overwrites", vpnController.GetOpenVPNClientOverwrites)
			}

			// WireGuard
			wireguard := vpn.Group("/wireguard")
			{
				wireguard.GET("/instances", vpnController.GetWireGuardInstances)
				wireguard.POST("/instances", vpnMiddleware.ValidateJSON(), vpnController.CreateWireGuardInstance)
				wireguard.PUT("/instances/:id", vpnMiddleware.ValidateJSON(), vpnController.UpdateWireGuardInstance)
				wireguard.DELETE("/instances/:id", vpnController.DeleteWireGuardInstance)
				wireguard.GET("/status", vpnController.GetWireGuardStatus)
				wireguard.GET("/log", vpnController.GetWireGuardLog)
				wireguard.GET("/peers", vpnController.GetWireGuardPeers)
				wireguard.POST("/peers", vpnMiddleware.ValidateJSON(), vpnController.CreateWireGuardPeer)
				wireguard.PUT("/peers/:id", vpnMiddleware.ValidateJSON(), vpnController.UpdateWireGuardPeer)
				wireguard.DELETE("/peers/:id", vpnController.DeleteWireGuardPeer)
				wireguard.GET("/peer-generator", vpnController.GetWireGuardPeerGenerator)
			}

			// IPsec
			ipsec := vpn.Group("/ipsec")
			{
				ipsec.GET("/connections", vpnController.GetIPSecConnections)
				ipsec.GET("/sessions", vpnController.GetIPSecSessions)
				ipsec.GET("/settings", vpnController.GetIPSecSettings)
				ipsec.PUT("/settings", vpnMiddleware.ValidateJSON(), vpnController.UpdateIPSecSettings)
				ipsec.GET("/pre-shared-keys", vpnController.GetIPSecPreSharedKeys)
				ipsec.GET("/key-pairs", vpnController.GetIPSecKeyPairs)
				ipsec.GET("/sad", vpnController.GetIPSecSAD)
				ipsec.GET("/spd", vpnController.GetIPSecSPD)
				ipsec.GET("/vti", vpnController.GetIPSecVTI)
				ipsec.GET("/leases", vpnController.GetIPSecLeases)
				ipsec.GET("/log", vpnController.GetIPSecLog)
			}
		}

		services := api.Group("/services")
		{
			services.Use(authMiddleware.RequireAuth())
			services.Use(servicesMiddleware.ValidateServicesAccess())

			// DHCP Services
			dhcp := services.Group("/dhcp")
			{
				dhcp.GET("/v4", servicesController.GetDHCPv4)
				dhcp.GET("/log", servicesController.GetDHCPLog)
				dhcp.GET("/leases6", servicesController.GetDHCPLeases6)
				dhcp.GET("/status", servicesController.GetDHCPStatus)
			}

			dhcprelay := services.Group("/dhcprelay")
			{
				dhcprelay.GET("/configs", servicesController.GetDHCPRelayConfigs)
				dhcprelay.GET("/log", servicesController.GetDHCPRelayLog)
			}

			dhcpv4 := services.Group("/dhcpv4")
			{
				dhcpv4.GET("/leases", servicesController.GetDHCPv4Leases)
				dhcpv4.GET("/log", servicesController.GetDHCPv4Log)
				dhcpv4.GET("/static", servicesController.GetDHCPv4Static)
				dhcpv4.POST("/static", servicesMiddleware.ValidateJSON(), servicesController.CreateDHCPv4Static)
				dhcpv4.PUT("/static/:id", servicesMiddleware.ValidateJSON(), servicesController.UpdateDHCPv4Static)
				dhcpv4.DELETE("/static/:id", servicesController.DeleteDHCPv4Static)
			}

			// DNS Services
			unbound := services.Group("/unbound-dns")
			{
				unbound.GET("/statistics", servicesController.GetUnboundStatistics)
				unbound.GET("/blocklist", servicesController.GetUnboundBlocklist)
				unbound.GET("/settings", servicesController.GetUnboundSettings)
				unbound.PUT("/settings", servicesMiddleware.ValidateJSON(), servicesController.UpdateUnboundSettings)
			}

			services.GET("/opendns", servicesController.GetOpenDNS)

			// Monitoring Services
			monit := services.Group("/monit")
			{
				monit.GET("/status", servicesController.GetMonitStatus)
				monit.GET("/log", servicesController.GetMonitLog)
				monit.GET("/settings", servicesController.GetMonitSettings)
				monit.PUT("/settings", servicesMiddleware.ValidateJSON(), servicesController.UpdateMonitSettings)
			}

			network := services.Group("/network")
			{
				network.GET("/log", servicesController.GetNetworkLog)
				network.GET("/status", servicesController.GetNetworkStatus)
			}

			// Additional Services
			services.GET("/ntp/status", servicesController.GetNTPStatus)
			services.GET("/snmp/status", servicesController.GetSNMPStatus)
			services.GET("/syslog/status", servicesController.GetSyslogStatus)
		}

		database := api.Group("/database")
		{
			database.Use(authMiddleware.RequireAuth())
			database.Use(databaseMiddleware.RequireDatabaseAccess())

			// Database Management
			database.GET("/tables", databaseController.GetTables)
			database.POST("/tables", databaseMiddleware.ValidateDatabaseJSON(), databaseController.CreateTable)
			database.GET("/tables/:name", databaseController.GetTable)
			database.PUT("/tables/:name", databaseMiddleware.ValidateDatabaseJSON(), databaseController.UpdateTable)
			database.DELETE("/tables/:name", databaseController.DeleteTable)
			database.GET("/schemas", databaseController.GetSchemas)
			database.POST("/schemas", databaseMiddleware.ValidateDatabaseJSON(), databaseController.CreateSchema)
			database.GET("/schemas/:name", databaseController.GetSchema)
			database.DELETE("/schemas/:name", databaseController.DeleteSchema)

			// Database Operations
			database.GET("/queries", databaseController.GetQueries)
			database.POST("/queries", databaseMiddleware.ValidateDatabaseJSON(), databaseController.CreateQuery)
			database.GET("/queries/:id", databaseController.GetQuery)
			database.DELETE("/queries/:id", databaseController.DeleteQuery)
			database.POST("/export", databaseMiddleware.ValidateDatabaseJSON(), databaseController.ExportDatabase)
			database.GET("/import", databaseController.GetImportStatus)
			database.POST("/import", databaseMiddleware.ValidateDatabaseJSON(), databaseController.ImportDatabase)
			database.GET("/backup", databaseController.GetBackupList)
			database.POST("/backup", databaseMiddleware.ValidateDatabaseJSON(), databaseController.CreateBackup)
			database.GET("/restore", databaseController.GetRestoreStatus)
			database.POST("/restore", databaseMiddleware.ValidateDatabaseJSON(), databaseController.RestoreDatabase)

			// Database Monitoring
			database.GET("/status", databaseController.GetStatus)
			database.GET("/performance", databaseController.GetPerformance)
			database.GET("/connections", databaseController.GetConnections)
			database.GET("/statistics", databaseController.GetStatistics)
			database.GET("/logs", databaseController.GetLogs)
			database.GET("/locks", databaseController.GetLocks)
			database.GET("/slow-queries", databaseController.GetSlowQueries)
		}

		routers := api.Group("/routers")
		{
			routers.Use(authMiddleware.RequireAuth())
			routers.Use(routersMiddleware.ValidateRouterAccess())

			// Router Management
			routers.GET("", routersController.GetRouters)
			routers.POST("", routersMiddleware.ValidateRouterJSON(), routersController.CreateRouter)
			routers.GET("/:id", routersController.GetRouter)
			routers.PUT("/:id", routersMiddleware.ValidateRouterJSON(), routersController.UpdateRouter)
			routers.DELETE("/:id", routersController.DeleteRouter)

			// Router Status
			routers.GET("/:id/status", routersController.GetRouterStatus)

			// Router Configuration
			routers.GET("/:id/config", routersController.GetRouterConfig)
			routers.PUT("/:id/config", routersMiddleware.ValidateRouterConfig(), routersController.UpdateRouterConfig)

			// Router Logs
			routers.GET("/:id/log", routersController.GetRouterLog)

			// Router Interfaces
			routers.GET("/:id/interfaces", routersController.GetRouterInterfaces)

			// Router Routes
			routers.GET("/:id/routes", routersController.GetRouterRoutes)

			// Router Services
			routers.GET("/:id/services", routersController.GetRouterServices)

			// Router Firewall
			routers.GET("/:id/firewall", routersController.GetRouterFirewall)

			// Router VPN
			routers.GET("/:id/vpn", routersController.GetRouterVPN)

			// Router Statistics
			routers.GET("/:id/statistics", routersController.GetRouterStatistics)

			// Router Commands
			routers.POST("/:id/commands", routersMiddleware.ValidateRouterCommand(), routersController.ExecuteRouterCommand)

			// Router Diagnostics
			routers.GET("/:id/diagnostics", routersController.GetRouterDiagnostics)

			// Router Backup
			routers.GET("/:id/backup", routersController.GetRouterBackup)
			routers.POST("/:id/backup", routersMiddleware.ValidateRouterBackup(), routersController.CreateRouterBackup)
			routers.POST("/:id/restore", routersMiddleware.ValidateRouterBackup(), routersController.RestoreRouterBackup)
		}
	}
}
