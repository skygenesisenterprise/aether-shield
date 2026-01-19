package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/skygenesisenterprise/aether-shield/server/src/model"
	"github.com/skygenesisenterprise/aether-shield/server/src/services"
)

type InterfaceController struct {
	interfaceService *services.InterfaceService
}

func NewInterfaceController(interfaceService *services.InterfaceService) *InterfaceController {
	return &InterfaceController{
		interfaceService: interfaceService,
	}
}

func (c *InterfaceController) GetAssignments(ctx *gin.Context) {
	assignments, err := c.interfaceService.GetAssignments()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, assignments)
}

func (c *InterfaceController) UpdateAssignments(ctx *gin.Context) {
	var assignments []model.InterfaceAssignment
	if err := ctx.ShouldBindJSON(&assignments); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := c.interfaceService.UpdateAssignments(assignments); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Assignments updated successfully"})
}

func (c *InterfaceController) GetDevices(ctx *gin.Context) {
	devices, err := c.interfaceService.GetDevices()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, devices)
}

func (c *InterfaceController) GetGifDevices(ctx *gin.Context) {
	devices, err := c.interfaceService.GetGifDevices()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, devices)
}

func (c *InterfaceController) GetGreDevices(ctx *gin.Context) {
	devices, err := c.interfaceService.GetGreDevices()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, devices)
}

func (c *InterfaceController) GetLaggDevices(ctx *gin.Context) {
	devices, err := c.interfaceService.GetLaggDevices()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, devices)
}

func (c *InterfaceController) GetVlanDevices(ctx *gin.Context) {
	devices, err := c.interfaceService.GetVlanDevices()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, devices)
}

func (c *InterfaceController) GetVxlanDevices(ctx *gin.Context) {
	devices, err := c.interfaceService.GetVxlanDevices()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, devices)
}

func (c *InterfaceController) GetLoopbackDevices(ctx *gin.Context) {
	devices, err := c.interfaceService.GetLoopbackDevices()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, devices)
}

func (c *InterfaceController) GetPointToPointDevices(ctx *gin.Context) {
	devices, err := c.interfaceService.GetPointToPointDevices()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, devices)
}

func (c *InterfaceController) GetBridgeDevices(ctx *gin.Context) {
	devices, err := c.interfaceService.GetBridgeDevices()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, devices)
}

func (c *InterfaceController) GetPing(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"message": "Ping endpoint ready"})
}

func (c *InterfaceController) ExecutePing(ctx *gin.Context) {
	var request model.PingRequest
	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := c.interfaceService.ExecutePing(request)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, response)
}

func (c *InterfaceController) GetTraceroute(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"message": "Traceroute endpoint ready"})
}

func (c *InterfaceController) ExecuteTraceroute(ctx *gin.Context) {
	var request model.TracerouteRequest
	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := c.interfaceService.ExecuteTraceroute(request)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, response)
}

func (c *InterfaceController) GetNetstat(ctx *gin.Context) {
	netstat, err := c.interfaceService.GetNetstat()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, netstat)
}

func (c *InterfaceController) GetDNSLookup(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"message": "DNS lookup endpoint ready"})
}

func (c *InterfaceController) ExecuteDNSLookup(ctx *gin.Context) {
	var request model.DNSLookupRequest
	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := c.interfaceService.ExecuteDNSLookup(request)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, response)
}

func (c *InterfaceController) GetPacketCapture(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"message": "Packet capture endpoint ready"})
}

func (c *InterfaceController) ExecutePacketCapture(ctx *gin.Context) {
	var request model.PacketCaptureRequest
	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := c.interfaceService.ExecutePacketCapture(request)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, response)
}

func (c *InterfaceController) GetArpTables(ctx *gin.Context) {
	arpTables, err := c.interfaceService.GetArpTables()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, arpTables)
}

func (c *InterfaceController) GetPortprobe(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"message": "Port probe endpoint ready"})
}

func (c *InterfaceController) ExecutePortprobe(ctx *gin.Context) {
	var request model.PortprobeRequest
	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := c.interfaceService.ExecutePortprobe(request)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, response)
}

func (c *InterfaceController) GetNeighbors(ctx *gin.Context) {
	neighbors, err := c.interfaceService.GetNeighbors()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, neighbors)
}

func (c *InterfaceController) GetOverview(ctx *gin.Context) {
	overview, err := c.interfaceService.GetOverview()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, overview)
}

func (c *InterfaceController) GetSettings(ctx *gin.Context) {
	settings, err := c.interfaceService.GetSettings()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, settings)
}

func (c *InterfaceController) UpdateSettings(ctx *gin.Context) {
	var settings model.InterfaceSettings
	if err := ctx.ShouldBindJSON(&settings); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := c.interfaceService.UpdateSettings(settings); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Settings updated successfully"})
}

func (c *InterfaceController) GetVirtualIPStatus(ctx *gin.Context) {
	status, err := c.interfaceService.GetVirtualIPStatus()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, status)
}

func (c *InterfaceController) GetVirtualIPSettings(ctx *gin.Context) {
	settings, err := c.interfaceService.GetVirtualIPSettings()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, settings)
}

func (c *InterfaceController) UpdateVirtualIPSettings(ctx *gin.Context) {
	var settings model.VirtualIP
	if err := ctx.ShouldBindJSON(&settings); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := c.interfaceService.UpdateVirtualIPSettings(settings); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Virtual IP settings updated successfully"})
}

func (c *InterfaceController) GetWan(ctx *gin.Context) {
	wan, err := c.interfaceService.GetWan()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, wan)
}

func (c *InterfaceController) UpdateWan(ctx *gin.Context) {
	var wanConfig model.Interface
	if err := ctx.ShouldBindJSON(&wanConfig); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := c.interfaceService.UpdateWan(wanConfig); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "WAN configuration updated successfully"})
}

func (c *InterfaceController) GetWirelessDevices(ctx *gin.Context) {
	devices, err := c.interfaceService.GetWirelessDevices()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, devices)
}
