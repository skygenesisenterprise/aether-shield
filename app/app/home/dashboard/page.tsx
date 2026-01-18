"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Plus,
  RotateCcw,
  Save,
  Edit3,
  Activity,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Shield,
  Bell,
  ChevronDown,
  ChevronUp,
  X,
  BarChart3,
  Server,
  FileText,
  Thermometer,
  Clock,
  Wifi,
  Globe,
} from "lucide-react";

interface WidgetData {
  id: string;
  title: string;
  icon: React.ElementType;
  content: React.ReactNode;
  size: "small" | "medium" | "large";
  minimized?: boolean;
}

export default function Dashboard() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [widgets, setWidgets] = useState<WidgetData[]>([
    {
      id: "system-info",
      title: "System Information",
      icon: Settings,
      content: <SystemInfoWidget />,
      size: "medium",
    },
    {
      id: "cpu",
      title: "CPU Usage",
      icon: Cpu,
      content: <CpuWidget />,
      size: "small",
    },
    {
      id: "memory",
      title: "Memory Usage",
      icon: MemoryStick,
      content: <MemoryWidget />,
      size: "small",
    },
    {
      id: "disk",
      title: "Disk Usage",
      icon: HardDrive,
      content: <DiskWidget />,
      size: "small",
    },
    {
      id: "temperature",
      title: "Temperature",
      icon: Thermometer,
      content: <TemperatureWidget />,
      size: "small",
    },
    {
      id: "announcements",
      title: "Announcements",
      icon: Bell,
      content: <AnnouncementsWidget />,
      size: "medium",
    },
    {
      id: "gateways",
      title: "Gateways",
      icon: Activity,
      content: <GatewaysWidget />,
      size: "small",
    },
    {
      id: "interfaces",
      title: "Interface Statistics",
      icon: Network,
      content: <InterfacesWidget />,
      size: "large",
    },
    {
      id: "firewall",
      title: "Firewall",
      icon: Shield,
      content: <FirewallWidget />,
      size: "medium",
    },
    {
      id: "traffic-graph",
      title: "Traffic Graph",
      icon: BarChart3,
      content: <TrafficGraphWidget />,
      size: "large",
    },
    {
      id: "services",
      title: "Services",
      icon: Server,
      content: <ServicesWidget />,
      size: "medium",
    },
    {
      id: "ntp-status",
      title: "NTP Status",
      icon: Clock,
      content: <NtpStatusWidget />,
      size: "small",
    },
  ]);

  const toggleWidgetMinimized = (id: string) => {
    setWidgets((prev) =>
      prev.map((widget) =>
        widget.id === id ? { ...widget, minimized: !widget.minimized } : widget,
      ),
    );
  };

  const removeWidget = (id: string) => {
    setWidgets((prev) => prev.filter((widget) => widget.id !== id));
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case "small":
        return "col-span-12 md:col-span-6 lg:col-span-4";
      case "medium":
        return "col-span-12 md:col-span-6 lg:col-span-8";
      case "large":
        return "col-span-12 lg:col-span-12";
      default:
        return "col-span-12";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          {isEditMode && (
            <>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Widget
              </Button>
              <Button variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Restore Default
              </Button>
              <Button variant="default" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </>
          )}
          <Button
            variant={isEditMode ? "default" : "outline"}
            size="sm"
            onClick={() => setIsEditMode(!isEditMode)}
          >
            <Edit3 className="h-4 w-4 mr-2" />
            {isEditMode ? "Exit Edit" : "Edit Dashboard"}
          </Button>
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-12 gap-4">
        {widgets.map((widget) => (
          <Card
            key={widget.id}
            className={`${getSizeClasses(widget.size)} ${isEditMode ? "ring-2 ring-primary/20" : ""}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <widget.icon className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">{widget.title}</CardTitle>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => toggleWidgetMinimized(widget.id)}
                  >
                    {widget.minimized ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronUp className="h-4 w-4" />
                    )}
                  </Button>
                  {isEditMode && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => removeWidget(widget.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            {!widget.minimized && (
              <CardContent className="pt-0">{widget.content}</CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

// Widget Components
function SystemInfoWidget() {
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-sm text-muted-foreground">Version</span>
        <span className="text-sm font-medium">Aether Shield 24.1</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-muted-foreground">Updates</span>
        <span className="text-sm font-medium text-green-600">Up to date</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-muted-foreground">Uptime</span>
        <span className="text-sm font-medium">15 days, 7:32:45</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-muted-foreground">Platform</span>
        <span className="text-sm font-medium">FreeBSD 14.0</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-muted-foreground">Hardware</span>
        <span className="text-sm font-medium">Intel NUC</span>
      </div>
    </div>
  );
}

function CpuWidget() {
  const [usage, setUsage] = useState(25);
  const [loadAvg, setLoadAvg] = useState([0.45, 0.32, 0.28]);

  useEffect(() => {
    const interval = setInterval(() => {
      setUsage(Math.floor(Math.random() * 40) + 10);
      setLoadAvg([
        Math.round(Math.random() * 2 * 100) / 100,
        Math.round(Math.random() * 1.5 * 100) / 100,
        Math.round(Math.random() * 1 * 100) / 100,
      ]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Usage</span>
        <span className="text-2xl font-bold">{usage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${usage}%` }}
        />
      </div>
      <div className="text-xs text-muted-foreground">
        Load average: {loadAvg[0]}, {loadAvg[1]}, {loadAvg[2]}
      </div>
      <div className="text-xs text-muted-foreground">
        Intel i7-8550U @ 1.80GHz
      </div>
    </div>
  );
}

function MemoryWidget() {
  const [usage, setUsage] = useState(67);
  const [total, setTotal] = useState(8192);
  const [used, setUsed] = useState(5488);

  useEffect(() => {
    const interval = setInterval(() => {
      const newUsage = Math.floor(Math.random() * 20) + 60;
      setUsage(newUsage);
      setUsed(Math.round((newUsage / 100) * total));
    }, 5000);
    return () => clearInterval(interval);
  }, [total]);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Usage</span>
        <span className="text-2xl font-bold">{usage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-green-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${usage}%` }}
        />
      </div>
      <div className="text-xs text-muted-foreground">
        {Math.round(used / 1024)} GB / {Math.round(total / 1024)} GB used
      </div>
      <div className="text-xs text-muted-foreground">Swap: 0 MB / 2048 MB</div>
    </div>
  );
}

function DiskWidget() {
  const [disks, setDisks] = useState([
    { name: "/", size: 40, used: 18, mount: "/" },
    { name: "var", size: 20, used: 2.4, mount: "/var" },
    { name: "tmp", size: 10, used: 0.5, mount: "/tmp" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisks((prev) =>
        prev.map((disk) => ({
          ...disk,
          used: Math.max(0.5, disk.used + (Math.random() - 0.5) * 0.2),
        })),
      );
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3">
      {disks.map((disk, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{disk.mount}</span>
            <span>{Math.round((disk.used / disk.size) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full ${
                disk.mount === "/"
                  ? "bg-orange-500"
                  : disk.mount === "/var"
                    ? "bg-blue-500"
                    : "bg-gray-500"
              }`}
              style={{ width: `${(disk.used / disk.size) * 100}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            {disk.used.toFixed(1)} GB / {disk.size} GB
          </div>
        </div>
      ))}
    </div>
  );
}

function TemperatureWidget() {
  const [temps, setTemps] = useState([
    { name: "CPU", temp: 45, max: 85 },
    { name: "System", temp: 38, max: 70 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTemps((prev) =>
        prev.map((temp) => ({
          ...temp,
          temp: Math.max(30, temp.temp + (Math.random() - 0.5) * 5),
        })),
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3">
      {temps.map((temp, index) => (
        <div key={index} className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{temp.name}</span>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium ${
                temp.temp > temp.max * 0.8
                  ? "text-red-600"
                  : temp.temp > temp.max * 0.6
                    ? "text-yellow-600"
                    : "text-green-600"
              }`}
            >
              {temp.temp.toFixed(1)}°C
            </span>
            <div className="w-12 bg-gray-200 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full ${
                  temp.temp > temp.max * 0.8
                    ? "bg-red-500"
                    : temp.temp > temp.max * 0.6
                      ? "bg-yellow-500"
                      : "bg-green-500"
                }`}
                style={{ width: `${(temp.temp / temp.max) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function InterfacesWidget() {
  const [interfaces, setInterfaces] = useState([
    {
      name: "wan",
      status: "up",
      ip: "192.168.1.10",
      media: "1Gbps",
      rx: 1234567,
      tx: 856432,
      rxRate: 1.2,
      txRate: 0.8,
      errors: 0,
      collisions: 0,
    },
    {
      name: "lan",
      status: "up",
      ip: "10.0.0.1",
      media: "2.5Gbps",
      rx: 45678901,
      tx: 23456789,
      rxRate: 45.6,
      txRate: 23.4,
      errors: 0,
      collisions: 0,
    },
    {
      name: "opt1",
      status: "down",
      ip: "-",
      media: "-",
      rx: 0,
      tx: 0,
      rxRate: 0,
      txRate: 0,
      errors: 0,
      collisions: 0,
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setInterfaces((prev) =>
        prev.map((iface) => ({
          ...iface,
          rx: iface.rx + Math.floor(Math.random() * 10000),
          tx: iface.tx + Math.floor(Math.random() * 8000),
          rxRate:
            iface.status === "up"
              ? Math.max(0.1, iface.rxRate + (Math.random() - 0.5) * 2)
              : 0,
          txRate:
            iface.status === "up"
              ? Math.max(0.1, iface.txRate + (Math.random() - 0.5) * 1.5)
              : 0,
        })),
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Interface</th>
              <th className="text-left py-2">Status</th>
              <th className="text-left py-2">IP Address</th>
              <th className="text-left py-2">Media</th>
              <th className="text-right py-2">RX Rate</th>
              <th className="text-right py-2">TX Rate</th>
              <th className="text-right py-2">RX Total</th>
              <th className="text-right py-2">TX Total</th>
              <th className="text-right py-2">Errors</th>
            </tr>
          </thead>
          <tbody>
            {interfaces.map((iface) => (
              <tr key={iface.name} className="border-b">
                <td className="py-2 font-medium">{iface.name.toUpperCase()}</td>
                <td className="py-2">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      iface.status === "up"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {iface.status}
                  </span>
                </td>
                <td className="py-2">{iface.ip}</td>
                <td className="py-2">{iface.media}</td>
                <td className="py-2 text-right">
                  {iface.rxRate.toFixed(1)} Mbps
                </td>
                <td className="py-2 text-right">
                  {iface.txRate.toFixed(1)} Mbps
                </td>
                <td className="py-2 text-right">{formatBytes(iface.rx)}</td>
                <td className="py-2 text-right">{formatBytes(iface.tx)}</td>
                <td className="py-2 text-right">{iface.errors}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FirewallWidget() {
  const [logs, setLogs] = useState([
    {
      time: "10:32:15",
      action: "block",
      src: "192.168.1.100",
      dst: "8.8.8.8",
      port: 53,
      proto: "UDP",
      rule: "Block Malicious IPs",
    },
    {
      time: "10:31:45",
      action: "pass",
      src: "10.0.0.50",
      dst: "192.168.1.10",
      port: 443,
      proto: "TCP",
      rule: "Allow LAN to WAN",
    },
    {
      time: "10:31:12",
      action: "block",
      src: "192.168.1.75",
      dst: "10.0.0.1",
      port: 22,
      proto: "TCP",
      rule: "Block SSH from WAN",
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs((prev) => {
        const newLog = {
          time: new Date().toLocaleTimeString("en-US", { hour12: false }),
          action: Math.random() > 0.7 ? "block" : "pass",
          src: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
          dst: Math.random() > 0.5 ? "8.8.8.8" : "10.0.0.1",
          port: Math.floor(Math.random() * 65535),
          proto: Math.random() > 0.5 ? "TCP" : "UDP",
          rule:
            Math.random() > 0.5 ? "Allow LAN to WAN" : "Block Malicious IPs",
        };
        return [newLog, ...prev.slice(0, 4)];
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Recent firewall activity
        </span>
        <Button variant="outline" size="sm">
          View Live Log
        </Button>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {logs.map((log, index) => (
          <div
            key={index}
            className="flex items-center justify-between text-sm p-2 rounded bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-mono">
                {log.time}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  log.action === "block"
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {log.action}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {log.proto}
              </span>
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              {log.src} → {log.dst}:{log.port}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GatewaysWidget() {
  const [gateways, setGateways] = useState([
    {
      name: "WAN_GW",
      ip: "192.168.1.1",
      status: "online",
      rtt: "12ms",
      loss: "0%",
      statusDesc: "Online",
    },
    {
      name: "LAN_GW",
      ip: "10.0.0.1",
      status: "online",
      rtt: "1ms",
      loss: "0%",
      statusDesc: "Online",
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGateways((prev) =>
        prev.map((gw) => ({
          ...gw,
          rtt: `${Math.max(1, Math.floor(Math.random() * 20))}ms`,
          loss:
            gw.status === "online"
              ? "0%"
              : Math.floor(Math.random() * 10) + "%",
        })),
      );
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3">
      {gateways.map((gw) => (
        <div
          key={gw.name}
          className="flex items-center justify-between p-3 rounded bg-gray-50"
        >
          <div>
            <div className="text-sm font-medium">{gw.name}</div>
            <div className="text-xs text-muted-foreground">{gw.ip}</div>
          </div>
          <div className="text-right">
            <div
              className={`text-xs font-medium ${
                gw.status === "online" ? "text-green-600" : "text-red-600"
              }`}
            >
              {gw.statusDesc}
            </div>
            <div className="text-xs text-muted-foreground">RTT: {gw.rtt}</div>
            <div className="text-xs text-muted-foreground">Loss: {gw.loss}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AnnouncementsWidget() {
  const [announcements, setAnnouncements] = useState([
    {
      type: "security",
      title: "Security Update Available",
      message: "Aether Shield 24.1.1 includes important security fixes",
      date: "2025-01-15",
      priority: "high",
    },
    {
      type: "feature",
      title: "New Feature Released",
      message: "Advanced traffic shaping now available",
      date: "2025-01-10",
      priority: "medium",
    },
    {
      type: "maintenance",
      title: "Scheduled Maintenance",
      message: "System maintenance planned for this weekend",
      date: "2025-01-08",
      priority: "low",
    },
  ]);

  return (
    <div className="space-y-3">
      {announcements.map((announcement, index) => (
        <div
          key={index}
          className={`p-3 rounded border ${
            announcement.type === "security"
              ? "bg-red-50 border-red-200"
              : announcement.type === "feature"
                ? "bg-green-50 border-green-200"
                : "bg-blue-50 border-blue-200"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div
                className={`text-sm font-medium ${
                  announcement.type === "security"
                    ? "text-red-800"
                    : announcement.type === "feature"
                      ? "text-green-800"
                      : "text-blue-800"
                }`}
              >
                {announcement.title}
              </div>
              <div
                className={`text-xs mt-1 ${
                  announcement.type === "security"
                    ? "text-red-600"
                    : announcement.type === "feature"
                      ? "text-green-600"
                      : "text-blue-600"
                }`}
              >
                {announcement.message}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {announcement.date}
              </div>
            </div>
            <div
              className={`w-2 h-2 rounded-full mt-1 ${
                announcement.priority === "high"
                  ? "bg-red-500"
                  : announcement.priority === "medium"
                    ? "bg-yellow-500"
                    : "bg-blue-500"
              }`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function TrafficGraphWidget() {
  const [trafficData, setTrafficData] = useState([
    { time: "00:00", rx: 120, tx: 85 },
    { time: "04:00", rx: 95, tx: 70 },
    { time: "08:00", rx: 280, tx: 195 },
    { time: "12:00", rx: 420, tx: 310 },
    { time: "16:00", rx: 380, tx: 285 },
    { time: "20:00", rx: 320, tx: 240 },
    { time: "23:59", rx: 180, tx: 125 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrafficData((prev) => {
        const newData = [...prev.slice(1)];
        const lastRx = prev[prev.length - 1].rx;
        const lastTx = prev[prev.length - 1].tx;
        newData.push({
          time: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          rx: Math.max(50, lastRx + Math.floor(Math.random() * 100) - 50),
          tx: Math.max(30, lastTx + Math.floor(Math.random() * 80) - 40),
        });
        return newData;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const maxTraffic = Math.max(...trafficData.map((d) => Math.max(d.rx, d.tx)));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Network Traffic (last 24h)
        </span>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span>RX: {trafficData[trafficData.length - 1].rx} Mbps</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>TX: {trafficData[trafficData.length - 1].tx} Mbps</span>
          </div>
        </div>
      </div>
      <div className="h-48 flex items-end justify-between gap-1">
        {trafficData.map((data, index) => (
          <div key={index} className="flex-1 flex flex-col gap-1">
            <div className="flex gap-1">
              <div
                className="flex-1 bg-blue-500 rounded-t"
                style={{ height: `${(data.rx / maxTraffic) * 100}%` }}
              />
              <div
                className="flex-1 bg-green-500 rounded-t"
                style={{ height: `${(data.tx / maxTraffic) * 100}%` }}
              />
            </div>
            <div className="text-xs text-center text-muted-foreground">
              {data.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServicesWidget() {
  const [services, setServices] = useState([
    {
      name: "DHCP Server",
      status: "running",
      icon: Server,
      description: "IPv4 DHCP Server",
      pid: 1234,
      memory: "12 MB",
    },
    {
      name: "DNS Forwarder",
      status: "running",
      icon: Globe,
      description: "DNS Forwarder (Unbound)",
      pid: 5678,
      memory: "8 MB",
    },
    {
      name: "SSH Daemon",
      status: "running",
      icon: Shield,
      description: "Secure Shell Daemon",
      pid: 9012,
      memory: "4 MB",
    },
    {
      name: "NTP Daemon",
      status: "stopped",
      icon: Clock,
      description: "Network Time Protocol",
      pid: null,
      memory: "0 MB",
    },
    {
      name: "Syslog",
      status: "running",
      icon: FileText,
      description: "System Logger",
      pid: 3456,
      memory: "6 MB",
    },
  ]);

  const toggleService = (serviceName: string) => {
    setServices((prev) =>
      prev.map((service) =>
        service.name === serviceName
          ? {
              ...service,
              status: service.status === "running" ? "stopped" : "running",
            }
          : service,
      ),
    );
  };

  return (
    <div className="space-y-2">
      {services.map((service, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3 rounded bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <service.icon className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">{service.name}</div>
              <div className="text-xs text-muted-foreground">
                {service.description}
              </div>
              {service.pid && (
                <div className="text-xs text-muted-foreground">
                  PID: {service.pid} | Memory: {service.memory}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                service.status === "running"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {service.status}
            </span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => toggleService(service.name)}
              >
                <span className="text-xs">
                  {service.status === "running" ? "⏸" : "▶"}
                </span>
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <span className="text-xs">⟳</span>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function NtpStatusWidget() {
  const [ntpStatus, setNtpStatus] = useState({
    status: "synced",
    server: "pool.ntp.org",
    offset: "2.3 ms",
    jitter: "0.5 ms",
    stratum: 2,
    lastUpdate: "",
  });

  useEffect(() => {
    setNtpStatus((prev) => ({
      ...prev,
      lastUpdate: new Date().toLocaleTimeString(),
    }));

    const interval = setInterval(() => {
      setNtpStatus((prev) => ({
        ...prev,
        offset: `${(Math.random() * 5).toFixed(1)} ms`,
        jitter: `${(Math.random() * 2).toFixed(1)} ms`,
        lastUpdate: new Date().toLocaleTimeString(),
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Status</span>
        <span
          className={`text-sm font-medium ${
            ntpStatus.status === "synced" ? "text-green-600" : "text-red-600"
          }`}
        >
          {ntpStatus.status === "synced" ? "Synced" : "Unsynced"}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Server</span>
        <span className="text-sm font-medium">{ntpStatus.server}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Offset</span>
        <span className="text-sm font-medium">{ntpStatus.offset}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Jitter</span>
        <span className="text-sm font-medium">{ntpStatus.jitter}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Stratum</span>
        <span className="text-sm font-medium">{ntpStatus.stratum}</span>
      </div>
      <div className="text-xs text-muted-foreground">
        Last update: {ntpStatus.lastUpdate}
      </div>
    </div>
  );
}
