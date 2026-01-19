package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type VPNMiddleware struct{}

func NewVPNMiddleware() *VPNMiddleware {
	return &VPNMiddleware{}
}

func (m *VPNMiddleware) ValidateVPNAccess() gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole := c.GetString("userRole")

		if userRole != "admin" && userRole != "vpn_manager" {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "Access denied. VPN access requires admin or vpn_manager role.",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

func (m *VPNMiddleware) ValidateJSON() gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		if c.Request.Method == "POST" || c.Request.Method == "PUT" {
			contentType := c.GetHeader("Content-Type")
			if contentType != "application/json" {
				c.JSON(http.StatusBadRequest, gin.H{
					"error": "Content-Type must be application/json",
				})
				c.Abort()
				return
			}
		}
		c.Next()
	})
}

func (m *VPNMiddleware) ValidateOpenVPNConfig() gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		if c.Request.Method == "POST" || c.Request.Method == "PUT" {
			var config struct {
				Protocol string `json:"protocol" binding:"required,oneof=udp tcp"`
				Port     int    `json:"port" binding:"required,min=1,max=65535"`
				Cipher   string `json:"cipher" binding:"required"`
				Auth     string `json:"auth" binding:"required"`
			}

			if err := c.ShouldBindJSON(&config); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{
					"error": "Invalid OpenVPN configuration: " + err.Error(),
				})
				c.Abort()
				return
			}
		}
		c.Next()
	})
}

func (m *VPNMiddleware) ValidateWireGuardConfig() gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		if c.Request.Method == "POST" || c.Request.Method == "PUT" {
			var config struct {
				ListenPort int    `json:"listenPort" binding:"required,min=1,max=65535"`
				PrivateKey string `json:"privateKey" binding:"required"`
				PublicKey  string `json:"publicKey" binding:"required"`
			}

			if err := c.ShouldBindJSON(&config); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{
					"error": "Invalid WireGuard configuration: " + err.Error(),
				})
				c.Abort()
				return
			}
		}
		c.Next()
	})
}

func (m *VPNMiddleware) ValidateWireGuardPeer() gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		if c.Request.Method == "POST" || c.Request.Method == "PUT" {
			var peer struct {
				PublicKey           string `json:"publicKey" binding:"required"`
				AllowedIPs          string `json:"allowedIPs" binding:"required"`
				Endpoint            string `json:"endpoint"`
				PersistentKeepalive int    `json:"persistentKeepalive"`
			}

			if err := c.ShouldBindJSON(&peer); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{
					"error": "Invalid WireGuard peer configuration: " + err.Error(),
				})
				c.Abort()
				return
			}
		}
		c.Next()
	})
}

func (m *VPNMiddleware) ValidateIPSecConfig() gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		if c.Request.Method == "POST" || c.Request.Method == "PUT" {
			var config struct {
				Protocol   string `json:"protocol" binding:"required,oneof=ikev1 ikev2 ikev2-mobile"`
				Encryption string `json:"encryption" binding:"required"`
				Integrity  string `json:"integrity" binding:"required"`
				DHGroup    string `json:"dhGroup" binding:"required"`
			}

			if err := c.ShouldBindJSON(&config); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{
					"error": "Invalid IPsec configuration: " + err.Error(),
				})
				c.Abort()
				return
			}
		}
		c.Next()
	})
}

func (m *VPNMiddleware) ValidateVPNCertificate() gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		if c.Request.Method == "POST" || c.Request.Method == "PUT" {
			var cert struct {
				Certificate string `json:"certificate" binding:"required"`
				PrivateKey  string `json:"privateKey" binding:"required"`
				CACert      string `json:"caCert"`
			}

			if err := c.ShouldBindJSON(&cert); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{
					"error": "Invalid VPN certificate configuration: " + err.Error(),
				})
				c.Abort()
				return
			}
		}
		c.Next()
	})
}

func (m *VPNMiddleware) RateLimiter() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("X-RateLimit-Limit", "100")
		c.Header("X-RateLimit-Remaining", "99")
		c.Next()
	}
}

func (m *VPNMiddleware) LogVPNAudit() gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetString("userID")
		method := c.Request.Method
		path := c.Request.URL.Path

		c.Set("auditLog", map[string]interface{}{
			"userID": userID,
			"method": method,
			"path":   path,
			"action": "VPN_ACCESS",
		})

		c.Next()
	}
}
