package services

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/skygenesisenterprise/aether-shield/server/src/model"
)

type VPNService struct {
	db *sql.DB
}

func NewVPNService(db *sql.DB) *VPNService {
	return &VPNService{
		db: db,
	}
}

// OpenVPN Instances
func (s *VPNService) GetOpenVPNInstances() ([]model.OpenVPNInstance, error) {
	query := `
		SELECT id, name, description, protocol, port, local_port, bind_address, device_mode,
			   tunnel_type, tls_key_usage, tcp_obust4, dev_node, cipher, auth, digest,
			   compression, compression_framing, topology, ipv4_network, ipv4_netmask,
			   ipv6_network, ipv6_prefix, verbosity_level, status, enabled, auth_mode,
			   local_group, strict_user_cn, username_as_cn, tls_remote, tls_auth,
			   tls_crypt, custom_options, created_at, updated_at
		FROM openvpn_instances
		ORDER BY name
	`

	rows, err := s.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query OpenVPN instances: %w", err)
	}
	defer rows.Close()

	var instances []model.OpenVPNInstance
	for rows.Next() {
		var instance model.OpenVPNInstance
		err := rows.Scan(
			&instance.ID, &instance.Name, &instance.Description, &instance.Protocol,
			&instance.Port, &instance.LocalPort, &instance.BindAddress, &instance.DeviceMode,
			&instance.TunnelType, &instance.TLSKeyUsage, &instance.TCPObust4, &instance.DevNode,
			&instance.Cipher, &instance.Auth, &instance.Digest, &instance.Compression,
			&instance.CompressionFraming, &instance.Topology, &instance.IPv4Network,
			&instance.IPv4Netmask, &instance.IPv6Network, &instance.IPv6Prefix,
			&instance.VerbosityLevel, &instance.Status, &instance.Enabled, &instance.AuthMode,
			&instance.LocalGroup, &instance.StrictUserCN, &instance.UsernameAsCN,
			&instance.TLSRemote, &instance.TLSAuth, &instance.TLSCrypt,
			&instance.CustomOptions, &instance.CreatedAt, &instance.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan OpenVPN instance: %w", err)
		}
		instances = append(instances, instance)
	}

	return instances, nil
}

func (s *VPNService) CreateOpenVPNInstance(instance *model.OpenVPNInstance) (*model.OpenVPNInstance, error) {
	query := `
		INSERT INTO openvpn_instances (name, description, protocol, port, local_port, bind_address,
			device_mode, tunnel_type, tls_key_usage, tcp_obust4, dev_node, cipher, auth, digest,
			compression, compression_framing, topology, ipv4_network, ipv4_netmask, ipv6_network,
			ipv6_prefix, verbosity_level, status, enabled, auth_mode, local_group, strict_user_cn,
			username_as_cn, tls_remote, tls_auth, tls_crypt, custom_options, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18,
			$19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34)
		RETURNING id
	`

	var id int
	err := s.db.QueryRow(
		query,
		instance.Name, instance.Description, instance.Protocol, instance.Port,
		instance.LocalPort, instance.BindAddress, instance.DeviceMode, instance.TunnelType,
		instance.TLSKeyUsage, instance.TCPObust4, instance.DevNode, instance.Cipher,
		instance.Auth, instance.Digest, instance.Compression, instance.CompressionFraming,
		instance.Topology, instance.IPv4Network, instance.IPv4Netmask, instance.IPv6Network,
		instance.IPv6Prefix, instance.VerbosityLevel, instance.Status, instance.Enabled,
		instance.AuthMode, instance.LocalGroup, instance.StrictUserCN, instance.UsernameAsCN,
		instance.TLSRemote, instance.TLSAuth, instance.TLSCrypt, instance.CustomOptions,
		time.Now(), time.Now(),
	).Scan(&id)

	if err != nil {
		return nil, fmt.Errorf("failed to create OpenVPN instance: %w", err)
	}

	instance.ID = id
	return instance, nil
}

func (s *VPNService) UpdateOpenVPNInstance(id int, instance *model.OpenVPNInstance) (*model.OpenVPNInstance, error) {
	query := `
		UPDATE openvpn_instances SET name = $1, description = $2, protocol = $3, port = $4,
			local_port = $5, bind_address = $6, device_mode = $7, tunnel_type = $8,
			tls_key_usage = $9, tcp_obust4 = $10, dev_node = $11, cipher = $12, auth = $13,
			digest = $14, compression = $15, compression_framing = $16, topology = $17,
			ipv4_network = $18, ipv4_netmask = $19, ipv6_network = $20, ipv6_prefix = $21,
			verbosity_level = $22, status = $23, enabled = $24, auth_mode = $25,
			local_group = $26, strict_user_cn = $27, username_as_cn = $28, tls_remote = $29,
			tls_auth = $30, tls_crypt = $31, custom_options = $32, updated_at = $33
		WHERE id = $34
	`

	_, err := s.db.Exec(
		query,
		instance.Name, instance.Description, instance.Protocol, instance.Port,
		instance.LocalPort, instance.BindAddress, instance.DeviceMode, instance.TunnelType,
		instance.TLSKeyUsage, instance.TCPObust4, instance.DevNode, instance.Cipher,
		instance.Auth, instance.Digest, instance.Compression, instance.CompressionFraming,
		instance.Topology, instance.IPv4Network, instance.IPv4Netmask, instance.IPv6Network,
		instance.IPv6Prefix, instance.VerbosityLevel, instance.Status, instance.Enabled,
		instance.AuthMode, instance.LocalGroup, instance.StrictUserCN, instance.UsernameAsCN,
		instance.TLSRemote, instance.TLSAuth, instance.TLSCrypt, instance.CustomOptions,
		time.Now(), id,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to update OpenVPN instance: %w", err)
	}

	instance.ID = id
	return instance, nil
}

func (s *VPNService) DeleteOpenVPNInstance(id int) error {
	query := `DELETE FROM openvpn_instances WHERE id = $1`
	_, err := s.db.Exec(query, id)
	if err != nil {
		return fmt.Errorf("failed to delete OpenVPN instance: %w", err)
	}
	return nil
}

func (s *VPNService) GetOpenVPNStatus() ([]model.OpenVPNStatus, error) {
	// This would integrate with the actual OpenVPN management interface
	// For now, return mock data
	status := []model.OpenVPNStatus{
		{
			ID:               1,
			Name:             "Main VPN",
			Status:           "running",
			ConnectedClients: 5,
			TotalClients:     10,
			UpTime:           "2 days, 3 hours",
			LastUpdate:       time.Now(),
		},
	}
	return status, nil
}

func (s *VPNService) GetOpenVPNLog() ([]model.VPNLog, error) {
	query := `
		SELECT id, service, level, message, timestamp, instance_id
		FROM vpn_logs
		WHERE service = 'openvpn'
		ORDER BY timestamp DESC
		LIMIT 100
	`

	rows, err := s.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query OpenVPN logs: %w", err)
	}
	defer rows.Close()

	var logs []model.VPNLog
	for rows.Next() {
		var log model.VPNLog
		err := rows.Scan(&log.ID, &log.Service, &log.Level, &log.Message, &log.Timestamp, &log.InstanceID)
		if err != nil {
			return nil, fmt.Errorf("failed to scan OpenVPN log: %w", err)
		}
		logs = append(logs, log)
	}

	return logs, nil
}

func (s *VPNService) GetOpenVPNExport() ([]model.VPNExport, error) {
	// Mock export functionality
	exports := []model.VPNExport{
		{
			Format:      "ovpn",
			Content:     "# OpenVPN Configuration File\nclient\ndev tun\nproto udp\n",
			ContentType: "text/plain",
			Filename:    "client-config.ovpn",
			ExportedAt:  time.Now(),
		},
	}
	return exports, nil
}

func (s *VPNService) GetOpenVPNClientOverwrites() ([]model.OpenVPNClientOverwrite, error) {
	query := `
		SELECT id, instance_id, client, options, description, created_at, updated_at
		FROM openvpn_client_overwrites
		ORDER BY client
	`

	rows, err := s.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query OpenVPN client overwrites: %w", err)
	}
	defer rows.Close()

	var overwrites []model.OpenVPNClientOverwrite
	for rows.Next() {
		var overwrite model.OpenVPNClientOverwrite
		err := rows.Scan(
			&overwrite.ID, &overwrite.InstanceID, &overwrite.Client,
			&overwrite.Options, &overwrite.Description, &overwrite.CreatedAt, &overwrite.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan OpenVPN client overwrite: %w", err)
		}
		overwrites = append(overwrites, overwrite)
	}

	return overwrites, nil
}

// WireGuard Instances
func (s *VPNService) GetWireGuardInstances() ([]model.WireGuardInstance, error) {
	query := `
		SELECT id, name, description, listen_port, private_key, public_key, dns, allowed_ips,
			   endpoint, persistent_keepalive, table, fw_mark, mtu, status, enabled,
			   custom_options, created_at, updated_at
		FROM wireguard_instances
		ORDER BY name
	`

	rows, err := s.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query WireGuard instances: %w", err)
	}
	defer rows.Close()

	var instances []model.WireGuardInstance
	for rows.Next() {
		var instance model.WireGuardInstance
		err := rows.Scan(
			&instance.ID, &instance.Name, &instance.Description, &instance.ListenPort,
			&instance.PrivateKey, &instance.PublicKey, &instance.DNS, &instance.AllowedIPs,
			&instance.Endpoint, &instance.PersistentKeepalive, &instance.Table, &instance.FwMark,
			&instance.MTU, &instance.Status, &instance.Enabled, &instance.CustomOptions,
			&instance.CreatedAt, &instance.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan WireGuard instance: %w", err)
		}
		instances = append(instances, instance)
	}

	return instances, nil
}

func (s *VPNService) CreateWireGuardInstance(instance *model.WireGuardInstance) (*model.WireGuardInstance, error) {
	query := `
		INSERT INTO wireguard_instances (name, description, listen_port, private_key, public_key,
			dns, allowed_ips, endpoint, persistent_keepalive, table, fw_mark, mtu, status,
			enabled, custom_options, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
		RETURNING id
	`

	var id int
	err := s.db.QueryRow(
		query,
		instance.Name, instance.Description, instance.ListenPort, instance.PrivateKey,
		instance.PublicKey, instance.DNS, instance.AllowedIPs, instance.Endpoint,
		instance.PersistentKeepalive, instance.Table, instance.FwMark, instance.MTU,
		instance.Status, instance.Enabled, instance.CustomOptions, time.Now(), time.Now(),
	).Scan(&id)

	if err != nil {
		return nil, fmt.Errorf("failed to create WireGuard instance: %w", err)
	}

	instance.ID = id
	return instance, nil
}

func (s *VPNService) UpdateWireGuardInstance(id int, instance *model.WireGuardInstance) (*model.WireGuardInstance, error) {
	query := `
		UPDATE wireguard_instances SET name = $1, description = $2, listen_port = $3,
			private_key = $4, public_key = $5, dns = $6, allowed_ips = $7, endpoint = $8,
			persistent_keepalive = $9, table = $10, fw_mark = $11, mtu = $12, status = $13,
			enabled = $14, custom_options = $15, updated_at = $16
		WHERE id = $17
	`

	_, err := s.db.Exec(
		query,
		instance.Name, instance.Description, instance.ListenPort, instance.PrivateKey,
		instance.PublicKey, instance.DNS, instance.AllowedIPs, instance.Endpoint,
		instance.PersistentKeepalive, instance.Table, instance.FwMark, instance.MTU,
		instance.Status, instance.Enabled, instance.CustomOptions, time.Now(), id,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to update WireGuard instance: %w", err)
	}

	instance.ID = id
	return instance, nil
}

func (s *VPNService) DeleteWireGuardInstance(id int) error {
	query := `DELETE FROM wireguard_instances WHERE id = $1`
	_, err := s.db.Exec(query, id)
	if err != nil {
		return fmt.Errorf("failed to delete WireGuard instance: %w", err)
	}
	return nil
}

func (s *VPNService) GetWireGuardStatus() ([]model.WireGuardStatus, error) {
	// This would integrate with the actual WireGuard management interface
	status := []model.WireGuardStatus{
		{
			ID:             1,
			Name:           "Main WireGuard",
			Status:         "active",
			ConnectedPeers: 3,
			TotalPeers:     5,
			UpTime:         "5 days, 12 hours",
			LastUpdate:     time.Now(),
		},
	}
	return status, nil
}

func (s *VPNService) GetWireGuardLog() ([]model.VPNLog, error) {
	query := `
		SELECT id, service, level, message, timestamp, instance_id
		FROM vpn_logs
		WHERE service = 'wireguard'
		ORDER BY timestamp DESC
		LIMIT 100
	`

	rows, err := s.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query WireGuard logs: %w", err)
	}
	defer rows.Close()

	var logs []model.VPNLog
	for rows.Next() {
		var log model.VPNLog
		err := rows.Scan(&log.ID, &log.Service, &log.Level, &log.Message, &log.Timestamp, &log.InstanceID)
		if err != nil {
			return nil, fmt.Errorf("failed to scan WireGuard log: %w", err)
		}
		logs = append(logs, log)
	}

	return logs, nil
}

// WireGuard Peers
func (s *VPNService) GetWireGuardPeers() ([]model.WireGuardPeer, error) {
	query := `
		SELECT id, instance_id, public_key, allowed_ips, endpoint, persistent_keepalive,
			   preshared_key, description, enabled, last_handshake, rx_bytes, tx_bytes,
			   created_at, updated_at
		FROM wireguard_peers
		ORDER BY created_at DESC
	`

	rows, err := s.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query WireGuard peers: %w", err)
	}
	defer rows.Close()

	var peers []model.WireGuardPeer
	for rows.Next() {
		var peer model.WireGuardPeer
		err := rows.Scan(
			&peer.ID, &peer.InstanceID, &peer.PublicKey, &peer.AllowedIPs, &peer.Endpoint,
			&peer.PersistentKeepalive, &peer.PresharedKey, &peer.Description, &peer.Enabled,
			&peer.LastHandshake, &peer.RxBytes, &peer.TxBytes, &peer.CreatedAt, &peer.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan WireGuard peer: %w", err)
		}
		peers = append(peers, peer)
	}

	return peers, nil
}

func (s *VPNService) CreateWireGuardPeer(peer *model.WireGuardPeer) (*model.WireGuardPeer, error) {
	query := `
		INSERT INTO wireguard_peers (instance_id, public_key, allowed_ips, endpoint,
			persistent_keepalive, preshared_key, description, enabled, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING id
	`

	var id int
	err := s.db.QueryRow(
		query,
		peer.InstanceID, peer.PublicKey, peer.AllowedIPs, peer.Endpoint,
		peer.PersistentKeepalive, peer.PresharedKey, peer.Description,
		peer.Enabled, time.Now(), time.Now(),
	).Scan(&id)

	if err != nil {
		return nil, fmt.Errorf("failed to create WireGuard peer: %w", err)
	}

	peer.ID = id
	return peer, nil
}

func (s *VPNService) UpdateWireGuardPeer(id int, peer *model.WireGuardPeer) (*model.WireGuardPeer, error) {
	query := `
		UPDATE wireguard_peers SET instance_id = $1, public_key = $2, allowed_ips = $3,
			endpoint = $4, persistent_keepalive = $5, preshared_key = $6, description = $7,
			enabled = $8, updated_at = $9
		WHERE id = $10
	`

	_, err := s.db.Exec(
		query,
		peer.InstanceID, peer.PublicKey, peer.AllowedIPs, peer.Endpoint,
		peer.PersistentKeepalive, peer.PresharedKey, peer.Description,
		peer.Enabled, time.Now(), id,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to update WireGuard peer: %w", err)
	}

	peer.ID = id
	return peer, nil
}

func (s *VPNService) DeleteWireGuardPeer(id int) error {
	query := `DELETE FROM wireguard_peers WHERE id = $1`
	_, err := s.db.Exec(query, id)
	if err != nil {
		return fmt.Errorf("failed to delete WireGuard peer: %w", err)
	}
	return nil
}

func (s *VPNService) GetWireGuardPeerGenerator() ([]model.WireGuardPeerGenerator, error) {
	// Mock peer generator functionality
	generator := []model.WireGuardPeerGenerator{
		{
			PrivateKey:          "ABC123...",
			PublicKey:           "DEF456...",
			Address:             "10.0.0.2/24",
			DNS:                 "1.1.1.1",
			AllowedIPs:          "0.0.0.0/0",
			Endpoint:            "vpn.example.com:51820",
			PersistentKeepalive: 25,
			GeneratedAt:         time.Now(),
		},
	}
	return generator, nil
}

// IPsec
func (s *VPNService) GetIPSecConnections() ([]model.IPSecConnection, error) {
	query := `
		SELECT id, name, description, protocol, local_id, remote_id, local_gateway,
			   remote_gateway, local_subnet, remote_subnet, encryption, integrity,
			   dh_group, ike_version, phase1_lifetime, phase2_lifetime, dpd,
			   dpd_delay, dpd_timeout, nat_traversal, mobility, dead_peer_detection,
			   enabled, status, created_at, updated_at
		FROM ipsec_connections
		ORDER BY name
	`

	rows, err := s.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query IPsec connections: %w", err)
	}
	defer rows.Close()

	var connections []model.IPSecConnection
	for rows.Next() {
		var conn model.IPSecConnection
		err := rows.Scan(
			&conn.ID, &conn.Name, &conn.Description, &conn.Protocol, &conn.LocalID,
			&conn.RemoteID, &conn.LocalGateway, &conn.RemoteGateway, &conn.LocalSubnet,
			&conn.RemoteSubnet, &conn.Encryption, &conn.Integrity, &conn.DHGroup,
			&conn.IKEVersion, &conn.Phase1Lifetime, &conn.Phase2Lifetime, &conn.DPD,
			&conn.DPDDelay, &conn.DPDTimeout, &conn.NATTraversal, &conn.Mobility,
			&conn.DeadPeerDetection, &conn.Enabled, &conn.Status, &conn.CreatedAt, &conn.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan IPsec connection: %w", err)
		}
		connections = append(connections, conn)
	}

	return connections, nil
}

func (s *VPNService) GetIPSecSessions() ([]model.IPSecStatus, error) {
	// Mock sessions functionality
	sessions := []model.IPSecStatus{
		{
			ID:         1,
			Name:       "Main IPsec",
			Status:     "connected",
			Phase1:     "established",
			Phase2:     "established",
			UpTime:     "1 day, 8 hours",
			LastUpdate: time.Now(),
		},
	}
	return sessions, nil
}

func (s *VPNService) GetIPSecSettings() (*model.IPSecSettings, error) {
	query := `
		SELECT id, enable, interface, listen_port, ike_lifetime, mobile_users,
			   accept_mobile_users, user_source, group_source, backend, auto_generate,
			   custom_options, created_at, updated_at
		FROM ipsec_settings
		LIMIT 1
	`

	var settings model.IPSecSettings
	err := s.db.QueryRow(query).Scan(
		&settings.ID, &settings.Enable, &settings.Interface, &settings.ListenPort,
		&settings.IKELifetime, &settings.MobileUsers, &settings.AcceptMobileUsers,
		&settings.UserSource, &settings.GroupSource, &settings.Backend,
		&settings.AutoGenerate, &settings.CustomOptions, &settings.CreatedAt, &settings.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to get IPsec settings: %w", err)
	}

	return &settings, nil
}

func (s *VPNService) UpdateIPSecSettings(settings *model.IPSecSettings) (*model.IPSecSettings, error) {
	query := `
		UPDATE ipsec_settings SET enable = $1, interface = $2, listen_port = $3,
			ike_lifetime = $4, mobile_users = $5, accept_mobile_users = $6,
			user_source = $7, group_source = $8, backend = $9, auto_generate = $10,
			custom_options = $11, updated_at = $12
		WHERE id = $13
	`

	_, err := s.db.Exec(
		query,
		settings.Enable, settings.Interface, settings.ListenPort, settings.IKELifetime,
		settings.MobileUsers, settings.AcceptMobileUsers, settings.UserSource,
		settings.GroupSource, settings.Backend, settings.AutoGenerate,
		settings.CustomOptions, time.Now(), settings.ID,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to update IPsec settings: %w", err)
	}

	return settings, nil
}

func (s *VPNService) GetIPSecPreSharedKeys() ([]model.IPSecPreSharedKey, error) {
	query := `
		SELECT id, identifier, pre_shared_key, description, created_at, updated_at
		FROM ipsec_pre_shared_keys
		ORDER BY identifier
	`

	rows, err := s.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query IPsec pre-shared keys: %w", err)
	}
	defer rows.Close()

	var keys []model.IPSecPreSharedKey
	for rows.Next() {
		var key model.IPSecPreSharedKey
		err := rows.Scan(
			&key.ID, &key.Identifier, &key.PreSharedKey, &key.Description,
			&key.CreatedAt, &key.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan IPsec pre-shared key: %w", err)
		}
		keys = append(keys, key)
	}

	return keys, nil
}

func (s *VPNService) GetIPSecKeyPairs() ([]model.IPSecKeyPair, error) {
	query := `
		SELECT id, type, public_key, private_key, key_size, created_at, updated_at
		FROM ipsec_key_pairs
		ORDER BY created_at DESC
	`

	rows, err := s.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query IPsec key pairs: %w", err)
	}
	defer rows.Close()

	var keyPairs []model.IPSecKeyPair
	for rows.Next() {
		var keyPair model.IPSecKeyPair
		err := rows.Scan(
			&keyPair.ID, &keyPair.Type, &keyPair.PublicKey, &keyPair.PrivateKey,
			&keyPair.KeySize, &keyPair.CreatedAt, &keyPair.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan IPsec key pair: %w", err)
		}
		keyPairs = append(keyPairs, keyPair)
	}

	return keyPairs, nil
}

func (s *VPNService) GetIPSecSAD() ([]model.IPSecSAD, error) {
	query := `
		SELECT id, source, destination, protocol, spi, encryption, auth, state, created_at, updated_at
		FROM ipsec_sad
		ORDER BY created_at DESC
	`

	rows, err := s.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query IPsec SAD: %w", err)
	}
	defer rows.Close()

	var sad []model.IPSecSAD
	for rows.Next() {
		var entry model.IPSecSAD
		err := rows.Scan(
			&entry.ID, &entry.Source, &entry.Destination, &entry.Protocol,
			&entry.SPI, &entry.Encryption, &entry.Auth, &entry.State,
			&entry.CreatedAt, &entry.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan IPsec SAD entry: %w", err)
		}
		sad = append(sad, entry)
	}

	return sad, nil
}

func (s *VPNService) GetIPSecSPD() ([]model.IPSecSPD, error) {
	query := `
		SELECT id, source, destination, protocol, action, priority, created_at, updated_at
		FROM ipsec_spd
		ORDER BY priority ASC
	`

	rows, err := s.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query IPsec SPD: %w", err)
	}
	defer rows.Close()

	var spd []model.IPSecSPD
	for rows.Next() {
		var entry model.IPSecSPD
		err := rows.Scan(
			&entry.ID, &entry.Source, &entry.Destination, &entry.Protocol,
			&entry.Action, &entry.Priority, &entry.CreatedAt, &entry.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan IPsec SPD entry: %w", err)
		}
		spd = append(spd, entry)
	}

	return spd, nil
}

func (s *VPNService) GetIPSecVTI() ([]model.IPSecVTI, error) {
	query := `
		SELECT id, interface, local_address, remote_address, created_at, updated_at
		FROM ipsec_vti
		ORDER BY interface
	`

	rows, err := s.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query IPsec VTI: %w", err)
	}
	defer rows.Close()

	var vti []model.IPSecVTI
	for rows.Next() {
		var entry model.IPSecVTI
		err := rows.Scan(
			&entry.ID, &entry.Interface, &entry.LocalAddress, &entry.RemoteAddress,
			&entry.CreatedAt, &entry.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan IPsec VTI entry: %w", err)
		}
		vti = append(vti, entry)
	}

	return vti, nil
}

func (s *VPNService) GetIPSecLeases() ([]model.IPSecLease, error) {
	query := `
		SELECT id, username, ip_address, connection_id, login_time, last_activity
		FROM ipsec_leases
		ORDER BY login_time DESC
	`

	rows, err := s.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query IPsec leases: %w", err)
	}
	defer rows.Close()

	var leases []model.IPSecLease
	for rows.Next() {
		var lease model.IPSecLease
		err := rows.Scan(
			&lease.ID, &lease.Username, &lease.IPAddress, &lease.ConnectionID,
			&lease.LoginTime, &lease.LastActivity,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan IPsec lease: %w", err)
		}
		leases = append(leases, lease)
	}

	return leases, nil
}

func (s *VPNService) GetIPSecLog() ([]model.VPNLog, error) {
	query := `
		SELECT id, service, level, message, timestamp, instance_id
		FROM vpn_logs
		WHERE service = 'ipsec'
		ORDER BY timestamp DESC
		LIMIT 100
	`

	rows, err := s.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query IPsec logs: %w", err)
	}
	defer rows.Close()

	var logs []model.VPNLog
	for rows.Next() {
		var log model.VPNLog
		err := rows.Scan(&log.ID, &log.Service, &log.Level, &log.Message, &log.Timestamp, &log.InstanceID)
		if err != nil {
			return nil, fmt.Errorf("failed to scan IPsec log: %w", err)
		}
		logs = append(logs, log)
	}

	return logs, nil
}
