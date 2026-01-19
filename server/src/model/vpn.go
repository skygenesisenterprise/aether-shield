package model

import "time"

type OpenVPNInstance struct {
	ID                 int       `json:"id" db:"id"`
	Name               string    `json:"name" db:"name"`
	Description        string    `json:"description" db:"description"`
	Protocol           string    `json:"protocol" db:"protocol"`
	Port               int       `json:"port" db:"port"`
	LocalPort          int       `json:"localPort" db:"local_port"`
	BindAddress        string    `json:"bindAddress" db:"bind_address"`
	DeviceMode         string    `json:"deviceMode" db:"device_mode"`
	TunnelType         string    `json:"tunnelType" db:"tunnel_type"`
	TLSKeyUsage        string    `json:"tlsKeyUsage" db:"tls_key_usage"`
	TCPObust4          bool      `json:"tcpObust4" db:"tcp_obust4"`
	DevNode            string    `json:"devNode" db:"dev_node"`
	Cipher             string    `json:"cipher" db:"cipher"`
	Auth               string    `json:"auth" db:"auth"`
	Digest             string    `json:"digest" db:"digest"`
	Compression        string    `json:"compression" db:"compression"`
	CompressionFraming bool      `json:"compressionFraming" db:"compression_framing"`
	Topology           string    `json:"topology" db:"topology"`
	IPv4Network        string    `json:"ipv4Network" db:"ipv4_network"`
	IPv4Netmask        string    `json:"ipv4Netmask" db:"ipv4_netmask"`
	IPv6Network        string    `json:"ipv6Network" db:"ipv6_network"`
	IPv6Prefix         string    `json:"ipv6Prefix" db:"ipv6_prefix"`
	VerbosityLevel     int       `json:"verbosityLevel" db:"verbosity_level"`
	Status             string    `json:"status" db:"status"`
	Enabled            bool      `json:"enabled" db:"enabled"`
	AuthMode           string    `json:"authMode" db:"auth_mode"`
	LocalGroup         string    `json:"localGroup" db:"local_group"`
	StrictUserCN       bool      `json:"strictUserCN" db:"strict_user_cn"`
	UsernameAsCN       bool      `json:"usernameAsCN" db:"username_as_cn"`
	TLSRemote          string    `json:"tlsRemote" db:"tls_remote"`
	TLSAuth            bool      `json:"tlsAuth" db:"tls_auth"`
	TLSCrypt           bool      `json:"tlsCrypt" db:"tls_crypt"`
	CustomOptions      string    `json:"customOptions" db:"custom_options"`
	CreatedAt          time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt          time.Time `json:"updatedAt" db:"updated_at"`
}

type WireGuardInstance struct {
	ID                  int       `json:"id" db:"id"`
	Name                string    `json:"name" db:"name"`
	Description         string    `json:"description" db:"description"`
	ListenPort          int       `json:"listenPort" db:"listen_port"`
	PrivateKey          string    `json:"privateKey" db:"private_key"`
	PublicKey           string    `json:"publicKey" db:"public_key"`
	DNS                 string    `json:"dns" db:"dns"`
	AllowedIPs          string    `json:"allowedIPs" db:"allowed_ips"`
	Endpoint            string    `json:"endpoint" db:"endpoint"`
	PersistentKeepalive int       `json:"persistentKeepalive" db:"persistent_keepalive"`
	Table               string    `json:"table" db:"table"`
	FwMark              string    `json:"fwMark" db:"fw_mark"`
	MTU                 int       `json:"mtu" db:"mtu"`
	Status              string    `json:"status" db:"status"`
	Enabled             bool      `json:"enabled" db:"enabled"`
	CustomOptions       string    `json:"customOptions" db:"custom_options"`
	CreatedAt           time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt           time.Time `json:"updatedAt" db:"updated_at"`
}

type WireGuardPeer struct {
	ID                  int        `json:"id" db:"id"`
	InstanceID          int        `json:"instanceId" db:"instance_id"`
	PublicKey           string     `json:"publicKey" db:"public_key"`
	AllowedIPs          string     `json:"allowedIPs" db:"allowed_ips"`
	Endpoint            string     `json:"endpoint" db:"endpoint"`
	PersistentKeepalive int        `json:"persistentKeepalive" db:"persistent_keepalive"`
	PresharedKey        string     `json:"presharedKey" db:"preshared_key"`
	Description         string     `json:"description" db:"description"`
	Enabled             bool       `json:"enabled" db:"enabled"`
	LastHandshake       *time.Time `json:"lastHandshake" db:"last_handshake"`
	RxBytes             int64      `json:"rxBytes" db:"rx_bytes"`
	TxBytes             int64      `json:"txBytes" db:"tx_bytes"`
	CreatedAt           time.Time  `json:"createdAt" db:"created_at"`
	UpdatedAt           time.Time  `json:"updatedAt" db:"updated_at"`
}

type IPSecConnection struct {
	ID                int       `json:"id" db:"id"`
	Name              string    `json:"name" db:"name"`
	Description       string    `json:"description" db:"description"`
	Protocol          string    `json:"protocol" db:"protocol"`
	LocalID           string    `json:"localId" db:"local_id"`
	RemoteID          string    `json:"remoteId" db:"remote_id"`
	LocalGateway      string    `json:"localGateway" db:"local_gateway"`
	RemoteGateway     string    `json:"remoteGateway" db:"remote_gateway"`
	LocalSubnet       string    `json:"localSubnet" db:"local_subnet"`
	RemoteSubnet      string    `json:"remoteSubnet" db:"remote_subnet"`
	Encryption        string    `json:"encryption" db:"encryption"`
	Integrity         string    `json:"integrity" db:"integrity"`
	DHGroup           string    `json:"dhGroup" db:"dh_group"`
	IKEVersion        string    `json:"ikeVersion" db:"ike_version"`
	Phase1Lifetime    int       `json:"phase1Lifetime" db:"phase1_lifetime"`
	Phase2Lifetime    int       `json:"phase2Lifetime" db:"phase2_lifetime"`
	DPD               bool      `json:"dpd" db:"dpd"`
	DPDDelay          int       `json:"dpdDelay" db:"dpd_delay"`
	DPDTimeout        int       `json:"dpdTimeout" db:"dpd_timeout"`
	NATTraversal      bool      `json:"natTraversal" db:"nat_traversal"`
	Mobility          bool      `json:"mobility" db:"mobility"`
	DeadPeerDetection bool      `json:"deadPeerDetection" db:"dead_peer_detection"`
	Enabled           bool      `json:"enabled" db:"enabled"`
	Status            string    `json:"status" db:"status"`
	CreatedAt         time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt         time.Time `json:"updatedAt" db:"updated_at"`
}

type IPSecSettings struct {
	ID                int       `json:"id" db:"id"`
	Enable            bool      `json:"enable" db:"enable"`
	Interface         string    `json:"interface" db:"interface"`
	ListenPort        int       `json:"listenPort" db:"listen_port"`
	IKELifetime       int       `json:"ikeLifetime" db:"ike_lifetime"`
	MobileUsers       bool      `json:"mobileUsers" db:"mobile_users"`
	AcceptMobileUsers bool      `json:"acceptMobileUsers" db:"accept_mobile_users"`
	UserSource        string    `json:"userSource" db:"user_source"`
	GroupSource       string    `json:"groupSource" db:"group_source"`
	Backend           string    `json:"backend" db:"backend"`
	AutoGenerate      bool      `json:"autoGenerate" db:"autoGenerate"`
	CustomOptions     string    `json:"customOptions" db:"custom_options"`
	CreatedAt         time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt         time.Time `json:"updatedAt" db:"updated_at"`
}

type IPSecPreSharedKey struct {
	ID           int       `json:"id" db:"id"`
	Identifier   string    `json:"identifier" db:"identifier"`
	PreSharedKey string    `json:"preSharedKey" db:"pre_shared_key"`
	Description  string    `json:"description" db:"description"`
	CreatedAt    time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt    time.Time `json:"updatedAt" db:"updated_at"`
}

type IPSecKeyPair struct {
	ID         int       `json:"id" db:"id"`
	Type       string    `json:"type" db:"type"`
	PublicKey  string    `json:"publicKey" db:"public_key"`
	PrivateKey string    `json:"privateKey" db:"private_key"`
	KeySize    int       `json:"keySize" db:"key_size"`
	CreatedAt  time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt  time.Time `json:"updatedAt" db:"updated_at"`
}

type IPSecSAD struct {
	ID          int       `json:"id" db:"id"`
	Source      string    `json:"source" db:"source"`
	Destination string    `json:"destination" db:"destination"`
	Protocol    string    `json:"protocol" db:"protocol"`
	SPI         string    `json:"spi" db:"spi"`
	Encryption  string    `json:"encryption" db:"encryption"`
	Auth        string    `json:"auth" db:"auth"`
	State       string    `json:"state" db:"state"`
	CreatedAt   time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt   time.Time `json:"updatedAt" db:"updated_at"`
}

type IPSecSPD struct {
	ID          int       `json:"id" db:"id"`
	Source      string    `json:"source" db:"source"`
	Destination string    `json:"destination" db:"destination"`
	Protocol    string    `json:"protocol" db:"protocol"`
	Action      string    `json:"action" db:"action"`
	Priority    int       `json:"priority" db:"priority"`
	CreatedAt   time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt   time.Time `json:"updatedAt" db:"updated_at"`
}

type IPSecVTI struct {
	ID            int       `json:"id" db:"id"`
	Interface     string    `json:"interface" db:"interface"`
	LocalAddress  string    `json:"localAddress" db:"local_address"`
	RemoteAddress string    `json:"remoteAddress" db:"remote_address"`
	CreatedAt     time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt     time.Time `json:"updatedAt" db:"updated_at"`
}

type IPSecLease struct {
	ID           int       `json:"id" db:"id"`
	Username     string    `json:"username" db:"username"`
	IPAddress    string    `json:"ipAddress" db:"ip_address"`
	ConnectionID int       `json:"connectionId" db:"connection_id"`
	LoginTime    time.Time `json:"loginTime" db:"login_time"`
	LastActivity time.Time `json:"lastActivity" db:"last_activity"`
}

type VPNStatus struct {
	OpenVPNInstances   []OpenVPNStatus   `json:"openvpnInstances"`
	WireGuardInstances []WireGuardStatus `json:"wireguardInstances"`
	IPSecConnections   []IPSecStatus     `json:"ipsecConnections"`
}

type OpenVPNStatus struct {
	ID               int       `json:"id"`
	Name             string    `json:"name"`
	Status           string    `json:"status"`
	ConnectedClients int       `json:"connectedClients"`
	TotalClients     int       `json:"totalClients"`
	UpTime           string    `json:"upTime"`
	LastUpdate       time.Time `json:"lastUpdate"`
}

type WireGuardStatus struct {
	ID             int       `json:"id"`
	Name           string    `json:"name"`
	Status         string    `json:"status"`
	ConnectedPeers int       `json:"connectedPeers"`
	TotalPeers     int       `json:"totalPeers"`
	UpTime         string    `json:"upTime"`
	LastUpdate     time.Time `json:"lastUpdate"`
}

type IPSecStatus struct {
	ID         int       `json:"id"`
	Name       string    `json:"name"`
	Status     string    `json:"status"`
	Phase1     string    `json:"phase1"`
	Phase2     string    `json:"phase2"`
	UpTime     string    `json:"upTime"`
	LastUpdate time.Time `json:"lastUpdate"`
}

type VPNLog struct {
	ID         int       `json:"id" db:"id"`
	Service    string    `json:"service" db:"service"`
	Level      string    `json:"level" db:"level"`
	Message    string    `json:"message" db:"message"`
	Timestamp  time.Time `json:"timestamp" db:"timestamp"`
	InstanceID *int      `json:"instanceId" db:"instance_id"`
}

type VPNExport struct {
	Format      string    `json:"format"`
	Content     string    `json:"content"`
	ContentType string    `json:"contentType"`
	Filename    string    `json:"filename"`
	ExportedAt  time.Time `json:"exportedAt"`
}

type OpenVPNClientOverwrite struct {
	ID          int       `json:"id" db:"id"`
	InstanceID  int       `json:"instanceId" db:"instance_id"`
	Client      string    `json:"client" db:"client"`
	Options     string    `json:"options" db:"options"`
	Description string    `json:"description" db:"description"`
	CreatedAt   time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt   time.Time `json:"updatedAt" db:"updated_at"`
}

type WireGuardPeerGenerator struct {
	PrivateKey          string    `json:"privateKey"`
	PublicKey           string    `json:"publicKey"`
	Address             string    `json:"address"`
	DNS                 string    `json:"dns"`
	AllowedIPs          string    `json:"allowedIPs"`
	Endpoint            string    `json:"endpoint"`
	PersistentKeepalive int       `json:"persistentKeepalive"`
	GeneratedAt         time.Time `json:"generatedAt"`
}
