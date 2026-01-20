"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Settings, Trash2, Edit, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ServersTableWidget() {
  const servers = [
    {
      name: "web-server-01",
      description: "Primary web server for hosting applications",
      os: "Ubuntu 22.04",
      ip: "192.168.1.10",
      type: "Web",
      created: "2024-01-15",
      status: "active",
    },
    {
      name: "db-server-01",
      description: "Database server for MySQL and PostgreSQL",
      os: "CentOS 8",
      ip: "192.168.1.20",
      type: "Database",
      created: "2024-01-15",
      status: "active",
    },
    {
      name: "app-server-01",
      description: "Application server for Node.js apps",
      os: "Ubuntu 20.04",
      ip: "192.168.1.30",
      type: "Application",
      created: "2024-02-01",
      status: "maintenance",
    },
    {
      name: "backup-server-01",
      description: "Backup and storage server",
      os: "Debian 11",
      ip: "192.168.1.40",
      type: "Storage",
      created: "2024-02-10",
      status: "active",
    },
    {
      name: "dev-server-01",
      description: "Development and testing environment",
      os: "Windows Server 2022",
      ip: "192.168.1.50",
      type: "Development",
      created: "2024-03-01",
      status: "inactive",
    },
    {
      name: "monitor-server-01",
      description: "Monitoring and logging server",
      os: "Ubuntu 22.04",
      ip: "192.168.1.60",
      type: "Monitoring",
      created: "2024-03-15",
      status: "active",
    },
  ];

  const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig = {
      active: { bg: "bg-green-900", text: "text-green-300", label: "Active" },
      maintenance: {
        bg: "bg-yellow-900",
        text: "text-yellow-300",
        label: "Maintenance",
      },
      inactive: { bg: "bg-gray-700", text: "text-gray-300", label: "Inactive" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.inactive;

    return (
      <Badge
        variant="default"
        className={`${config.bg} ${config.text} hover:opacity-80`}
      >
        {config.label}
      </Badge>
    );
  };

  const TypeBadge = ({ type }: { type: string }) => {
    const colors = {
      Web: "border-blue-500 text-blue-300",
      Database: "border-purple-500 text-purple-300",
      Application: "border-green-500 text-green-300",
      Storage: "border-orange-500 text-orange-300",
      Development: "border-cyan-500 text-cyan-300",
      Monitoring: "border-red-500 text-red-300",
    };

    return (
      <Badge
        variant="outline"
        className={
          colors[type as keyof typeof colors] || "border-gray-500 text-gray-300"
        }
      >
        {type}
      </Badge>
    );
  };

  return (
    <Card className="border border-gray-700 bg-gray-900 shadow-sm">
      <CardHeader className="bg-gray-800 py-2 px-3 border-b border-gray-700">
        <CardTitle className="text-sm font-semibold text-gray-200 flex items-center gap-2">
          <Server className="h-4 w-4 text-orange-500" />
          Server Inventory
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-800 border-b border-gray-700">
              <th className="py-1.5 px-3 text-left font-semibold text-gray-300">
                Server Name
              </th>
              <th className="py-1.5 px-3 text-left font-semibold text-gray-300">
                Description
              </th>
              <th className="py-1.5 px-3 text-center font-semibold text-gray-300">
                OS
              </th>
              <th className="py-1.5 px-3 text-center font-semibold text-gray-300">
                IP Address
              </th>
              <th className="py-1.5 px-3 text-center font-semibold text-gray-300">
                Type
              </th>
              <th className="py-1.5 px-3 text-center font-semibold text-gray-300">
                Status
              </th>
              <th className="py-1.5 px-3 text-center font-semibold text-gray-300">
                Actions
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
                    <div className="flex items-center gap-2">
                      <Server className="h-3 w-3 text-gray-400" />
                      <span>{server.name}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Created: {server.created}
                    </div>
                  </div>
                </td>
                <td className="py-1.5 px-3 text-gray-300 border-b border-gray-700 max-w-xs">
                  <div className="truncate" title={server.description}>
                    {server.description}
                  </div>
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <span className="text-gray-200">{server.os}</span>
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <span className="text-gray-200 font-mono">{server.ip}</span>
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <TypeBadge type={server.type} />
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <StatusBadge status={server.status} />
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto hover:bg-gray-700"
                      title="Edit Server"
                    >
                      <Edit className="h-3 w-3 text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto hover:bg-gray-700"
                      title="Server Settings"
                    >
                      <Settings className="h-3 w-3 text-gray-400" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto hover:bg-gray-700"
                      title={
                        server.status === "active"
                          ? "Stop Server"
                          : "Start Server"
                      }
                    >
                      <Power
                        className={`h-3 w-3 ${server.status === "active" ? "text-red-500" : "text-green-500"}`}
                      />
                    </Button>
                    {server.type !== "Web" && server.type !== "Database" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto hover:bg-gray-700"
                        title="Delete Server"
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    )}
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
