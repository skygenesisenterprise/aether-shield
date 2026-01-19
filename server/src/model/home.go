package model

import "time"

type SystemInfo struct {
	Hostname     string `json:"hostname"`
	OS           string `json:"os"`
	Kernel       string `json:"kernel"`
	Uptime       int64  `json:"uptime"`
	Architecture string `json:"architecture"`
}

type CpuInfo struct {
	Usage       float64 `json:"usage"`
	Cores       int     `json:"cores"`
	Frequency   float64 `json:"frequency"`
	Temperature float64 `json:"temperature"`
}

type MemoryInfo struct {
	Total      int64   `json:"total"`
	Used       int64   `json:"used"`
	Available  int64   `json:"available"`
	Percentage float64 `json:"percentage"`
}

type DiskInfo struct {
	Total      int64   `json:"total"`
	Used       int64   `json:"used"`
	Free       int64   `json:"free"`
	Percentage float64 `json:"percentage"`
	MountPoint string  `json:"mountPoint"`
}

type InterfaceStats struct {
	Name      string `json:"name"`
	Status    string `json:"status"`
	RxBytes   int64  `json:"rx"`
	TxBytes   int64  `json:"tx"`
	RxPackets int64  `json:"rxPackets"`
	TxPackets int64  `json:"txPackets"`
	RxErrors  int64  `json:"rxErrors"`
	TxErrors  int64  `json:"txErrors"`
}

type FirewallInfo struct {
	Status  string `json:"status"`
	Rules   int    `json:"rules"`
	Blocked int64  `json:"blocked"`
	Allowed int64  `json:"allowed"`
}

type Service struct {
	Name    string  `json:"name"`
	Status  string  `json:"status"`
	Enabled bool    `json:"enabled"`
	Running bool    `json:"running"`
	CPU     float64 `json:"cpu"`
	Memory  int64   `json:"memory"`
}

type Announcement struct {
	ID        string    `json:"id"`
	Title     string    `json:"title"`
	Message   string    `json:"message"`
	Type      string    `json:"type"`
	Severity  string    `json:"severity"`
	CreatedAt time.Time `json:"createdAt"`
	ExpiresAt time.Time `json:"expiresAt"`
}

type TrafficData struct {
	Timestamp     int64  `json:"timestamp"`
	RxBytes       int64  `json:"rxBytes"`
	TxBytes       int64  `json:"txBytes"`
	RxPackets     int64  `json:"rxPackets"`
	TxPackets     int64  `json:"txPackets"`
	InterfaceName string `json:"interfaceName"`
}

type LicenseInfo struct {
	Type         string    `json:"type"`
	Status       string    `json:"status"`
	ValidUntil   time.Time `json:"validUntil"`
	Features     []string  `json:"features"`
	LicensedTo   string    `json:"licensedTo"`
	MaxUsers     int       `json:"maxUsers"`
	CurrentUsers int       `json:"currentUsers"`
}

type PasswordChangeRequest struct {
	OldPassword string `json:"oldPassword" binding:"required"`
	NewPassword string `json:"newPassword" binding:"required,min=8"`
}

type PasswordChangeResponse struct {
	Success   bool   `json:"success"`
	Message   string `json:"message"`
	Timestamp int64  `json:"timestamp"`
}
