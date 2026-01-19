package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/skygenesisenterprise/aether-shield/server/src/model"
	"github.com/skygenesisenterprise/aether-shield/server/src/services"
)

// FirewallController handles firewall-related HTTP requests
type FirewallController struct {
	firewallService services.FirewallService
}

// NewFirewallController creates a new firewall controller
func NewFirewallController(firewallService services.FirewallService) *FirewallController {
	return &FirewallController{
		firewallService: firewallService,
	}
}

// Rules & Aliases handlers

// GetWanRules handles GET /api/v1/firewall/rules/wan
func (c *FirewallController) GetWanRules(ctx *gin.Context) {
	rules, err := c.firewallService.GetWanRules(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": rules})
}

// GetFloatingRules handles GET /api/v1/firewall/rules/floating
func (c *FirewallController) GetFloatingRules(ctx *gin.Context) {
	rules, err := c.firewallService.GetFloatingRules(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": rules})
}

// CreateRule handles POST /api/v1/firewall/rules
func (c *FirewallController) CreateRule(ctx *gin.Context) {
	var rule model.FirewallRule

	if err := ctx.ShouldBindJSON(&rule); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := c.firewallService.CreateRule(ctx.Request.Context(), &rule); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"data": rule})
}

// UpdateRule handles PUT /api/v1/firewall/rules/:id
func (c *FirewallController) UpdateRule(ctx *gin.Context) {
	id := ctx.Param("id")

	var rule model.FirewallRule
	if err := ctx.ShouldBindJSON(&rule); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := c.firewallService.UpdateRule(ctx.Request.Context(), id, &rule); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": rule})
}

// DeleteRule handles DELETE /api/v1/firewall/rules/:id
func (c *FirewallController) DeleteRule(ctx *gin.Context) {
	id := ctx.Param("id")

	if err := c.firewallService.DeleteRule(ctx.Request.Context(), id); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Rule deleted successfully"})
}

// GetAliases handles GET /api/v1/firewall/aliases
func (c *FirewallController) GetAliases(ctx *gin.Context) {
	aliases, err := c.firewallService.GetAliases(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": aliases})
}

// CreateAlias handles POST /api/v1/firewall/aliases
func (c *FirewallController) CreateAlias(ctx *gin.Context) {
	var alias model.FirewallAlias

	if err := ctx.ShouldBindJSON(&alias); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := c.firewallService.CreateAlias(ctx.Request.Context(), &alias); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"data": alias})
}

// UpdateAlias handles PUT /api/v1/firewall/aliases/:id
func (c *FirewallController) UpdateAlias(ctx *gin.Context) {
	id := ctx.Param("id")

	var alias model.FirewallAlias
	if err := ctx.ShouldBindJSON(&alias); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := c.firewallService.UpdateAlias(ctx.Request.Context(), id, &alias); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": alias})
}

// DeleteAlias handles DELETE /api/v1/firewall/aliases/:id
func (c *FirewallController) DeleteAlias(ctx *gin.Context) {
	id := ctx.Param("id")

	if err := c.firewallService.DeleteAlias(ctx.Request.Context(), id); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Alias deleted successfully"})
}

// GetCategories handles GET /api/v1/firewall/categories
func (c *FirewallController) GetCategories(ctx *gin.Context) {
	categories, err := c.firewallService.GetCategories(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": categories})
}

// GetGroups handles GET /api/v1/firewall/groups
func (c *FirewallController) GetGroups(ctx *gin.Context) {
	groups, err := c.firewallService.GetGroups(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": groups})
}

// Automation handlers

// GetAutomationFilter handles GET /api/v1/firewall/automation/filter
func (c *FirewallController) GetAutomationFilter(ctx *gin.Context) {
	filters, err := c.firewallService.GetAutomationFilter(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": filters})
}

// GetAutomationSourceNat handles GET /api/v1/firewall/automation/source-nat
func (c *FirewallController) GetAutomationSourceNat(ctx *gin.Context) {
	natRules, err := c.firewallService.GetAutomationSourceNat(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": natRules})
}

// NAT handlers

// GetOneToOneNat handles GET /api/v1/firewall/nat/one-to-one
func (c *FirewallController) GetOneToOneNat(ctx *gin.Context) {
	rules, err := c.firewallService.GetOneToOneNat(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": rules})
}

// GetOutboundNat handles GET /api/v1/firewall/nat/outbound
func (c *FirewallController) GetOutboundNat(ctx *gin.Context) {
	rules, err := c.firewallService.GetOutboundNat(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": rules})
}

// GetPortForward handles GET /api/v1/firewall/nat/port-forward
func (c *FirewallController) GetPortForward(ctx *gin.Context) {
	rules, err := c.firewallService.GetPortForward(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": rules})
}

// GetNptv6Nat handles GET /api/v1/firewall/nat/nptv6
func (c *FirewallController) GetNptv6Nat(ctx *gin.Context) {
	rules, err := c.firewallService.GetNptv6Nat(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": rules})
}

// Traffic Shaping handlers

// GetQueues handles GET /api/v1/firewall/shaper/queues
func (c *FirewallController) GetQueues(ctx *gin.Context) {
	queues, err := c.firewallService.GetQueues(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": queues})
}

// GetShaperRules handles GET /api/v1/firewall/shaper/rules
func (c *FirewallController) GetShaperRules(ctx *gin.Context) {
	rules, err := c.firewallService.GetShaperRules(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": rules})
}

// GetPipes handles GET /api/v1/firewall/shaper/pipes
func (c *FirewallController) GetPipes(ctx *gin.Context) {
	pipes, err := c.firewallService.GetPipes(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": pipes})
}

// GetShaperStatus handles GET /api/v1/firewall/shaper/status
func (c *FirewallController) GetShaperStatus(ctx *gin.Context) {
	status, err := c.firewallService.GetShaperStatus(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": status})
}

// Settings & Logs handlers

// GetAdvancedSettings handles GET /api/v1/firewall/settings/advanced
func (c *FirewallController) GetAdvancedSettings(ctx *gin.Context) {
	settings, err := c.firewallService.GetAdvancedSettings(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": settings})
}

// UpdateAdvancedSettings handles PUT /api/v1/firewall/settings/advanced
func (c *FirewallController) UpdateAdvancedSettings(ctx *gin.Context) {
	var settings model.AdvancedSettings

	if err := ctx.ShouldBindJSON(&settings); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := c.firewallService.UpdateAdvancedSettings(ctx.Request.Context(), &settings); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": settings})
}

// GetNormalizationSettings handles GET /api/v1/firewall/settings/normalization
func (c *FirewallController) GetNormalizationSettings(ctx *gin.Context) {
	settings, err := c.firewallService.GetNormalizationSettings(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": settings})
}

// UpdateNormalizationSettings handles PUT /api/v1/firewall/settings/normalization
func (c *FirewallController) UpdateNormalizationSettings(ctx *gin.Context) {
	var settings model.NormalizationSettings

	if err := ctx.ShouldBindJSON(&settings); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := c.firewallService.UpdateNormalizationSettings(ctx.Request.Context(), &settings); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": settings})
}

// GetSchedules handles GET /api/v1/firewall/settings/schedules
func (c *FirewallController) GetSchedules(ctx *gin.Context) {
	schedules, err := c.firewallService.GetSchedules(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": schedules})
}

// UpdateSchedules handles PUT /api/v1/firewall/settings/schedules
func (c *FirewallController) UpdateSchedules(ctx *gin.Context) {
	var schedules []model.ScheduleSettings

	if err := ctx.ShouldBindJSON(&schedules); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := c.firewallService.UpdateSchedules(ctx.Request.Context(), schedules); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": schedules})
}

// GetGeneralLog handles GET /api/v1/firewall/log/general
func (c *FirewallController) GetGeneralLog(ctx *gin.Context) {
	// Parse pagination parameters
	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(ctx.DefaultQuery("limit", "50"))

	logs, err := c.firewallService.GetGeneralLog(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Apply pagination (simple implementation)
	start := (page - 1) * limit
	end := start + limit
	if start >= len(logs) {
		logs = []model.FirewallLog{}
	} else if end > len(logs) {
		logs = logs[start:]
	} else {
		logs = logs[start:end]
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":  logs,
		"page":  page,
		"limit": limit,
		"total": len(logs),
	})
}

// GetLiveLog handles GET /api/v1/firewall/log/live
func (c *FirewallController) GetLiveLog(ctx *gin.Context) {
	logs, err := c.firewallService.GetLiveLog(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": logs})
}

// GetLogOverview handles GET /api/v1/firewall/log/overview
func (c *FirewallController) GetLogOverview(ctx *gin.Context) {
	overview, err := c.firewallService.GetLogOverview(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": overview})
}

// GetPlainViewLog handles GET /api/v1/firewall/log/plain-view
func (c *FirewallController) GetPlainViewLog(ctx *gin.Context) {
	logs, err := c.firewallService.GetPlainViewLog(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": logs})
}

// Diagnostics handlers

// GetStatistics handles GET /api/v1/firewall/diagnostics/statistics
func (c *FirewallController) GetStatistics(ctx *gin.Context) {
	stats, err := c.firewallService.GetStatistics(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": stats})
}

// GetStates handles GET /api/v1/firewall/diagnostics/states
func (c *FirewallController) GetStates(ctx *gin.Context) {
	states, err := c.firewallService.GetStates(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": states})
}

// GetAliasDiagnostics handles GET /api/v1/firewall/diagnostics/aliases
func (c *FirewallController) GetAliasDiagnostics(ctx *gin.Context) {
	aliases, err := c.firewallService.GetAliasDiagnostics(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": aliases})
}

// GetSessions handles GET /api/v1/firewall/diagnostics/sessions
func (c *FirewallController) GetSessions(ctx *gin.Context) {
	sessions, err := c.firewallService.GetSessions(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": sessions})
}
