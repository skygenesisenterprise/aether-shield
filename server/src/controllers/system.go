package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/skygenesisenterprise/aether-shield/server/src/model"
	"github.com/skygenesisenterprise/aether-shield/server/src/services"
)

type SystemController struct {
	systemService *services.SystemService
}

func NewSystemController(systemService *services.SystemService) *SystemController {
	return &SystemController{
		systemService: systemService,
	}
}

// Access Management Handlers

func (sc *SystemController) GetUsers(c *gin.Context) {
	users, err := sc.systemService.GetUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, users)
}

func (sc *SystemController) CreateUser(c *gin.Context) {
	var req model.CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := sc.systemService.CreateUser(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, user)
}

func (sc *SystemController) UpdateUser(c *gin.Context) {
	id := c.Param("id")
	var req model.UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := sc.systemService.UpdateUser(id, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, user)
}

func (sc *SystemController) DeleteUser(c *gin.Context) {
	id := c.Param("id")
	err := sc.systemService.DeleteUser(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusNoContent, nil)
}

func (sc *SystemController) GetGroups(c *gin.Context) {
	groups, err := sc.systemService.GetGroups()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, groups)
}

func (sc *SystemController) CreateGroup(c *gin.Context) {
	var req model.CreateGroupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	group, err := sc.systemService.CreateGroup(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, group)
}

func (sc *SystemController) UpdateGroup(c *gin.Context) {
	id := c.Param("id")
	var req model.UpdateGroupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	group, err := sc.systemService.UpdateGroup(id, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, group)
}

func (sc *SystemController) DeleteGroup(c *gin.Context) {
	id := c.Param("id")
	err := sc.systemService.DeleteGroup(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusNoContent, nil)
}

func (sc *SystemController) GetPrivileges(c *gin.Context) {
	privileges, err := sc.systemService.GetPrivileges()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, privileges)
}

func (sc *SystemController) GetServers(c *gin.Context) {
	servers, err := sc.systemService.GetServers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, servers)
}

func (sc *SystemController) GetTesters(c *gin.Context) {
	testers, err := sc.systemService.GetTesters()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, testers)
}

// Configuration Handlers

func (sc *SystemController) GetBackupConfig(c *gin.Context) {
	config, err := sc.systemService.GetBackupConfig()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, config)
}

func (sc *SystemController) CreateBackup(c *gin.Context) {
	var req model.CreateBackupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	backup, err := sc.systemService.CreateBackup(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, backup)
}

func (sc *SystemController) GetDefaultConfig(c *gin.Context) {
	config, err := sc.systemService.GetDefaultConfig()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, config)
}

func (sc *SystemController) GetConfigHistory(c *gin.Context) {
	history, err := sc.systemService.GetConfigHistory()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, history)
}

func (sc *SystemController) GetConfigWizard(c *gin.Context) {
	wizard, err := sc.systemService.GetConfigWizard()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, wizard)
}

// Diagnostics Handlers

func (sc *SystemController) GetActivity(c *gin.Context) {
	activity, err := sc.systemService.GetActivity()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, activity)
}

func (sc *SystemController) GetServices(c *gin.Context) {
	services, err := sc.systemService.GetDiagnosticsServices()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, services)
}

func (sc *SystemController) GetStatistics(c *gin.Context) {
	stats, err := sc.systemService.GetStatistics()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, stats)
}

// Firmware Handlers

func (sc *SystemController) GetChangelog(c *gin.Context) {
	changelog, err := sc.systemService.GetChangelog()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, changelog)
}

func (sc *SystemController) GetPackages(c *gin.Context) {
	packages, err := sc.systemService.GetPackages()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, packages)
}

func (sc *SystemController) GetPlugins(c *gin.Context) {
	plugins, err := sc.systemService.GetPlugins()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, plugins)
}

func (sc *SystemController) GetFirmwareSettings(c *gin.Context) {
	settings, err := sc.systemService.GetFirmwareSettings()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, settings)
}

func (sc *SystemController) GetFirmwareStatus(c *gin.Context) {
	status, err := sc.systemService.GetFirmwareStatus()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, status)
}

func (sc *SystemController) CheckUpdates(c *gin.Context) {
	updates, err := sc.systemService.CheckUpdates()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, updates)
}

// Gateways Handlers

func (sc *SystemController) GetGatewayConfigs(c *gin.Context) {
	configs, err := sc.systemService.GetGatewayConfigs()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, configs)
}

func (sc *SystemController) GetGatewayGroups(c *gin.Context) {
	groups, err := sc.systemService.GetGatewayGroups()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, groups)
}

func (sc *SystemController) GetGatewayLog(c *gin.Context) {
	log, err := sc.systemService.GetGatewayLog()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, log)
}

// High Availability Handlers

func (sc *SystemController) GetHAStatus(c *gin.Context) {
	status, err := sc.systemService.GetHAStatus()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, status)
}

func (sc *SystemController) GetHASettings(c *gin.Context) {
	settings, err := sc.systemService.GetHASettings()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, settings)
}

func (sc *SystemController) UpdateHASettings(c *gin.Context) {
	var req model.UpdateHASettingsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	settings, err := sc.systemService.UpdateHASettings(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, settings)
}

// Routes Handlers

func (sc *SystemController) GetRouteConfigs(c *gin.Context) {
	configs, err := sc.systemService.GetRouteConfigs()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, configs)
}

func (sc *SystemController) GetRouteLog(c *gin.Context) {
	log, err := sc.systemService.GetRouteLog()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, log)
}

func (sc *SystemController) GetRouteStatus(c *gin.Context) {
	status, err := sc.systemService.GetRouteStatus()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, status)
}

// Settings Handlers

func (sc *SystemController) GetAdminSettings(c *gin.Context) {
	settings, err := sc.systemService.GetAdminSettings()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, settings)
}

func (sc *SystemController) UpdateAdminSettings(c *gin.Context) {
	var req model.UpdateAdminSettingsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	settings, err := sc.systemService.UpdateAdminSettings(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, settings)
}

func (sc *SystemController) GetCronSettings(c *gin.Context) {
	settings, err := sc.systemService.GetCronSettings()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, settings)
}

func (sc *SystemController) UpdateCronSettings(c *gin.Context) {
	var req model.CronSettings
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	settings, err := sc.systemService.UpdateCronSettings(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, settings)
}

func (sc *SystemController) GetGeneralSettings(c *gin.Context) {
	settings, err := sc.systemService.GetGeneralSettings()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, settings)
}

func (sc *SystemController) UpdateGeneralSettings(c *gin.Context) {
	var req model.UpdateGeneralSettingsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	settings, err := sc.systemService.UpdateGeneralSettings(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, settings)
}

func (sc *SystemController) GetLoggingSettings(c *gin.Context) {
	settings, err := sc.systemService.GetLoggingSettings()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, settings)
}

func (sc *SystemController) UpdateLoggingSettings(c *gin.Context) {
	var req model.LoggingSettings
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	settings, err := sc.systemService.UpdateLoggingSettings(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, settings)
}

func (sc *SystemController) GetMiscSettings(c *gin.Context) {
	settings, err := sc.systemService.GetMiscSettings()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, settings)
}

func (sc *SystemController) UpdateMiscSettings(c *gin.Context) {
	var req model.MiscSettings
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	settings, err := sc.systemService.UpdateMiscSettings(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, settings)
}

func (sc *SystemController) GetTunables(c *gin.Context) {
	tunables, err := sc.systemService.GetTunables()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, tunables)
}

func (sc *SystemController) UpdateTunables(c *gin.Context) {
	var req []model.Tunable
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tunables, err := sc.systemService.UpdateTunables(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, tunables)
}

// Trust & Certificates Handlers

func (sc *SystemController) GetAuthorities(c *gin.Context) {
	authorities, err := sc.systemService.GetAuthorities()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, authorities)
}

func (sc *SystemController) CreateAuthority(c *gin.Context) {
	var req model.CreateCARequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	authority, err := sc.systemService.CreateAuthority(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, authority)
}

func (sc *SystemController) GetCertificates(c *gin.Context) {
	certificates, err := sc.systemService.GetCertificates()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, certificates)
}

func (sc *SystemController) CreateCertificate(c *gin.Context) {
	var req model.CreateCertificateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	certificate, err := sc.systemService.CreateCertificate(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, certificate)
}

func (sc *SystemController) GetRevocation(c *gin.Context) {
	revocation, err := sc.systemService.GetRevocation()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, revocation)
}

func (sc *SystemController) GetTrustSettings(c *gin.Context) {
	settings, err := sc.systemService.GetTrustSettings()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, settings)
}
