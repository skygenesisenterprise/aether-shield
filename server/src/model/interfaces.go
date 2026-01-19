package model

import "time"

type Interface struct {
	ID          string                 `json:"id"`
	Name        string                 `json:"name"`
	Type        string                 `json:"type"`
	Status      string                 `json:"status"`
	IPAddress   string                 `json:"ipAddress"`
	Subnet      string                 `json:"subnet"`
	MAC         string                 `json:"mac"`
	Gateway     string                 `json:"gateway"`
	DNS         []string               `json:"dns"`
	Description string                 `json:"description"`
	Mtu         int                    `json:"mtu"`
	Speed       int                    `json:"speed"`
	Duplex      string                 `json:"duplex"`
	Config      InterfaceConfig        `json:"config"`
	Statistics  InterfaceDetailedStats `json:"statistics"`
	CreatedAt   time.Time              `json:"createdAt"`
	UpdatedAt   time.Time              `json:"updatedAt"`
}

type InterfaceConfig struct {
	Enabled       bool     `json:"enabled"`
	DHCP          bool     `json:"dhcp"`
	StaticIP      string   `json:"staticIp"`
	StaticMask    string   `json:"staticMask"`
	StaticGateway string   `json:"staticGateway"`
	StaticDNS     []string `json:"staticDns"`
	VLANID        int      `json:"vlanId"`
	Parent        string   `json:"parent"`
	BridgeGroup   string   `json:"bridgeGroup"`
}

type InterfaceDetailedStats struct {
	RxBytes    uint64 `json:"rxBytes"`
	RxPackets  uint64 `json:"rxPackets"`
	RxErrors   uint64 `json:"rxErrors"`
	TxBytes    uint64 `json:"txBytes"`
	TxPackets  uint64 `json:"txPackets"`
	TxErrors   uint64 `json:"txErrors"`
	Collisions uint64 `json:"collisions"`
}

type InterfaceAssignment struct {
	ID        string `json:"id"`
	Interface string `json:"interface"`
	Network   string `json:"network"`
	Gateway   string `json:"gateway"`
	Priority  int    `json:"priority"`
	Weight    int    `json:"weight"`
	Enabled   bool   `json:"enabled"`
}

type VirtualIP struct {
	ID        string    `json:"id"`
	IPAddress string    `json:"ipAddress"`
	Subnet    string    `json:"subnet"`
	Interface string    `json:"interface"`
	Type      string    `json:"type"`
	Password  string    `json:"password"`
	Enabled   bool      `json:"enabled"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type InterfaceDevice struct {
	Name        string `json:"name"`
	Type        string `json:"type"`
	Status      string `json:"status"`
	MAC         string `json:"mac"`
	MTU         int    `json:"mtu"`
	Description string `json:"description"`
}

type PingRequest struct {
	Host      string `json:"host" binding:"required"`
	Count     int    `json:"count"`
	Interval  int    `json:"interval"`
	Timeout   int    `json:"timeout"`
	Interface string `json:"interface"`
}

type PingResponse struct {
	Success  bool     `json:"success"`
	Host     string   `json:"host"`
	Sent     int      `json:"sent"`
	Received int      `json:"received"`
	Loss     float64  `json:"loss"`
	MinTime  float64  `json:"minTime"`
	MaxTime  float64  `json:"maxTime"`
	AvgTime  float64  `json:"avgTime"`
	Results  []string `json:"results"`
}

type TracerouteRequest struct {
	Host      string `json:"host" binding:"required"`
	MaxHops   int    `json:"maxHops"`
	Timeout   int    `json:"timeout"`
	Interface string `json:"interface"`
}

type TracerouteResponse struct {
	Success bool            `json:"success"`
	Host    string          `json:"host"`
	Hops    []TracerouteHop `json:"hops"`
}

type TracerouteHop struct {
	Hop   int       `json:"hop"`
	IPs   []string  `json:"ips"`
	Times []float64 `json:"times"`
}

type DNSLookupRequest struct {
	Domain    string `json:"domain" binding:"required"`
	Type      string `json:"type"`
	Server    string `json:"server"`
	Interface string `json:"interface"`
}

type DNSLookupResponse struct {
	Success bool        `json:"success"`
	Domain  string      `json:"domain"`
	Type    string      `json:"type"`
	Answers []DNSAnswer `json:"answers"`
	Server  string      `json:"server"`
	Time    float64     `json:"time"`
}

type DNSAnswer struct {
	Name  string `json:"name"`
	Type  string `json:"type"`
	TTL   int    `json:"ttl"`
	Value string `json:"value"`
}

type PacketCaptureRequest struct {
	Interface string `json:"interface" binding:"required"`
	Filter    string `json:"filter"`
	Count     int    `json:"count"`
	Timeout   int    `json:"timeout"`
	Promisc   bool   `json:"promisc"`
}

type PacketCaptureResponse struct {
	Success   bool     `json:"success"`
	Interface string   `json:"interface"`
	Packets   []Packet `json:"packets"`
	Captured  int      `json:"captured"`
}

type Packet struct {
	Timestamp  int64             `json:"timestamp"`
	SourceIP   string            `json:"sourceIp"`
	DestIP     string            `json:"destIp"`
	SourcePort int               `json:"sourcePort"`
	DestPort   int               `json:"destPort"`
	Protocol   string            `json:"protocol"`
	Length     int               `json:"length"`
	Payload    string            `json:"payload"`
	Headers    map[string]string `json:"headers"`
}

type PortprobeRequest struct {
	Host      string `json:"host" binding:"required"`
	Ports     []int  `json:"ports" binding:"required"`
	Timeout   int    `json:"timeout"`
	Interface string `json:"interface"`
}

type PortprobeResponse struct {
	Success bool         `json:"success"`
	Host    string       `json:"host"`
	Results []PortResult `json:"results"`
}

type PortResult struct {
	Port    int     `json:"port"`
	Open    bool    `json:"open"`
	Service string  `json:"service"`
	Time    float64 `json:"time"`
}

type InterfaceSettings struct {
	EnableLLDP         bool     `json:"enableLLDP"`
	EnableSTP          bool     `json:"enableSTP"`
	STPPriority        int      `json:"stpPriority"`
	STPCost            int      `json:"stpCost"`
	EnableFiltering    bool     `json:"enableFiltering"`
	EnableLogging      bool     `json:"enableLogging"`
	LogLevel           string   `json:"logLevel"`
	AllowedMACs        []string `json:"allowedMacs"`
	BlockedMACs        []string `json:"blockedMacs"`
	EnableMonitoring   bool     `json:"enableMonitoring"`
	MonitoringInterval int      `json:"monitoringInterval"`
}

type WirelessDevice struct {
	SSID      string `json:"ssid"`
	BSSID     string `json:"bssid"`
	Channel   int    `json:"channel"`
	Frequency int    `json:"frequency"`
	Signal    int    `json:"signal"`
	Noise     int    `json:"noise"`
	Quality   int    `json:"quality"`
	Security  string `json:"security"`
	Mode      string `json:"mode"`
	Connected bool   `json:"connected"`
}

type ArpEntry struct {
	IPAddress string `json:"ipAddress"`
	MAC       string `json:"mac"`
	Interface string `json:"interface"`
	Type      string `json:"type"`
	Age       int    `json:"age"`
	Permanent bool   `json:"permanent"`
}

type InterfaceNeighbor struct {
	IPAddress string    `json:"ipAddress"`
	MAC       string    `json:"mac"`
	Interface string    `json:"interface"`
	State     string    `json:"state"`
	Reachable bool      `json:"reachable"`
	LastSeen  time.Time `json:"lastSeen"`
}
