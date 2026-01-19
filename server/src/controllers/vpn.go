package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/skygenesisenterprise/aether-shield/server/src/model"
	"github.com/skygenesisenterprise/aether-shield/server/src/services"
)

type VPNController struct {
	vpnService *services.VPNService
}

func NewVPNController(vpnService *services.VPNService) *VPNController {
	return &VPNController{
		vpnService: vpnService,
	}
}

// OpenVPN Instances
func (c *VPNController) GetOpenVPNInstances(ctx *gin.Context) {
	instances, err := c.vpnService.GetOpenVPNInstances()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, instances)
}

func (c *VPNController) CreateOpenVPNInstance(ctx *gin.Context) {
	var req model.OpenVPNInstance
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	instance, err := c.vpnService.CreateOpenVPNInstance(&req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, instance)
}

func (c *VPNController) UpdateOpenVPNInstance(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var req model.OpenVPNInstance
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	instance, err := c.vpnService.UpdateOpenVPNInstance(id, &req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, instance)
}

func (c *VPNController) DeleteOpenVPNInstance(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := c.vpnService.DeleteOpenVPNInstance(id); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "OpenVPN instance deleted successfully"})
}

func (c *VPNController) GetOpenVPNStatus(ctx *gin.Context) {
	status, err := c.vpnService.GetOpenVPNStatus()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, status)
}

func (c *VPNController) GetOpenVPNLog(ctx *gin.Context) {
	log, err := c.vpnService.GetOpenVPNLog()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, log)
}

func (c *VPNController) GetOpenVPNExport(ctx *gin.Context) {
	export, err := c.vpnService.GetOpenVPNExport()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, export)
}

func (c *VPNController) GetOpenVPNClientOverwrites(ctx *gin.Context) {
	overwrites, err := c.vpnService.GetOpenVPNClientOverwrites()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, overwrites)
}

// WireGuard Instances
func (c *VPNController) GetWireGuardInstances(ctx *gin.Context) {
	instances, err := c.vpnService.GetWireGuardInstances()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, instances)
}

func (c *VPNController) CreateWireGuardInstance(ctx *gin.Context) {
	var req model.WireGuardInstance
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	instance, err := c.vpnService.CreateWireGuardInstance(&req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, instance)
}

func (c *VPNController) UpdateWireGuardInstance(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var req model.WireGuardInstance
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	instance, err := c.vpnService.UpdateWireGuardInstance(id, &req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, instance)
}

func (c *VPNController) DeleteWireGuardInstance(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := c.vpnService.DeleteWireGuardInstance(id); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "WireGuard instance deleted successfully"})
}

func (c *VPNController) GetWireGuardStatus(ctx *gin.Context) {
	status, err := c.vpnService.GetWireGuardStatus()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, status)
}

func (c *VPNController) GetWireGuardLog(ctx *gin.Context) {
	log, err := c.vpnService.GetWireGuardLog()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, log)
}

// WireGuard Peers
func (c *VPNController) GetWireGuardPeers(ctx *gin.Context) {
	peers, err := c.vpnService.GetWireGuardPeers()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, peers)
}

func (c *VPNController) CreateWireGuardPeer(ctx *gin.Context) {
	var req model.WireGuardPeer
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	peer, err := c.vpnService.CreateWireGuardPeer(&req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, peer)
}

func (c *VPNController) UpdateWireGuardPeer(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var req model.WireGuardPeer
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	peer, err := c.vpnService.UpdateWireGuardPeer(id, &req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, peer)
}

func (c *VPNController) DeleteWireGuardPeer(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := c.vpnService.DeleteWireGuardPeer(id); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "WireGuard peer deleted successfully"})
}

func (c *VPNController) GetWireGuardPeerGenerator(ctx *gin.Context) {
	generator, err := c.vpnService.GetWireGuardPeerGenerator()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, generator)
}

// IPsec
func (c *VPNController) GetIPSecConnections(ctx *gin.Context) {
	connections, err := c.vpnService.GetIPSecConnections()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, connections)
}

func (c *VPNController) GetIPSecSessions(ctx *gin.Context) {
	sessions, err := c.vpnService.GetIPSecSessions()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, sessions)
}

func (c *VPNController) GetIPSecSettings(ctx *gin.Context) {
	settings, err := c.vpnService.GetIPSecSettings()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, settings)
}

func (c *VPNController) UpdateIPSecSettings(ctx *gin.Context) {
	var req model.IPSecSettings
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	settings, err := c.vpnService.UpdateIPSecSettings(&req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, settings)
}

func (c *VPNController) GetIPSecPreSharedKeys(ctx *gin.Context) {
	keys, err := c.vpnService.GetIPSecPreSharedKeys()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, keys)
}

func (c *VPNController) GetIPSecKeyPairs(ctx *gin.Context) {
	keyPairs, err := c.vpnService.GetIPSecKeyPairs()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, keyPairs)
}

func (c *VPNController) GetIPSecSAD(ctx *gin.Context) {
	sad, err := c.vpnService.GetIPSecSAD()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, sad)
}

func (c *VPNController) GetIPSecSPD(ctx *gin.Context) {
	spd, err := c.vpnService.GetIPSecSPD()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, spd)
}

func (c *VPNController) GetIPSecVTI(ctx *gin.Context) {
	vti, err := c.vpnService.GetIPSecVTI()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, vti)
}

func (c *VPNController) GetIPSecLeases(ctx *gin.Context) {
	leases, err := c.vpnService.GetIPSecLeases()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, leases)
}

func (c *VPNController) GetIPSecLog(ctx *gin.Context) {
	log, err := c.vpnService.GetIPSecLog()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, log)
}
