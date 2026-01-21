package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/skygenesisenterprise/aether-shield/server/src/model"
	"github.com/skygenesisenterprise/aether-shield/server/src/services"
)

type DatabaseController struct {
	databaseService *services.DatabaseService
}

func NewDatabaseController(databaseService *services.DatabaseService) *DatabaseController {
	return &DatabaseController{
		databaseService: databaseService,
	}
}

// Database Management endpoints

func (dc *DatabaseController) GetTables(c *gin.Context) {
	tables, err := dc.databaseService.GetTables()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, tables)
}

func (dc *DatabaseController) CreateTable(c *gin.Context) {
	var req model.CreateTableRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	table, err := dc.databaseService.CreateTable(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, table)
}

func (dc *DatabaseController) GetTable(c *gin.Context) {
	name := c.Param("name")
	table, err := dc.databaseService.GetTable(name)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, table)
}

func (dc *DatabaseController) UpdateTable(c *gin.Context) {
	name := c.Param("name")
	var req model.UpdateTableRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	table, err := dc.databaseService.UpdateTable(name, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, table)
}

func (dc *DatabaseController) DeleteTable(c *gin.Context) {
	name := c.Param("name")
	err := dc.databaseService.DeleteTable(name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusNoContent, nil)
}

func (dc *DatabaseController) GetSchemas(c *gin.Context) {
	schemas, err := dc.databaseService.GetSchemas()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, schemas)
}

func (dc *DatabaseController) CreateSchema(c *gin.Context) {
	var req model.CreateSchemaRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	schema, err := dc.databaseService.CreateSchema(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, schema)
}

func (dc *DatabaseController) GetSchema(c *gin.Context) {
	name := c.Param("name")
	schema, err := dc.databaseService.GetSchema(name)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, schema)
}

func (dc *DatabaseController) DeleteSchema(c *gin.Context) {
	name := c.Param("name")
	err := dc.databaseService.DeleteSchema(name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusNoContent, nil)
}

// Database Operations endpoints

func (dc *DatabaseController) GetQueries(c *gin.Context) {
	queries, err := dc.databaseService.GetQueries()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, queries)
}

func (dc *DatabaseController) CreateQuery(c *gin.Context) {
	var req model.CreateQueryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	query, err := dc.databaseService.CreateQuery(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, query)
}

func (dc *DatabaseController) GetQuery(c *gin.Context) {
	id := c.Param("id")
	query, err := dc.databaseService.GetQuery(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, query)
}

func (dc *DatabaseController) DeleteQuery(c *gin.Context) {
	id := c.Param("id")
	err := dc.databaseService.DeleteQuery(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusNoContent, nil)
}

func (dc *DatabaseController) ExportDatabase(c *gin.Context) {
	var req model.ExportRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	data, err := dc.databaseService.ExportDatabase(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, data)
}

func (dc *DatabaseController) GetImportStatus(c *gin.Context) {
	status, err := dc.databaseService.GetImportStatus()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, status)
}

func (dc *DatabaseController) ImportDatabase(c *gin.Context) {
	var req model.ImportRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := dc.databaseService.ImportDatabase(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (dc *DatabaseController) GetBackupList(c *gin.Context) {
	backups, err := dc.databaseService.GetBackupList()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, backups)
}

func (dc *DatabaseController) CreateBackup(c *gin.Context) {
	var req model.BackupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	backup, err := dc.databaseService.CreateBackup(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, backup)
}

func (dc *DatabaseController) GetRestoreStatus(c *gin.Context) {
	status, err := dc.databaseService.GetRestoreStatus()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, status)
}

func (dc *DatabaseController) RestoreDatabase(c *gin.Context) {
	var req model.RestoreRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := dc.databaseService.RestoreDatabase(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

// Database Monitoring endpoints

func (dc *DatabaseController) GetStatus(c *gin.Context) {
	status, err := dc.databaseService.GetStatus()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, status)
}

func (dc *DatabaseController) GetPerformance(c *gin.Context) {
	performance, err := dc.databaseService.GetPerformance()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, performance)
}

func (dc *DatabaseController) GetConnections(c *gin.Context) {
	connections, err := dc.databaseService.GetConnections()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, connections)
}

func (dc *DatabaseController) GetStatistics(c *gin.Context) {
	statistics, err := dc.databaseService.GetStatistics()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, statistics)
}

func (dc *DatabaseController) GetLogs(c *gin.Context) {
	limit := 100
	if limitStr := c.Query("limit"); limitStr != "" {
		if parsedLimit, err := strconv.Atoi(limitStr); err == nil && parsedLimit > 0 {
			limit = parsedLimit
		}
	}

	logs, err := dc.databaseService.GetLogs(limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, logs)
}

func (dc *DatabaseController) GetLocks(c *gin.Context) {
	locks, err := dc.databaseService.GetLocks()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, locks)
}

func (dc *DatabaseController) GetSlowQueries(c *gin.Context) {
	limit := 50
	if limitStr := c.Query("limit"); limitStr != "" {
		if parsedLimit, err := strconv.Atoi(limitStr); err == nil && parsedLimit > 0 {
			limit = parsedLimit
		}
	}

	queries, err := dc.databaseService.GetSlowQueries(limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, queries)
}
