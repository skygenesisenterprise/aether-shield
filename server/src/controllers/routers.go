package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/skygenesisenterprise/aether-shield/server/src/services"
	"net/http"
)

// RouterController handles all router-related operations
type RouterController struct {
	routerService *services.RouterService
}

// NewRouterController creates a new RouterController instance
func NewRouterController(routerService *services.RouterService) *RouterController {
	return &RouterController{
		routerService: routerService,
	}
}

// GetRouters retrieves all routers
func (c *RouterController) GetRouters(ctx *gin.Context) {
	routers, err := c.routerService.GetRouters()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, routers)
}

// GetRouter retrieves a specific router by ID
func (c *RouterController) GetRouter(ctx *gin.Context) {
	id := ctx.Param("id")
	router, err := c.routerService.GetRouter(id)
	if err != nil {
		if err == services.ErrRouterNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{
				"error": "Router not found",
			})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, router)
}

// CreateRouter creates a new router
func (c *RouterController) CreateRouter(ctx *gin.Context) {
	var router services.Router
	if err := ctx.ShouldBindJSON(&router); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request body",
		})
		return
	}

	createdRouter, err := c.routerService.CreateRouter(&router)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusCreated, createdRouter)
}

// UpdateRouter updates an existing router
func (c *RouterController) UpdateRouter(ctx *gin.Context) {
	id := ctx.Param("id")
	var router services.Router
	if err := ctx.ShouldBindJSON(&router); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request body",
		})
		return
	}

	updatedRouter, err := c.routerService.UpdateRouter(id, &router)
	if err != nil {
		if err == services.ErrRouterNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{
				"error": "Router not found",
			})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, updatedRouter)
}

// DeleteRouter deletes a router
func (c *RouterController) DeleteRouter(ctx *gin.Context) {
	id := ctx.Param("id")
	err := c.routerService.DeleteRouter(id)
	if err != nil {
		if err == services.ErrRouterNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{
				"error": "Router not found",
			})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusNoContent, nil)
}

// GetRouterStatus retrieves the status of a router
func (c *RouterController) GetRouterStatus(ctx *gin.Context) {
	id := ctx.Param("id")
	status, err := c.routerService.GetRouterStatus(id)
	if err != nil {
		if err == services.ErrRouterNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{
				"error": "Router not found",
			})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, status)
}

// GetRouterConfig retrieves the configuration of a router
func (c *RouterController) GetRouterConfig(ctx *gin.Context) {
	id := ctx.Param("id")
	config, err := c.routerService.GetRouterConfig(id)
	if err != nil {
		if err == services.ErrRouterNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{
				"error": "Router not found",
			})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, config)
}

// UpdateRouterConfig updates the configuration of a router
func (c *RouterController) UpdateRouterConfig(ctx *gin.Context) {
	id := ctx.Param("id")
	var config services.RouterConfig
	if err := ctx.ShouldBindJSON(&config); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request body",
		})
		return
	}

	updatedConfig, err := c.routerService.UpdateRouterConfig(id, &config)
	if err != nil {
		if err == services.ErrRouterNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{
				"error": "Router not found",
			})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, updatedConfig)
}

// GetRouterLog retrieves the log of a router
func (c *RouterController) GetRouterLog(ctx *gin.Context) {
	id := ctx.Param("id")
	log, err := c.routerService.GetRouterLog(id)
	if err != nil {
		if err == services.ErrRouterNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{
				"error": "Router not found",
			})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, log)
}

// GetRouterInterfaces retrieves the interfaces of a router
func (c *RouterController) GetRouterInterfaces(ctx *gin.Context) {
	id := ctx.Param("id")
	interfaces, err := c.routerService.GetRouterInterfaces(id)
	if err != nil {
		if err == services.ErrRouterNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{
				"error": "Router not found",
			})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, interfaces)
}

// GetRouterRoutes retrieves the routes of a router
func (c *RouterController) GetRouterRoutes(ctx *gin.Context) {
	id := ctx.Param("id")
	routes, err := c.routerService.GetRouterRoutes(id)
	if err != nil {
		if err == services.ErrRouterNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{
				"error": "Router not found",
			})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, routes)
}

// GetRouterServices retrieves the services of a router
func (c *RouterController) GetRouterServices(ctx *gin.Context) {
	id := ctx.Param("id")
	routerServices, err := c.routerService.GetRouterServices(id)
	if err != nil {
		if err == services.ErrRouterNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{
				"error": "Router not found",
			})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, routerServices)
}

// GetRouterFirewall retrieves the firewall configuration of a router
func (c *RouterController) GetRouterFirewall(ctx *gin.Context) {
	id := ctx.Param("id")
	firewall, err := c.routerService.GetRouterFirewall(id)
	if err != nil {
		if err == services.ErrRouterNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{
				"error": "Router not found",
			})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, firewall)
}

// GetRouterVPN retrieves the VPN configuration of a router
func (c *RouterController) GetRouterVPN(ctx *gin.Context) {
	id := ctx.Param("id")
	vpn, err := c.routerService.GetRouterVPN(id)
	if err != nil {
		if err == services.ErrRouterNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{
				"error": "Router not found",
			})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, vpn)
}

// GetRouterStatistics retrieves the statistics of a router
func (c *RouterController) GetRouterStatistics(ctx *gin.Context) {
	id := ctx.Param("id")
	stats, err := c.routerService.GetRouterStatistics(id)
	if err != nil {
		if err == services.ErrRouterNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{
				"error": "Router not found",
			})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, stats)
}

// ExecuteRouterCommand executes a command on a router
func (c *RouterController) ExecuteRouterCommand(ctx *gin.Context) {
	id := ctx.Param("id")
	var command services.RouterCommand
	if err := ctx.ShouldBindJSON(&command); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request body",
		})
		return
	}

	result, err := c.routerService.ExecuteRouterCommand(id, &command)
	if err != nil {
		if err == services.ErrRouterNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{
				"error": "Router not found",
			})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, result)
}

// GetRouterDiagnostics retrieves diagnostics information from a router
func (c *RouterController) GetRouterDiagnostics(ctx *gin.Context) {
	id := ctx.Param("id")
	diagnostics, err := c.routerService.GetRouterDiagnostics(id)
	if err != nil {
		if err == services.ErrRouterNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{
				"error": "Router not found",
			})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, diagnostics)
}

// GetRouterBackup retrieves a backup of a router
func (c *RouterController) GetRouterBackup(ctx *gin.Context) {
	id := ctx.Param("id")
	backup, err := c.routerService.GetRouterBackup(id)
	if err != nil {
		if err == services.ErrRouterNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{
				"error": "Router not found",
			})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, backup)
}

// CreateRouterBackup creates a backup of a router
func (c *RouterController) CreateRouterBackup(ctx *gin.Context) {
	id := ctx.Param("id")
	backup, err := c.routerService.CreateRouterBackup(id)
	if err != nil {
		if err == services.ErrRouterNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{
				"error": "Router not found",
			})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusCreated, backup)
}

// RestoreRouterBackup restores a router from backup
func (c *RouterController) RestoreRouterBackup(ctx *gin.Context) {
	id := ctx.Param("id")
	var backup services.RouterBackup
	if err := ctx.ShouldBindJSON(&backup); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request body",
		})
		return
	}

	err := c.routerService.RestoreRouterBackup(id, &backup)
	if err != nil {
		if err == services.ErrRouterNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{
				"error": "Router not found",
			})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": "Router restored successfully",
	})
}
