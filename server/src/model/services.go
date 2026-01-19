package model

import "time"

// APIResponse represents the standard API response format
type APIResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
	Message string      `json:"message,omitempty"`
}

// DHCPv4Service represents DHCPv4 service configuration
type DHCPv4Service struct {
	Enabled    bool     `json:"enabled"`
	Interface  string   `json:"interface"`
	Range      string   `json:"range"`
	LeaseTime  string   `json:"leaseTime"`
	Domain     string   `json:"domain"`
	DNSServers []string `json:"dnsServers"`
	Gateway    string   `json:"gateway"`
	WinServers []string `json:"winServers,omitempty"`
}

// DHCPv4Lease represents a DHCPv4 lease
type DHCPv4Lease struct {
	IP       string    `json:"ip"`
	MAC      string    `json:"mac"`
	Hostname string    `json:"hostname"`
	Expires  time.Time `json:"expires"`
	Type     string    `json:"type"`  // dynamic, static
	State    string    `json:"state"` // active, expired, free
}

// DHCPv4Static represents a DHCPv4 static mapping
type DHCPv4Static struct {
	IP          string `json:"ip"`
	MAC         string `json:"mac"`
	Hostname    string `json:"hostname"`
	Description string `json:"description"`
}

// DHCPv6Lease represents a DHCPv6 lease
type DHCPv6Lease struct {
	IPv6     string    `json:"ipv6"`
	MAC      string    `json:"mac"`
	Hostname string    `json:"hostname"`
	Expires  time.Time `json:"expires"`
	Type     string    `json:"type"`  // dynamic, static
	State    string    `json:"state"` // active, expired, free
}

// DHCPRelayConfig represents DHCP relay configuration
type DHCPRelayConfig struct {
	Interface string `json:"interface"`
	Server    string `json:"server"`
	Enabled   bool   `json:"enabled"`
}

// UnboundStatistics represents Unbound DNS statistics
type UnboundStatistics struct {
	Queries     int64  `json:"queries"`
	CacheHits   int64  `json:"cacheHits"`
	CacheMisses int64  `json:"cacheMisses"`
	Blocked     int64  `json:"blocked"`
	Uptime      string `json:"uptime"`
	MemoryUsage string `json:"memoryUsage"`
	CacheSize   string `json:"cacheSize"`
	Threads     int    `json:"threads"`
}

// UnboundBlocklist represents Unbound blocklist configuration
type UnboundBlocklist struct {
	Enabled      bool      `json:"enabled"`
	Sources      []string  `json:"sources"`
	TotalBlocked int64     `json:"totalBlocked"`
	LastUpdate   time.Time `json:"lastUpdate"`
	Whitelist    []string  `json:"whitelist"`
}

// UnboundSettings represents Unbound DNS settings
type UnboundSettings struct {
	Enabled        bool     `json:"enabled"`
	ListenPort     int      `json:"listenPort"`
	Interfaces     []string `json:"interfaces"`
	ForwardServers []string `json:"forwardServers"`
	CacheSize      int      `json:"cacheSize"` // in MB
	MaxTTL         int      `json:"maxTTL"`    // in seconds
	MinTTL         int      `json:"minTTL"`    // in seconds
	HardenGlue     bool     `json:"hardenGlue"`
	HardenDNSSEC   bool     `json:"hardenDNSSEC"`
	PrivateDomains []string `json:"privateDomains"`
}

// OpenDNSConfig represents OpenDNS configuration
type OpenDNSConfig struct {
	Enabled     bool   `json:"enabled"`
	Server      string `json:"server"`
	Backup      string `json:"backup"`
	FilterLevel string `json:"filterLevel"` // none, low, moderate, high
}

// ServiceStatus represents the status of a service
type ServiceStatus struct {
	Service   string `json:"service"`
	Running   bool   `json:"running"`
	PID       int    `json:"pid"`
	Uptime    string `json:"uptime"`
	Memory    string `json:"memory"`
	CPU       string `json:"cpu"`
	Enabled   bool   `json:"enabled"`
	AutoStart bool   `json:"autoStart"`
}

// ServiceLog represents service log entries
type ServiceLog struct {
	Entries []LogEntry `json:"entries"`
	Total   int        `json:"total"`
}

// LogEntry represents a single log entry
type LogEntry struct {
	Timestamp string `json:"timestamp"`
	Level     string `json:"level"` // DEBUG, INFO, WARN, ERROR
	Message   string `json:"message"`
}

// MonitSettings represents Monit monitoring settings
type MonitSettings struct {
	Enabled         bool     `json:"enabled"`
	CheckInterval   int      `json:"checkInterval"` // in seconds
	EmailAlerts     bool     `json:"emailAlerts"`
	EmailRecipients []string `json:"emailRecipients"`
	LogFile         string   `json:"logFile"`
	HTTPPort        int      `json:"httpPort"`
	AllowIPs        []string `json:"allowIPs"`
}

// NetworkStatus represents network status information
type NetworkStatus struct {
	Gateway       string   `json:"gateway"`
	DNS           []string `json:"dns"`
	Internet      bool     `json:"internet"`
	Latency       string   `json:"latency"`
	DownloadSpeed string   `json:"downloadSpeed"`
	UploadSpeed   string   `json:"uploadSpeed"`
	ExternalIP    string   `json:"externalIP"`
	IPv6          bool     `json:"ipv6"`
}

// ServiceConfig represents a generic service configuration
type ServiceConfig struct {
	Name        string                 `json:"name"`
	Enabled     bool                   `json:"enabled"`
	Settings    map[string]interface{} `json:"settings"`
	Status      ServiceStatus          `json:"status"`
	LastUpdated time.Time              `json:"lastUpdated"`
}

// ServiceMetrics represents service performance metrics
type ServiceMetrics struct {
	Service        string    `json:"service"`
	CPUUsage       float64   `json:"cpuUsage"`
	MemoryUsage    int64     `json:"memoryUsage"`
	Connections    int       `json:"connections"`
	RequestsPerSec float64   `json:"requestsPerSec"`
	Uptime         time.Time `json:"uptime"`
	LastUpdated    time.Time `json:"lastUpdated"`
}

// ServiceAlert represents a service alert or notification
type ServiceAlert struct {
	ID           string    `json:"id"`
	Service      string    `json:"service"`
	Level        string    `json:"level"` // INFO, WARN, ERROR, CRITICAL
	Title        string    `json:"title"`
	Message      string    `json:"message"`
	Timestamp    time.Time `json:"timestamp"`
	Acknowledged bool      `json:"acknowledged"`
}

// ServiceDependency represents a service dependency
type ServiceDependency struct {
	Service     string   `json:"service"`
	DependsOn   []string `json:"dependsOn"`
	Required    bool     `json:"required"`
	Description string   `json:"description"`
}

// ServiceHealth represents the health status of a service
type ServiceHealth struct {
	Service   string                 `json:"service"`
	Status    string                 `json:"status"` // healthy, unhealthy, degraded
	Checks    map[string]bool        `json:"checks"`
	LastCheck time.Time              `json:"lastCheck"`
	Metrics   map[string]interface{} `json:"metrics"`
	Errors    []string               `json:"errors,omitempty"`
}

// ServiceBackup represents a service backup configuration
type ServiceBackup struct {
	Service    string    `json:"service"`
	Enabled    bool      `json:"enabled"`
	Schedule   string    `json:"schedule"`  // cron format
	Retention  int       `json:"retention"` // in days
	Location   string    `json:"location"`
	LastBackup time.Time `json:"lastBackup"`
	NextBackup time.Time `json:"nextBackup"`
	Size       int64     `json:"size"` // in bytes
}

// ServiceLogConfig represents service logging configuration
type ServiceLogConfig struct {
	Service        string `json:"service"`
	Enabled        bool   `json:"enabled"`
	LogLevel       string `json:"logLevel"` // DEBUG, INFO, WARN, ERROR
	LogFile        string `json:"logFile"`
	MaxSize        int    `json:"maxSize"` // in MB
	MaxFiles       int    `json:"maxFiles"`
	Syslog         bool   `json:"syslog"`
	SyslogFacility string `json:"syslogFacility"`
}

// ServiceSecurity represents service security settings
type ServiceSecurity struct {
	Service        string   `json:"service"`
	Enabled        bool     `json:"enabled"`
	AllowedIPs     []string `json:"allowedIPs"`
	BlockedIPs     []string `json:"blockedIPs"`
	RequireAuth    bool     `json:"requireAuth"`
	SSLEnabled     bool     `json:"sslEnabled"`
	SSLCertificate string   `json:"sslCertificate"`
	SSLKey         string   `json:"sslKey"`
}

// ServiceUpdate represents a service update configuration
type ServiceUpdate struct {
	Service         string    `json:"service"`
	AutoUpdate      bool      `json:"autoUpdate"`
	Channel         string    `json:"channel"` // stable, beta, dev
	LastCheck       time.Time `json:"lastCheck"`
	LastUpdate      time.Time `json:"lastUpdate"`
	Version         string    `json:"version"`
	LatestVersion   string    `json:"latestVersion"`
	UpdateAvailable bool      `json:"updateAvailable"`
}
