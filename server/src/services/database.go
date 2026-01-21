package services

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	"github.com/skygenesisenterprise/aether-shield/server/src/model"
)

type DatabaseService struct {
	db *sql.DB
}

func NewDatabaseService(db *sql.DB) *DatabaseService {
	return &DatabaseService{
		db: db,
	}
}

// Database Management Services

func (ds *DatabaseService) GetTables() ([]model.Table, error) {
	query := `
		SELECT 
			t.table_name,
			t.table_schema,
			t.table_type,
			t.table_catalog,
			COALESCE(s.n_tup_ins + s.n_tup_upd + s.n_tup_del, 0) as row_count,
			pg_size_pretty(pg_total_relation_size(c.oid)) as size,
			obj_description(c.oid, 'pg_class') as description,
			t.table_catalog as created_at,
			t.table_catalog as updated_at
		FROM information_schema.tables t
		LEFT JOIN pg_class c ON c.relname = t.table_name
		LEFT JOIN pg_stat_user_tables s ON s.relname = t.table_name
		WHERE t.table_schema NOT IN ('information_schema', 'pg_catalog')
		ORDER BY t.table_schema, t.table_name
	`

	rows, err := ds.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query tables: %w", err)
	}
	defer rows.Close()

	var tables []model.Table
	for rows.Next() {
		var table model.Table
		var createdAt, updatedAt sql.NullString

		err := rows.Scan(
			&table.Name,
			&table.Schema,
			&table.Type,
			&table.Owner,
			&table.Rows,
			&table.Size,
			&table.Description,
			&createdAt,
			&updatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan table row: %w", err)
		}

		if createdAt.Valid {
			table.CreatedAt, _ = time.Parse(time.RFC3339, createdAt.String)
		}
		if updatedAt.Valid {
			table.UpdatedAt, _ = time.Parse(time.RFC3339, updatedAt.String)
		}

		tables = append(tables, table)
	}

	return tables, nil
}

func (ds *DatabaseService) CreateTable(req model.CreateTableRequest) (*model.Table, error) {
	tx, err := ds.db.Begin()
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback()

	// Build CREATE TABLE statement
	createSQL := fmt.Sprintf("CREATE TABLE %s.%s (", req.Schema, req.Name)

	for i, col := range req.Columns {
		if i > 0 {
			createSQL += ", "
		}

		colDef := fmt.Sprintf("%s %s", col.Name, col.Type)
		if !col.Nullable {
			colDef += " NOT NULL"
		}
		if col.Default != "" {
			colDef += fmt.Sprintf(" DEFAULT %s", col.Default)
		}
		if col.Length > 0 {
			colDef += fmt.Sprintf("(%d)", col.Length)
		}
		if col.Precision > 0 && col.Scale > 0 {
			colDef += fmt.Sprintf("(%d,%d)", col.Precision, col.Scale)
		}

		createSQL += colDef
	}

	createSQL += ")"

	// Execute CREATE TABLE
	_, err = tx.Exec(createSQL)
	if err != nil {
		return nil, fmt.Errorf("failed to create table: %w", err)
	}

	// Add constraints if any
	for _, constraint := range req.Constraints {
		constraintSQL := fmt.Sprintf("ALTER TABLE %s.%s ADD CONSTRAINT %s %s",
			req.Schema, req.Name, constraint.Name, constraint.Type)

		if len(constraint.Columns) > 0 {
			constraintSQL += fmt.Sprintf(" (%s)", fmt.Sprintf("%s", fmt.Sprint(constraint.Columns)))
		}

		_, err = tx.Exec(constraintSQL)
		if err != nil {
			return nil, fmt.Errorf("failed to add constraint %s: %w", constraint.Name, err)
		}
	}

	// Add indexes if any
	for _, index := range req.Indexes {
		indexType := "INDEX"
		if index.Unique {
			indexType = "UNIQUE INDEX"
		}

		indexSQL := fmt.Sprintf("CREATE %s %s ON %s.%s (%s)",
			indexType, index.Name, req.Schema, req.Name,
			fmt.Sprintf("%s", fmt.Sprint(index.Columns)))

		_, err = tx.Exec(indexSQL)
		if err != nil {
			return nil, fmt.Errorf("failed to create index %s: %w", index.Name, err)
		}
	}

	// Add comment if description provided
	if req.Description != "" {
		commentSQL := fmt.Sprintf("COMMENT ON TABLE %s.%s IS '%s'",
			req.Schema, req.Name, req.Description)
		_, err = tx.Exec(commentSQL)
		if err != nil {
			log.Printf("Warning: failed to add table comment: %v", err)
		}
	}

	err = tx.Commit()
	if err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}

	// Return the created table
	table := &model.Table{
		Name:        req.Name,
		Schema:      req.Schema,
		Type:        "BASE TABLE",
		Description: req.Description,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	return table, nil
}

func (ds *DatabaseService) GetTable(name string) (*model.Table, error) {
	query := `
		SELECT 
			t.table_name,
			t.table_schema,
			t.table_type,
			t.table_catalog,
			COALESCE(s.n_tup_ins + s.n_tup_upd + s.n_tup_del, 0) as row_count,
			pg_size_pretty(pg_total_relation_size(c.oid)) as size,
			obj_description(c.oid, 'pg_class') as description
		FROM information_schema.tables t
		LEFT JOIN pg_class c ON c.relname = t.table_name
		LEFT JOIN pg_stat_user_tables s ON s.relname = t.table_name
		WHERE t.table_name = $1 AND t.table_schema NOT IN ('information_schema', 'pg_catalog')
	`

	var table model.Table
	err := ds.db.QueryRow(query, name).Scan(
		&table.Name,
		&table.Schema,
		&table.Type,
		&table.Owner,
		&table.Rows,
		&table.Size,
		&table.Description,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("table %s not found", name)
		}
		return nil, fmt.Errorf("failed to query table: %w", err)
	}

	return &table, nil
}

func (ds *DatabaseService) UpdateTable(name string, req model.UpdateTableRequest) (*model.Table, error) {
	tx, err := ds.db.Begin()
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback()

	// Update table name if provided
	if req.NewName != "" && req.NewName != name {
		// Get current schema first
		var schema string
		err := tx.QueryRow("SELECT table_schema FROM information_schema.tables WHERE table_name = $1", name).Scan(&schema)
		if err != nil {
			return nil, fmt.Errorf("failed to get table schema: %w", err)
		}

		_, err = tx.Exec(fmt.Sprintf("ALTER TABLE %s.%s RENAME TO %s", schema, name, req.NewName))
		if err != nil {
			return nil, fmt.Errorf("failed to rename table: %w", err)
		}
		name = req.NewName
	}

	// Update comment if description provided
	if req.Description != "" {
		var schema string
		err := tx.QueryRow("SELECT table_schema FROM information_schema.tables WHERE table_name = $1", name).Scan(&schema)
		if err != nil {
			return nil, fmt.Errorf("failed to get table schema: %w", err)
		}

		commentSQL := fmt.Sprintf("COMMENT ON TABLE %s.%s IS '%s'", schema, name, req.Description)
		_, err = tx.Exec(commentSQL)
		if err != nil {
			return nil, fmt.Errorf("failed to update table comment: %w", err)
		}
	}

	err = tx.Commit()
	if err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}

	return ds.GetTable(name)
}

func (ds *DatabaseService) DeleteTable(name string) error {
	// Get schema first
	var schema string
	err := ds.db.QueryRow("SELECT table_schema FROM information_schema.tables WHERE table_name = $1", name).Scan(&schema)
	if err != nil {
		return fmt.Errorf("failed to get table schema: %w", err)
	}

	_, err = ds.db.Exec(fmt.Sprintf("DROP TABLE %s.%s CASCADE", schema, name))
	if err != nil {
		return fmt.Errorf("failed to drop table: %w", err)
	}

	return nil
}

func (ds *DatabaseService) GetSchemas() ([]model.Schema, error) {
	query := `
		SELECT 
			s.schema_name,
			s.owner,
			COUNT(t.table_name) as table_count,
			pg_size_pretty(SUM(pg_total_relation_size(c.oid))) as size,
			obj_description(s.oid, 'pg_namespace') as description
		FROM information_schema.schemata s
		LEFT JOIN information_schema.tables t ON t.table_schema = s.schema_name
		LEFT JOIN pg_class c ON c.relname = t.table_name AND c.relnamespace = s.oid
		LEFT JOIN pg_namespace s_oid ON s_oid.nspname = s.schema_name
		WHERE s.schema_name NOT IN ('information_schema', 'pg_catalog')
		GROUP BY s.schema_name, s.owner, s.oid.oid
		ORDER BY s.schema_name
	`

	rows, err := ds.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query schemas: %w", err)
	}
	defer rows.Close()

	var schemas []model.Schema
	for rows.Next() {
		var schema model.Schema
		var size sql.NullString

		err := rows.Scan(
			&schema.Name,
			&schema.Owner,
			&schema.Tables,
			&size,
			&schema.Description,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan schema row: %w", err)
		}

		if size.Valid {
			schema.Size = size.String
		} else {
			schema.Size = "0 MB"
		}

		schema.CreatedAt = time.Now()
		schema.UpdatedAt = time.Now()

		schemas = append(schemas, schema)
	}

	return schemas, nil
}

func (ds *DatabaseService) CreateSchema(req model.CreateSchemaRequest) (*model.Schema, error) {
	createSQL := fmt.Sprintf("CREATE SCHEMA %s", req.Name)
	if req.Owner != "" {
		createSQL += fmt.Sprintf(" AUTHORIZATION %s", req.Owner)
	}

	_, err := ds.db.Exec(createSQL)
	if err != nil {
		return nil, fmt.Errorf("failed to create schema: %w", err)
	}

	// Add comment if description provided
	if req.Description != "" {
		commentSQL := fmt.Sprintf("COMMENT ON SCHEMA %s IS '%s'", req.Name, req.Description)
		_, err = ds.db.Exec(commentSQL)
		if err != nil {
			log.Printf("Warning: failed to add schema comment: %v", err)
		}
	}

	schema := &model.Schema{
		Name:        req.Name,
		Owner:       req.Owner,
		Description: req.Description,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	return schema, nil
}

func (ds *DatabaseService) GetSchema(name string) (*model.Schema, error) {
	query := `
		SELECT 
			s.schema_name,
			s.owner,
			COUNT(t.table_name) as table_count,
			pg_size_pretty(SUM(pg_total_relation_size(c.oid))) as size,
			obj_description(s.oid, 'pg_namespace') as description
		FROM information_schema.schemata s
		LEFT JOIN information_schema.tables t ON t.table_schema = s.schema_name
		LEFT JOIN pg_class c ON c.relname = t.table_name AND c.relnamespace = s.oid
		LEFT JOIN pg_namespace s_oid ON s_oid.nspname = s.schema_name
		WHERE s.schema_name = $1
		GROUP BY s.schema_name, s.owner, s.oid.oid
	`

	var schema model.Schema
	var size sql.NullString

	err := ds.db.QueryRow(query, name).Scan(
		&schema.Name,
		&schema.Owner,
		&schema.Tables,
		&size,
		&schema.Description,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("schema %s not found", name)
		}
		return nil, fmt.Errorf("failed to query schema: %w", err)
	}

	if size.Valid {
		schema.Size = size.String
	} else {
		schema.Size = "0 MB"
	}

	schema.CreatedAt = time.Now()
	schema.UpdatedAt = time.Now()

	return &schema, nil
}

func (ds *DatabaseService) DeleteSchema(name string) error {
	_, err := ds.db.Exec(fmt.Sprintf("DROP SCHEMA %s CASCADE", name))
	if err != nil {
		return fmt.Errorf("failed to drop schema: %w", err)
	}

	return nil
}

// Database Operations Services

func (ds *DatabaseService) GetQueries() ([]model.Query, error) {
	// This would typically query a saved_queries table
	// For now, return empty slice as placeholder
	return []model.Query{}, nil
}

func (ds *DatabaseService) CreateQuery(req model.CreateQueryRequest) (*model.Query, error) {
	// This would typically insert into a saved_queries table
	// For now, return placeholder
	query := &model.Query{
		ID:          fmt.Sprintf("query_%d", time.Now().Unix()),
		Name:        req.Name,
		Description: req.Description,
		SQL:         req.SQL,
		Parameters:  req.Parameters,
		CreatedBy:   "system",
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	return query, nil
}

func (ds *DatabaseService) GetQuery(id string) (*model.Query, error) {
	// This would typically query from a saved_queries table
	return nil, fmt.Errorf("query %s not found", id)
}

func (ds *DatabaseService) DeleteQuery(id string) error {
	// This would typically delete from a saved_queries table
	return nil
}

func (ds *DatabaseService) ExportDatabase(req model.ExportRequest) (*model.ExportResult, error) {
	// This would implement database export logic
	// For now, return placeholder
	result := &model.ExportResult{
		Format:    req.Format,
		Size:      0,
		FileName:  fmt.Sprintf("export_%s.%s", time.Now().Format("20060102_150405"), req.Format),
		Checksum:  "",
		CreatedAt: time.Now(),
	}

	return result, nil
}

func (ds *DatabaseService) GetImportStatus() (*model.ImportStatus, error) {
	// This would check current import status
	status := &model.ImportStatus{
		Status:           "idle",
		Progress:         0,
		RecordsProcessed: 0,
		TotalRecords:     0,
		StartedAt:        time.Now(),
		EstimatedEnd:     time.Now(),
	}

	return status, nil
}

func (ds *DatabaseService) ImportDatabase(req model.ImportRequest) (*model.ImportResult, error) {
	// This would implement database import logic
	result := &model.ImportResult{
		RecordsProcessed: 0,
		RecordsInserted:  0,
		RecordsUpdated:   0,
		RecordsSkipped:   0,
		Errors:           []string{},
		StartedAt:        time.Now(),
		CompletedAt:      time.Now(),
	}

	return result, nil
}

func (ds *DatabaseService) GetBackupList() ([]model.Backup, error) {
	// This would query backup records from database
	return []model.Backup{}, nil
}

func (ds *DatabaseService) CreateBackup(req model.BackupRequest) (*model.Backup, error) {
	// This would implement database backup logic
	backup := &model.Backup{
		ID:          fmt.Sprintf("backup_%d", time.Now().Unix()),
		Name:        req.Name,
		Type:        req.Type,
		Size:        0,
		Format:      req.Format,
		Compression: req.Compression,
		Status:      "pending",
		CreatedBy:   "system",
		CreatedAt:   time.Now(),
	}

	return backup, nil
}

func (ds *DatabaseService) GetRestoreStatus() (*model.RestoreStatus, error) {
	// This would check current restore status
	status := &model.RestoreStatus{
		Status:          "idle",
		Progress:        0,
		TablesRestored:  0,
		TotalTables:     0,
		RecordsRestored: 0,
		StartedAt:       time.Now(),
		EstimatedEnd:    time.Now(),
	}

	return status, nil
}

func (ds *DatabaseService) RestoreDatabase(req model.RestoreRequest) (*model.RestoreResult, error) {
	// This would implement database restore logic
	result := &model.RestoreResult{
		BackupID:         req.BackupID,
		TablesRestored:   0,
		RecordsRestored:  0,
		ValidationPassed: false,
		Errors:           []string{},
		StartedAt:        time.Now(),
		CompletedAt:      time.Now(),
	}

	return result, nil
}

// Database Monitoring Services

func (ds *DatabaseService) GetStatus() (*model.DatabaseStatus, error) {
	var status model.DatabaseStatus

	// Get database version
	err := ds.db.QueryRow("SELECT version()").Scan(&status.Version)
	if err != nil {
		return nil, fmt.Errorf("failed to get database version: %w", err)
	}

	// Get connection info
	err = ds.db.QueryRow(`
		SELECT 
			COUNT(*) as active_connections,
			(SELECT setting FROM pg_settings WHERE name = 'max_connections') as max_connections
		FROM pg_stat_activity 
		WHERE state = 'active'
	`).Scan(&status.Connections, &status.MaxConnections)
	if err != nil {
		return nil, fmt.Errorf("failed to get connection info: %w", err)
	}

	// Get database size
	var totalSize, freeSize sql.NullString
	err = ds.db.QueryRow(`
		SELECT 
			pg_size_pretty(pg_database_size(current_database())) as total_size,
			'Unknown' as free_size
	`).Scan(&totalSize, &freeSize)
	if err != nil {
		return nil, fmt.Errorf("failed to get database size: %w", err)
	}

	if totalSize.Valid {
		status.TotalSize = totalSize.String
	}
	if freeSize.Valid {
		status.FreeSize = freeSize.String
	}

	status.Status = "online"
	status.Uptime = time.Now().Unix() // Placeholder
	status.UsedSize = status.TotalSize
	status.LastCheck = time.Now()

	return &status, nil
}

func (ds *DatabaseService) GetPerformance() (*model.DatabasePerformance, error) {
	var perf model.DatabasePerformance

	// This would collect performance metrics
	// For now, return placeholder values
	perf.CPUUsage = 0.0
	perf.MemoryUsage = 0.0
	perf.DiskUsage = 0.0
	perf.DiskIOPS = 0
	perf.DiskThroughput = 0
	perf.NetworkIO = 0
	perf.QueryRate = 0.0
	perf.TransactionRate = 0.0
	perf.LockWaitTime = 0
	perf.DeadlockCount = 0

	return &perf, nil
}

func (ds *DatabaseService) GetConnections() ([]model.DatabaseConnection, error) {
	query := `
		SELECT 
			pid::text as id,
			datname as database,
			usename as user,
			client_addr as host,
			state as state,
			COALESCE(query, '') as query,
			EXTRACT(EPOCH FROM (now() - query_start))::bigint as duration,
			query_start as started_at
		FROM pg_stat_activity 
		WHERE state != 'idle'
		ORDER BY query_start
	`

	rows, err := ds.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query connections: %w", err)
	}
	defer rows.Close()

	var connections []model.DatabaseConnection
	for rows.Next() {
		var conn model.DatabaseConnection
		var startedAt time.Time

		err := rows.Scan(
			&conn.ID,
			&conn.Database,
			&conn.User,
			&conn.Host,
			&conn.State,
			&conn.Query,
			&conn.Duration,
			&startedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan connection row: %w", err)
		}

		conn.StartedAt = startedAt
		connections = append(connections, conn)
	}

	return connections, nil
}

func (ds *DatabaseService) GetStatistics() (*model.DatabaseStatistics, error) {
	var stats model.DatabaseStatistics

	// This would collect database statistics
	// For now, return placeholder values
	stats.TotalQueries = 0
	stats.SelectQueries = 0
	stats.InsertQueries = 0
	stats.UpdateQueries = 0
	stats.DeleteQueries = 0
	stats.TotalTransactions = 0
	stats.CommittedTransactions = 0
	stats.RollbackTransactions = 0
	stats.TotalRows = 0
	stats.AverageQueryTime = 0.0
	stats.SlowQueryCount = 0

	return &stats, nil
}

func (ds *DatabaseService) GetLogs(limit int) ([]model.DatabaseLog, error) {
	// This would query database logs
	// For now, return empty slice
	return []model.DatabaseLog{}, nil
}

func (ds *DatabaseService) GetLocks() ([]model.DatabaseLock, error) {
	query := `
		SELECT 
			pid::text as id,
			locktype as type,
			mode as mode,
			database::text as database,
			relation::text as table,
			pid as process_id,
			EXTRACT(EPOCH FROM (now() - query_start))::bigint as duration,
			query_start as started_at
		FROM pg_locks l
		JOIN pg_stat_activity a ON l.pid = a.pid
		WHERE NOT granted
		ORDER BY query_start
	`

	rows, err := ds.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query locks: %w", err)
	}
	defer rows.Close()

	var locks []model.DatabaseLock
	for rows.Next() {
		var lock model.DatabaseLock
		var startedAt time.Time
		var database, table sql.NullString

		err := rows.Scan(
			&lock.ID,
			&lock.Type,
			&lock.Mode,
			&database,
			&table,
			&lock.ProcessID,
			&lock.Duration,
			&startedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan lock row: %w", err)
		}

		if database.Valid {
			lock.Database = database.String
		}
		if table.Valid {
			lock.Table = table.String
		}

		lock.StartedAt = startedAt
		locks = append(locks, lock)
	}

	return locks, nil
}

func (ds *DatabaseService) GetSlowQueries(limit int) ([]model.SlowQuery, error) {
	// This would query slow query log
	// For now, return empty slice
	return []model.SlowQuery{}, nil
}
