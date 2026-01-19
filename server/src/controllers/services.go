package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/skygenesisenterprise/aether-shield/server/src/model"
	"github.com/skygenesisenterprise/aether-shield/server/src/services"
)

type ServicesController struct {
	servicesService *services.ServicesService
}

func NewServicesController() *ServicesController {
	return &ServicesController{
		servicesService: services.NewServicesService(),
	}
}

// DHCP v4 endpoints
func (c *ServicesController) GetDHCPv4(ctx *gin.Context) {
	response, err := c.servicesService.GetDHCPv4Service(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, model.APIResponse{
			Success: false,
			Error:   "Failed to retrieve DHCPv4 service: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, model.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (c *ServicesController) GetDHCPLog(ctx *gin.Context) {
	// Get number of lines from query parameter (default to 100)
	linesStr := ctx.DefaultQuery("lines", "100")
	lines, err := strconv.Atoi(linesStr)
	if err != nil || lines < 1 {
		lines = 100
	}

	response, err := c.servicesService.GetServiceLog(ctx.Request.Context(), "dhcp", lines)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, model.APIResponse{
			Success: false,
			Error:   "Failed to retrieve DHCP log: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, model.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (c *ServicesController) GetDHCPLeases6(ctx *gin.Context) {
	response, err := c.servicesService.GetDHCPv6Leases(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, model.APIResponse{
			Success: false,
			Error:   "Failed to retrieve DHCPv6 leases: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, model.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (c *ServicesController) GetDHCPStatus(ctx *gin.Context) {
	response, err := c.servicesService.GetServiceStatus(ctx.Request.Context(), "dhcp")
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, model.APIResponse{
			Success: false,
			Error:   "Failed to retrieve DHCP status: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, model.APIResponse{
		Success: true,
		Data:    response,
	})
}

// DHCP Relay endpoints
func (c *ServicesController) GetDHCPRelayConfigs(ctx *gin.Context) {
	response, err := c.servicesService.GetDHCPRelayConfigs(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, model.APIResponse{
			Success: false,
			Error:   "Failed to retrieve DHCP relay configs: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, model.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (c *ServicesController) GetDHCPRelayLog(ctx *gin.Context) {
	// Get number of lines from query parameter (default to 100)
	linesStr := ctx.DefaultQuery("lines", "100")
	lines, err := strconv.Atoi(linesStr)
	if err != nil || lines < 1 {
		lines = 100
	}

	response, err := c.servicesService.GetServiceLog(ctx.Request.Context(), "dhcprelay", lines)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, model.APIResponse{
			Success: false,
			Error:   "Failed to retrieve DHCP relay log: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, model.APIResponse{
		Success: true,
		Data:    response,
	})
}

// DHCPv4 endpoints
func (c *ServicesController) GetDHCPv4Leases(ctx *gin.Context) {
	response, err := c.servicesService.GetDHCPv4Leases(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, model.APIResponse{
			Success: false,
			Error:   "Failed to retrieve DHCPv4 leases: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, model.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (c *ServicesController) GetDHCPv4Log(ctx *gin.Context) {
	// Get number of lines from query parameter (default to 100)
	linesStr := ctx.DefaultQuery("lines", "100")
	lines, err := strconv.Atoi(linesStr)
	if err != nil || lines < 1 {
		lines = 100
	}

	response, err := c.servicesService.GetServiceLog(ctx.Request.Context(), "dhcpd", lines)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, model.APIResponse{
			Success: false,
			Error:   "Failed to retrieve DHCPv4 log: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, model.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (c *ServicesController) GetDHCPv4Static(ctx *gin.Context) {
	response, err := c.servicesService.GetDHCPv4StaticMappings(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, model.APIResponse{
			Success: false,
			Error:   "Failed to retrieve DHCPv4 static mappings: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, model.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (c *ServicesController) CreateDHCPv4Static(ctx *gin.Context) {
	var staticMapping model.DHCPv4Static
	if err := ctx.ShouldBindJSON(&staticMapping); err != nil {
		ctx.JSON(http.StatusBadRequest, model.APIResponse{
			Success: false,
			Error:   "Invalid JSON format: " + err.Error(),
		})
		return
	}

	err := c.servicesService.CreateDHCPv4StaticMapping(ctx.Request.Context(), staticMapping)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, model.APIResponse{
			Success: false,
			Error:   "Failed to create DHCPv4 static mapping: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusCreated, model.APIResponse{
		Success: true,
		Data:    staticMapping,
		Message: "Static mapping created successfully",
	})
}

func (c *ServicesController) UpdateDHCPv4Static(ctx *gin.Context) {
	id := ctx.Param("id")
	var staticMapping model.DHCPv4Static
	if err := ctx.ShouldBindJSON(&staticMapping); err != nil {
		ctx.JSON(http.StatusBadRequest, model.APIResponse{
			Success: false,
			Error:   "Invalid JSON format: " + err.Error(),
		})
		return
	}

	err := c.servicesService.UpdateDHCPv4StaticMapping(ctx.Request.Context(), id, staticMapping)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, model.APIResponse{
			Success: false,
			Error:   "Failed to update DHCPv4 static mapping: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, model.APIResponse{
		Success: true,
		Data:    staticMapping,
		Message: "Static mapping " + id + " updated successfully",
	})
}

func (c *ServicesController) DeleteDHCPv4Static(ctx *gin.Context) {
	id := ctx.Param("id")

	err := c.servicesService.DeleteDHCPv4StaticMapping(ctx.Request.Context(), id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, model.APIResponse{
			Success: false,
			Error:   "Failed to delete DHCPv4 static mapping: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, model.APIResponse{
		Success: true,
		Message: "Static mapping " + id + " deleted successfully",
	})
}

// DNS Services endpoints
func (c *ServicesController) GetUnboundStatistics(ctx *gin.Context) {
	response, err := c.servicesService.GetUnboundStatistics(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, model.APIResponse{
			Success: false,
			Error:   "Failed to retrieve Unbound statistics: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, model.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (c *ServicesController) GetUnboundBlocklist(ctx *gin.Context) {
	response, err := c.servicesService.GetUnboundBlocklist(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, model.APIResponse{
			Success: false,
			Error:   "Failed to retrieve Unbound blocklist: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, model.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (c *ServicesController) GetUnboundSettings(ctx *gin.Context) {
	response, err := c.servicesService.GetUnboundSettings(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, model.APIResponse{
			Success: false,
			Error:   "Failed to retrieve Unbound settings: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, model.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (c *ServicesController) UpdateUnboundSettings(ctx *gin.Context) {
	var settings model.UnboundSettings
	if err := ctx.ShouldBindJSON(&settings); err != nil {
		ctx.JSON(http.StatusBadRequest, model.APIResponse{
			Success: false,
			Error:   "Invalid JSON format: " + err.Error(),
		})
		return
	}

	err := c.servicesService.UpdateUnboundSettings(ctx.Request.Context(), settings)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, model.APIResponse{
			Success: false,
			Error:   "Failed to update Unbound settings: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, model.APIResponse{
		Success: true,
		Data:    settings,
		Message: "Unbound settings updated successfully",
	})
}

func (c *ServicesController) GetOpenDNS(ctx *gin.Context) {
	response, err := c.servicesService.GetOpenDNSConfig(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, model.APIResponse{
			Success: false,
			Error:   "Failed to retrieve OpenDNS configuration: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, model.APIResponse{
		Success: true,
		Data:    response,
	})
}

// Monitoring Services endpoints
func (c *ServicesController) GetMonitStatus(ctx *gin.Context) {
	response, err := c.servicesService.GetMonitStatus(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, model.APIResponse{
			Success: false,
			Error:   "Failed to retrieve Monit status: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, model.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (c *ServicesController) GetMonitLog(ctx *gin.Context) {
	// Get number of lines from query parameter (default to 100)
	linesStr := ctx.DefaultQuery("lines", "100")
	lines, err := strconv.Atoi(linesStr)
	if err != nil || lines < 1 {
		lines = 100
	}

	response, err := c.servicesService.GetServiceLog(ctx.Request.Context(), "monit", lines)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, model.APIResponse{
			Success: false,
			Error:   "Failed to retrieve Monit log: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, model.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (c *ServicesController) GetMonitSettings(ctx *gin.Context) {
	response, err := c.servicesService.GetMonitSettings(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, model.APIResponse{
			Success: false,
			Error:   "Failed to retrieve Monit settings: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, model.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (c *ServicesController) UpdateMonitSettings(ctx *gin.Context) {
	var settings model.MonitSettings
	if err := ctx.ShouldBindJSON(&settings); err != nil {
		ctx.JSON(http.StatusBadRequest, model.APIResponse{
			Success: false,
			Error:   "Invalid JSON format: " + err.Error(),
		})
		return
	}

	err := c.servicesService.UpdateMonitSettings(ctx.Request.Context(), settings)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, model.APIResponse{
			Success: false,
			Error:   "Failed to update Monit settings: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, model.APIResponse{
		Success: true,
		Data:    settings,
		Message: "Monit settings updated successfully",
	})
}

// Network Services endpoints
func (c *ServicesController) GetNetworkLog(ctx *gin.Context) {
	// Get number of lines from query parameter (default to 100)
	linesStr := ctx.DefaultQuery("lines", "100")
	lines, err := strconv.Atoi(linesStr)
	if err != nil || lines < 1 {
		lines = 100
	}

	response, err := c.servicesService.GetServiceLog(ctx.Request.Context(), "network", lines)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, model.APIResponse{
			Success: false,
			Error:   "Failed to retrieve network log: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, model.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (c *ServicesController) GetNetworkStatus(ctx *gin.Context) {
	response, err := c.servicesService.GetNetworkStatus(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, model.APIResponse{
			Success: false,
			Error:   "Failed to retrieve network status: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, model.APIResponse{
		Success: true,
		Data:    response,
	})
}

// Additional Services endpoints
func (c *ServicesController) GetNTPStatus(ctx *gin.Context) {
	response, err := c.servicesService.GetNTPStatus(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, model.APIResponse{
			Success: false,
			Error:   "Failed to retrieve NTP status: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, model.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (c *ServicesController) GetSNMPStatus(ctx *gin.Context) {
	response, err := c.servicesService.GetSNMPStatus(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, model.APIResponse{
			Success: false,
			Error:   "Failed to retrieve SNMP status: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, model.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (c *ServicesController) GetSyslogStatus(ctx *gin.Context) {
	response, err := c.servicesService.GetSyslogStatus(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, model.APIResponse{
			Success: false,
			Error:   "Failed to retrieve Syslog status: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, model.APIResponse{
		Success: true,
		Data:    response,
	})
}
