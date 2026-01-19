package model

import "time"

// Access Management Models

type Server struct {
	ID        string    `json:"id"`
	Hostname  string    `json:"hostname"`
	IPAddress string    `json:"ipAddress"`
	Port      int       `json:"port"`
	Protocol  string    `json:"protocol"`
	Status    string    `json:"status"`
	LastSync  time.Time `json:"lastSync"`
}

type Tester struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	IPAddress string    `json:"ipAddress"`
	Port      int       `json:"port"`
	Status    string    `json:"status"`
	LastTest  time.Time `json:"lastTest"`
}

// Configuration Models
type BackupConfig struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Enabled     bool      `json:"enabled"`
	Schedule    string    `json:"schedule"`
	Location    string    `json:"location"`
	Retention   int       `json:"retention"`
	CreatedAt   time.Time `json:"createdAt"`
}

type DefaultConfig struct {
	Section  string                 `json:"section"`
	Settings map[string]interface{} `json:"settings"`
}

type ConfigHistory struct {
	ID        string    `json:"id"`
	Section   string    `json:"section"`
	Changes   string    `json:"changes"`
	Author    string    `json:"author"`
	Timestamp time.Time `json:"timestamp"`
	Version   string    `json:"version"`
}

type ConfigWizard struct {
	Step      int                 `json:"step"`
	Title     string              `json:"title"`
	Fields    []ConfigWizardField `json:"fields"`
	Completed bool                `json:"completed"`
}

type ConfigWizardField struct {
	Name        string      `json:"name"`
	Type        string      `json:"type"`
	Label       string      `json:"label"`
	Required    bool        `json:"required"`
	Default     interface{} `json:"default"`
	Description string      `json:"description"`
	Options     []string    `json:"options,omitempty"`
}

// Diagnostics Models
type Activity struct {
	ID        string                 `json:"id"`
	Type      string                 `json:"type"`
	Message   string                 `json:"message"`
	User      string                 `json:"user"`
	Timestamp time.Time              `json:"timestamp"`
	Details   map[string]interface{} `json:"details"`
}

type Statistics struct {
	CPU       float64 `json:"cpu"`
	Memory    int64   `json:"memory"`
	Disk      int64   `json:"disk"`
	Network   int64   `json:"network"`
	Uptime    int64   `json:"uptime"`
	Processes int     `json:"processes"`
}

// Firmware Models
type Changelog struct {
	Version     string    `json:"version"`
	Date        time.Time `json:"date"`
	Changes     []string  `json:"changes"`
	Type        string    `json:"type"`
	DownloadURL string    `json:"downloadUrl"`
}

type Package struct {
	Name      string    `json:"name"`
	Version   string    `json:"version"`
	Status    string    `json:"status"`
	Size      int64     `json:"size"`
	Installed time.Time `json:"installed"`
	Updated   time.Time `json:"updated"`
}

type Plugin struct {
	ID      string                 `json:"id"`
	Name    string                 `json:"name"`
	Version string                 `json:"version"`
	Status  string                 `json:"status"`
	Enabled bool                   `json:"enabled"`
	Config  map[string]interface{} `json:"config"`
}

type FirmwareSettings struct {
	AutoUpdate     bool   `json:"autoUpdate"`
	UpdateChannel  string `json:"updateChannel"`
	BackupOnUpdate bool   `json:"backupOnUpdate"`
	Schedule       string `json:"schedule"`
}

type FirmwareStatus struct {
	CurrentVersion  string    `json:"currentVersion"`
	AvailableUpdate string    `json:"availableUpdate"`
	LastUpdate      time.Time `json:"lastUpdate"`
	NextCheck       time.Time `json:"nextCheck"`
	Status          string    `json:"status"`
}

// Gateways Models
type GatewayConfig struct {
	ID        string                 `json:"id"`
	Name      string                 `json:"name"`
	Type      string                 `json:"type"`
	Enabled   bool                   `json:"enabled"`
	Settings  map[string]interface{} `json:"settings"`
	CreatedAt time.Time              `json:"createdAt"`
	UpdatedAt time.Time              `json:"updatedAt"`
}

type GatewayGroup struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Gateways  []string  `json:"gateways"`
	Strategy  string    `json:"strategy"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type GatewayLog struct {
	ID        string    `json:"id"`
	Gateway   string    `json:"gateway"`
	Level     string    `json:"level"`
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
}

// High Availability Models
type HAStatus struct {
	Enabled    bool      `json:"enabled"`
	State      string    `json:"state"`
	NodeID     string    `json:"nodeId"`
	PeerNodeID string    `json:"peerNodeId"`
	LastSync   time.Time `json:"lastSync"`
	SyncStatus string    `json:"syncStatus"`
	VirtualIP  string    `json:"virtualIp"`
}

type HASettings struct {
	Enabled       bool   `json:"enabled"`
	NodeID        string `json:"nodeId"`
	PeerNodeIP    string `json:"peerNodeIp"`
	SyncInterface string `json:"syncInterface"`
	VirtualIP     string `json:"virtualIp"`
	Password      string `json:"password"`
}

// Routes Models
type RouteConfig struct {
	ID          string                 `json:"id"`
	Network     string                 `json:"network"`
	Gateway     string                 `json:"gateway"`
	Interface   string                 `json:"interface"`
	Metric      int                    `json:"metric"`
	Type        string                 `json:"type"`
	Enabled     bool                   `json:"enabled"`
	Description string                 `json:"description"`
	Settings    map[string]interface{} `json:"settings"`
}

type RouteLog struct {
	ID        string    `json:"id"`
	Route     string    `json:"route"`
	Action    string    `json:"action"`
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
}

type RouteStatus struct {
	Network   string    `json:"network"`
	Gateway   string    `json:"gateway"`
	Interface string    `json:"interface"`
	Status    string    `json:"status"`
	LastCheck time.Time `json:"lastCheck"`
	Hops      int       `json:"hops"`
	Latency   int64     `json:"latency"`
}

// Settings Models
type AdminSettings struct {
	Language   string `json:"language"`
	Theme      string `json:"theme"`
	Timezone   string `json:"timezone"`
	DateFormat string `json:"dateFormat"`
	TimeFormat string `json:"timeFormat"`
}

type CronSettings struct {
	Jobs []CronJob `json:"jobs"`
}

type CronJob struct {
	ID          string    `json:"id"`
	Command     string    `json:"command"`
	Schedule    string    `json:"schedule"`
	Description string    `json:"description"`
	Enabled     bool      `json:"enabled"`
	LastRun     time.Time `json:"lastRun"`
	NextRun     time.Time `json:"nextRun"`
}

type GeneralSettings struct {
	Hostname string   `json:"hostname"`
	Domain   string   `json:"domain"`
	DNS      []string `json:"dns"`
	NTP      []string `json:"ntp"`
	Timezone string   `json:"timezone"`
}

type LoggingSettings struct {
	Level         string `json:"level"`
	Syslog        bool   `json:"syslog"`
	SyslogServer  string `json:"syslogServer"`
	SyslogPort    int    `json:"syslogPort"`
	RemoteLogging bool   `json:"remoteLogging"`
	LogFile       string `json:"logFile"`
	MaxSize       int64  `json:"maxSize"`
	MaxFiles      int    `json:"maxFiles"`
}

type MiscSettings struct {
	WebGUIProtocol string `json:"webGuiProtocol"`
	WebGUIPort     int    `json:"webGuiPort"`
	SSH            bool   `json:"ssh"`
	SSHPort        int    `json:"sshPort"`
	PasswordPolicy bool   `json:"passwordPolicy"`
}

type Tunable struct {
	Name        string      `json:"name"`
	Value       interface{} `json:"value"`
	Default     interface{} `json:"default"`
	Description string      `json:"description"`
	Type        string      `json:"type"`
	Module      string      `json:"module"`
}

// Trust & Certificates Models
type CertificateAuthority struct {
	ID           string    `json:"id"`
	Name         string    `json:"name"`
	Description  string    `json:"description"`
	KeyLength    int       `json:"keyLength"`
	Lifetime     int       `json:"lifetime"`
	Country      string    `json:"country"`
	State        string    `json:"state"`
	City         string    `json:"city"`
	Organization string    `json:"organization"`
	CreatedAt    time.Time `json:"createdAt"`
}

type Certificate struct {
	ID               string    `json:"id"`
	Name             string    `json:"name"`
	Description      string    `json:"description"`
	CAID             string    `json:"caId"`
	CommonName       string    `json:"commonName"`
	AlternativeNames []string  `json:"alternativeNames"`
	KeyLength        int       `json:"keyLength"`
	Lifetime         int       `json:"lifetime"`
	UsageType        string    `json:"usageType"`
	Status           string    `json:"status"`
	IssuedAt         time.Time `json:"issuedAt"`
	ExpiresAt        time.Time `json:"expiresAt"`
}

type Revocation struct {
	ID            string    `json:"id"`
	CertificateID string    `json:"certificateId"`
	Reason        string    `json:"reason"`
	RevokedAt     time.Time `json:"revokedAt"`
	RevokedBy     string    `json:"revokedBy"`
}

type TrustSettings struct {
	AutoCRL     bool `json:"autoCRL"`
	CRLInterval int  `json:"crlInterval"`
	OCSP        bool `json:"ocsp"`
	StrictMode  bool `json:"strictMode"`
}

// Request/Response DTOs
type CreateUserRequest struct {
	Username    string   `json:"username"`
	Email       string   `json:"email"`
	Password    string   `json:"password"`
	Role        string   `json:"role"`
	Permissions []string `json:"permissions"`
}

type UpdateUserRequest struct {
	Username    *string  `json:"username"`
	Email       *string  `json:"email"`
	Role        *string  `json:"role"`
	Permissions []string `json:"permissions"`
	Disabled    *bool    `json:"disabled"`
}

type CreateGroupRequest struct {
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Permissions []string `json:"permissions"`
	Members     []string `json:"members"`
}

type UpdateGroupRequest struct {
	Name        *string  `json:"name"`
	Description *string  `json:"description"`
	Permissions []string `json:"permissions"`
	Members     []string `json:"members"`
}

type CreateBackupRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Enabled     bool   `json:"enabled"`
	Schedule    string `json:"schedule"`
	Location    string `json:"location"`
	Retention   int    `json:"retention"`
}

type CreateGatewayConfigRequest struct {
	Name     string                 `json:"name"`
	Type     string                 `json:"type"`
	Enabled  bool                   `json:"enabled"`
	Settings map[string]interface{} `json:"settings"`
}

type UpdateHASettingsRequest struct {
	Enabled       bool   `json:"enabled"`
	NodeID        string `json:"nodeId"`
	PeerNodeIP    string `json:"peerNodeIp"`
	SyncInterface string `json:"syncInterface"`
	VirtualIP     string `json:"virtualIp"`
	Password      string `json:"password"`
}

type CreateRouteRequest struct {
	Network     string                 `json:"network"`
	Gateway     string                 `json:"gateway"`
	Interface   string                 `json:"interface"`
	Metric      int                    `json:"metric"`
	Type        string                 `json:"type"`
	Enabled     bool                   `json:"enabled"`
	Description string                 `json:"description"`
	Settings    map[string]interface{} `json:"settings"`
}

type UpdateAdminSettingsRequest struct {
	Language   string `json:"language"`
	Theme      string `json:"theme"`
	Timezone   string `json:"timezone"`
	DateFormat string `json:"dateFormat"`
	TimeFormat string `json:"timeFormat"`
}

type UpdateGeneralSettingsRequest struct {
	Hostname string   `json:"hostname"`
	Domain   string   `json:"domain"`
	DNS      []string `json:"dns"`
	NTP      []string `json:"ntp"`
	Timezone string   `json:"timezone"`
}

type CreateCARequest struct {
	Name         string `json:"name"`
	Description  string `json:"description"`
	KeyLength    int    `json:"keyLength"`
	Lifetime     int    `json:"lifetime"`
	Country      string `json:"country"`
	State        string `json:"state"`
	City         string `json:"city"`
	Organization string `json:"organization"`
}

type CreateCertificateRequest struct {
	Name             string   `json:"name"`
	Description      string   `json:"description"`
	CAID             string   `json:"caId"`
	CommonName       string   `json:"commonName"`
	AlternativeNames []string `json:"alternativeNames"`
	KeyLength        int      `json:"keyLength"`
	Lifetime         int      `json:"lifetime"`
	UsageType        string   `json:"usageType"`
}
