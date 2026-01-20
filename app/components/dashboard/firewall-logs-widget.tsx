"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, XCircle, CheckCircle } from "lucide-react";

const firewallLogs = [
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
  return (
    <Card className="border border-gray-700 bg-gray-900 shadow-sm">
      <CardHeader className="bg-gray-800 py-2 px-3 border-b border-gray-700">
        <CardTitle className="text-sm font-semibold text-gray-200 flex items-center gap-2">
          <Shield className="h-4 w-4 text-orange-500" />
          Firewall Logs (Live)
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
