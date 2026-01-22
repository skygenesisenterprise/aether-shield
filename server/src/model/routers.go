package model

import (
	"time"
)

// Router represents a network router entity
type Router struct {
	ID          string    `json:"id" gorm:"primaryKey"`
	Name        string    `json:"name" gorm:"not null"`
	Description string    `json:"description"`
	IPAddress   string    `json:"ip_address" gorm:"not null"`
	Model       string    `json:"model"`
	Vendor      string    `json:"vendor"`
	Firmware    string    `json:"firmware"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt   time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}

// RouterConfig represents the configuration of a router
type RouterConfig struct {
	ID        string    `json:"id" gorm:"primaryKey"`
	RouterID  string    `json:"router_id" gorm:"not null"`
	Config    string    `json:"config" gorm:"type:text"`
	Version   string    `json:"version"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}

// RouterStatus represents the status information of a router
type RouterStatus struct {
	ID          string    `json:"id" gorm:"primaryKey"`
	RouterID    string    `json:"router_id" gorm:"not null"`
	Uptime      string    `json:"uptime"`
	CPUUsage    float64   `json:"cpu_usage"`
	MemoryUsage float64   `json:"memory_usage"`
	Temperature float64   `json:"temperature"`
	Interfaces  int       `json:"interfaces"`
	CreatedAt   time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt   time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}

// RouterLog represents a log entry for a router
type RouterLog struct {
	ID        string    `json:"id" gorm:"primaryKey"`
	RouterID  string    `json:"router_id" gorm:"not null"`
	Level     string    `json:"level"`
	Message   string    `json:"message" gorm:"type:text"`
	Source    string    `json:"source"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
}

// RouterInterface represents an interface of a router
type RouterInterface struct {
	ID          string    `json:"id" gorm:"primaryKey"`
	RouterID    string    `json:"router_id" gorm:"not null"`
	Name        string    `json:"name"`
	Type        string    `json:"type"`
	IPAddress   string    `json:"ip_address"`
	Netmask     string    `json:"netmask"`
	Status      string    `json:"status"`
	Speed       int       `json:"speed"`
	Duplex      string    `json:"duplex"`
	CreatedAt   time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt   time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}

// RouterRoute represents a route configured on a router
type RouterRoute struct {
	ID          string    `json:"id" gorm:"primaryKey"`
	RouterID    string    `json:"router_id" gorm:"not null"`
	Destination string    `json:"destination"`
	Gateway     string    `json:"gateway"`
	Interface   string    `json:"interface"`
	Metric      int       `json:"metric"`
	Type        string    `json:"type"`
	Protocol    string    `json:"protocol"`
	CreatedAt   time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt   time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}

// RouterService represents a service running on a router
type RouterService struct {
	ID          string    `json:"id" gorm:"primaryKey"`
	RouterID    string    `json:"router_id" gorm:"not null"`
	Name        string    `json:"name"`
	Status      string    `json:"status"`
	PID         int       `json:"pid"`
	Uptime      string    `json:"uptime"`
	CreatedAt   time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt   time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}

// RouterFirewall represents firewall configuration on a router
type RouterFirewall struct {
	ID          string    `json:"id" gorm:"primaryKey"`
	RouterID    string    `json:"router_id" gorm:"not null"`
	RuleID      string    `json:"rule_id"`
	Action      string    `json:"action"`
	Source      string    `json:"source"`
	Destination string    `json:"destination"`
	Protocol    string    `json:"protocol"`
	Port        string    `json:"port"`
	Interface   string    `json:"interface"`
	CreatedAt   time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt   time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}

// RouterVPN represents VPN configuration on a router
type RouterVPN struct {
	ID          string    `json:"id" gorm:"primaryKey"`
	RouterID    string    `json:"router_id" gorm:"not null"`
	Type        string    `json:"type"`
	Name        string    `json:"name"`
	Status      string    `json:"status"`
	RemoteIP    string    `json:"remote_ip"`
	LocalIP     string    `json:"local_ip"`
	CreatedAt   time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt   time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}

// RouterStatistics represents statistics for a router
type RouterStatistics struct {
	ID          string    `json:"id" gorm:"primaryKey"`
	RouterID    string    `json:"router_id" gorm:"not null"`
	InBytes     int64     `json:"in_bytes"`
	OutBytes    int64     `json:"out_bytes"`
	InPackets   int64     `json:"in_packets"`
	OutPackets  int64     `json:"out_packets"`
	InErrors    int64     `json:"in_errors"`
	OutErrors   int64     `json:"out_errors"`
	CreatedAt   time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt   time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}

// RouterCommand represents a command to be executed on a router
type RouterCommand struct {
	ID          string    `json:"id" gorm:"primaryKey"`
	RouterID    string    `json:"router_id" gorm:"not null"`
	Command     string    `json:"command"`
	Output      string    `json:"output" gorm:"type:text"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt   time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}

// RouterDiagnostic represents diagnostic information from a router
type RouterDiagnostic struct {
	ID          string    `json:"id" gorm:"primaryKey"`
	RouterID    string    `json:"router_id" gorm:"not null"`
	TestType    string    `json:"test_type"`
	Result      string    `json:"result" gorm:"type:text"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt   time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}

// RouterBackup represents a backup of a router configuration
type RouterBackup struct {
	ID          string    `json:"id" gorm:"primaryKey"`
	RouterID    string    `json:"router_id" gorm:"not null"`
	BackupName  string    `json:"backup_name"`
	BackupData  string    `json:"backup_data" gorm:"type:text"`
	Size        int64     `json:"size"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt   time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}
