"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { List, Plus, Edit, Trash2, Users, MapPin, Globe } from "lucide-react";

const firewallAliases = [
  {
    name: "LAN_Network",
    type: "Network",
    description: "Local Area Network subnet",
    members: "192.168.1.0/24",
    usage: 15,
    status: "active",
  },
  {
    name: "DMZ_Servers",
    type: "Host",
    description: "DMZ server IPs",
    members: "10.0.0.10, 10.0.0.11, 10.0.0.12",
    usage: 8,
    status: "active",
  },
  {
    name: "Blocked_Countries",
    type: "GeoIP",
    description: "Blocked country codes",
    members: "CN, RU, KP",
    usage: 12,
    status: "active",
  },
  {
    name: "Allowed_Ports",
    type: "Port",
    description: "Permitted service ports",
    members: "80, 443, 22, 53",
    usage: 6,
    status: "active",
  },
  {
    name: "VPN_Users",
    type: "Network",
    description: "VPN client network",
    members: "10.8.0.0/24",
    usage: 4,
    status: "inactive",
  },
  {
    name: "Management_Network",
    type: "Network",
    description: "Management interface subnet",
    members: "172.16.0.0/24",
    usage: 3,
    status: "active",
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "Network":
      return <Globe className="h-4 w-4 text-blue-500" />;
    case "Host":
      return <Users className="h-4 w-4 text-green-500" />;
    case "GeoIP":
      return <MapPin className="h-4 w-4 text-orange-500" />;
    case "Port":
      return <List className="h-4 w-4 text-purple-500" />;
    default:
      return <List className="h-4 w-4 text-gray-500" />;
  }
};

export function AliasListWidget() {
  return (
    <Card className="border border-gray-700 bg-gray-900 shadow-sm">
      <CardHeader className="bg-gray-800 py-3 px-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-gray-200 flex items-center gap-2">
            <List className="h-4 w-4 text-blue-500" />
            Firewall Aliases
          </CardTitle>
          <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded flex items-center gap-1">
            <Plus className="h-3 w-3" />
            Add
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0">
              <tr className="bg-gray-800 border-b border-gray-700">
                <th className="py-2 px-3 text-left font-semibold text-gray-300">
                  Name
                </th>
                <th className="py-2 px-2 text-left font-semibold text-gray-300">
                  Type
                </th>
                <th className="py-2 px-3 text-left font-semibold text-gray-300">
                  Members
                </th>
                <th className="py-2 px-2 text-center font-semibold text-gray-300">
                  Usage
                </th>
                <th className="py-2 px-2 text-center font-semibold text-gray-300">
                  Status
                </th>
                <th className="py-2 px-2 text-center font-semibold text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {firewallAliases.map((alias, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
                >
                  <td className="py-2 px-3 border-b border-gray-700">
                    <div>
                      <div className="font-medium text-gray-200">
                        {alias.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {alias.description}
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-2 border-b border-gray-700">
                    <div className="flex items-center gap-1">
                      {getTypeIcon(alias.type)}
                      <span className="text-gray-300">{alias.type}</span>
                    </div>
                  </td>
                  <td className="py-2 px-3 border-b border-gray-700">
                    <div className="text-gray-300 font-mono text-xs max-w-xs truncate">
                      {alias.members}
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center border-b border-gray-700">
                    <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                      {alias.usage}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-center border-b border-gray-700">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        alias.status === "active"
                          ? "bg-green-900 text-green-300"
                          : "bg-gray-700 text-gray-400"
                      }`}
                    >
                      {alias.status}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-center border-b border-gray-700">
                    <div className="flex items-center justify-center gap-1">
                      <button className="text-gray-400 hover:text-blue-400">
                        <Edit className="h-3 w-3" />
                      </button>
                      <button className="text-gray-400 hover:text-red-400">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
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
