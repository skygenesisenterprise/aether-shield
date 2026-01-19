package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/skygenesisenterprise/aether-shield/server/src/model"
	"github.com/skygenesisenterprise/aether-shield/server/src/services"
)

type HomeController struct {
	homeService *services.HomeService
}

func NewHomeController(homeService *services.HomeService) *HomeController {
	return &HomeController{
		homeService: homeService,
	}
}

func (h *HomeController) GetSystemInfo(c *gin.Context) {
	info, err := h.homeService.GetSystemInfo()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, info)
}

func (h *HomeController) GetCpuInfo(c *gin.Context) {
	info, err := h.homeService.GetCpuInfo()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, info)
}

func (h *HomeController) GetMemoryInfo(c *gin.Context) {
	info, err := h.homeService.GetMemoryInfo()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, info)
}

func (h *HomeController) GetDiskInfo(c *gin.Context) {
	info, err := h.homeService.GetDiskInfo()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, info)
}

func (h *HomeController) GetInterfaceStats(c *gin.Context) {
	stats, err := h.homeService.GetInterfaceStats()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, stats)
}

func (h *HomeController) GetFirewallInfo(c *gin.Context) {
	info, err := h.homeService.GetFirewallInfo()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, info)
}

func (h *HomeController) GetServices(c *gin.Context) {
	services, err := h.homeService.GetServices()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, services)
}

func (h *HomeController) GetAnnouncements(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "10")
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		limit = 10
	}

	announcements, err := h.homeService.GetAnnouncements()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if len(announcements) > limit {
		announcements = announcements[:limit]
	}

	c.JSON(http.StatusOK, announcements)
}

func (h *HomeController) GetTrafficData(c *gin.Context) {
	hoursStr := c.DefaultQuery("hours", "24")
	hours, err := strconv.Atoi(hoursStr)
	if err != nil || hours <= 0 || hours > 168 {
		hours = 24
	}

	data, err := h.homeService.GetTrafficData()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	step := len(data) / hours
	if step < 1 {
		step = 1
	}

	var filtered []*model.TrafficData
	for i := 0; i < len(data) && len(filtered) < hours; i += step {
		filtered = append(filtered, data[i])
	}

	c.JSON(http.StatusOK, filtered)
}

func (h *HomeController) GetLicenseInfo(c *gin.Context) {
	info, err := h.homeService.GetLicenseInfo()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, info)
}

func (h *HomeController) ChangePassword(c *gin.Context) {
	var req model.PasswordChangeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := h.homeService.ChangePassword(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if !response.Success {
		c.JSON(http.StatusBadRequest, response)
		return
	}

	c.JSON(http.StatusOK, response)
}
