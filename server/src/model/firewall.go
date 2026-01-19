package model

import "time"

// FirewallRule represents a firewall rule
type FirewallRule struct {
	ID          string    `json:"id"`
	Action      string    `json:"action"`
	Protocol    string    `json:"protocol"`
	Source      string    `json:"source"`
	Destination string    `json:"destination"`
	Port        string    `json:"port"`
	Description string    `json:"description"`
	Enabled     bool      `json:"enabled"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// FirewallAlias represents a firewall alias
type FirewallAlias struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Type        string    `json:"type"`
	Content     string    `json:"content"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// FirewallCategory represents a firewall rule category
type FirewallCategory struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Color       string `json:"color"`
}

// FirewallGroup represents a group of firewall rules
type FirewallGroup struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Rules       []string  `json:"rules"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// AutomationFilter represents automation filter settings
type AutomationFilter struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Rules       string `json:"rules"`
	Enabled     bool   `json:"enabled"`
	Description string `json:"description"`
}

// AutomationSourceNat represents source NAT automation
type AutomationSourceNat struct {
	ID          string `json:"id"`
	Interface   string `json:"interface"`
	Source      string `json:"source"`
	Description string `json:"description"`
	Enabled     bool   `json:"enabled"`
}

// NatOneToOne represents one-to-one NAT mapping
type NatOneToOne struct {
	ID          string `json:"id"`
	ExternalIP  string `json:"externalIp"`
	InternalIP  string `json:"internalIp"`
	Description string `json:"description"`
	Enabled     bool   `json:"enabled"`
}

// NatOutbound represents outbound NAT rule
type NatOutbound struct {
	ID          string `json:"id"`
	Interface   string `json:"interface"`
	Source      string `json:"source"`
	Translation string `json:"translation"`
	Description string `json:"description"`
	Enabled     bool   `json:"enabled"`
}

// NatPortForward represents port forwarding rule
type NatPortForward struct {
	ID           string `json:"id"`
	ExternalIP   string `json:"externalIp"`
	ExternalPort string `json:"externalPort"`
	InternalIP   string `json:"internalIp"`
	InternalPort string `json:"internalPort"`
	Protocol     string `json:"protocol"`
	Description  string `json:"description"`
	Enabled      bool   `json:"enabled"`
}

// NatNptv6 represents NPTv6 NAT rule
type NatNptv6 struct {
	ID          string `json:"id"`
	Interface   string `json:"interface"`
	Source      string `json:"source"`
	Destination string `json:"destination"`
	Description string `json:"description"`
	Enabled     bool   `json:"enabled"`
}

// ShaperQueue represents traffic shaping queue
type ShaperQueue struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Interface   string `json:"interface"`
	Bandwidth   string `json:"bandwidth"`
	Priority    int    `json:"priority"`
	Description string `json:"description"`
}

// ShaperRule represents traffic shaping rule
type ShaperRule struct {
	ID          string `json:"id"`
	Queue       string `json:"queue"`
	Source      string `json:"source"`
	Destination string `json:"destination"`
	Protocol    string `json:"protocol"`
	Port        string `json:"port"`
	Description string `json:"description"`
	Enabled     bool   `json:"enabled"`
}

// ShaperPipe represents traffic shaping pipe
type ShaperPipe struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Bandwidth   string `json:"bandwidth"`
	Delay       string `json:"delay"`
	Description string `json:"description"`
}

// ShaperStatus represents traffic shaping status
type ShaperStatus struct {
	QueueName  string  `json:"queueName"`
	Used       int64   `json:"used"`
	Available  int64   `json:"available"`
	Percentage float64 `json:"percentage"`
}

// FirewallSettings represents firewall settings
type FirewallSettings struct {
	Advanced      AdvancedSettings      `json:"advanced"`
	Normalization NormalizationSettings `json:"normalization"`
	Schedules     []ScheduleSettings    `json:"schedules"`
}

// AdvancedSettings represents advanced firewall settings
type AdvancedSettings struct {
	DisableAntiLockout  bool `json:"disableAntiLockout"`
	DisableFilter       bool `json:"disableFilter"`
	DisableScrub        bool `json:"disableScrub"`
	DisableVpnFilter    bool `json:"disableVpnFilter"`
	NoSync              bool `json:"noSync"`
	BogonsInterval      int  `json:"bogonsInterval"`
	SkipRulesGwCheck    bool `json:"skipRulesGwCheck"`
	Optimize            bool `json:"optimize"`
	DisableReplyTo      bool `json:"disableReplyTo"`
	DisableStates       bool `json:"disableStates"`
	DisableStateTable   bool `json:"disableStateTable"`
	StateTableSize      int  `json:"stateTableSize"`
	StateMax            int  `json:"stateMax"`
	Statetimeout        int  `json:"statetimeout"`
	MaxSrcStates        int  `json:"maxSrcStates"`
	MaxSrcConn          int  `json:"maxSrcConn"`
	MaxSrcConnRate      int  `json:"maxSrcConnRate"`
	MaxFragments        int  `json:"maxFragments"`
	DisableAutoFragment bool `json:"disableAutoFragment"`
}

// NormalizationSettings represents packet normalization settings
type NormalizationSettings struct {
	NoPf          bool `json:"noPf"`
	Scrub         bool `json:"scrub"`
	Mss           int  `json:"mss"`
	MaxMss        int  `json:"maxMss"`
	DisableVpn    bool `json:"disableVpn"`
	DisableFilter bool `json:"disableFilter"`
}

// ScheduleSettings represents firewall schedule settings
type ScheduleSettings struct {
	ID          string   `json:"id"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Enabled     bool     `json:"enabled"`
	StartTime   string   `json:"startTime"`
	EndTime     string   `json:"endTime"`
	Days        []string `json:"days"`
}

// FirewallLog represents firewall log entry
type FirewallLog struct {
	ID        string    `json:"id"`
	Timestamp time.Time `json:"timestamp"`
	Action    string    `json:"action"`
	Protocol  string    `json:"protocol"`
	Source    string    `json:"source"`
	Dest      string    `json:"dest"`
	Interface string    `json:"interface"`
	Rule      string    `json:"rule"`
	Reason    string    `json:"reason"`
}

// FirewallStatistics represents firewall diagnostic statistics
type FirewallStatistics struct {
	TotalRules     int64   `json:"totalRules"`
	ActiveRules    int64   `json:"activeRules"`
	BlockedPackets int64   `json:"blockedPackets"`
	AllowedPackets int64   `json:"allowedPackets"`
	States         int64   `json:"states"`
	MaxStates      int64   `json:"maxStates"`
	StateUsage     float64 `json:"stateUsage"`
}

// FirewallState represents firewall state information
type FirewallState struct {
	Proto   string `json:"proto"`
	Source  string `json:"source"`
	Dest    string `json:"dest"`
	State   string `json:"state"`
	Expires int64  `json:"expires"`
	Packets int64  `json:"packets"`
	Bytes   int64  `json:"bytes"`
	Rule    string `json:"rule"`
}

// FirewallSession represents firewall session information
type FirewallSession struct {
	ID        string    `json:"id"`
	Source    string    `json:"source"`
	Dest      string    `json:"dest"`
	Protocol  string    `json:"protocol"`
	State     string    `json:"state"`
	Duration  int64     `json:"duration"`
	Packets   int64     `json:"packets"`
	Bytes     int64     `json:"bytes"`
	Interface string    `json:"interface"`
	Rule      string    `json:"rule"`
	StartTime time.Time `json:"startTime"`
}
