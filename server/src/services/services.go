package services

import (
	"context"
	"fmt"
	"log"
	"os/exec"
	"strconv"
	"strings"
	"time"

	"github.com/skygenesisenterprise/aether-shield/server/src/model"
)

type ServicesService struct{}

func NewServicesService() *ServicesService {
	return &ServicesService{}
}

// DHCP Services
func (s *ServicesService) GetDHCPv4Service(ctx context.Context) (*model.DHCPv4Service, error) {
	service := &model.DHCPv4Service{
		Enabled:    false,
		Interface:  "",
		Range:      "",
		LeaseTime:  "",
		Domain:     "",
		DNSServers: []string{},
		Gateway:    "",
		WinServers: []string{},
	}

	// Check if DHCP service is running (isc-dhcp-server or dnsmasq)
	running, err := s.isServiceRunning("isc-dhcp-server")
	if err != nil {
		running, err = s.isServiceRunning("dnsmasq")
	}
	if err == nil {
		service.Enabled = running
	}

	// Try to get DHCP configuration from /etc/dhcp/dhcpd.conf
	if output, err := s.executeCommand("grep", "-E", "^(subnet|option|domain-name|domain-name-servers)", "/etc/dhcp/dhcpd.conf"); err == nil {
		lines := strings.Split(output, "\n")
		for _, line := range lines {
			line = strings.TrimSpace(line)
			if strings.HasPrefix(line, "subnet") {
				// Extract range from subnet declaration
				if parts := strings.Fields(line); len(parts) >= 4 {
					service.Interface = parts[3]
				}
			} else if strings.Contains(line, "range") {
				if parts := strings.Fields(line); len(parts) >= 3 {
					service.Range = parts[1] + "-" + parts[2]
				}
			} else if strings.Contains(line, "default-lease-time") {
				if parts := strings.Fields(line); len(parts) >= 2 {
					service.LeaseTime = parts[1]
				}
			} else if strings.Contains(line, "domain-name") {
				if parts := strings.Fields(line); len(parts) >= 2 {
					service.Domain = strings.Trim(parts[1], `";`)
				}
			} else if strings.Contains(line, "domain-name-servers") {
				if parts := strings.Fields(line); len(parts) >= 2 {
					dnsStr := strings.Trim(strings.Join(parts[1:], " "), `";`)
					service.DNSServers = strings.Split(dnsStr, ",")
					for i, dns := range service.DNSServers {
						service.DNSServers[i] = strings.TrimSpace(dns)
					}
				}
			}
		}
	}

	// Try to get configuration from dnsmasq if dhcpd.conf not found
	if service.Interface == "" {
		if output, err := s.executeCommand("grep", "-E", "^(dhcp-range|interface|server|domain)", "/etc/dnsmasq.conf"); err == nil {
			lines := strings.Split(output, "\n")
			for _, line := range lines {
				line = strings.TrimSpace(line)
				if strings.HasPrefix(line, "dhcp-range") {
					if parts := strings.Fields(line); len(parts) >= 2 {
						service.Range = parts[1]
						if len(parts) >= 3 {
							service.LeaseTime = parts[2]
						}
					}
				} else if strings.HasPrefix(line, "interface") {
					if parts := strings.Fields(line); len(parts) >= 2 {
						service.Interface = parts[1]
					}
				} else if strings.HasPrefix(line, "server") {
					if parts := strings.Fields(line); len(parts) >= 2 {
						service.DNSServers = append(service.DNSServers, parts[1])
					}
				} else if strings.HasPrefix(line, "domain") {
					if parts := strings.Fields(line); len(parts) >= 2 {
						service.Domain = parts[1]
					}
				}
			}
		}
	}

	// Get gateway from route command
	if output, err := s.executeCommand("ip", "route", "show", "default"); err == nil {
		if fields := strings.Fields(output); len(fields) >= 3 {
			service.Gateway = fields[2]
		}
	}

	return service, nil
}

func (s *ServicesService) GetDHCPv4Leases(ctx context.Context) ([]model.DHCPv4Lease, error) {
	var leases []model.DHCPv4Lease

	// Try to read from dhcpd.leases file
	if output, err := s.executeCommand("cat", "/var/lib/dhcp/dhcpd.leases"); err == nil {
		lines := strings.Split(output, "\n")
		var currentLease *model.DHCPv4Lease

		for _, line := range lines {
			line = strings.TrimSpace(line)
			if strings.HasPrefix(line, "lease") {
				if currentLease != nil {
					leases = append(leases, *currentLease)
				}
				if parts := strings.Fields(line); len(parts) >= 2 {
					ip := strings.Trim(parts[1], "{")
					currentLease = &model.DHCPv4Lease{
						IP:    ip,
						Type:  "dynamic",
						State: "active",
					}
				}
			} else if currentLease != nil {
				if strings.Contains(line, "hardware ethernet") {
					if parts := strings.Fields(line); len(parts) >= 3 {
						currentLease.MAC = strings.Trim(parts[2], ";")
					}
				} else if strings.Contains(line, "client-hostname") {
					if parts := strings.Fields(line); len(parts) >= 2 {
						currentLease.Hostname = strings.Trim(parts[1], `";`)
					}
				} else if strings.Contains(line, "ends") {
					if parts := strings.Fields(line); len(parts) >= 3 {
						if timestamp, err := time.Parse("2006/01/02 15:04:05", parts[2]+" "+parts[3]); err == nil {
							currentLease.Expires = timestamp
							if time.Now().After(timestamp) {
								currentLease.State = "expired"
							}
						}
					}
				}
			}
		}
		if currentLease != nil {
			leases = append(leases, *currentLease)
		}
	}

	// Try dnsmasq lease file if dhcpd.leases not found
	if len(leases) == 0 {
		if output, err := s.executeCommand("cat", "/var/lib/misc/dnsmasq.leases"); err == nil {
			lines := strings.Split(output, "\n")
			for _, line := range lines {
				line = strings.TrimSpace(line)
				if line != "" {
					parts := strings.Fields(line)
					if len(parts) >= 4 {
						expireTime, _ := strconv.ParseInt(parts[0], 10, 64)
						mac := parts[1]
						ip := parts[2]
						hostname := parts[3]

						state := "active"
						if expireTime > 0 && time.Now().After(time.Unix(expireTime, 0)) {
							state = "expired"
						}

						lease := model.DHCPv4Lease{
							IP:       ip,
							MAC:      mac,
							Hostname: hostname,
							Expires:  time.Unix(expireTime, 0),
							Type:     "dynamic",
							State:    state,
						}
						leases = append(leases, lease)
					}
				}
			}
		}
	}

	// Fallback to ARP table if no lease files found
	if len(leases) == 0 {
		if output, err := s.executeCommand("arp", "-n"); err == nil {
			lines := strings.Split(output, "\n")
			for _, line := range lines {
				line = strings.TrimSpace(line)
				if strings.Contains(line, "ether") && !strings.HasPrefix(line, "Address") {
					parts := strings.Fields(line)
					if len(parts) >= 3 {
						ip := parts[0]
						mac := parts[2]

						lease := model.DHCPv4Lease{
							IP:       ip,
							MAC:      mac,
							Hostname: "",
							Expires:  time.Now().Add(24 * time.Hour),
							Type:     "dynamic",
							State:    "active",
						}
						leases = append(leases, lease)
					}
				}
			}
		}
	}

	return leases, nil
}

func (s *ServicesService) GetDHCPv6Leases(ctx context.Context) ([]model.DHCPv6Lease, error) {
	var leases []model.DHCPv6Lease

	// Try to read from dhcpd6.leases file
	if output, err := s.executeCommand("cat", "/var/lib/dhcp/dhcpd6.leases"); err == nil {
		lines := strings.Split(output, "\n")
		var currentLease *model.DHCPv6Lease

		for _, line := range lines {
			line = strings.TrimSpace(line)
			if strings.HasPrefix(line, "ia-na") || strings.HasPrefix(line, "ia-ta") || strings.HasPrefix(line, "ia-pd") {
				if currentLease != nil {
					leases = append(leases, *currentLease)
				}
				currentLease = &model.DHCPv6Lease{
					Type:  "dynamic",
					State: "active",
				}
			} else if currentLease != nil {
				if strings.Contains(line, "iaaddr") {
					if parts := strings.Fields(line); len(parts) >= 2 {
						currentLease.IPv6 = strings.Trim(parts[1], ";")
					}
				} else if strings.Contains(line, "hardware ethernet") {
					if parts := strings.Fields(line); len(parts) >= 3 {
						currentLease.MAC = strings.Trim(parts[2], ";")
					}
				} else if strings.Contains(line, "client-hostname") {
					if parts := strings.Fields(line); len(parts) >= 2 {
						currentLease.Hostname = strings.Trim(parts[1], `";`)
					}
				} else if strings.Contains(line, "ends") {
					if parts := strings.Fields(line); len(parts) >= 3 {
						if timestamp, err := time.Parse("2006/01/02 15:04:05", parts[2]+" "+parts[3]); err == nil {
							currentLease.Expires = timestamp
							if time.Now().After(timestamp) {
								currentLease.State = "expired"
							}
						}
					}
				}
			}
		}
		if currentLease != nil {
			leases = append(leases, *currentLease)
		}
	}

	// Try radvd lease file if dhcpd6.leases not found
	if len(leases) == 0 {
		if output, err := s.executeCommand("cat", "/var/lib/radvd/radvd.leases"); err == nil {
			lines := strings.Split(output, "\n")
			for _, line := range lines {
				line = strings.TrimSpace(line)
				if line != "" {
					parts := strings.Fields(line)
					if len(parts) >= 3 {
						ipv6 := parts[0]
						mac := parts[1]
						hostname := parts[2]

						lease := model.DHCPv6Lease{
							IPv6:     ipv6,
							MAC:      mac,
							Hostname: hostname,
							Expires:  time.Now().Add(24 * time.Hour),
							Type:     "dynamic",
							State:    "active",
						}
						leases = append(leases, lease)
					}
				}
			}
		}
	}

	// Fallback to IPv6 neighbor table
	if len(leases) == 0 {
		if output, err := s.executeCommand("ip", "-6", "neighbor"); err == nil {
			lines := strings.Split(output, "\n")
			for _, line := range lines {
				line = strings.TrimSpace(line)
				if strings.Contains(line, "lladdr") && !strings.HasPrefix(line, "Destination") {
					parts := strings.Fields(line)
					if len(parts) >= 5 {
						ipv6 := parts[0]
						mac := parts[4]

						lease := model.DHCPv6Lease{
							IPv6:     ipv6,
							MAC:      mac,
							Hostname: "",
							Expires:  time.Now().Add(24 * time.Hour),
							Type:     "dynamic",
							State:    "active",
						}
						leases = append(leases, lease)
					}
				}
			}
		}
	}

	return leases, nil
}

func (s *ServicesService) GetDHCPv4StaticMappings(ctx context.Context) ([]model.DHCPv4Static, error) {
	var mappings []model.DHCPv4Static

	// Try to read static mappings from dhcpd.conf
	if output, err := s.executeCommand("grep", "-A", "5", "host", "/etc/dhcp/dhcpd.conf"); err == nil {
		lines := strings.Split(output, "\n")
		var currentHost *model.DHCPv4Static

		for _, line := range lines {
			line = strings.TrimSpace(line)
			if strings.HasPrefix(line, "host") {
				if currentHost != nil {
					mappings = append(mappings, *currentHost)
				}
				if parts := strings.Fields(line); len(parts) >= 2 {
					hostname := strings.Trim(parts[1], "{")
					currentHost = &model.DHCPv4Static{
						Hostname: hostname,
					}
				}
			} else if currentHost != nil {
				if strings.Contains(line, "hardware ethernet") {
					if parts := strings.Fields(line); len(parts) >= 3 {
						currentHost.MAC = strings.Trim(parts[2], ";")
					}
				} else if strings.Contains(line, "fixed-address") {
					if parts := strings.Fields(line); len(parts) >= 2 {
						currentHost.IP = strings.Trim(parts[1], ";")
					}
				} else if strings.Contains(line, "#") || strings.Contains(line, "description") {
					if parts := strings.Split(line, "#"); len(parts) > 1 {
						currentHost.Description = strings.TrimSpace(parts[1])
					}
				}
			}
		}
		if currentHost != nil {
			mappings = append(mappings, *currentHost)
		}
	}

	// Try dnsmasq.conf for static mappings
	if len(mappings) == 0 {
		if output, err := s.executeCommand("grep", "dhcp-host", "/etc/dnsmasq.conf"); err == nil {
			lines := strings.Split(output, "\n")
			for _, line := range lines {
				line = strings.TrimSpace(line)
				if strings.HasPrefix(line, "dhcp-host") {
					if parts := strings.Fields(line); len(parts) >= 2 {
						config := strings.Trim(strings.Join(parts[1:], " "), "#")
						configParts := strings.Split(config, ",")

						mapping := model.DHCPv4Static{}
						for i, part := range configParts {
							part = strings.TrimSpace(part)
							if i == 0 && strings.Contains(part, ":") {
								mapping.MAC = part
							} else if i == 0 && !strings.Contains(part, ":") {
								mapping.IP = part
							} else if i == 1 && strings.Contains(part, ":") {
								mapping.MAC = part
							} else if i == 1 && !strings.Contains(part, ":") {
								mapping.IP = part
							} else if i == 2 {
								mapping.Hostname = part
							} else if i == 3 {
								mapping.Description = part
							}
						}
						if mapping.MAC != "" || mapping.IP != "" {
							mappings = append(mappings, mapping)
						}
					}
				}
			}
		}
	}

	return mappings, nil
}

func (s *ServicesService) CreateDHCPv4StaticMapping(ctx context.Context, mapping model.DHCPv4Static) error {
	// Read current configuration
	config, err := s.executeCommand("cat", "/etc/dhcp/dhcpd.conf")
	if err != nil {
		return fmt.Errorf("failed to read DHCP configuration: %v", err)
	}

	// Create new host entry
	newEntry := fmt.Sprintf(`
host %s {
    hardware ethernet %s;
    fixed-address %s;
    # %s
}`, mapping.Hostname, mapping.MAC, mapping.IP, mapping.Description)

	// Append to configuration
	updatedConfig := config + newEntry

	// Write back to file
	if _, err := s.executeCommand("sh", "-c", "echo '"+updatedConfig+"' > /etc/dhcp/dhcpd.conf"); err != nil {
		return fmt.Errorf("failed to write DHCP configuration: %v", err)
	}

	// Restart DHCP service
	return s.RestartService(ctx, "isc-dhcp-server")
}

func (s *ServicesService) UpdateDHCPv4StaticMapping(ctx context.Context, id string, mapping model.DHCPv4Static) error {
	// Read current configuration
	config, err := s.executeCommand("cat", "/etc/dhcp/dhcpd.conf")
	if err != nil {
		return fmt.Errorf("failed to read DHCP configuration: %v", err)
	}

	// Find and replace the existing host entry
	lines := strings.Split(config, "\n")
	var updatedLines []string
	inHostBlock := false
	hostFound := false

	for _, line := range lines {
		trimmedLine := strings.TrimSpace(line)

		if strings.HasPrefix(trimmedLine, "host") && strings.Contains(trimmedLine, id) {
			// Found the host block to update
			inHostBlock = true
			hostFound = true
			// Add the new host entry
			updatedLines = append(updatedLines, fmt.Sprintf("host %s {", mapping.Hostname))
			updatedLines = append(updatedLines, fmt.Sprintf("    hardware ethernet %s;", mapping.MAC))
			updatedLines = append(updatedLines, fmt.Sprintf("    fixed-address %s;", mapping.IP))
			if mapping.Description != "" {
				updatedLines = append(updatedLines, fmt.Sprintf("    # %s", mapping.Description))
			}
			updatedLines = append(updatedLines, "}")
		} else if inHostBlock && strings.Contains(trimmedLine, "}") {
			// End of host block, skip the old entry
			inHostBlock = false
		} else if !inHostBlock {
			// Keep lines that are not part of the host block being replaced
			updatedLines = append(updatedLines, line)
		}
	}

	if !hostFound {
		return fmt.Errorf("host entry with ID %s not found", id)
	}

	// Write updated configuration back
	updatedConfig := strings.Join(updatedLines, "\n")
	if _, err := s.executeCommand("sh", "-c", "echo '"+updatedConfig+"' > /etc/dhcp/dhcpd.conf"); err != nil {
		return fmt.Errorf("failed to write DHCP configuration: %v", err)
	}

	// Restart DHCP service
	return s.RestartService(ctx, "isc-dhcp-server")
}

func (s *ServicesService) DeleteDHCPv4StaticMapping(ctx context.Context, id string) error {
	// Read current configuration
	config, err := s.executeCommand("cat", "/etc/dhcp/dhcpd.conf")
	if err != nil {
		return fmt.Errorf("failed to read DHCP configuration: %v", err)
	}

	// Find and remove the host entry
	lines := strings.Split(config, "\n")
	var updatedLines []string
	inHostBlock := false
	hostFound := false

	for _, line := range lines {
		trimmedLine := strings.TrimSpace(line)

		if strings.HasPrefix(trimmedLine, "host") && strings.Contains(trimmedLine, id) {
			// Found the host block to delete
			inHostBlock = true
			hostFound = true
		} else if inHostBlock && strings.Contains(trimmedLine, "}") {
			// End of host block, skip the entry
			inHostBlock = false
		} else if !inHostBlock {
			// Keep lines that are not part of the host block being deleted
			updatedLines = append(updatedLines, line)
		}
	}

	if !hostFound {
		return fmt.Errorf("host entry with ID %s not found", id)
	}

	// Write updated configuration back
	updatedConfig := strings.Join(updatedLines, "\n")
	if _, err := s.executeCommand("sh", "-c", "echo '"+updatedConfig+"' > /etc/dhcp/dhcpd.conf"); err != nil {
		return fmt.Errorf("failed to write DHCP configuration: %v", err)
	}

	// Restart DHCP service
	return s.RestartService(ctx, "isc-dhcp-server")
}

func (s *ServicesService) GetDHCPRelayConfigs(ctx context.Context) ([]model.DHCPRelayConfig, error) {
	var configs []model.DHCPRelayConfig

	// Try to read from /etc/dhcp/dhcrelay.conf
	if output, err := s.executeCommand("cat", "/etc/dhcp/dhcrelay.conf"); err == nil {
		lines := strings.Split(output, "\n")
		for _, line := range lines {
			line = strings.TrimSpace(line)
			if strings.HasPrefix(line, "#") || line == "" {
				continue
			}

			if strings.Contains(line, "dhcrelay") {
				// Parse dhcrelay command line options
				parts := strings.Fields(line)
				var servers []string
				var interfaces []string

				for i, part := range parts {
					if part == "-i" && i+1 < len(parts) {
						interfaces = append(interfaces, parts[i+1])
					} else if strings.Contains(part, ".") && !strings.HasPrefix(part, "-") {
						servers = append(servers, part)
					}
				}

				for _, server := range servers {
					for _, iface := range interfaces {
						configs = append(configs, model.DHCPRelayConfig{
							Interface: iface,
							Server:    server,
							Enabled:   true,
						})
					}
				}
			}
		}
	}

	// Try to read from /etc/default/isc-dhcp-relay
	if len(configs) == 0 {
		if output, err := s.executeCommand("cat", "/etc/default/isc-dhcp-relay"); err == nil {
			lines := strings.Split(output, "\n")
			var servers []string
			var interfaces []string

			for _, line := range lines {
				line = strings.TrimSpace(line)
				if strings.HasPrefix(line, "SERVERS=") {
					serversStr := strings.Trim(line[8:], `"`)
					servers = strings.Fields(serversStr)
				} else if strings.HasPrefix(line, "INTERFACES=") {
					interfacesStr := strings.Trim(line[12:], `"`)
					interfaces = strings.Fields(interfacesStr)
				}
			}

			for _, server := range servers {
				for _, iface := range interfaces {
					configs = append(configs, model.DHCPRelayConfig{
						Interface: iface,
						Server:    server,
						Enabled:   true,
					})
				}
			}
		}
	}

	// Check if dhcrelay service is running
	running, err := s.isServiceRunning("isc-dhcp-relay")
	if err == nil {
		for i := range configs {
			configs[i].Enabled = running
		}
	}

	return configs, nil
}

// DNS Services
func (s *ServicesService) GetUnboundStatistics(ctx context.Context) (*model.UnboundStatistics, error) {
	stats := &model.UnboundStatistics{
		Queries:     0,
		CacheHits:   0,
		CacheMisses: 0,
		Blocked:     0,
		Uptime:      "",
		MemoryUsage: "",
		CacheSize:   "",
		Threads:     0,
	}

	// Try to get statistics from unbound-control
	if output, err := s.executeCommand("unbound-control", "stats"); err == nil {
		lines := strings.Split(output, "\n")
		for _, line := range lines {
			line = strings.TrimSpace(line)
			if strings.Contains(line, "total.num.queries") {
				if parts := strings.Fields(line); len(parts) >= 2 {
					if queries, err := strconv.ParseInt(parts[1], 10, 64); err == nil {
						stats.Queries = queries
					}
				}
			} else if strings.Contains(line, "total.num.cachehits") {
				if parts := strings.Fields(line); len(parts) >= 2 {
					if hits, err := strconv.ParseInt(parts[1], 10, 64); err == nil {
						stats.CacheHits = hits
					}
				}
			} else if strings.Contains(line, "total.num.cachemiss") {
				if parts := strings.Fields(line); len(parts) >= 2 {
					if misses, err := strconv.ParseInt(parts[1], 10, 64); err == nil {
						stats.CacheMisses = misses
					}
				}
			}
		}
		stats.Blocked = stats.Queries - stats.CacheHits - stats.CacheMisses
	}

	// Get memory usage from unbound process
	if pid, err := s.getServicePID("unbound"); err == nil && pid > 0 {
		if memory, err := s.getServiceMemoryUsage(pid); err == nil {
			stats.MemoryUsage = memory
		}
	}

	// Get uptime from systemd
	if output, err := s.executeCommand("systemctl", "show", "unbound", "--property=ActiveUptime"); err == nil {
		if parts := strings.Split(output, "="); len(parts) >= 2 {
			stats.Uptime = strings.TrimSpace(parts[1])
		}
	}

	// Get thread count from process
	if pid, err := s.getServicePID("unbound"); err == nil && pid > 0 {
		if output, err := s.executeCommand("ps", "-p", strconv.Itoa(pid), "-o", "nlwp="); err == nil {
			if threads, err := strconv.Atoi(strings.TrimSpace(output)); err == nil {
				stats.Threads = threads
			}
		}
	}

	// Get cache size from unbound-control
	if output, err := s.executeCommand("unbound-control", "list_stubs"); err == nil {
		// Estimate cache size based on response
		stats.CacheSize = fmt.Sprintf("%dKB", len(output)/1024)
	}

	return stats, nil
}

func (s *ServicesService) GetUnboundBlocklist(ctx context.Context) (*model.UnboundBlocklist, error) {
	blocklist := &model.UnboundBlocklist{
		Enabled:      false,
		Sources:      []string{},
		TotalBlocked: 0,
		LastUpdate:   time.Time{},
		Whitelist:    []string{},
	}

	// Check if unbound is running
	if running, err := s.isServiceRunning("unbound"); err == nil {
		blocklist.Enabled = running
	}

	// Read unbound configuration for blocklist settings
	if output, err := s.executeCommand("cat", "/etc/unbound/unbound.conf"); err == nil {
		lines := strings.Split(output, "\n")
		inBlocklistZone := false

		for _, line := range lines {
			line = strings.TrimSpace(line)

			if strings.Contains(line, "name: \"adblock.\"") || strings.Contains(line, "name: \"block.\"") {
				inBlocklistZone = true
				blocklist.Sources = append(blocklist.Sources, "adblock")
			} else if strings.Contains(line, "include:") && inBlocklistZone {
				if parts := strings.Fields(line); len(parts) >= 2 {
					includeFile := strings.Trim(parts[1], `"`)
					if strings.Contains(includeFile, "blocked") || strings.Contains(includeFile, "blacklist") {
						blocklist.Sources = append(blocklist.Sources, includeFile)
					}
				}
			} else if strings.Contains(line, "}") {
				inBlocklistZone = false
			}
		}
	}

	// Try to get blocklist statistics from unbound-control
	if output, err := s.executeCommand("unbound-control", "stats"); err == nil {
		lines := strings.Split(output, "\n")
		for _, line := range lines {
			line = strings.TrimSpace(line)
			if strings.Contains(line, "num.query.type.blocked") {
				if parts := strings.Fields(line); len(parts) >= 2 {
					if blocked, err := strconv.ParseInt(parts[1], 10, 64); err == nil {
						blocklist.TotalBlocked = blocked
					}
				}
			}
		}
	}

	// Get whitelist entries
	if output, err := s.executeCommand("grep", "-r", "private-domain", "/etc/unbound/"); err == nil {
		lines := strings.Split(output, "\n")
		for _, line := range lines {
			line = strings.TrimSpace(line)
			if strings.Contains(line, "private-domain") {
				if parts := strings.Fields(line); len(parts) >= 2 {
					domain := strings.Trim(parts[1], `"`)
					blocklist.Whitelist = append(blocklist.Whitelist, domain)
				}
			}
		}
	}

	// Get last update time from blocklist files
	if len(blocklist.Sources) > 0 {
		for _, source := range blocklist.Sources {
			if strings.Contains(source, ".") {
				if output, err := s.executeCommand("stat", "-c", "%Y", source); err == nil {
					if timestamp, err := strconv.ParseInt(strings.TrimSpace(output), 10, 64); err == nil {
						updateTime := time.Unix(timestamp, 0)
						if updateTime.After(blocklist.LastUpdate) {
							blocklist.LastUpdate = updateTime
						}
					}
				}
			}
		}
	}

	// If no last update found, use current time
	if blocklist.LastUpdate.IsZero() && blocklist.Enabled {
		blocklist.LastUpdate = time.Now()
	}

	return blocklist, nil
}

func (s *ServicesService) GetUnboundSettings(ctx context.Context) (*model.UnboundSettings, error) {
	settings := &model.UnboundSettings{
		Enabled:        false,
		ListenPort:     53,
		Interfaces:     []string{},
		ForwardServers: []string{},
		CacheSize:      256,
		MaxTTL:         86400,
		MinTTL:         60,
		HardenGlue:     false,
		HardenDNSSEC:   false,
		PrivateDomains: []string{},
	}

	// Check if unbound is running
	if running, err := s.isServiceRunning("unbound"); err == nil {
		settings.Enabled = running
	}

	// Read configuration from /etc/unbound/unbound.conf
	if output, err := s.executeCommand("cat", "/etc/unbound/unbound.conf"); err == nil {
		lines := strings.Split(output, "\n")
		for _, line := range lines {
			line = strings.TrimSpace(line)
			if strings.HasPrefix(line, "port:") {
				if parts := strings.Fields(line); len(parts) >= 2 {
					if port, err := strconv.Atoi(parts[1]); err == nil {
						settings.ListenPort = port
					}
				}
			} else if strings.HasPrefix(line, "interface:") {
				if parts := strings.Fields(line); len(parts) >= 2 {
					settings.Interfaces = append(settings.Interfaces, parts[1])
				}
			} else if strings.HasPrefix(line, "forward-zone:") {
				// Look for forward servers in the next lines
				continue
			} else if strings.Contains(line, "forward-addr:") {
				if parts := strings.Fields(line); len(parts) >= 2 {
					addr := strings.Trim(parts[1], "@")
					settings.ForwardServers = append(settings.ForwardServers, addr)
				}
			} else if strings.HasPrefix(line, "msg-cache-size:") {
				if parts := strings.Fields(line); len(parts) >= 2 {
					if size, err := strconv.Atoi(parts[1]); err == nil {
						settings.CacheSize = size / (1024 * 1024) // Convert to MB
					}
				}
			} else if strings.HasPrefix(line, "cache-max-ttl:") {
				if parts := strings.Fields(line); len(parts) >= 2 {
					if ttl, err := strconv.Atoi(parts[1]); err == nil {
						settings.MaxTTL = ttl
					}
				}
			} else if strings.HasPrefix(line, "cache-min-ttl:") {
				if parts := strings.Fields(line); len(parts) >= 2 {
					if ttl, err := strconv.Atoi(parts[1]); err == nil {
						settings.MinTTL = ttl
					}
				}
			} else if strings.HasPrefix(line, "harden-glue:") {
				if parts := strings.Fields(line); len(parts) >= 2 {
					settings.HardenGlue = parts[1] == "yes"
				}
			} else if strings.HasPrefix(line, "harden-dnssec-stripped:") {
				if parts := strings.Fields(line); len(parts) >= 2 {
					settings.HardenDNSSEC = parts[1] == "yes"
				}
			} else if strings.HasPrefix(line, "private-domain:") {
				if parts := strings.Fields(line); len(parts) >= 2 {
					domain := strings.Trim(parts[1], `"`)
					settings.PrivateDomains = append(settings.PrivateDomains, domain)
				}
			}
		}
	}

	return settings, nil
}

func (s *ServicesService) UpdateUnboundSettings(ctx context.Context, settings model.UnboundSettings) error {
	// Backup current configuration
	if _, err := s.executeCommand("cp", "/etc/dhcp/dhcpd.conf", "/etc/dhcp/dhcpd.conf.bak"); err != nil {
		return fmt.Errorf("failed to backup configuration: %v", err)
	}

	// Generate new configuration
	config := `server:
	port: ` + strconv.Itoa(settings.ListenPort) + `
`

	for _, iface := range settings.Interfaces {
		config += `	interface: ` + iface + "\n"
	}

	config += `	msg-cache-size: ` + strconv.Itoa(settings.CacheSize*1024*1024) + `
	cache-max-ttl: ` + strconv.Itoa(settings.MaxTTL) + `
	cache-min-ttl: ` + strconv.Itoa(settings.MinTTL) + `
	harden-glue: ` + map[bool]string{true: "yes", false: "no"}[settings.HardenGlue] + `
	harden-dnssec-stripped: ` + map[bool]string{true: "yes", false: "no"}[settings.HardenDNSSEC] + `
`

	for _, domain := range settings.PrivateDomains {
		config += `	private-domain: "` + domain + `"` + "\n"
	}

	// Add forward zones if specified
	if len(settings.ForwardServers) > 0 {
		config += `forward-zone:
	name: "."
`
		for _, server := range settings.ForwardServers {
			config += `	forward-addr: ` + server + "\n"
		}
	}

	// Write new configuration
	if _, err := s.executeCommand("sh", "-c", "echo '"+config+"' > /etc/unbound/unbound.conf"); err != nil {
		return fmt.Errorf("failed to write configuration: %v", err)
	}

	// Test configuration
	if _, err := s.executeCommand("unbound-checkconf", "/etc/unbound/unbound.conf"); err != nil {
		// Restore backup if test fails
		s.executeCommand("mv", "/etc/unbound/unbound.conf.bak", "/etc/unbound/unbound.conf")
		return fmt.Errorf("configuration test failed: %v", err)
	}

	// Restart unbound to apply changes
	return s.RestartService(ctx, "unbound")
}

func (s *ServicesService) GetOpenDNSConfig(ctx context.Context) (*model.OpenDNSConfig, error) {
	config := &model.OpenDNSConfig{
		Enabled:     false,
		Server:      "208.67.222.222",
		Backup:      "208.67.220.220",
		FilterLevel: "none",
	}

	// Check if OpenDNS servers are configured in resolv.conf
	if output, err := s.executeCommand("cat", "/etc/resolv.conf"); err == nil {
		lines := strings.Split(output, "\n")
		for _, line := range lines {
			line = strings.TrimSpace(line)
			if strings.HasPrefix(line, "nameserver") {
				if parts := strings.Fields(line); len(parts) >= 2 {
					if parts[1] == "208.67.222.222" || parts[1] == "208.67.220.220" {
						config.Enabled = true
					}
				}
			}
		}
	}

	// Check dnsmasq configuration for OpenDNS
	if output, err := s.executeCommand("cat", "/etc/dnsmasq.conf"); err == nil {
		lines := strings.Split(output, "\n")
		for _, line := range lines {
			line = strings.TrimSpace(line)
			if strings.HasPrefix(line, "server") {
				if parts := strings.Fields(line); len(parts) >= 2 {
					if parts[1] == "208.67.222.222" || parts[1] == "208.67.220.220" {
						config.Enabled = true
					}
				}
			}
		}
	}

	// Check unbound configuration for OpenDNS forwarders
	if output, err := s.executeCommand("cat", "/etc/unbound/unbound.conf"); err == nil {
		lines := strings.Split(output, "\n")
		for _, line := range lines {
			line = strings.TrimSpace(line)
			if strings.Contains(line, "forward-addr") {
				if parts := strings.Fields(line); len(parts) >= 2 {
					addr := strings.Trim(parts[1], "@")
					if addr == "208.67.222.222" || addr == "208.67.220.220" {
						config.Enabled = true
					}
				}
			}
		}
	}

	// Try to determine filter level by checking network configuration
	// This is a simplified approach - actual filter level would require API access
	if config.Enabled {
		// Check for any content filtering configurations
		if output, err := s.executeCommand("grep", "-r", "opendns", "/etc/"); err == nil {
			if strings.Contains(strings.ToLower(output), "family") {
				config.FilterLevel = "high"
			} else if strings.Contains(strings.ToLower(output), "moderate") {
				config.FilterLevel = "moderate"
			} else if strings.Contains(strings.ToLower(output), "low") {
				config.FilterLevel = "low"
			}
		}
	}

	return config, nil
}

// Monitoring Services
func (s *ServicesService) GetMonitStatus(ctx context.Context) (*model.ServiceStatus, error) {
	status := &model.ServiceStatus{
		Service:   "monit",
		Running:   false,
		PID:       0,
		Uptime:    "",
		Memory:    "",
		CPU:       "",
		Enabled:   false,
		AutoStart: false,
	}

	// Check if monit is running
	running, err := s.isServiceRunning("monit")
	if err == nil {
		status.Running = running
	}

	// Get PID
	if pid, err := s.getServicePID("monit"); err == nil {
		status.PID = pid

		// Get memory usage if PID is available
		if memory, err := s.getServiceMemoryUsage(pid); err == nil {
			status.Memory = memory
		}

		// Get uptime from process start time
		if pid > 0 {
			if output, err := s.executeCommand("ps", "-p", strconv.Itoa(pid), "-o", "etime="); err == nil {
				status.Uptime = strings.TrimSpace(output)
			}

			// Get CPU usage
			if output, err := s.executeCommand("ps", "-p", strconv.Itoa(pid), "-o", "%cpu="); err == nil {
				status.CPU = strings.TrimSpace(output) + "%"
			}
		}
	}

	// Check if monit is enabled
	if output, err := s.executeCommand("systemctl", "is-enabled", "monit"); err == nil {
		status.Enabled = strings.TrimSpace(output) == "enabled"
		status.AutoStart = status.Enabled
	}

	// Try to get monit summary status
	if status.Running {
		if output, err := s.executeCommand("monit", "summary"); err == nil {
			lines := strings.Split(output, "\n")
			for _, line := range lines {
				line = strings.TrimSpace(line)
				if strings.Contains(line, "monit") && strings.Contains(line, "Status") {
					if strings.Contains(line, "running") {
						status.Running = true
					} else if strings.Contains(line, "not") {
						status.Running = false
					}
				}
			}
		}
	}

	return status, nil
}

func (s *ServicesService) GetMonitSettings(ctx context.Context) (*model.MonitSettings, error) {
	settings := &model.MonitSettings{
		Enabled:         false,
		CheckInterval:   120,
		EmailAlerts:     false,
		EmailRecipients: []string{},
		LogFile:         "/var/log/monit.log",
		HTTPPort:        2812,
		AllowIPs:        []string{"127.0.0.1"},
	}

	// Check if monit is running
	if running, err := s.isServiceRunning("monit"); err == nil {
		settings.Enabled = running
	}

	// Read monit configuration
	if output, err := s.executeCommand("cat", "/etc/monit/monitrc"); err == nil {
		lines := strings.Split(output, "\n")
		for _, line := range lines {
			line = strings.TrimSpace(line)
			if strings.HasPrefix(line, "#") || line == "" {
				continue
			}

			if strings.HasPrefix(line, "set daemon") {
				if parts := strings.Fields(line); len(parts) >= 3 {
					if interval, err := strconv.Atoi(parts[2]); err == nil {
						settings.CheckInterval = interval
					}
				}
			} else if strings.Contains(line, "set mailserver") {
				settings.EmailAlerts = true
			} else if strings.Contains(line, "set alert") {
				if parts := strings.Fields(line); len(parts) >= 3 {
					email := parts[2]
					settings.EmailRecipients = append(settings.EmailRecipients, email)
				}
			} else if strings.Contains(line, "set logfile") {
				if parts := strings.Fields(line); len(parts) >= 2 {
					settings.LogFile = strings.Trim(parts[1], `"`)
				}
			} else if strings.Contains(line, "set httpd port") {
				if parts := strings.Fields(line); len(parts) >= 4 {
					if port, err := strconv.Atoi(parts[3]); err == nil {
						settings.HTTPPort = port
					}
				}
			} else if strings.Contains(line, "allow") {
				if parts := strings.Fields(line); len(parts) >= 2 {
					ip := parts[1]
					if ip != "localhost" && ip != "127.0.0.1" {
						settings.AllowIPs = append(settings.AllowIPs, ip)
					}
				}
			}
		}
	}

	// Try to get settings from monit status
	if settings.Enabled {
		if output, err := s.executeCommand("monit", "status"); err == nil {
			lines := strings.Split(output, "\n")
			for _, line := range lines {
				line = strings.TrimSpace(line)
				if strings.Contains(line, "check interval") {
					if parts := strings.Fields(line); len(parts) >= 3 {
						if interval, err := strconv.Atoi(parts[2]); err == nil {
							settings.CheckInterval = interval
						}
					}
				}
			}
		}
	}

	return settings, nil
}

func (s *ServicesService) UpdateMonitSettings(ctx context.Context, settings model.MonitSettings) error {
	// Backup current configuration
	_, err := s.executeCommand("cp", "/etc/monit/monitrc", "/etc/monit/monitrc.bak")
	if err != nil {
		return fmt.Errorf("failed to backup monit configuration: %v", err)
	}

	// Read current configuration
	config, err := s.executeCommand("cat", "/etc/monit/monitrc")
	if err != nil {
		return fmt.Errorf("failed to read monit configuration: %v", err)
	}

	// Update configuration
	lines := strings.Split(config, "\n")
	var updatedLines []string

	for _, line := range lines {
		trimmedLine := strings.TrimSpace(line)

		if strings.HasPrefix(trimmedLine, "set daemon") {
			updatedLines = append(updatedLines, fmt.Sprintf("set daemon %d", settings.CheckInterval))
		} else if strings.HasPrefix(trimmedLine, "set logfile") {
			updatedLines = append(updatedLines, fmt.Sprintf("set logfile %s", settings.LogFile))
		} else if strings.Contains(trimmedLine, "set httpd port") {
			updatedLines = append(updatedLines, fmt.Sprintf("set httpd port %d", settings.HTTPPort))
		} else if strings.HasPrefix(trimmedLine, "allow") && !strings.Contains(trimmedLine, "admin:") {
			// Skip old allow lines, will add new ones
			continue
		} else if strings.Contains(trimmedLine, "set alert") {
			// Skip old alert lines, will add new ones
			continue
		} else {
			updatedLines = append(updatedLines, line)
		}
	}

	// Add new email recipients if alerts are enabled
	if settings.EmailAlerts && len(settings.EmailRecipients) > 0 {
		for _, recipient := range settings.EmailRecipients {
			updatedLines = append(updatedLines, fmt.Sprintf("set alert %s", recipient))
		}
	}

	// Add new allow IPs
	for _, ip := range settings.AllowIPs {
		updatedLines = append(updatedLines, fmt.Sprintf("    allow %s", ip))
	}

	// Write updated configuration
	updatedConfig := strings.Join(updatedLines, "\n")
	if _, err := s.executeCommand("sh", "-c", "echo '"+updatedConfig+"' > /etc/monit/monitrc"); err != nil {
		// Restore backup on error
		s.executeCommand("mv", "/etc/monit/monitrc.bak", "/etc/monit/monitrc")
		return fmt.Errorf("failed to write monit configuration: %v", err)
	}

	// Test configuration
	if _, err := s.executeCommand("monit", "-t"); err != nil {
		// Restore backup if test fails
		s.executeCommand("mv", "/etc/monit/monitrc.bak", "/etc/monit/monitrc")
		return fmt.Errorf("monit configuration test failed: %v", err)
	}

	// Restart monit to apply changes
	return s.RestartService(ctx, "monit")
}

// Network Services
func (s *ServicesService) GetNetworkStatus(ctx context.Context) (*model.NetworkStatus, error) {
	status := &model.NetworkStatus{
		Gateway:       "",
		DNS:           []string{},
		Internet:      false,
		Latency:       "",
		DownloadSpeed: "",
		UploadSpeed:   "",
		ExternalIP:    "",
		IPv6:          false,
	}

	// Get gateway
	if output, err := s.executeCommand("ip", "route", "show", "default"); err == nil {
		if fields := strings.Fields(output); len(fields) >= 3 {
			status.Gateway = fields[2]
		}
	}

	// Get DNS servers from /etc/resolv.conf
	if output, err := s.executeCommand("cat", "/etc/resolv.conf"); err == nil {
		lines := strings.Split(output, "\n")
		for _, line := range lines {
			line = strings.TrimSpace(line)
			if strings.HasPrefix(line, "nameserver") {
				if parts := strings.Fields(line); len(parts) >= 2 {
					status.DNS = append(status.DNS, parts[1])
				}
			}
		}
	}

	// Check internet connectivity with ping
	if output, err := s.executeCommand("ping", "-c", "1", "-W", "2", "8.8.8.8"); err == nil {
		status.Internet = strings.Contains(output, "1 received")

		// Extract latency from ping output
		if strings.Contains(output, "time=") {
			if parts := strings.Split(output, "time="); len(parts) >= 2 {
				latencyStr := strings.Fields(parts[1])[0]
				status.Latency = latencyStr
			}
		}
	}

	// Get external IP
	if output, err := s.executeCommand("curl", "-s", "ifconfig.me"); err == nil {
		status.ExternalIP = strings.TrimSpace(output)
	} else if output, err := s.executeCommand("curl", "-s", "ipinfo.io/ip"); err == nil {
		status.ExternalIP = strings.TrimSpace(output)
	}

	// Check IPv6 connectivity
	if output, err := s.executeCommand("ping6", "-c", "1", "-W", "2", "2001:4860:4860::8888"); err == nil {
		status.IPv6 = strings.Contains(output, "1 received")
	}

	// Get network interface stats for speed estimation
	if output, err := s.executeCommand("cat", "/proc/net/dev"); err == nil {
		lines := strings.Split(output, "\n")
		for _, line := range lines {
			line = strings.TrimSpace(line)
			if strings.HasPrefix(line, "eth") || strings.HasPrefix(line, "enp") || strings.HasPrefix(line, "wlan") {
				if fields := strings.Fields(line); len(fields) >= 9 {
					// This is a simplified approach - real speed measurement would require timing
					rxBytes := fields[1]
					txBytes := fields[9]
					if rxBytes != "0" && txBytes != "0" {
						status.DownloadSpeed = "Unknown"
						status.UploadSpeed = "Unknown"
					}
				}
			}
		}
	}

	return status, nil
}

// Additional Services
func (s *ServicesService) GetNTPStatus(ctx context.Context) (*model.ServiceStatus, error) {
	status := &model.ServiceStatus{
		Service:   "ntp",
		Running:   false,
		PID:       0,
		Uptime:    "",
		Memory:    "",
		CPU:       "",
		Enabled:   false,
		AutoStart: false,
	}

	// Check various NTP services
	ntpServices := []string{"ntpd", "chronyd", "systemd-timesyncd", "ntp"}
	var foundService string

	for _, service := range ntpServices {
		if running, err := s.isServiceRunning(service); err == nil && running {
			status.Running = true
			foundService = service
			break
		}
	}

	// Get PID and other info for the found service
	if foundService != "" {
		if pid, err := s.getServicePID(foundService); err == nil {
			status.PID = pid

			// Get memory usage
			if memory, err := s.getServiceMemoryUsage(pid); err == nil {
				status.Memory = memory
			}

			// Get uptime
			if pid > 0 {
				if output, err := s.executeCommand("ps", "-p", strconv.Itoa(pid), "-o", "etime="); err == nil {
					status.Uptime = strings.TrimSpace(output)
				}

				// Get CPU usage
				if output, err := s.executeCommand("ps", "-p", strconv.Itoa(pid), "-o", "%cpu="); err == nil {
					status.CPU = strings.TrimSpace(output) + "%"
				}
			}
		}

		// Check if service is enabled
		if output, err := s.executeCommand("systemctl", "is-enabled", foundService); err == nil {
			status.Enabled = strings.TrimSpace(output) == "enabled"
			status.AutoStart = status.Enabled
		}
	}

	// Try to get NTP synchronization status
	if status.Running {
		// Try ntpq for ntpd
		if output, err := s.executeCommand("ntpq", "-p"); err == nil {
			lines := strings.Split(output, "\n")
			if len(lines) > 2 {
				// Parse synchronization status
				for _, line := range lines {
					if strings.Contains(line, "*") {
						// Synchronized to this peer
						status.Uptime += " (synced)"
						break
					}
				}
			}
		}

		// Try chronyc for chronyd
		if output, err := s.executeCommand("chronyc", "tracking"); err == nil {
			if strings.Contains(output, "Reference ID") {
				status.Uptime += " (synced)"
			}
		}

		// Try timedatectl for systemd-timesyncd
		if output, err := s.executeCommand("timedatectl", "status"); err == nil {
			if strings.Contains(output, "NTP synchronized: yes") {
				status.Uptime += " (synced)"
			}
		}
	}

	return status, nil
}

func (s *ServicesService) GetSNMPStatus(ctx context.Context) (*model.ServiceStatus, error) {
	status := &model.ServiceStatus{
		Service:   "snmp",
		Running:   false,
		PID:       0,
		Uptime:    "",
		Memory:    "",
		CPU:       "",
		Enabled:   false,
		AutoStart: false,
	}

	// Check various SNMP services
	snmpServices := []string{"snmpd", "snmp", "net-snmp"}
	var foundService string

	for _, service := range snmpServices {
		if running, err := s.isServiceRunning(service); err == nil && running {
			status.Running = true
			foundService = service
			break
		}
	}

	// Get PID and other info for the found service
	if foundService != "" {
		if pid, err := s.getServicePID(foundService); err == nil {
			status.PID = pid

			// Get memory usage
			if memory, err := s.getServiceMemoryUsage(pid); err == nil {
				status.Memory = memory
			}

			// Get uptime
			if pid > 0 {
				if output, err := s.executeCommand("ps", "-p", strconv.Itoa(pid), "-o", "etime="); err == nil {
					status.Uptime = strings.TrimSpace(output)
				}

				// Get CPU usage
				if output, err := s.executeCommand("ps", "-p", strconv.Itoa(pid), "-o", "%cpu="); err == nil {
					status.CPU = strings.TrimSpace(output) + "%"
				}
			}
		}

		// Check if service is enabled
		if output, err := s.executeCommand("systemctl", "is-enabled", foundService); err == nil {
			status.Enabled = strings.TrimSpace(output) == "enabled"
			status.AutoStart = status.Enabled
		}
	}

	// Try to get SNMP agent status
	if status.Running {
		// Try snmpwalk to test SNMP agent
		if output, err := s.executeCommand("snmpwalk", "-v2c", "-c", "public", "localhost", "sysName.0"); err == nil {
			if strings.Contains(output, "sysName") {
				status.Uptime += " (responding)"
			}
		}

		// Try to get SNMP configuration
		if output, err := s.executeCommand("cat", "/etc/snmp/snmpd.conf"); err == nil {
			lines := strings.Split(output, "\n")
			for _, line := range lines {
				line = strings.TrimSpace(line)
				if strings.HasPrefix(line, "agentaddress") {
					// Extract port information
					if parts := strings.Fields(line); len(parts) >= 2 {
						addr := parts[1]
						if strings.Contains(addr, ":") {
							if portParts := strings.Split(addr, ":"); len(portParts) >= 2 {
								status.Uptime += fmt.Sprintf(" (port %s)", portParts[1])
							}
						}
					}
				}
			}
		}
	}

	return status, nil
}

func (s *ServicesService) GetSyslogStatus(ctx context.Context) (*model.ServiceStatus, error) {
	status := &model.ServiceStatus{
		Service:   "syslog",
		Running:   false,
		PID:       0,
		Uptime:    "",
		Memory:    "",
		CPU:       "",
		Enabled:   false,
		AutoStart: false,
	}

	// Check various syslog services
	syslogServices := []string{"rsyslog", "syslog-ng", "syslog", "systemd-journald"}
	var foundService string

	for _, service := range syslogServices {
		if running, err := s.isServiceRunning(service); err == nil && running {
			status.Running = true
			foundService = service
			break
		}
	}

	// Get PID and other info for the found service
	if foundService != "" {
		if pid, err := s.getServicePID(foundService); err == nil {
			status.PID = pid

			// Get memory usage
			if memory, err := s.getServiceMemoryUsage(pid); err == nil {
				status.Memory = memory
			}

			// Get uptime
			if pid > 0 {
				if output, err := s.executeCommand("ps", "-p", strconv.Itoa(pid), "-o", "etime="); err == nil {
					status.Uptime = strings.TrimSpace(output)
				}

				// Get CPU usage
				if output, err := s.executeCommand("ps", "-p", strconv.Itoa(pid), "-o", "%cpu="); err == nil {
					status.CPU = strings.TrimSpace(output) + "%"
				}
			}
		}

		// Check if service is enabled
		if output, err := s.executeCommand("systemctl", "is-enabled", foundService); err == nil {
			status.Enabled = strings.TrimSpace(output) == "enabled"
			status.AutoStart = status.Enabled
		}
	}

	// Try to get syslog configuration and status
	if status.Running {
		// Check syslog socket status
		if output, err := s.executeCommand("ss", "-ulpn"); err == nil {
			if strings.Contains(output, ":514") {
				status.Uptime += " (listening on 514)"
			}
		}

		// Try to get log file information
		if foundService == "rsyslog" {
			if output, err := s.executeCommand("cat", "/etc/rsyslog.conf"); err == nil {
				if strings.Contains(output, "/var/log/syslog") || strings.Contains(output, "/var/log/messages") {
					status.Uptime += " (logging to /var/log)"
				}
			}
		} else if foundService == "syslog-ng" {
			if output, err := s.executeCommand("cat", "/etc/syslog-ng/syslog-ng.conf"); err == nil {
				if strings.Contains(output, "/var/log") {
					status.Uptime += " (logging to /var/log)"
				}
			}
		} else if foundService == "systemd-journald" {
			if output, err := s.executeCommand("journalctl", "--verify", "--no-pager"); err == nil {
				if strings.Contains(output, "PASS") {
					status.Uptime += " (journald verified)"
				}
			}
		}
	}

	return status, nil
}

// Service Management
func (s *ServicesService) StartService(ctx context.Context, serviceName string) error {
	_, err := s.executeCommand("systemctl", "start", serviceName)
	if err != nil {
		// Fallback to service command
		_, err = s.executeCommand("service", serviceName, "start")
	}
	return err
}

func (s *ServicesService) StopService(ctx context.Context, serviceName string) error {
	_, err := s.executeCommand("systemctl", "stop", serviceName)
	if err != nil {
		// Fallback to service command
		_, err = s.executeCommand("service", serviceName, "stop")
	}
	return err
}

func (s *ServicesService) RestartService(ctx context.Context, serviceName string) error {
	_, err := s.executeCommand("systemctl", "restart", serviceName)
	if err != nil {
		// Fallback to service command
		_, err = s.executeCommand("service", serviceName, "restart")
	}
	return err
}

func (s *ServicesService) GetServiceStatus(ctx context.Context, serviceName string) (*model.ServiceStatus, error) {
	status := &model.ServiceStatus{
		Service:   serviceName,
		Running:   false,
		PID:       0,
		Uptime:    "",
		Memory:    "",
		CPU:       "",
		Enabled:   false,
		AutoStart: false,
	}

	// Check if service is running
	running, err := s.isServiceRunning(serviceName)
	if err == nil {
		status.Running = running
	}

	// Get PID
	if pid, err := s.getServicePID(serviceName); err == nil {
		status.PID = pid

		// Get memory usage if PID is available
		if memory, err := s.getServiceMemoryUsage(pid); err == nil {
			status.Memory = memory
		}

		// Get uptime from process start time
		if pid > 0 {
			if output, err := s.executeCommand("ps", "-p", strconv.Itoa(pid), "-o", "etime="); err == nil {
				status.Uptime = strings.TrimSpace(output)
			}

			// Get CPU usage
			if output, err := s.executeCommand("ps", "-p", strconv.Itoa(pid), "-o", "%cpu="); err == nil {
				status.CPU = strings.TrimSpace(output) + "%"
			}
		}
	}

	// Check if service is enabled
	if output, err := s.executeCommand("systemctl", "is-enabled", serviceName); err == nil {
		status.Enabled = strings.TrimSpace(output) == "enabled"
		status.AutoStart = status.Enabled
	}

	return status, nil
}

// Log Management
func (s *ServicesService) GetServiceLog(ctx context.Context, serviceName string, lines int) (*model.ServiceLog, error) {
	var logEntries []model.LogEntry

	// Try journalctl first (systemd)
	if output, err := s.executeCommand("journalctl", "-u", serviceName, "-n", strconv.Itoa(lines), "--no-pager"); err == nil {
		outputLines := strings.Split(output, "\n")
		for _, line := range outputLines {
			line = strings.TrimSpace(line)
			if line != "" && !strings.HasPrefix(line, "--") {
				// Parse journalctl format: timestamp hostname service[pid]: message
				if parts := strings.SplitN(line, " ", 4); len(parts) >= 4 {
					timestamp := strings.Join(parts[0:3], " ")
					message := parts[3]

					// Extract log level from message
					level := "INFO"
					if strings.Contains(strings.ToUpper(message), "ERROR") {
						level = "ERROR"
					} else if strings.Contains(strings.ToUpper(message), "WARN") {
						level = "WARN"
					} else if strings.Contains(strings.ToUpper(message), "DEBUG") {
						level = "DEBUG"
					}

					logEntries = append(logEntries, model.LogEntry{
						Timestamp: timestamp,
						Level:     level,
						Message:   message,
					})
				}
			}
		}
	}

	// Fallback to /var/log/service.log
	if len(logEntries) == 0 {
		logPath := "/var/log/" + serviceName + ".log"
		if output, err := s.executeCommand("tail", "-n", strconv.Itoa(lines), logPath); err == nil {
			outputLines := strings.Split(output, "\n")
			for _, line := range outputLines {
				line = strings.TrimSpace(line)
				if line != "" {
					// Try to extract timestamp and level
					level := "INFO"
					timestamp := time.Now().Format(time.RFC3339)
					message := line

					if strings.Contains(line, "ERROR") || strings.Contains(line, "error") {
						level = "ERROR"
					} else if strings.Contains(line, "WARN") || strings.Contains(line, "warn") {
						level = "WARN"
					} else if strings.Contains(line, "DEBUG") || strings.Contains(line, "debug") {
						level = "DEBUG"
					}

					logEntries = append(logEntries, model.LogEntry{
						Timestamp: timestamp,
						Level:     level,
						Message:   message,
					})
				}
			}
		}
	}

	serviceLog := &model.ServiceLog{
		Entries: logEntries,
		Total:   len(logEntries),
	}
	return serviceLog, nil
}

// System Integration Methods
func (s *ServicesService) executeCommand(command string, args ...string) (string, error) {
	cmd := exec.Command(command, args...)
	output, err := cmd.CombinedOutput()
	if err != nil {
		return "", fmt.Errorf("command failed: %v, output: %s", err, string(output))
	}
	return string(output), nil
}

func (s *ServicesService) isServiceRunning(serviceName string) (bool, error) {
	output, err := s.executeCommand("systemctl", "is-active", serviceName)
	if err != nil {
		// Fallback to service command
		output, err = s.executeCommand("service", serviceName, "status")
		if err != nil {
			return false, err
		}
		return strings.Contains(output, "running") || strings.Contains(output, "is running"), nil
	}
	return strings.TrimSpace(output) == "active", nil
}

func (s *ServicesService) getServicePID(serviceName string) (int, error) {
	// Try systemctl first
	if output, err := s.executeCommand("systemctl", "show", "--property=MainPID", serviceName); err == nil {
		if parts := strings.Split(output, "="); len(parts) >= 2 {
			if pid, err := strconv.Atoi(strings.TrimSpace(parts[1])); err == nil && pid > 0 {
				return pid, nil
			}
		}
	}

	// Fallback to pgrep
	output, err := s.executeCommand("pgrep", "-f", serviceName)
	if err != nil {
		return 0, err
	}

	pidStr := strings.TrimSpace(output)
	if pidStr == "" {
		return 0, nil
	}

	return strconv.Atoi(pidStr)
}

func (s *ServicesService) getServiceMemoryUsage(pid int) (string, error) {
	if pid <= 0 {
		return "0KB", nil
	}

	output, err := s.executeCommand("ps", "-p", strconv.Itoa(pid), "-o", "rss=")
	if err != nil {
		return "", err
	}

	kb := strings.TrimSpace(output)
	if kb == "" {
		return "0KB", nil
	}

	kbInt, err := strconv.Atoi(kb)
	if err != nil {
		return kb + "KB", nil
	}

	// Convert to MB if > 1024KB
	if kbInt > 1024 {
		mb := kbInt / 1024
		return fmt.Sprintf("%dMB", mb), nil
	}

	return kb + "KB", nil
}

// Configuration Management
func (s *ServicesService) BackupServiceConfig(ctx context.Context, serviceName string) error {
	// Create backup directory if it doesn't exist
	backupDir := "/etc/backups"
	if _, err := s.executeCommand("mkdir", "-p", backupDir); err != nil {
		return fmt.Errorf("failed to create backup directory: %v", err)
	}

	// Generate timestamp for backup
	timestamp := time.Now().Format("20060102-150405")

	// Determine config file path based on service
	var configFiles []string
	switch serviceName {
	case "dhcp", "isc-dhcp-server":
		configFiles = []string{"/etc/dhcp/dhcpd.conf", "/etc/default/isc-dhcp-server"}
	case "dnsmasq":
		configFiles = []string{"/etc/dnsmasq.conf"}
	case "unbound":
		configFiles = []string{"/etc/unbound/unbound.conf"}
	case "monit":
		configFiles = []string{"/etc/monit/monitrc"}
	case "nginx":
		configFiles = []string{"/etc/nginx/nginx.conf", "/etc/nginx/sites-available/"}
	case "apache2", "httpd":
		configFiles = []string{"/etc/apache2/apache2.conf", "/etc/httpd/conf/httpd.conf"}
	case "rsyslog":
		configFiles = []string{"/etc/rsyslog.conf"}
	case "syslog-ng":
		configFiles = []string{"/etc/syslog-ng/syslog-ng.conf"}
	case "snmpd":
		configFiles = []string{"/etc/snmp/snmpd.conf"}
	default:
		// Try common config locations
		configFiles = []string{
			fmt.Sprintf("/etc/%s/%s.conf", serviceName, serviceName),
			fmt.Sprintf("/etc/%s.conf", serviceName),
			fmt.Sprintf("/etc/%s/config", serviceName),
		}
	}

	// Backup each config file
	for _, configFile := range configFiles {
		// Check if file exists
		if _, err := s.executeCommand("test", "-f", configFile); err != nil {
			continue // Skip non-existent files
		}

		// Create backup filename based on original path
		backupPath := fmt.Sprintf("%s/%s-%s%s.bak", backupDir, serviceName, timestamp, strings.ReplaceAll(configFile, "/", "_"))

		// Copy file to backup location
		if _, err := s.executeCommand("cp", configFile, backupPath); err != nil {
			return fmt.Errorf("failed to backup %s: %v", configFile, err)
		}

		log.Printf("Backed up %s to %s", configFile, backupPath)
	}

	// Create a metadata file with backup information
	metadataFile := fmt.Sprintf("%s/%s-%s.metadata", backupDir, serviceName, timestamp)
	metadata := fmt.Sprintf("service: %s\nbackup_time: %s\noriginal_files: %s\n",
		serviceName, time.Now().Format(time.RFC3339), strings.Join(configFiles, ","))

	if _, err := s.executeCommand("sh", "-c", fmt.Sprintf("echo '%s' > %s", metadata, metadataFile)); err != nil {
		return fmt.Errorf("failed to create backup metadata: %v", err)
	}

	// Clean up old backups (keep last 10)
	if _, err := s.executeCommand("sh", "-c", fmt.Sprintf("ls -t %s/%s-*.bak | tail -n +11 | xargs rm -f", backupDir, serviceName)); err != nil {
		log.Printf("Warning: failed to clean up old backups: %v", err)
	}

	return nil
}

func (s *ServicesService) RestoreServiceConfig(ctx context.Context, serviceName string, backupPath string) error {
	// Validate backup path exists
	if _, err := s.executeCommand("test", "-f", backupPath); err != nil {
		return fmt.Errorf("backup file does not exist: %s", backupPath)
	}

	// Create a backup of current configuration before restore
	if err := s.BackupServiceConfig(ctx, serviceName); err != nil {
		log.Printf("Warning: failed to backup current configuration: %v", err)
	}

	// Determine the original config file path from backup filename
	var originalConfig string
	if strings.Contains(backupPath, "_etc_") {
		// Extract original path from backup filename
		parts := strings.Split(backupPath, "-")
		if len(parts) >= 3 {
			pathPart := strings.Join(parts[2:], "-")
			originalConfig = strings.ReplaceAll(pathPart, "_", "/")
			originalConfig = strings.TrimSuffix(originalConfig, ".conf.bak")
			originalConfig = strings.TrimSuffix(originalConfig, ".bak")
		}
	}

	// If we can't determine original path, use service-specific defaults
	if originalConfig == "" {
		switch serviceName {
		case "dhcp", "isc-dhcp-server":
			originalConfig = "/etc/dhcp/dhcpd.conf"
		case "dnsmasq":
			originalConfig = "/etc/dnsmasq.conf"
		case "unbound":
			originalConfig = "/etc/unbound/unbound.conf"
		case "monit":
			originalConfig = "/etc/monit/monitrc"
		case "nginx":
			originalConfig = "/etc/nginx/nginx.conf"
		case "apache2", "httpd":
			originalConfig = "/etc/apache2/apache2.conf"
		case "rsyslog":
			originalConfig = "/etc/rsyslog.conf"
		case "syslog-ng":
			originalConfig = "/etc/syslog-ng/syslog-ng.conf"
		case "snmpd":
			originalConfig = "/etc/snmp/snmpd.conf"
		default:
			return fmt.Errorf("cannot determine original config path for service: %s", serviceName)
		}
	}

	// Create directory for original config if it doesn't exist
	originalDir := strings.TrimSuffix(originalConfig, "/"+strings.Split(originalConfig, "/")[len(strings.Split(originalConfig, "/"))-1])
	if _, err := s.executeCommand("mkdir", "-p", originalDir); err != nil {
		return fmt.Errorf("failed to create config directory: %v", err)
	}

	// Restore the configuration file
	if _, err := s.executeCommand("cp", backupPath, originalConfig); err != nil {
		return fmt.Errorf("failed to restore configuration: %v", err)
	}

	// Set appropriate permissions
	if _, err := s.executeCommand("chmod", "644", originalConfig); err != nil {
		log.Printf("Warning: failed to set permissions on %s: %v", originalConfig, err)
	}

	// Set ownership if it's a system config file
	if strings.HasPrefix(originalConfig, "/etc/") {
		if _, err := s.executeCommand("chown", "root:root", originalConfig); err != nil {
			log.Printf("Warning: failed to set ownership on %s: %v", originalConfig, err)
		}
	}

	// Test configuration if possible
	switch serviceName {
	case "nginx":
		if _, err := s.executeCommand("nginx", "-t"); err != nil {
			return fmt.Errorf("nginx configuration test failed: %v", err)
		}
	case "apache2":
		if _, err := s.executeCommand("apache2ctl", "configtest"); err != nil {
			return fmt.Errorf("apache2 configuration test failed: %v", err)
		}
	case "monit":
		if _, err := s.executeCommand("monit", "-t"); err != nil {
			return fmt.Errorf("monit configuration test failed: %v", err)
		}
	case "unbound":
		if _, err := s.executeCommand("unbound-checkconf", originalConfig); err != nil {
			return fmt.Errorf("unbound configuration test failed: %v", err)
		}
	}

	// Restart the service to apply changes
	if err := s.RestartService(ctx, serviceName); err != nil {
		log.Printf("Warning: failed to restart service %s: %v", serviceName, err)
	}

	log.Printf("Successfully restored %s configuration from %s", serviceName, backupPath)
	return nil
}

// Health Checks
func (s *ServicesService) CheckServiceHealth(ctx context.Context, serviceName string) (*model.ServiceHealth, error) {
	health := &model.ServiceHealth{
		Service:   serviceName,
		Status:    "unknown",
		Checks:    map[string]bool{},
		LastCheck: time.Now(),
		Metrics:   map[string]interface{}{},
	}

	// Process check
	if running, err := s.isServiceRunning(serviceName); err == nil {
		health.Checks["process"] = running
	} else {
		health.Checks["process"] = false
	}

	// Configuration check
	configValid := true
	switch serviceName {
	case "nginx":
		if _, err := s.executeCommand("nginx", "-t"); err != nil {
			configValid = false
		}
	case "apache2", "httpd":
		if _, err := s.executeCommand("apache2ctl", "configtest"); err != nil {
			configValid = false
		}
	case "monit":
		if _, err := s.executeCommand("monit", "-t"); err != nil {
			configValid = false
		}
	case "unbound":
		if _, err := s.executeCommand("unbound-checkconf", "/etc/unbound/unbound.conf"); err != nil {
			configValid = false
		}
	case "dhcp", "isc-dhcp-server":
		if _, err := s.executeCommand("dhcpd", "-t"); err != nil {
			configValid = false
		}
	default:
		// Generic config check - just verify config file exists and is readable
		configFiles := []string{
			fmt.Sprintf("/etc/%s/%s.conf", serviceName, serviceName),
			fmt.Sprintf("/etc/%s.conf", serviceName),
		}
		configValid = false
		for _, configFile := range configFiles {
			if _, err := s.executeCommand("test", "-r", configFile); err == nil {
				configValid = true
				break
			}
		}
	}
	health.Checks["config"] = configValid

	// Network check
	networkHealthy := true
	switch serviceName {
	case "nginx", "apache2", "httpd":
		// Check if web server is listening on ports 80/443
		if output, err := s.executeCommand("ss", "-tlnp"); err == nil {
			if !strings.Contains(output, ":80") && !strings.Contains(output, ":443") {
				networkHealthy = false
			}
		} else {
			networkHealthy = false
		}
	case "dns", "unbound", "dnsmasq":
		// Check if DNS server is listening on port 53
		if output, err := s.executeCommand("ss", "-ulnp"); err == nil {
			if !strings.Contains(output, ":53") {
				networkHealthy = false
			}
		} else {
			networkHealthy = false
		}
	case "dhcp", "isc-dhcp-server":
		// Check if DHCP server is listening on port 67
		if output, err := s.executeCommand("ss", "-ulnp"); err == nil {
			if !strings.Contains(output, ":67") {
				networkHealthy = false
			}
		} else {
			networkHealthy = false
		}
	default:
		// Generic network check - try to connect to service-specific port
		if pid, err := s.getServicePID(serviceName); err == nil && pid > 0 {
			// Service is running, assume network is healthy
			networkHealthy = true
		} else {
			networkHealthy = false
		}
	}
	health.Checks["network"] = networkHealthy

	// Resource check
	if pid, err := s.getServicePID(serviceName); err == nil && pid > 0 {
		// Get memory usage
		if memory, err := s.getServiceMemoryUsage(pid); err == nil {
			health.Metrics["memory"] = memory
		}

		// Get CPU usage
		if output, err := s.executeCommand("ps", "-p", strconv.Itoa(pid), "-o", "%cpu="); err == nil {
			health.Metrics["cpu"] = strings.TrimSpace(output) + "%"
		}

		// Get uptime
		if output, err := s.executeCommand("ps", "-p", strconv.Itoa(pid), "-o", "etime="); err == nil {
			health.Metrics["uptime"] = strings.TrimSpace(output)
		}

		// Check for high resource usage
		if cpuStr, ok := health.Metrics["cpu"].(string); ok {
			if cpuValue, err := strconv.ParseFloat(strings.TrimSuffix(cpuStr, "%"), 64); err == nil {
				health.Checks["resources"] = cpuValue < 80.0
			}
		}
	} else {
		health.Checks["resources"] = false
	}

	// Log file check
	logFiles := []string{
		fmt.Sprintf("/var/log/%s.log", serviceName),
		fmt.Sprintf("/var/log/%s/%s.log", serviceName, serviceName),
		"/var/log/syslog",
		"/var/log/messages",
	}
	logHealthy := false
	for _, logFile := range logFiles {
		if _, err := s.executeCommand("test", "-r", logFile); err == nil {
			logHealthy = true
			break
		}
	}
	health.Checks["logs"] = logHealthy

	// Determine overall health status
	allChecks := []string{"process", "config", "network", "resources", "logs"}
	passedChecks := 0
	for _, check := range allChecks {
		if result, ok := health.Checks[check]; ok && result {
			passedChecks++
		}
	}

	if passedChecks == len(allChecks) {
		health.Status = "healthy"
	} else if passedChecks >= len(allChecks)/2 {
		health.Status = "degraded"
	} else {
		health.Status = "unhealthy"
	}

	return health, nil
}

// Metrics Collection
func (s *ServicesService) GetServiceMetrics(ctx context.Context, serviceName string) (*model.ServiceMetrics, error) {
	metrics := &model.ServiceMetrics{
		Service:        serviceName,
		CPUUsage:       0.0,
		MemoryUsage:    0,
		Connections:    0,
		RequestsPerSec: 0.0,
		Uptime:         time.Time{},
		LastUpdated:    time.Now(),
	}

	// Get PID for the service
	pid, err := s.getServicePID(serviceName)
	if err != nil || pid <= 0 {
		// Service not running, return zero metrics
		return metrics, nil
	}

	// Get CPU usage
	if output, err := s.executeCommand("ps", "-p", strconv.Itoa(pid), "-o", "%cpu="); err == nil {
		if cpuStr := strings.TrimSpace(output); cpuStr != "" {
			if cpuValue, err := strconv.ParseFloat(cpuStr, 64); err == nil {
				metrics.CPUUsage = cpuValue
			}
		}
	}

	// Get memory usage in bytes
	if output, err := s.executeCommand("ps", "-p", strconv.Itoa(pid), "-o", "rss="); err == nil {
		if rssStr := strings.TrimSpace(output); rssStr != "" {
			if rssKB, err := strconv.Atoi(rssStr); err == nil {
				metrics.MemoryUsage = int64(rssKB) * 1024 // Convert KB to bytes
			}
		}
	}

	// Get uptime
	if output, err := s.executeCommand("ps", "-p", strconv.Itoa(pid), "-o", "etime="); err == nil {
		if etimeStr := strings.TrimSpace(output); etimeStr != "" {
			// Parse etime format (DD-HH:MM:SS or HH:MM:SS or MM:SS)
			parts := strings.Split(etimeStr, "-")
			var days, hours, minutes, seconds int

			if len(parts) == 2 {
				// DD-HH:MM:SS format
				days, _ = strconv.Atoi(parts[0])
				timeParts := strings.Split(parts[1], ":")
				if len(timeParts) == 3 {
					hours, _ = strconv.Atoi(timeParts[0])
					minutes, _ = strconv.Atoi(timeParts[1])
					seconds, _ = strconv.Atoi(timeParts[2])
				}
			} else {
				// HH:MM:SS or MM:SS format
				timeParts := strings.Split(etimeStr, ":")
				if len(timeParts) == 3 {
					hours, _ = strconv.Atoi(timeParts[0])
					minutes, _ = strconv.Atoi(timeParts[1])
					seconds, _ = strconv.Atoi(timeParts[2])
				} else if len(timeParts) == 2 {
					minutes, _ = strconv.Atoi(timeParts[0])
					seconds, _ = strconv.Atoi(timeParts[1])
				}
			}

			duration := time.Duration(days)*24*time.Hour + time.Duration(hours)*time.Hour + time.Duration(minutes)*time.Minute + time.Duration(seconds)*time.Second
			metrics.Uptime = time.Now().Add(-duration)
		}
	}

	// Get connection count based on service type
	switch serviceName {
	case "nginx", "apache2", "httpd":
		// Get active connections for web servers
		if serviceName == "nginx" {
			if output, err := s.executeCommand("curl", "-s", "http://localhost/nginx_status"); err == nil {
				lines := strings.Split(output, "\n")
				for _, line := range lines {
					if strings.Contains(line, "Active connections:") {
						if parts := strings.Fields(line); len(parts) >= 3 {
							if connections, err := strconv.Atoi(parts[2]); err == nil {
								metrics.Connections = connections
							}
						}
					}
				}
			}
		} else {
			// For Apache, use mod_status or count processes
			if output, err := s.executeCommand("pgrep", "-c", "apache2"); err == nil {
				if connections, err := strconv.Atoi(strings.TrimSpace(output)); err == nil {
					metrics.Connections = connections
				}
			}
		}

		// Get requests per second (simplified - would need log analysis for accurate data)
		if output, err := s.executeCommand("ss", "-tn"); err == nil {
			lines := strings.Split(output, "\n")
			establishedConnections := 0
			for _, line := range lines {
				if strings.Contains(line, "ESTAB") {
					establishedConnections++
				}
			}
			// Rough estimate: divide established connections by uptime hours
			if !metrics.Uptime.IsZero() {
				uptimeHours := time.Since(metrics.Uptime).Hours()
				if uptimeHours > 0 {
					metrics.RequestsPerSec = float64(establishedConnections) / uptimeHours / 3600
				}
			}
		}

	case "mysql", "mariadb":
		// Get MySQL connections
		if output, err := s.executeCommand("mysql", "-e", "SHOW STATUS LIKE 'Threads_connected';"); err == nil {
			lines := strings.Split(output, "\n")
			for _, line := range lines {
				if strings.Contains(line, "Threads_connected") {
					if parts := strings.Fields(line); len(parts) >= 2 {
						if connections, err := strconv.Atoi(parts[1]); err == nil {
							metrics.Connections = connections
						}
					}
				}
			}
		}

	case "postgres", "postgresql":
		// Get PostgreSQL connections
		if output, err := s.executeCommand("psql", "-t", "-c", "SELECT count(*) FROM pg_stat_activity;"); err == nil {
			if connections, err := strconv.Atoi(strings.TrimSpace(output)); err == nil {
				metrics.Connections = connections
			}
		}

	default:
		// Generic connection count using network connections
		if output, err := s.executeCommand("ss", "-tnp"); err == nil {
			lines := strings.Split(output, "\n")
			for _, line := range lines {
				if strings.Contains(line, strconv.Itoa(pid)) {
					metrics.Connections++
				}
			}
		}
	}

	// Get additional process metrics
	if output, err := s.executeCommand("ps", "-p", strconv.Itoa(pid), "-o", "vsz,rss,threads="); err == nil {
		parts := strings.Fields(strings.TrimSpace(output))
		if len(parts) >= 3 {
			// Virtual memory size (already have RSS in MemoryUsage)
			if vsz, err := strconv.Atoi(parts[0]); err == nil {
				metrics.MemoryUsage = int64(vsz) * 1024 // Use VSZ if available
			}
			// Thread count
			if threads, err := strconv.Atoi(parts[2]); err == nil {
				metrics.Threads = threads
			}
		}
	}

	return metrics, nil
}
