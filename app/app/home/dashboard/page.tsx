"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  AlertTriangle,
  Server,
  Cpu,
  HardDrive,
  MemoryStick,
  Router,
  Megaphone,
  LineChart,
  Settings,
  Bell,
  XCircle,
  Info,
  Wifi,
  WifiOff,
  TrendingUp,
  TrendingDown,
  Layers,
} from "lucide-react";

interface SystemInfo {
  hostname: string;
  os: string;
  kernel: string;
  uptime: string;
  architecture: string;
}

interface MemoryInfo {
  total: number;
  used: number;
  available: number;
  percentage: number;
}

interface DiskInfo {
  total: number;
  used: number;
  free: number;
  percentage: number;
  mountPoint: string;
}

interface InterfaceStats {
  name: string;
  status: "up" | "down";
  rx: number;
  tx: number;
  packets: number;
  errors: number;
}

interface FirewallInfo {
  status: "active" | "inactive";
  rules: number;
  blocked: number;
  allowed: number;
}

interface CpuInfo {
  usage: number;
  cores: number;
  frequency: string;
  temperature: number;
}

interface ServiceInfo {
  name: string;
  status: "running" | "stopped" | "failed";
  cpu: number;
  memory: number;
}

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "critical";
  date: string;
}

interface TrafficData {
  time: string;
  upload: number;
  download: number;
}

export default function Dashboard() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    hostname: "aether-shield",
    os: "Ubuntu 24.04 LTS",
    kernel: "6.8.0-41-generic",
    uptime: "15d 7h 32m",
    architecture: "x86_64",
  });

  const [memoryInfo, setMemoryInfo] = useState<MemoryInfo>({
    total: 16384,
    used: 8192,
    available: 8192,
    percentage: 50,
  });

  const [diskInfo, setDiskInfo] = useState<DiskInfo>({
    total: 512000,
    used: 256000,
    free: 256000,
    percentage: 50,
    mountPoint: "/",
  });

  const [interfaceStats, setInterfaceStats] = useState<InterfaceStats[]>([
    {
      name: "eth0",
      status: "up",
      rx: 1024000,
      tx: 512000,
      packets: 15000,
      errors: 0,
    },
    {
      name: "wlan0",
      status: "up",
      rx: 512000,
      tx: 256000,
      packets: 8000,
      errors: 2,
    },
  ]);

  const [firewallInfo, setFirewallInfo] = useState<FirewallInfo>({
    status: "active",
    rules: 42,
    blocked: 127,
    allowed: 89,
  });

  const [cpuInfo, setCpuInfo] = useState<CpuInfo>({
    usage: 35,
    cores: 8,
    frequency: "3.2 GHz",
    temperature: 45,
  });

  const [services, setServices] = useState<ServiceInfo[]>([
    { name: "nginx", status: "running", cpu: 2.5, memory: 128 },
    { name: "mysql", status: "running", cpu: 8.3, memory: 512 },
    { name: "redis", status: "running", cpu: 1.2, memory: 64 },
    { name: "docker", status: "running", cpu: 15.7, memory: 2048 },
  ]);

  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: "1",
      title: "System Update Available",
      message:
        "Aether Shield 24.1.1 is ready to install with security improvements",
      type: "info",
      date: "2 hours ago",
    },
    {
      id: "2",
      title: "Maintenance Scheduled",
      message: "Scheduled maintenance on Sunday 2AM - 4AM EST",
      type: "warning",
      date: "1 day ago",
    },
  ]);

  const [trafficData, setTrafficData] = useState<TrafficData[]>([
    { time: "00:00", upload: 45, download: 120 },
    { time: "04:00", upload: 32, download: 85 },
    { time: "08:00", upload: 78, download: 245 },
    { time: "12:00", upload: 95, download: 320 },
    { time: "16:00", upload: 88, download: 285 },
    { time: "20:00", upload: 65, download: 195 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuInfo((prev) => ({
        ...prev,
        usage: Math.max(
          10,
          Math.min(90, prev.usage + (Math.random() - 0.5) * 5),
        ),
        temperature: Math.max(
          35,
          Math.min(75, prev.temperature + (Math.random() - 0.5) * 2),
        ),
      }));

      setMemoryInfo((prev) => ({
        ...prev,
        used: Math.max(
          4096,
          Math.min(14336, prev.used + (Math.random() - 0.5) * 100),
        ),
        percentage: Math.max(
          25,
          Math.min(
            87.5,
            ((prev.used + (Math.random() - 0.5) * 100) / prev.total) * 100,
          ),
        ),
      }));

      setInterfaceStats((prev) =>
        prev.map((iface) => ({
          ...iface,
          rx: iface.rx + Math.floor(Math.random() * 1000),
          tx: iface.tx + Math.floor(Math.random() * 500),
          packets: iface.packets + Math.floor(Math.random() * 10),
        })),
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes: number) => {
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 B";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
      case "up":
      case "active":
        return "text-green-600 bg-green-50 border-green-200";
      case "stopped":
      case "down":
      case "inactive":
        return "text-red-600 bg-red-50 border-red-200";
      case "failed":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-600" />;
      default:
        return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 overflow-hidden">
      <div className="container mx-auto px-6 py-6 h-full flex flex-col">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Aether Shield
              </h1>
              <p className="text-slate-600 mt-1">System Monitoring Dashboard</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:border-slate-300"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:border-slate-300"
              >
                <Bell className="h-4 w-4 mr-2" />
                Alerts
              </Button>
            </div>
          </div>
        </div>

        {/* Main Grid Layout - 2 rows optimized */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 flex-1 overflow-hidden">
          {/* First Row - System Info & Resources */}
          {/* System Information Widget */}
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-slate-900">
                <div className="p-1 bg-linear-to-br from-blue-50 to-cyan-50 rounded">
                  <Server className="h-4 w-4 text-blue-600" />
                </div>
                System
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs">
                <span className="text-slate-600">Host:</span>
                <span className="ml-1 font-medium text-slate-900">
                  {systemInfo.hostname}
                </span>
              </div>
              <div className="text-xs">
                <span className="text-slate-600">OS:</span>
                <span className="ml-1 font-medium text-slate-900">
                  {systemInfo.os.split(" ")[0]}
                </span>
              </div>
              <div className="text-xs">
                <span className="text-slate-600">Uptime:</span>
                <span className="ml-1 font-medium text-slate-900">
                  {systemInfo.uptime}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* CPU Widget */}
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-slate-900">
                <div className="p-1 bg-linear-to-br from-orange-50 to-red-50 rounded">
                  <Cpu className="h-4 w-4 text-orange-600" />
                </div>
                CPU
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">
                  {cpuInfo.usage}%
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mt-2">
                  <div
                    className="bg-linear-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${cpuInfo.usage}%` }}
                  />
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {cpuInfo.cores} cores • {cpuInfo.temperature}°C
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Memory Widget */}
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-slate-900">
                <div className="p-1 bg-linear-to-br from-green-50 to-emerald-50 rounded">
                  <MemoryStick className="h-4 w-4 text-green-600" />
                </div>
                Memory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">
                  {memoryInfo.percentage}%
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mt-2">
                  <div
                    className="bg-linear-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${memoryInfo.percentage}%` }}
                  />
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {formatBytes(memoryInfo.used * 1024 * 1024)} /{" "}
                  {formatBytes(memoryInfo.total * 1024 * 1024)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disk Widget */}
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-slate-900">
                <div className="p-1 bg-linear-to-br from-purple-50 to-indigo-50 rounded">
                  <HardDrive className="h-4 w-4 text-purple-600" />
                </div>
                Disk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">
                  {diskInfo.percentage}%
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mt-2">
                  <div
                    className="bg-linear-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${diskInfo.percentage}%` }}
                  />
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {formatBytes(diskInfo.free * 1024 * 1024)} free
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Firewall Widget */}
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-slate-900">
                <div className="p-1 bg-linear-to-br from-red-50 to-orange-50 rounded">
                  <Shield className="h-4 w-4 text-red-600" />
                </div>
                Firewall
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium mb-2 ${getStatusColor(firewallInfo.status)}`}
                >
                  {firewallInfo.status}
                </div>
                <div className="text-lg font-bold text-slate-900">
                  {firewallInfo.rules}
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs mt-2">
                  <div className="text-center p-1 bg-green-50/50 rounded">
                    <div className="font-medium text-green-600">
                      {firewallInfo.allowed}
                    </div>
                    <div className="text-slate-600">Allowed</div>
                  </div>
                  <div className="text-center p-1 bg-red-50/50 rounded">
                    <div className="font-medium text-red-600">
                      {firewallInfo.blocked}
                    </div>
                    <div className="text-slate-600">Blocked</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Announcements Widget */}
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-slate-900">
                <div className="p-1 bg-linear-to-br from-amber-50 to-yellow-50 rounded">
                  <Megaphone className="h-4 w-4 text-amber-600" />
                </div>
                Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {announcements.slice(0, 2).map((announcement) => (
                  <div
                    key={announcement.id}
                    className="p-2 bg-slate-50/50 rounded text-xs"
                  >
                    <div className="flex items-start gap-1">
                      <div className="mt-0.5">
                        {getAnnouncementIcon(announcement.type)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">
                          {announcement.title}
                        </div>
                        <div className="text-slate-600 mt-0.5">
                          {announcement.date}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Second Row - Expanded widgets */}
          {/* Interface Statistics Widget */}
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm hover:shadow-md transition-shadow lg:col-span-2 h-full">
            <CardHeader className="pb-1">
              <CardTitle className="text-sm flex items-center gap-2 text-slate-900">
                <div className="p-1 bg-linear-to-br from-cyan-50 to-blue-50 rounded">
                  <Router className="h-4 w-4 text-cyan-600" />
                </div>
                Network Interfaces
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full overflow-hidden">
              <div className="space-y-1 h-full">
                {interfaceStats.map((iface) => (
                  <div
                    key={iface.name}
                    className="p-1.5 bg-slate-50/50 rounded"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-xs text-slate-900">
                          {iface.name}
                        </span>
                        <div
                          className={`px-1 py-0.5 rounded-full text-xs font-medium ${getStatusColor(iface.status)}`}
                        >
                          {iface.status}
                        </div>
                      </div>
                      {iface.status === "up" ? (
                        <Wifi className="h-3 w-3 text-green-600" />
                      ) : (
                        <WifiOff className="h-3 w-3 text-red-600" />
                      )}
                    </div>
                    <div className="grid grid-cols-4 gap-0.5 text-xs">
                      <div className="text-center">
                        <div className="font-medium text-slate-900 text-xs">
                          {formatBytes(iface.rx)}
                        </div>
                        <div className="text-slate-600 text-xs">RX</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-slate-900 text-xs">
                          {formatBytes(iface.tx)}
                        </div>
                        <div className="text-slate-600 text-xs">TX</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-slate-900 text-xs">
                          {iface.packets.toLocaleString()}
                        </div>
                        <div className="text-slate-600 text-xs">Pkts</div>
                      </div>
                      <div className="text-center">
                        <div
                          className={`font-medium text-xs ${iface.errors > 0 ? "text-red-600" : "text-green-600"}`}
                        >
                          {iface.errors}
                        </div>
                        <div className="text-slate-600 text-xs">Err</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Services Widget */}
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm hover:shadow-md transition-shadow lg:col-span-2 h-full">
            <CardHeader className="pb-1">
              <CardTitle className="text-sm flex items-center gap-2 text-slate-900">
                <div className="p-1 bg-linear-to-br from-blue-50 to-indigo-50 rounded">
                  <Layers className="h-4 w-4 text-blue-600" />
                </div>
                Services
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full overflow-hidden">
              <div className="space-y-1 h-full">
                {services.map((service) => (
                  <div
                    key={service.name}
                    className="flex items-center justify-between p-1.5 bg-slate-50/50 rounded"
                  >
                    <div className="flex items-center gap-1">
                      <div
                        className={`px-1 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}
                      >
                        {service.status}
                      </div>
                      <span className="font-medium text-xs text-slate-900">
                        {service.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <div className="text-center">
                        <div className="font-medium text-slate-900 text-xs">
                          {service.cpu}%
                        </div>
                        <div className="text-slate-600 text-xs">CPU</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-slate-900 text-xs">
                          {formatBytes(service.memory * 1024 * 1024)}
                        </div>
                        <div className="text-slate-600 text-xs">Mem</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Traffic Chart Widget */}
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm hover:shadow-md transition-shadow lg:col-span-2 h-full">
            <CardHeader className="pb-1">
              <CardTitle className="text-sm flex items-center gap-2 text-slate-900">
                <div className="p-1 bg-linear-to-br from-green-50 to-emerald-50 rounded">
                  <LineChart className="h-4 w-4 text-green-600" />
                </div>
                Traffic Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full overflow-hidden">
              <div className="space-y-2 h-full flex flex-col">
                <div className="grid grid-cols-2 gap-1">
                  <div className="flex items-center gap-1 p-1 bg-blue-50/50 rounded">
                    <TrendingUp className="h-3 w-3 text-blue-600" />
                    <div>
                      <div className="text-xs font-medium text-slate-900">
                        Upload
                      </div>
                      <div className="text-xs text-slate-600">65 Mbps</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 p-1 bg-green-50/50 rounded">
                    <TrendingDown className="h-3 w-3 text-green-600" />
                    <div>
                      <div className="text-xs font-medium text-slate-900">
                        Download
                      </div>
                      <div className="text-xs text-slate-600">205 Mbps</div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-slate-50/50 rounded p-1 min-h-0">
                  <div className="h-full flex items-end justify-between gap-0.5">
                    {trafficData.map((data, index) => (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center gap-0.5"
                      >
                        <div className="w-full flex flex-col gap-0.5">
                          <div
                            className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                            style={{ height: `${(data.upload / 100) * 40}px` }}
                          />
                          <div
                            className="bg-gradient-to-t from-green-500 to-green-400 rounded-b"
                            style={{
                              height: `${(data.download / 100) * 40}px`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-slate-600">
                          {data.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded" />
                    <span className="text-slate-600">Upload</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded" />
                    <span className="text-slate-600">Download</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services Widget */}
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm hover:shadow-md transition-shadow lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-slate-900">
                <div className="p-1 bg-gradient-to-br from-blue-50 to-indigo-50 rounded">
                  <Layers className="h-4 w-4 text-blue-600" />
                </div>
                Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {services.map((service) => (
                  <div
                    key={service.name}
                    className="flex items-center justify-between p-2 bg-slate-50/50 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}
                      >
                        {service.status}
                      </div>
                      <span className="font-medium text-sm text-slate-900">
                        {service.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-medium text-slate-900">
                          {service.cpu}%
                        </div>
                        <div className="text-slate-600">CPU</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-slate-900">
                          {formatBytes(service.memory * 1024 * 1024)}
                        </div>
                        <div className="text-slate-600">Mem</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Traffic Chart Widget */}
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm hover:shadow-md transition-shadow lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-slate-900">
                <div className="p-1 bg-gradient-to-br from-green-50 to-emerald-50 rounded">
                  <LineChart className="h-4 w-4 text-green-600" />
                </div>
                Traffic Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1 p-2 bg-blue-50/50 rounded">
                    <TrendingUp className="h-3 w-3 text-blue-600" />
                    <div>
                      <div className="text-xs font-medium text-slate-900">
                        Upload
                      </div>
                      <div className="text-xs text-slate-600">65 Mbps avg</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 p-2 bg-green-50/50 rounded">
                    <TrendingDown className="h-3 w-3 text-green-600" />
                    <div>
                      <div className="text-xs font-medium text-slate-900">
                        Download
                      </div>
                      <div className="text-xs text-slate-600">205 Mbps avg</div>
                    </div>
                  </div>
                </div>
                <div className="h-32 bg-slate-50/50 rounded p-2">
                  <div className="h-full flex items-end justify-between gap-1">
                    {trafficData.map((data, index) => (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center gap-0.5"
                      >
                        <div className="w-full flex flex-col gap-0.5">
                          <div
                            className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                            style={{ height: `${(data.upload / 100) * 50}px` }}
                          />
                          <div
                            className="bg-gradient-to-t from-green-500 to-green-400 rounded-b"
                            style={{
                              height: `${(data.download / 100) * 50}px`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-slate-600">
                          {data.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded" />
                    <span className="text-slate-600">Upload</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded" />
                    <span className="text-slate-600">Download</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
