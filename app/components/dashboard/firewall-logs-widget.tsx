"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Shield,
  XCircle,
  CheckCircle,
  Play,
  Pause,
  RotateCw,
} from "lucide-react";
import { useLiveData } from "@/hooks/use-live-data";

interface FirewallLog {
  time: string;
  action: "block" | "pass";
  interface: string;
  source: string;
  destination: string;
  protocol: "TCP" | "UDP" | "ICMP";
}

const generateRandomLog = (): FirewallLog => {
  const now = new Date();
  const time = now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const actions: Array<"block" | "pass"> = ["block", "pass"];
  const interfaces = ["WAN", "LAN", "OPT1"];
  const protocols: Array<"TCP" | "UDP" | "ICMP"> = ["TCP", "UDP", "ICMP"];

  const sourceIps = [
    "203.0.113.",
    "198.51.100.",
    "192.0.2.",
    "10.0.0.",
    "172.16.0.",
  ];
  const destIps = [
    "192.168.1.100",
    "8.8.8.8",
    "93.184.216.34",
    "10.0.0.1",
    "151.101.1.69",
  ];
  const ports = ["22", "25", "53", "80", "443", "3389", "54321", "12345"];

  const generateIpPort = (base: string) => {
    if (base.includes("10.0.0.") || base.includes("172.16.0.")) {
      return `${base}${Math.floor(Math.random() * 254 + 1)}:${Math.floor(Math.random() * 50000 + 1024)}`;
    }
    return `${base}${Math.floor(Math.random() * 254 + 1)}:${Math.floor(Math.random() * 50000 + 1024)}`;
  };

  const action = actions[Math.floor(Math.random() * actions.length)];
  const iface = interfaces[Math.floor(Math.random() * interfaces.length)];
  const protocol = protocols[Math.floor(Math.random() * protocols.length)];

  let source, destination;
  if (iface === "LAN" || iface === "OPT1") {
    source = generateIpPort("10.0.0.");
    destination = `${destIps[Math.floor(Math.random() * destIps.length)]}:${ports[Math.floor(Math.random() * ports.length)]}`;
  } else {
    source = generateIpPort(
      sourceIps[Math.floor(Math.random() * sourceIps.length)],
    );
    destination = `192.168.1.100:${ports[Math.floor(Math.random() * ports.length)]}`;
  }

  return {
    time,
    action,
    interface: iface,
    source,
    destination,
    protocol,
  };
};

const generateFirewallLogs = (currentLogs?: FirewallLog[]): FirewallLog[] => {
  const logs = currentLogs || [];
  const newLog = generateRandomLog();
  return [newLog, ...logs].slice(0, 20);
};

const initialFirewallLogs: FirewallLog[] = [
  {
    time: "14:32:15",
    action: "block",
    interface: "WAN",
    source: "203.0.113.45:54321",
    destination: "192.168.1.100:443",
    protocol: "TCP",
  },
  {
    time: "14:32:10",
    action: "pass",
    interface: "LAN",
    source: "10.0.0.50:52341",
    destination: "8.8.8.8:53",
    protocol: "UDP",
  },
  {
    time: "14:32:08",
    action: "block",
    interface: "WAN",
    source: "198.51.100.23:12345",
    destination: "192.168.1.100:22",
    protocol: "TCP",
  },
  {
    time: "14:32:05",
    action: "pass",
    interface: "LAN",
    source: "10.0.0.25:49876",
    destination: "93.184.216.34:80",
    protocol: "TCP",
  },
  {
    time: "14:32:01",
    action: "block",
    interface: "WAN",
    source: "192.0.2.100:33333",
    destination: "192.168.1.100:3389",
    protocol: "TCP",
  },
  {
    time: "14:31:58",
    action: "pass",
    interface: "LAN",
    source: "10.0.0.15:51234",
    destination: "151.101.1.69:443",
    protocol: "TCP",
  },
  {
    time: "14:31:55",
    action: "block",
    interface: "WAN",
    source: "203.0.113.100:44444",
    destination: "192.168.1.100:25",
    protocol: "TCP",
  },
  {
    time: "14:31:50",
    action: "pass",
    interface: "OPT1",
    source: "172.16.0.50:45678",
    destination: "10.0.0.1:80",
    protocol: "TCP",
  },
];

export function FirewallLogsWidget() {
  const {
    data: firewallLogs,
    isPlaying,
    toggle,
    reset,
  } = useLiveData<FirewallLog[]>({
    generateData: (currentLogs?: FirewallLog[]) =>
      generateFirewallLogs(currentLogs),
    interval: 1500,
    initialData: initialFirewallLogs,
  });

  return (
    <Card className="border border-gray-700 bg-gray-900 shadow-sm">
      <CardHeader className="bg-gray-800 py-2 px-3 border-b border-gray-700">
        <CardTitle className="text-sm font-semibold text-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-orange-500" />
            Firewall Logs (Live)
            <div
              className={`w-2 h-2 rounded-full ${isPlaying ? "bg-green-500 animate-pulse" : "bg-gray-500"}`}
            />
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={toggle}
              className="p-1 text-gray-400 hover:text-gray-200 transition-colors"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-3 w-3" />
              ) : (
                <Play className="h-3 w-3" />
              )}
            </button>
            <button
              onClick={reset}
              className="p-1 text-gray-400 hover:text-gray-200 transition-colors"
              title="Reset"
            >
              <RotateCw className="h-3 w-3" />
            </button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-64 overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0">
              <tr className="bg-gray-800 border-b border-gray-700">
                <th className="py-1.5 px-2 text-left font-semibold text-gray-300">
                  Time
                </th>
                <th className="py-1.5 px-2 text-center font-semibold text-gray-300">
                  Action
                </th>
                <th className="py-1.5 px-2 text-left font-semibold text-gray-300">
                  If
                </th>
                <th className="py-1.5 px-2 text-left font-semibold text-gray-300">
                  Source
                </th>
                <th className="py-1.5 px-2 text-left font-semibold text-gray-300">
                  Destination
                </th>
                <th className="py-1.5 px-2 text-center font-semibold text-gray-300">
                  Proto
                </th>
              </tr>
            </thead>
            <tbody>
              {firewallLogs.map((log, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
                >
                  <td className="py-1 px-2 text-gray-400 border-b border-gray-700 font-mono">
                    {log.time}
                  </td>
                  <td className="py-1 px-2 text-center border-b border-gray-700">
                    {log.action === "block" ? (
                      <XCircle className="h-4 w-4 text-red-500 mx-auto" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                    )}
                  </td>
                  <td className="py-1 px-2 text-gray-200 border-b border-gray-700 font-medium">
                    {log.interface}
                  </td>
                  <td className="py-1 px-2 text-gray-300 border-b border-gray-700 font-mono text-xs">
                    {log.source}
                  </td>
                  <td className="py-1 px-2 text-gray-300 border-b border-gray-700 font-mono text-xs">
                    {log.destination}
                  </td>
                  <td className="py-1 px-2 text-center text-gray-300 border-b border-gray-700">
                    <span className="px-1.5 py-0.5 bg-gray-700 rounded text-xs">
                      {log.protocol}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
