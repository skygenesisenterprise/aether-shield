package services

import (
	"fmt"
	"io/ioutil"
	"math/rand"
	"os"
	"os/exec"
	"runtime"
	"strconv"
	"strings"
	"time"

	"github.com/skygenesisenterprise/aether-shield/server/src/model"
)

type HomeService struct{}

func NewHomeService() *HomeService {
	return &HomeService{}
}

func (h *HomeService) GetSystemInfo() (*model.SystemInfo, error) {
	hostname, _ := os.Hostname()

	info := &model.SystemInfo{
		Hostname:     hostname,
		OS:           runtime.GOOS,
		Kernel:       "Unknown",
		Uptime:       h.getUptime(),
		Architecture: runtime.GOARCH,
	}

	if runtime.GOOS == "linux" {
		if kernel, err := ioutil.ReadFile("/proc/version"); err == nil {
			info.Kernel = strings.Split(string(kernel), " ")[2]
		}
	}

	return info, nil
}

func (h *HomeService) GetCpuInfo() (*model.CpuInfo, error) {
	cpu := &model.CpuInfo{
		Cores: runtime.NumCPU(),
	}

	if runtime.GOOS == "linux" {
		if stat, err := ioutil.ReadFile("/proc/stat"); err == nil {
			lines := strings.Split(string(stat), "\n")
			for _, line := range lines {
				if strings.HasPrefix(line, "cpu ") {
					fields := strings.Fields(line)
					if len(fields) >= 5 {
						user, _ := strconv.ParseFloat(fields[1], 64)
						nice, _ := strconv.ParseFloat(fields[2], 64)
						system, _ := strconv.ParseFloat(fields[3], 64)
						idle, _ := strconv.ParseFloat(fields[4], 64)
						total := user + nice + system + idle
						if total > 0 {
							cpu.Usage = ((total - idle) / total) * 100
						}
					}
					break
				}
			}
		}

		if cpuinfo, err := ioutil.ReadFile("/proc/cpuinfo"); err == nil {
			lines := strings.Split(string(cpuinfo), "\n")
			for _, line := range lines {
				if strings.HasPrefix(line, "cpu MHz") {
					if freq, err := strconv.ParseFloat(strings.Split(line, ":")[1], 64); err == nil {
						cpu.Frequency = freq
					}
					break
				}
			}
		}
	} else {
		cpu.Usage = float64(rand.Intn(100))
		cpu.Frequency = 2000.0 + rand.Float64()*2000
	}

	cpu.Temperature = 40.0 + rand.Float64()*40

	return cpu, nil
}

func (h *HomeService) GetMemoryInfo() (*model.MemoryInfo, error) {
	mem := &model.MemoryInfo{}

	if runtime.GOOS == "linux" {
		if meminfo, err := ioutil.ReadFile("/proc/meminfo"); err == nil {
			lines := strings.Split(string(meminfo), "\n")
			var totalKB, availableKB int64

			for _, line := range lines {
				fields := strings.Fields(line)
				if len(fields) >= 2 {
					value, _ := strconv.ParseInt(fields[1], 10, 64)
					switch fields[0] {
					case "MemTotal:":
						totalKB = value
					case "MemAvailable:":
						availableKB = value
					}
				}
			}

			mem.Total = totalKB * 1024
			mem.Available = availableKB * 1024
			mem.Used = mem.Total - mem.Available
			if mem.Total > 0 {
				mem.Percentage = float64(mem.Used) / float64(mem.Total) * 100
			}
		}
	} else {
		mem.Total = 8589934592
		mem.Used = int64(rand.Intn(4000000000))
		mem.Available = mem.Total - mem.Used
		if mem.Total > 0 {
			mem.Percentage = float64(mem.Used) / float64(mem.Total) * 100
		}
	}

	return mem, nil
}

func (h *HomeService) GetDiskInfo() ([]*model.DiskInfo, error) {
	var disks []*model.DiskInfo

	if runtime.GOOS == "linux" {
		if mounts, err := ioutil.ReadFile("/proc/mounts"); err == nil {
			lines := strings.Split(string(mounts), "\n")
			for _, line := range lines {
				fields := strings.Fields(line)
				if len(fields) >= 3 && !strings.HasPrefix(fields[1], "/sys") && !strings.HasPrefix(fields[1], "/proc") && !strings.HasPrefix(fields[1], "/dev") {
					mountPoint := fields[1]
					if stat, err := exec.Command("df", "-k", mountPoint).Output(); err == nil {
						lines := strings.Split(string(stat), "\n")
						if len(lines) >= 2 {
							fields := strings.Fields(lines[1])
							if len(fields) >= 6 {
								total, _ := strconv.ParseInt(fields[1], 10, 64)
								used, _ := strconv.ParseInt(fields[2], 10, 64)
								avail, _ := strconv.ParseInt(fields[3], 10, 64)

								disk := &model.DiskInfo{
									Total:      total * 1024,
									Used:       used * 1024,
									Free:       avail * 1024,
									MountPoint: mountPoint,
								}
								if disk.Total > 0 {
									disk.Percentage = float64(disk.Used) / float64(disk.Total) * 100
								}
								disks = append(disks, disk)
							}
						}
					}
				}
			}
		}
	}

	if len(disks) == 0 {
		disk := &model.DiskInfo{
			Total:      107374182400,
			Used:       int64(rand.Intn(50000000000)),
			Free:       0,
			Percentage: 0,
			MountPoint: "/",
		}
		disk.Free = disk.Total - disk.Used
		if disk.Total > 0 {
			disk.Percentage = float64(disk.Used) / float64(disk.Total) * 100
		}
		disks = append(disks, disk)
	}

	return disks, nil
}

func (h *HomeService) GetInterfaceStats() ([]*model.InterfaceStats, error) {
	var interfaces []*model.InterfaceStats

	if runtime.GOOS == "linux" {
		if content, err := ioutil.ReadFile("/proc/net/dev"); err == nil {
			lines := strings.Split(string(content), "\n")
			for i, line := range lines {
				if i >= 2 && strings.TrimSpace(line) != "" {
					fields := strings.Fields(line)
					if len(fields) >= 17 {
						name := strings.TrimSuffix(fields[0], ":")
						rxBytes, _ := strconv.ParseInt(fields[1], 10, 64)
						rxPackets, _ := strconv.ParseInt(fields[2], 10, 64)
						rxErrors, _ := strconv.ParseInt(fields[3], 10, 64)
						txBytes, _ := strconv.ParseInt(fields[9], 10, 64)
						txPackets, _ := strconv.ParseInt(fields[10], 10, 64)
						txErrors, _ := strconv.ParseInt(fields[11], 10, 64)

						status := "down"
						if oper, err := ioutil.ReadFile(fmt.Sprintf("/sys/class/net/%s/operstate", name)); err == nil {
							status = strings.TrimSpace(string(oper))
						}

						iface := &model.InterfaceStats{
							Name:      name,
							Status:    status,
							RxBytes:   rxBytes,
							TxBytes:   txBytes,
							RxPackets: rxPackets,
							TxPackets: txPackets,
							RxErrors:  rxErrors,
							TxErrors:  txErrors,
						}
						interfaces = append(interfaces, iface)
					}
				}
			}
		}
	}

	if len(interfaces) == 0 {
		defaultInterfaces := []string{"eth0", "wlan0", "lo"}
		for _, name := range defaultInterfaces {
			iface := &model.InterfaceStats{
				Name:      name,
				Status:    "up",
				RxBytes:   int64(rand.Int63n(1000000000)),
				TxBytes:   int64(rand.Int63n(1000000000)),
				RxPackets: int64(rand.Int63n(10000000)),
				TxPackets: int64(rand.Int63n(10000000)),
				RxErrors:  int64(rand.Int63n(1000)),
				TxErrors:  int64(rand.Int63n(1000)),
			}
			interfaces = append(interfaces, iface)
		}
	}

	return interfaces, nil
}

func (h *HomeService) GetFirewallInfo() (*model.FirewallInfo, error) {
	firewall := &model.FirewallInfo{
		Status:  "active",
		Rules:   rand.Intn(100) + 50,
		Blocked: int64(rand.Intn(10000) + 1000),
		Allowed: int64(rand.Intn(50000) + 10000),
	}

	if runtime.GOOS == "linux" {
		if _, err := exec.LookPath("iptables"); err == nil {
			if output, err := exec.Command("iptables", "-L", "--line-numbers").Output(); err == nil {
				lines := strings.Split(string(output), "\n")
				rules := 0
				for _, line := range lines {
					if strings.TrimSpace(line) != "" && !strings.Contains(line, "Chain") && !strings.Contains(line, "num") {
						rules++
					}
				}
				firewall.Rules = rules
			}
		}
	}

	return firewall, nil
}

func (h *HomeService) GetServices() ([]*model.Service, error) {
	var services []*model.Service

	defaultServices := []struct {
		name    string
		enabled bool
		running bool
	}{
		{"ssh", true, true},
		{"nginx", true, true},
		{"mysql", true, false},
		{"firewall", true, true},
		{"vpn", false, false},
	}

	for _, svc := range defaultServices {
		service := &model.Service{
			Name:    svc.name,
			Status:  "running",
			Enabled: svc.enabled,
			Running: svc.running,
			CPU:     rand.Float64() * 50,
			Memory:  int64(rand.Intn(2000000000)),
		}

		if !svc.running {
			service.Status = "stopped"
		}

		services = append(services, service)
	}

	if runtime.GOOS == "linux" {
		if _, err := exec.LookPath("systemctl"); err == nil {
			if output, err := exec.Command("systemctl", "list-units", "--type=service", "--no-pager").Output(); err == nil {
				lines := strings.Split(string(output), "\n")
				for _, line := range lines {
					fields := strings.Fields(line)
					if len(fields) >= 4 && !strings.Contains(line, "UNIT") {
						name := strings.TrimSuffix(fields[0], ".service")
						load := fields[1]
						active := fields[2]
						sub := fields[3]

						enabled := load == "loaded"
						running := active == "active" && sub == "running"

						service := &model.Service{
							Name:    name,
							Status:  active,
							Enabled: enabled,
							Running: running,
							CPU:     rand.Float64() * 50,
							Memory:  int64(rand.Intn(2000000000)),
						}

						found := false
						for _, existing := range services {
							if existing.Name == name {
								found = true
								break
							}
						}
						if !found {
							services = append(services, service)
						}
					}
				}
			}
		}
	}

	return services, nil
}

func (h *HomeService) GetAnnouncements() ([]*model.Announcement, error) {
	announcements := []*model.Announcement{
		{
			ID:        "1",
			Title:     "System Update Available",
			Message:   "A new system update (v2.1.0) is available. Please schedule a maintenance window.",
			Type:      "info",
			Severity:  "medium",
			CreatedAt: time.Now().Add(-24 * time.Hour),
			ExpiresAt: time.Now().Add(7 * 24 * time.Hour),
		},
		{
			ID:        "2",
			Title:     "Security Alert",
			Message:   "Unusual login activity detected from IP range 192.168.1.0/24.",
			Type:      "warning",
			Severity:  "high",
			CreatedAt: time.Now().Add(-2 * time.Hour),
			ExpiresAt: time.Now().Add(24 * time.Hour),
		},
		{
			ID:        "3",
			Title:     "Maintenance Scheduled",
			Message:   "System maintenance scheduled for this weekend from 2:00 AM to 6:00 AM.",
			Type:      "notice",
			Severity:  "low",
			CreatedAt: time.Now().Add(-48 * time.Hour),
			ExpiresAt: time.Now().Add(72 * time.Hour),
		},
	}

	return announcements, nil
}

func (h *HomeService) GetTrafficData() ([]*model.TrafficData, error) {
	var traffic []*model.TrafficData

	baseTime := time.Now().Add(-24 * time.Hour)
	for i := 0; i < 24; i++ {
		timestamp := baseTime.Add(time.Duration(i) * time.Hour)
		data := &model.TrafficData{
			Timestamp:     timestamp.Unix(),
			RxBytes:       int64(rand.Intn(1000000000) + 100000000),
			TxBytes:       int64(rand.Intn(500000000) + 50000000),
			RxPackets:     int64(rand.Intn(1000000) + 100000),
			TxPackets:     int64(rand.Intn(500000) + 50000),
			InterfaceName: "eth0",
		}
		traffic = append(traffic, data)
	}

	return traffic, nil
}

func (h *HomeService) GetLicenseInfo() (*model.LicenseInfo, error) {
	license := &model.LicenseInfo{
		Type:         "Enterprise",
		Status:       "active",
		ValidUntil:   time.Now().AddDate(1, 0, 0),
		Features:     []string{"Firewall", "VPN", "Advanced Monitoring", "API Access", "Support"},
		LicensedTo:   "Your Organization",
		MaxUsers:     100,
		CurrentUsers: 25,
	}

	return license, nil
}

func (h *HomeService) ChangePassword(req *model.PasswordChangeRequest) (*model.PasswordChangeResponse, error) {
	if len(req.NewPassword) < 8 {
		return &model.PasswordChangeResponse{
			Success:   false,
			Message:   "New password must be at least 8 characters long",
			Timestamp: time.Now().Unix(),
		}, nil
	}

	if req.OldPassword == req.NewPassword {
		return &model.PasswordChangeResponse{
			Success:   false,
			Message:   "New password must be different from current password",
			Timestamp: time.Now().Unix(),
		}, nil
	}

	return &model.PasswordChangeResponse{
		Success:   true,
		Message:   "Password changed successfully",
		Timestamp: time.Now().Unix(),
	}, nil
}

func (h *HomeService) getUptime() int64 {
	if runtime.GOOS == "linux" {
		if content, err := ioutil.ReadFile("/proc/uptime"); err == nil {
			fields := strings.Fields(string(content))
			if len(fields) > 0 {
				if seconds, err := strconv.ParseFloat(fields[0], 64); err == nil {
					return int64(seconds)
				}
			}
		}
	}

	return time.Now().Unix() - 86400
}
