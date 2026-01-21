package model

import "time"

// Database Management Models

type Table struct {
	Name        string    `json:"name"`
	Schema      string    `json:"schema"`
	Type        string    `json:"type"`
	Owner       string    `json:"owner"`
	Rows        int64     `json:"rows"`
	Size        string    `json:"size"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type Column struct {
	Name      string `json:"name"`
	Type      string `json:"type"`
	Nullable  bool   `json:"nullable"`
	Default   string `json:"default"`
	Length    int    `json:"length"`
	Precision int    `json:"precision"`
	Scale     int    `json:"scale"`
}

type CreateTableRequest struct {
	Name        string            `json:"name" binding:"required"`
	Schema      string            `json:"schema" binding:"required"`
	Columns     []Column          `json:"columns" binding:"required"`
	Description string            `json:"description"`
	Constraints []TableConstraint `json:"constraints"`
	Indexes     []TableIndex      `json:"indexes"`
}

type UpdateTableRequest struct {
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Columns     []Column `json:"columns"`
	NewName     string   `json:"newName"`
}

type TableConstraint struct {
	Name      string   `json:"name"`
	Type      string   `json:"type"`
	Columns   []string `json:"columns"`
	Reference string   `json:"reference"`
	OnDelete  string   `json:"onDelete"`
	OnUpdate  string   `json:"onUpdate"`
}

type TableIndex struct {
	Name    string   `json:"name"`
	Columns []string `json:"columns"`
	Unique  bool     `json:"unique"`
	Type    string   `json:"type"`
}

type Schema struct {
	Name        string    `json:"name"`
	Owner       string    `json:"owner"`
	Tables      int       `json:"tables"`
	Size        string    `json:"size"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type CreateSchemaRequest struct {
	Name        string `json:"name" binding:"required"`
	Owner       string `json:"owner"`
	Description string `json:"description"`
}

// Database Operations Models

type Query struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	SQL         string    `json:"sql"`
	Parameters  []string  `json:"parameters"`
	CreatedBy   string    `json:"createdBy"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type CreateQueryRequest struct {
	Name        string   `json:"name" binding:"required"`
	Description string   `json:"description"`
	SQL         string   `json:"sql" binding:"required"`
	Parameters  []string `json:"parameters"`
}

type QueryResult struct {
	Columns []string        `json:"columns"`
	Rows    [][]interface{} `json:"rows"`
	Total   int             `json:"total"`
}

type ExportRequest struct {
	Format      string   `json:"format" binding:"required"` // sql, csv, json
	Tables      []string `json:"tables"`
	Schemas     []string `json:"schemas"`
	WithData    bool     `json:"withData"`
	Compression bool     `json:"compression"`
}

type ExportResult struct {
	Format    string    `json:"format"`
	Size      int64     `json:"size"`
	FileName  string    `json:"fileName"`
	Checksum  string    `json:"checksum"`
	CreatedAt time.Time `json:"createdAt"`
}

type ImportRequest struct {
	Format     string `json:"format" binding:"required"` // sql, csv, json
	FileName   string `json:"fileName" binding:"required"`
	Data       string `json:"data"`
	Overwrite  bool   `json:"overwrite"`
	Validation bool   `json:"validation"`
}

type ImportResult struct {
	RecordsProcessed int       `json:"recordsProcessed"`
	RecordsInserted  int       `json:"recordsInserted"`
	RecordsUpdated   int       `json:"recordsUpdated"`
	RecordsSkipped   int       `json:"recordsSkipped"`
	Errors           []string  `json:"errors"`
	StartedAt        time.Time `json:"startedAt"`
	CompletedAt      time.Time `json:"completedAt"`
}

type ImportStatus struct {
	Status           string    `json:"status"` // pending, running, completed, failed
	Progress         float64   `json:"progress"`
	RecordsProcessed int       `json:"recordsProcessed"`
	TotalRecords     int       `json:"totalRecords"`
	StartedAt        time.Time `json:"startedAt"`
	EstimatedEnd     time.Time `json:"estimatedEnd"`
}

// Database Backup & Restore Models

type Backup struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Type        string    `json:"type"` // full, incremental, differential
	Size        int64     `json:"size"`
	Format      string    `json:"format"`
	Compression bool      `json:"compression"`
	Status      string    `json:"status"` // pending, running, completed, failed
	CreatedBy   string    `json:"createdBy"`
	CreatedAt   time.Time `json:"createdAt"`
	CompletedAt time.Time `json:"completedAt"`
}

type BackupRequest struct {
	Name        string   `json:"name" binding:"required"`
	Type        string   `json:"type" binding:"required"`
	Tables      []string `json:"tables"`
	Schemas     []string `json:"schemas"`
	Format      string   `json:"format"`
	Compression bool     `json:"compression"`
	Encryption  bool     `json:"encryption"`
}

type RestoreRequest struct {
	BackupID   string `json:"backupId" binding:"required"`
	Overwrite  bool   `json:"overwrite"`
	Validation bool   `json:"validation"`
	DryRun     bool   `json:"dryRun"`
}

type RestoreResult struct {
	BackupID         string    `json:"backupId"`
	TablesRestored   int       `json:"tablesRestored"`
	RecordsRestored  int64     `json:"recordsRestored"`
	ValidationPassed bool      `json:"validationPassed"`
	Errors           []string  `json:"errors"`
	StartedAt        time.Time `json:"startedAt"`
	CompletedAt      time.Time `json:"completedAt"`
}

type RestoreStatus struct {
	Status          string    `json:"status"` // pending, running, completed, failed
	Progress        float64   `json:"progress"`
	TablesRestored  int       `json:"tablesRestored"`
	TotalTables     int       `json:"totalTables"`
	RecordsRestored int64     `json:"recordsRestored"`
	StartedAt       time.Time `json:"startedAt"`
	EstimatedEnd    time.Time `json:"estimatedEnd"`
}

// Database Monitoring Models

type DatabaseStatus struct {
	Status         string    `json:"status"` // online, offline, maintenance
	Version        string    `json:"version"`
	Uptime         int64     `json:"uptime"`
	TotalSize      string    `json:"totalSize"`
	FreeSize       string    `json:"freeSize"`
	UsedSize       string    `json:"usedSize"`
	Connections    int       `json:"connections"`
	MaxConnections int       `json:"maxConnections"`
	LastCheck      time.Time `json:"lastCheck"`
}

type DatabasePerformance struct {
	CPUUsage        float64 `json:"cpuUsage"`
	MemoryUsage     float64 `json:"memoryUsage"`
	DiskUsage       float64 `json:"diskUsage"`
	DiskIOPS        int64   `json:"diskIOPS"`
	DiskThroughput  int64   `json:"diskThroughput"`
	NetworkIO       int64   `json:"networkIO"`
	QueryRate       float64 `json:"queryRate"`
	TransactionRate float64 `json:"transactionRate"`
	LockWaitTime    int64   `json:"lockWaitTime"`
	DeadlockCount   int     `json:"deadlockCount"`
}

type DatabaseConnection struct {
	ID        string    `json:"id"`
	Database  string    `json:"database"`
	User      string    `json:"user"`
	Host      string    `json:"host"`
	State     string    `json:"state"`
	Query     string    `json:"query"`
	Duration  int64     `json:"duration"`
	StartedAt time.Time `json:"startedAt"`
}

type DatabaseStatistics struct {
	TotalQueries          int64   `json:"totalQueries"`
	SelectQueries         int64   `json:"selectQueries"`
	InsertQueries         int64   `json:"insertQueries"`
	UpdateQueries         int64   `json:"updateQueries"`
	DeleteQueries         int64   `json:"deleteQueries"`
	TotalTransactions     int64   `json:"totalTransactions"`
	CommittedTransactions int64   `json:"committedTransactions"`
	RollbackTransactions  int64   `json:"rollbackTransactions"`
	TotalRows             int64   `json:"totalRows"`
	AverageQueryTime      float64 `json:"averageQueryTime"`
	SlowQueryCount        int64   `json:"slowQueryCount"`
}

type DatabaseLog struct {
	ID        string    `json:"id"`
	Level     string    `json:"level"` // DEBUG, INFO, WARNING, ERROR, FATAL
	Message   string    `json:"message"`
	Details   string    `json:"details"`
	Module    string    `json:"module"`
	Timestamp time.Time `json:"timestamp"`
}

type DatabaseLock struct {
	ID        string    `json:"id"`
	Type      string    `json:"type"`
	Mode      string    `json:"mode"`
	Database  string    `json:"database"`
	Table     string    `json:"table"`
	ProcessID int       `json:"processId"`
	Duration  int64     `json:"duration"`
	StartedAt time.Time `json:"startedAt"`
}

type SlowQuery struct {
	ID           string    `json:"id"`
	Query        string    `json:"query"`
	Database     string    `json:"database"`
	User         string    `json:"user"`
	Duration     float64   `json:"duration"`
	RowsExamined int64     `json:"rowsExamined"`
	RowsReturned int64     `json:"rowsReturned"`
	Timestamp    time.Time `json:"timestamp"`
}

// Database Configuration Models

type DatabaseConfig struct {
	MaxConnections     int           `json:"maxConnections"`
	SharedBuffers      string        `json:"sharedBuffers"`
	EffectiveCacheSize string        `json:"effectiveCacheSize"`
	MaintenanceWorkMem string        `json:"maintenanceWorkMem"`
	CheckpointTimeout  time.Duration `json:"checkpointTimeout"`
	WalBuffers         string        `json:"walBuffers"`
	DefaultTablespace  string        `json:"defaultTablespace"`
	LogMinDuration     int           `json:"logMinDuration"`
	LogCheckpoints     bool          `json:"logCheckpoints"`
	LogConnections     bool          `json:"logConnections"`
	LogDisconnections  bool          `json:"logDisconnections"`
	LogLockWaits       bool          `json:"logLockWaits"`
}

// Database Health Models

type DatabaseHealth struct {
	Status    string                 `json:"status"`
	Score     int                    `json:"score"`
	Checks    map[string]HealthCheck `json:"checks"`
	Summary   string                 `json:"summary"`
	LastCheck time.Time              `json:"lastCheck"`
}

type HealthCheck struct {
	Status  string `json:"status"` // PASS, FAIL, WARN
	Message string `json:"message"`
	Value   string `json:"value"`
	Details string `json:"details"`
}
