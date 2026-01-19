package services

import (
	"fmt"
	"os/exec"
	"strconv"
	"strings"
	"time"

	"github.com/skygenesisenterprise/aether-shield/server/src/model"
)

type InterfaceService struct {
}

func NewInterfaceService() *InterfaceService {
	return &InterfaceService{}
}

func (s *InterfaceService) GetAssignments() ([]model.InterfaceAssignment, error) {
	return []model.InterfaceAssignment{
		{
			ID:        "1",
			Interface: "em0",
			Network:   "LAN",
			Gateway:   "192.168.1.1",
			Priority:  1,
			Weight:    100,
			Enabled:   true,
		},
		{
			ID:        "2",
			Interface: "em1",
			Network:   "WAN",
			Gateway:   "10.0.0.1",
			Priority:  2,
			Weight:    50,
			Enabled:   true,
		},
	}, nil
}

func (s *InterfaceService) UpdateAssignments(assignments []model.InterfaceAssignment) error {
	return nil
}

func (s *InterfaceService) GetDevices() ([]model.InterfaceDevice, error) {
	return []model.InterfaceDevice{
		{
			Name:        "em0",
			Type:        "ethernet",
			Status:      "up",
			MAC:         "00:1a:2b:3c:4d:5e",
			MTU:         1500,
			Description: "Intel PRO/1000",
		},
		{
			Name:        "em1",
			Type:        "ethernet",
			Status:      "up",
			MAC:         "00:1a:2b:3c:4d:5f",
			MTU:         1500,
			Description: "Intel PRO/1000",
		},
	}, nil
}

func (s *InterfaceService) GetGifDevices() ([]model.InterfaceDevice, error) {
	return []model.InterfaceDevice{}, nil
}

func (s *InterfaceService) GetGreDevices() ([]model.InterfaceDevice, error) {
	return []model.InterfaceDevice{}, nil
}

func (s *InterfaceService) GetLaggDevices() ([]model.InterfaceDevice, error) {
	return []model.InterfaceDevice{}, nil
}

func (s *InterfaceService) GetVlanDevices() ([]model.InterfaceDevice, error) {
	return []model.InterfaceDevice{}, nil
}

func (s *InterfaceService) GetVxlanDevices() ([]model.InterfaceDevice, error) {
	return []model.InterfaceDevice{}, nil
}

func (s *InterfaceService) GetLoopbackDevices() ([]model.InterfaceDevice, error) {
	return []model.InterfaceDevice{
		{
			Name:        "lo0",
			Type:        "loopback",
			Status:      "up",
			MAC:         "",
			MTU:         16384,
			Description: "Loopback",
		},
	}, nil
}

func (s *InterfaceService) GetPointToPointDevices() ([]model.InterfaceDevice, error) {
	return []model.InterfaceDevice{}, nil
}

func (s *InterfaceService) GetBridgeDevices() ([]model.InterfaceDevice, error) {
	return []model.InterfaceDevice{}, nil
}

func (s *InterfaceService) ExecutePing(request model.PingRequest) (*model.PingResponse, error) {
	if request.Count == 0 {
		request.Count = 4
	}
	if request.Timeout == 0 {
		request.Timeout = 1
	}

	cmd := exec.Command("ping", "-c", strconv.Itoa(request.Count), "-W", strconv.Itoa(request.Timeout), request.Host)
	output, err := cmd.CombinedOutput()
	if err != nil {
		return nil, fmt.Errorf("ping failed: %v", err)
	}

	lines := strings.Split(string(output), "\n")
	var results []string
	var sent, received int
	var loss float64
	var minTime, maxTime, avgTime float64

	for _, line := range lines {
		results = append(results, line)
		if strings.Contains(line, "packets transmitted") {
			parts := strings.Fields(line)
			if len(parts) >= 4 {
				sent, _ = strconv.Atoi(parts[0])
				received, _ = strconv.Atoi(parts[3])
				if sent > 0 {
					loss = float64(sent-received) / float64(sent) * 100
				}
			}
		}
		if strings.Contains(line, "min/avg/max") {
			parts := strings.Split(line, "=")
			if len(parts) > 1 {
				times := strings.TrimSpace(parts[1])
				timeParts := strings.Split(times, "/")
				if len(timeParts) >= 3 {
					minTime, _ = strconv.ParseFloat(timeParts[0], 64)
					avgTime, _ = strconv.ParseFloat(timeParts[1], 64)
					maxTime, _ = strconv.ParseFloat(timeParts[2], 64)
				}
			}
		}
	}

	return &model.PingResponse{
		Success:  received > 0,
		Host:     request.Host,
		Sent:     sent,
		Received: received,
		Loss:     loss,
		MinTime:  minTime,
		MaxTime:  maxTime,
		AvgTime:  avgTime,
		Results:  results,
	}, nil
}

func (s *InterfaceService) ExecuteTraceroute(request model.TracerouteRequest) (*model.TracerouteResponse, error) {
	if request.MaxHops == 0 {
		request.MaxHops = 30
	}
	if request.Timeout == 0 {
		request.Timeout = 5
	}

	cmd := exec.Command("traceroute", "-m", strconv.Itoa(request.MaxHops), "-w", strconv.Itoa(request.Timeout), request.Host)
	output, err := cmd.CombinedOutput()
	if err != nil {
		return nil, fmt.Errorf("traceroute failed: %v", err)
	}

	lines := strings.Split(string(output), "\n")
	var hops []model.TracerouteHop

	for _, line := range lines {
		if strings.TrimSpace(line) == "" {
			continue
		}

		parts := strings.Fields(line)
		if len(parts) < 2 {
			continue
		}

		hopNum, _ := strconv.Atoi(parts[0])
		var ips []string
		var times []float64

		for i := 1; i < len(parts); i++ {
			if strings.Contains(parts[i], ".") {
				if !strings.Contains(parts[i], "ms") {
					ips = append(ips, parts[i])
				}
			} else if strings.Contains(parts[i], "ms") {
				timeStr := strings.TrimSuffix(parts[i], "ms")
				if time, err := strconv.ParseFloat(timeStr, 64); err == nil {
					times = append(times, time)
				}
			}
		}

		hops = append(hops, model.TracerouteHop{
			Hop:   hopNum,
			IPs:   ips,
			Times: times,
		})
	}

	return &model.TracerouteResponse{
		Success: len(hops) > 0,
		Host:    request.Host,
		Hops:    hops,
	}, nil
}

func (s *InterfaceService) GetNetstat() (map[string]interface{}, error) {
	cmd := exec.Command("netstat", "-rn")
	output, err := cmd.CombinedOutput()
	if err != nil {
		return nil, fmt.Errorf("netstat failed: %v", err)
	}

	return map[string]interface{}{
		"routing_table": string(output),
		"timestamp":     time.Now(),
	}, nil
}

func (s *InterfaceService) ExecuteDNSLookup(request model.DNSLookupRequest) (*model.DNSLookupResponse, error) {
	if request.Type == "" {
		request.Type = "A"
	}
	if request.Server == "" {
		request.Server = "8.8.8.8"
	}

	cmd := exec.Command("dig", "@"+request.Server, request.Type, request.Domain)
	output, err := cmd.CombinedOutput()
	if err != nil {
		return nil, fmt.Errorf("DNS lookup failed: %v", err)
	}

	lines := strings.Split(string(output), "\n")
	var answers []model.DNSAnswer
	var queryTime float64

	for _, line := range lines {
		if strings.Contains(line, "Query time") {
			parts := strings.Fields(line)
			if len(parts) >= 4 {
				queryTime, _ = strconv.ParseFloat(parts[3], 64)
			}
		}
		if strings.Contains(line, request.Domain) && !strings.Contains(line, ";") {
			parts := strings.Fields(line)
			if len(parts) >= 5 {
				ttl, _ := strconv.Atoi(parts[3])
				answers = append(answers, model.DNSAnswer{
					Name:  parts[0],
					Type:  parts[3],
					TTL:   ttl,
					Value: parts[4],
				})
			}
		}
	}

	return &model.DNSLookupResponse{
		Success: len(answers) > 0,
		Domain:  request.Domain,
		Type:    request.Type,
		Answers: answers,
		Server:  request.Server,
		Time:    queryTime,
	}, nil
}

func (s *InterfaceService) ExecutePacketCapture(request model.PacketCaptureRequest) (*model.PacketCaptureResponse, error) {
	return &model.PacketCaptureResponse{
		Success:   false,
		Interface: request.Interface,
		Packets:   []model.Packet{},
		Captured:  0,
	}, nil
}

func (s *InterfaceService) GetArpTables() ([]model.ArpEntry, error) {
	cmd := exec.Command("arp", "-an")
	output, err := cmd.CombinedOutput()
	if err != nil {
		return nil, fmt.Errorf("arp command failed: %v", err)
	}

	lines := strings.Split(string(output), "\n")
	var entries []model.ArpEntry

	for _, line := range lines {
		if strings.Contains(line, "?") && strings.Contains(line, "(") {
			parts := strings.Fields(line)
			if len(parts) >= 4 {
				ip := strings.Trim(parts[1], "()")
				mac := strings.Trim(parts[3], "[]")
				entries = append(entries, model.ArpEntry{
					IPAddress: ip,
					MAC:       mac,
					Interface: parts[5],
					Type:      "dynamic",
					Age:       0,
					Permanent: false,
				})
			}
		}
	}

	return entries, nil
}

func (s *InterfaceService) ExecutePortprobe(request model.PortprobeRequest) (*model.PortprobeResponse, error) {
	var results []model.PortResult

	for _, port := range request.Ports {
		cmd := exec.Command("nc", "-z", "-w", strconv.Itoa(request.Timeout), request.Host, strconv.Itoa(port))
		err := cmd.Run()

		result := model.PortResult{
			Port:    port,
			Open:    err == nil,
			Service: s.getServiceName(port),
			Time:    0,
		}
		results = append(results, result)
	}

	return &model.PortprobeResponse{
		Success: true,
		Host:    request.Host,
		Results: results,
	}, nil
}

func (s *InterfaceService) getServiceName(port int) string {
	services := map[int]string{
		21:   "ftp",
		22:   "ssh",
		23:   "telnet",
		25:   "smtp",
		53:   "dns",
		80:   "http",
		110:  "pop3",
		143:  "imap",
		443:  "https",
		993:  "imaps",
		995:  "pop3s",
		3306: "mysql",
		5432: "postgresql",
	}
	if service, exists := services[port]; exists {
		return service
	}
	return "unknown"
}

func (s *InterfaceService) GetNeighbors() ([]model.InterfaceNeighbor, error) {
	return []model.InterfaceNeighbor{}, nil
}

func (s *InterfaceService) GetOverview() (map[string]interface{}, error) {
	devices, _ := s.GetDevices()
	assignments, _ := s.GetAssignments()

	return map[string]interface{}{
		"total_devices":  len(devices),
		"active_devices": len(devices),
		"assignments":    assignments,
		"last_updated":   time.Now(),
	}, nil
}

func (s *InterfaceService) GetSettings() (*model.InterfaceSettings, error) {
	return &model.InterfaceSettings{
		EnableLLDP:         true,
		EnableSTP:          false,
		STPPriority:        128,
		STPCost:            4,
		EnableFiltering:    false,
		EnableLogging:      true,
		LogLevel:           "info",
		AllowedMACs:        []string{},
		BlockedMACs:        []string{},
		EnableMonitoring:   true,
		MonitoringInterval: 60,
	}, nil
}

func (s *InterfaceService) UpdateSettings(settings model.InterfaceSettings) error {
	return nil
}

func (s *InterfaceService) GetVirtualIPStatus() (map[string]interface{}, error) {
	return map[string]interface{}{
		"virtual_ips": []model.VirtualIP{},
		"status":      "active",
		"last_check":  time.Now(),
	}, nil
}

func (s *InterfaceService) GetVirtualIPSettings() (*model.VirtualIP, error) {
	return &model.VirtualIP{}, nil
}

func (s *InterfaceService) UpdateVirtualIPSettings(settings model.VirtualIP) error {
	return nil
}

func (s *InterfaceService) GetWan() (*model.Interface, error) {
	return &model.Interface{
		ID:          "wan1",
		Name:        "em1",
		Type:        "ethernet",
		Status:      "up",
		IPAddress:   "10.0.0.2",
		Subnet:      "255.255.255.0",
		MAC:         "00:1a:2b:3c:4d:5f",
		Gateway:     "10.0.0.1",
		DNS:         []string{"8.8.8.8", "8.8.4.4"},
		Description: "WAN Interface",
		Mtu:         1500,
		Speed:       1000,
		Duplex:      "full",
		Config: model.InterfaceConfig{
			Enabled:       true,
			DHCP:          true,
			StaticIP:      "",
			StaticMask:    "",
			StaticGateway: "",
			StaticDNS:     []string{},
			VLANID:        0,
			Parent:        "",
			BridgeGroup:   "",
		},
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}, nil
}

func (s *InterfaceService) UpdateWan(wanConfig model.Interface) error {
	return nil
}

func (s *InterfaceService) GetWirelessDevices() ([]model.WirelessDevice, error) {
	return []model.WirelessDevice{}, nil
}
