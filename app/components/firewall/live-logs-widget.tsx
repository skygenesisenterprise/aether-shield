"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Shield,
  XCircle,
  CheckCircle,
  Play,
  Pause,
  Square,
  RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

// TypeScript interfaces
interface FirewallLog {
  id: string;
  timestamp: string;
  action: "block" | "pass";
  interface: "WAN" | "LAN";
  source: string;
  destination: string;
  protocol: "TCP" | "UDP" | "ICMP";
  rule: string;
  country: string;
  reputation: "Malicious" | "Suspicious" | "Trusted" | "Neutral" | "Unknown";
}

interface LogControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onClear: () => void;
  logFilter: "all" | "block" | "pass";
  onFilterChange: (filter: "all" | "block" | "pass") => void;
}

// Initial log data
const initialLogs: FirewallLog[] = [
  {
    id: "1",
    timestamp: new Date().toISOString(),
    action: "block",
    interface: "WAN",
    source: "203.0.113.45:54321",
    destination: "192.168.1.100:443",
    protocol: "TCP",
    rule: "Block External to Internal",
    country: "CN",
    reputation: "Malicious",
  },
  {
    id: "2",
    timestamp: new Date().toISOString(),
    action: "pass",
    interface: "LAN",
    source: "10.0.0.50:52341",
    destination: "8.8.8.8:53",
    protocol: "UDP",
    rule: "Allow DNS",
    country: "US",
    reputation: "Trusted",
  },
  {
    id: "3",
    timestamp: new Date().toISOString(),
    action: "block",
    interface: "WAN",
    source: "198.51.100.23:12345",
    destination: "192.168.1.100:22",
    protocol: "TCP",
    rule: "Block SSH from WAN",
    country: "RU",
    reputation: "Suspicious",
  },
  {
    id: "4",
    timestamp: new Date().toISOString(),
    action: "pass",
    interface: "LAN",
    source: "10.0.0.25:49876",
    destination: "93.184.216.34:80",
    protocol: "TCP",
    rule: "Allow HTTP",
    country: "FR",
    reputation: "Neutral",
  },
  {
    id: "5",
    timestamp: new Date().toISOString(),
    action: "block",
    interface: "WAN",
    source: "192.0.2.100:33333",
    destination: "192.168.1.100:3389",
    protocol: "TCP",
    rule: "Block RDP from WAN",
    country: "BR",
    reputation: "Unknown",
  },
];

// Utility functions
const generateRandomLog = (): FirewallLog => {
  const sourceIPs = [
    "203.0.113.45",
    "198.51.100.23",
    "192.0.2.100",
    "192.168.1.50",
    "10.0.0.25",
    "172.16.0.5",
    "203.0.113.67",
    "198.51.100.89",
  ];
  const destinationIPs = [
    "192.168.1.100",
    "8.8.8.8",
    "93.184.216.34",
    "192.168.1.200",
    "10.0.0.1",
    "172.16.0.1",
    "192.168.1.150",
    "8.8.4.4",
  ];
  const protocols = ["TCP", "UDP", "ICMP"] as const;
  const ports = [22, 53, 80, 443, 3389, 5432, 3306, 8080];
  const countries = ["CN", "RU", "US", "FR", "BR", "DE", "JP", "IN"];
  const reputations = [
    "Malicious",
    "Suspicious",
    "Trusted",
    "Neutral",
    "Unknown",
  ] as const;
  const rules = [
    "Block External to Internal",
    "Allow DNS",
    "Block SSH from WAN",
    "Allow HTTP",
    "Block RDP from WAN",
    "Allow HTTPS",
    "Block Port Scan",
    "Allow Internal Traffic",
  ];

  const isBlock = Math.random() > 0.4;
  const isWAN = Math.random() > 0.3;

  return {
    id: `${Date.now()}-${Math.random()}`,
    timestamp: new Date().toISOString(),
    action: isBlock ? "block" : "pass",
    interface: isWAN ? "WAN" : "LAN",
    source: `${sourceIPs[Math.floor(Math.random() * sourceIPs.length)]}:${Math.floor(Math.random() * 65535)}`,
    destination: `${destinationIPs[Math.floor(Math.random() * destinationIPs.length)]}:${ports[Math.floor(Math.random() * ports.length)]}`,
    protocol: protocols[Math.floor(Math.random() * protocols.length)],
    rule: rules[Math.floor(Math.random() * rules.length)],
    country: countries[Math.floor(Math.random() * countries.length)],
    reputation: reputations[Math.floor(Math.random() * reputations.length)],
  };
};

// Log controls component
const LogControls: React.FC<LogControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onClear,
  logFilter,
  onFilterChange,
}) => (
  <div className="flex items-center gap-2">
    <Button
      variant="outline"
      size="sm"
      onClick={onTogglePlay}
      className="h-8 px-2 bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
    >
      {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={onClear}
      className="h-8 px-2 bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
    >
      <Square className="h-3 w-3" />
    </Button>
    <div className="flex items-center gap-1 bg-gray-700 rounded-md p-1">
      <Button
        variant={logFilter === "all" ? "default" : "ghost"}
        size="sm"
        onClick={() => onFilterChange("all")}
        className="h-6 px-2 text-xs"
      >
        All
      </Button>
      <Button
        variant={logFilter === "block" ? "default" : "ghost"}
        size="sm"
        onClick={() => onFilterChange("block")}
        className="h-6 px-2 text-xs"
      >
        Blocks
      </Button>
      <Button
        variant={logFilter === "pass" ? "default" : "ghost"}
        size="sm"
        onClick={() => onFilterChange("pass")}
        className="h-6 px-2 text-xs"
      >
        Pass
      </Button>
    </div>
  </div>
);

// Main component
export function LiveLogsWidget() {
  const [logs, setLogs] = useState<FirewallLog[]>(initialLogs);
  const [isPlaying, setIsPlaying] = useState(true);
  const [logFilter, setLogFilter] = useState<"all" | "block" | "pass">("all");
  const [autoScroll, setAutoScroll] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        const newLog = generateRandomLog();
        setLogs((prev) => {
          const updated = [newLog, ...prev];
          // Keep only last 5 logs
          return updated.slice(0, 5);
        });
      }, 1500);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  const filteredLogs = useMemo(() => {
    if (logFilter === "all") return logs;
    return logs.filter((log) => log.action === logFilter);
  }, [logs, logFilter]);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleClear = useCallback(() => {
    setLogs([]);
  }, []);

  const handleFilterChange = useCallback((filter: "all" | "block" | "pass") => {
    setLogFilter(filter);
  }, []);

  const logStats = useMemo(
    () => ({
      total: logs.length,
      blocks: logs.filter((l) => l.action === "block").length,
      passes: logs.filter((l) => l.action === "pass").length,
      malicious: logs.filter((l) => l.reputation === "Malicious").length,
    }),
    [logs],
  );

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date
      .toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        fractionalSecondDigits: 3,
        hour12: false,
      })
      .replace(",", "");
  };

  return (
    <Card className="border border-gray-700 bg-gray-900 shadow-sm">
      <CardHeader className="bg-gray-800 py-3 px-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-200 flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-500" />
            Live Firewall Logs
            <div
              className={`w-2 h-2 rounded-full ${isPlaying ? "bg-red-500 animate-pulse" : "bg-gray-500"}`}
            />
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-xs bg-red-500/10 border-red-500/20 text-red-400"
            >
              <XCircle className="h-3 w-3 mr-1" />
              {logStats.blocks} Blocks
            </Badge>
            <Badge
              variant="outline"
              className="text-xs bg-green-500/10 border-green-500/20 text-green-400"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              {logStats.passes} Pass
            </Badge>
            <LogControls
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              onClear={handleClear}
              logFilter={logFilter}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {/* Live Controls */}
        <div className="flex flex-wrap gap-3 mb-4 p-3 bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2">
            <Switch checked={autoScroll} onCheckedChange={setAutoScroll} />
            <span className="text-sm text-gray-300">Auto-scroll</span>
          </div>
          <div className="flex items-center gap-2">
            <Switch defaultChecked />
            <span className="text-sm text-gray-300">Sound alerts</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Speed:</span>
            <select className="text-xs bg-gray-700 border-gray-600 text-gray-300 rounded px-2 py-1">
              <option>1x</option>
              <option>2x</option>
              <option>5x</option>
              <option>10x</option>
            </select>
          </div>
        </div>

        {/* Live Logs Table */}
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0">
              <tr className="bg-gray-800 border-b border-gray-700">
                <th className="py-2 px-2 text-left font-semibold text-gray-300">
                  Timestamp
                </th>
                <th className="py-2 px-1 text-center font-semibold text-gray-300">
                  Action
                </th>
                <th className="py-2 px-1 text-left font-semibold text-gray-300">
                  IF
                </th>
                <th className="py-2 px-2 text-left font-semibold text-gray-300">
                  Source
                </th>
                <th className="py-2 px-2 text-left font-semibold text-gray-300">
                  Destination
                </th>
                <th className="py-2 px-1 text-center font-semibold text-gray-300">
                  Proto
                </th>
                <th className="py-2 px-2 text-left font-semibold text-gray-300">
                  Country
                </th>
                <th className="py-2 px-2 text-left font-semibold text-gray-300">
                  Reputation
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-gray-700 hover:bg-gray-800 transition-colors animate-in slide-in-from-bottom-2"
                >
                  <td className="py-2 px-2 text-gray-400 font-mono text-xs">
                    {formatTimestamp(log.timestamp)}
                  </td>
                  <td className="py-2 px-1 text-center">
                    {log.action === "block" ? (
                      <Badge variant="destructive" className="text-xs">
                        <XCircle className="h-3 w-3 mr-1" />
                        Block
                      </Badge>
                    ) : (
                      <Badge
                        variant="default"
                        className="bg-green-600 hover:bg-green-700 text-xs"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Pass
                      </Badge>
                    )}
                  </td>
                  <td className="py-2 px-1 text-gray-200 font-medium">
                    <Badge
                      variant="outline"
                      className="text-xs border-gray-600 text-gray-300"
                    >
                      {log.interface}
                    </Badge>
                  </td>
                  <td className="py-2 px-2 text-gray-300 font-mono text-xs">
                    {log.source}
                  </td>
                  <td className="py-2 px-2 text-gray-300 font-mono text-xs">
                    {log.destination}
                  </td>
                  <td className="py-2 px-1 text-center">
                    <span className="px-1.5 py-0.5 bg-gray-700 rounded text-xs text-gray-300">
                      {log.protocol}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        log.country === "CN"
                          ? "bg-red-500/20 text-red-400"
                          : log.country === "RU"
                            ? "bg-orange-500/20 text-orange-400"
                            : log.country === "US"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {log.country}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        log.reputation === "Malicious"
                          ? "bg-red-500/20 text-red-400"
                          : log.reputation === "Suspicious"
                            ? "bg-orange-500/20 text-orange-400"
                            : log.reputation === "Trusted"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {log.reputation}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Live Stats */}
        <div className="mt-4 pt-3 border-t border-gray-700">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Live entries: {logs.length}</span>
            <span>Update rate: 1.5s</span>
            <span>Buffer: 5/10000</span>
            <span>Memory: {(logs.length * 0.05).toFixed(2)}MB</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
