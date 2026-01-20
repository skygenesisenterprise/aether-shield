import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Shield,
  XCircle,
  CheckCircle,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const firewallLogs = [
  {
    id: 1,
    timestamp: "2025-01-20 14:32:15",
    action: "block",
    interface: "WAN",
    source: "203.0.113.45:54321",
    destination: "192.168.1.100:443",
    protocol: "TCP",
    rule: "Block External to Internal",
    bytes: 0,
    duration: "0.00s",
  },
  {
    id: 2,
    timestamp: "2025-01-20 14:32:10",
    action: "pass",
    interface: "LAN",
    source: "10.0.0.50:52341",
    destination: "8.8.8.8:53",
    protocol: "UDP",
    rule: "Allow DNS",
    bytes: 64,
    duration: "0.12s",
  },
  {
    id: 3,
    timestamp: "2025-01-20 14:32:08",
    action: "block",
    interface: "WAN",
    source: "198.51.100.23:12345",
    destination: "192.168.1.100:22",
    protocol: "TCP",
    rule: "Block SSH from WAN",
    bytes: 0,
    duration: "0.00s",
  },
  {
    id: 4,
    timestamp: "2025-01-20 14:32:05",
    action: "pass",
    interface: "LAN",
    source: "10.0.0.25:49876",
    destination: "93.184.216.34:80",
    protocol: "TCP",
    rule: "Allow HTTP",
    bytes: 1024,
    duration: "1.45s",
  },
  {
    id: 5,
    timestamp: "2025-01-20 14:32:01",
    action: "block",
    interface: "WAN",
    source: "192.0.2.100:33333",
    destination: "192.168.1.100:3389",
    protocol: "TCP",
    rule: "Block RDP from WAN",
    bytes: 0,
    duration: "0.00s",
  },
  {
    id: 6,
    timestamp: "2025-01-20 14:31:58",
    action: "pass",
    interface: "LAN",
    source: "10.0.0.15:51234",
    destination: "151.101.1.69:443",
    protocol: "TCP",
    rule: "Allow HTTPS",
    bytes: 2048,
    duration: "2.10s",
  },
  {
    id: 7,
    timestamp: "2025-01-20 14:31:55",
    action: "block",
    interface: "WAN",
    source: "203.0.113.100:44444",
    destination: "192.168.1.100:25",
    protocol: "TCP",
    rule: "Block SMTP from WAN",
    bytes: 0,
    duration: "0.00s",
  },
  {
    id: 8,
    timestamp: "2025-01-20 14:31:50",
    action: "pass",
    interface: "OPT1",
    source: "172.16.0.50:45678",
    destination: "10.0.0.1:80",
    protocol: "TCP",
    rule: "Allow Internal Traffic",
    bytes: 512,
    duration: "0.85s",
  },
];

export function GeneralLogsWidget() {
  return (
    <Card className="border border-gray-700 bg-gray-900 shadow-sm">
      <CardHeader className="bg-gray-800 py-3 px-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-200 flex items-center gap-2">
            <Shield className="h-5 w-5 text-orange-500" />
            General Firewall Logs
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 text-xs bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 text-xs bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
            >
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4 p-3 bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-400">Filters:</span>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-24 h-8 text-xs bg-gray-700 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pass">Pass</SelectItem>
                <SelectItem value="block">Block</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-20 h-8 text-xs bg-gray-700 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="tcp">TCP</SelectItem>
                <SelectItem value="udp">UDP</SelectItem>
                <SelectItem value="icmp">ICMP</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-24 h-8 text-xs bg-gray-700 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all">All IF</SelectItem>
                <SelectItem value="wan">WAN</SelectItem>
                <SelectItem value="lan">LAN</SelectItem>
                <SelectItem value="opt1">OPT1</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Search IP..."
              className="w-32 h-8 text-xs bg-gray-700 border-gray-600 text-gray-300 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Logs Table */}
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0">
              <tr className="bg-gray-800 border-b border-gray-700">
                <th className="py-2 px-3 text-left font-semibold text-gray-300">
                  Timestamp
                </th>
                <th className="py-2 px-2 text-center font-semibold text-gray-300">
                  Action
                </th>
                <th className="py-2 px-2 text-left font-semibold text-gray-300">
                  Interface
                </th>
                <th className="py-2 px-3 text-left font-semibold text-gray-300">
                  Source
                </th>
                <th className="py-2 px-3 text-left font-semibold text-gray-300">
                  Destination
                </th>
                <th className="py-2 px-2 text-center font-semibold text-gray-300">
                  Protocol
                </th>
                <th className="py-2 px-3 text-left font-semibold text-gray-300">
                  Rule
                </th>
                <th className="py-2 px-2 text-right font-semibold text-gray-300">
                  Bytes
                </th>
                <th className="py-2 px-2 text-right font-semibold text-gray-300">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody>
              {firewallLogs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-gray-700 hover:bg-gray-800 transition-colors"
                >
                  <td className="py-2 px-3 text-gray-400 font-mono text-xs">
                    {log.timestamp}
                  </td>
                  <td className="py-2 px-2 text-center">
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
                  <td className="py-2 px-2 text-gray-200 font-medium">
                    <Badge
                      variant="outline"
                      className="text-xs border-gray-600 text-gray-300"
                    >
                      {log.interface}
                    </Badge>
                  </td>
                  <td className="py-2 px-3 text-gray-300 font-mono text-xs">
                    {log.source}
                  </td>
                  <td className="py-2 px-3 text-gray-300 font-mono text-xs">
                    {log.destination}
                  </td>
                  <td className="py-2 px-2 text-center">
                    <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                      {log.protocol}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-gray-400 text-xs">
                    {log.rule}
                  </td>
                  <td className="py-2 px-2 text-right text-gray-300 font-mono text-xs">
                    {log.bytes}
                  </td>
                  <td className="py-2 px-2 text-right text-gray-300 font-mono text-xs">
                    {log.duration}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Stats */}
        <div className="mt-4 pt-3 border-t border-gray-700">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Total entries: {firewallLogs.length}</span>
            <span>
              Blocked:{" "}
              {firewallLogs.filter((log) => log.action === "block").length}
            </span>
            <span>
              Allowed:{" "}
              {firewallLogs.filter((log) => log.action === "pass").length}
            </span>
            <span>Last updated: Just now</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
