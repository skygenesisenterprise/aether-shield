"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

export function ServersStatusWidget() {
  const servers = [
    {
      name: "web-server-01",
      status: "online",
      cpu: "45%",
      memory: "62%",
      disk: "38%",
      uptime: "15d 8h",
    },
    {
      name: "db-server-01",
      status: "online",
      cpu: "78%",
      memory: "85%",
      disk: "42%",
      uptime: "32d 14h",
    },
    {
      name: "app-server-01",
      status: "offline",
      cpu: "0%",
      memory: "0%",
      disk: "0%",
      uptime: "0d 0h",
    },
    {
      name: "backup-server-01",
      status: "online",
      cpu: "12%",
      memory: "28%",
      disk: "75%",
      uptime: "67d 3h",
    },
  ];

  const StatusBadge = ({ status }: { status: string }) => (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
        status === "online"
          ? "bg-green-900 text-green-300"
          : "bg-red-900 text-red-300"
      }`}
    >
      {status === "online" ? "Online" : "Offline"}
    </span>
  );

  const ProgressBar = ({ value, color }: { value: string; color: string }) => (
    <div className="w-full bg-gray-700 rounded-full h-1.5">
      <div className={`h-1.5 rounded-full ${color}`} style={{ width: value }} />
    </div>
  );

  const getColorClass = (value: string) => {
    const num = parseInt(value);
    if (num >= 80) return "bg-red-500";
    if (num >= 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Card className="border border-gray-700 bg-gray-900 shadow-sm">
      <CardHeader className="bg-gray-800 py-2 px-3 border-b border-gray-700">
        <CardTitle className="text-sm font-semibold text-gray-200 flex items-center gap-2">
          <Activity className="h-4 w-4 text-cyan-500" />
          Server Status
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-800 border-b border-gray-700">
              <th className="py-1.5 px-3 text-left font-semibold text-gray-300">
                Server
              </th>
              <th className="py-1.5 px-3 text-center font-semibold text-gray-300">
                Status
              </th>
              <th className="py-1.5 px-3 text-center font-semibold text-gray-300">
                CPU
              </th>
              <th className="py-1.5 px-3 text-center font-semibold text-gray-300">
                Memory
              </th>
              <th className="py-1.5 px-3 text-center font-semibold text-gray-300">
                Disk
              </th>
            </tr>
          </thead>
          <tbody>
            {servers.map((server, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
              >
                <td className="py-1.5 px-3 font-medium text-gray-200 border-b border-gray-700">
                  <div>
                    <div>{server.name}</div>
                    <div className="text-xs text-gray-400">
                      Uptime: {server.uptime}
                    </div>
                  </div>
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <StatusBadge status={server.status} />
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <div className="space-y-1">
                    <div className="text-gray-300">{server.cpu}</div>
                    <ProgressBar
                      value={server.cpu}
                      color={getColorClass(server.cpu)}
                    />
                  </div>
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <div className="space-y-1">
                    <div className="text-gray-300">{server.memory}</div>
                    <ProgressBar
                      value={server.memory}
                      color={getColorClass(server.memory)}
                    />
                  </div>
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <div className="space-y-1">
                    <div className="text-gray-300">{server.disk}</div>
                    <ProgressBar
                      value={server.disk}
                      color={getColorClass(server.disk)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
