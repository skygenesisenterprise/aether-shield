"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, ArrowUpDown } from "lucide-react";

const gateways = [
  {
    name: "WAN_DHCP",
    gateway: "192.168.1.1",
    monitor: "8.8.8.8",
    rtt: "12.5ms",
    rttsd: "1.2ms",
    loss: "0.0%",
    status: "Online",
  },
  {
    name: "WAN_PPPOE",
    gateway: "10.0.0.1",
    monitor: "8.8.4.4",
    rtt: "15.2ms",
    rttsd: "2.1ms",
    loss: "0.0%",
    status: "Online",
  },
  {
    name: "VPN_GW",
    gateway: "10.10.10.1",
    monitor: "10.10.10.1",
    rtt: "—",
    rttsd: "—",
    loss: "—",
    status: "Offline",
  },
];

export function GatewaysWidget() {
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="bg-[#f5f5f5] py-2 px-3 border-b border-gray-200">
        <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Globe className="h-4 w-4 text-orange-500" />
          Gateways
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="py-1.5 px-2 text-left font-semibold text-gray-600">
                Name
              </th>
              <th className="py-1.5 px-2 text-left font-semibold text-gray-600">
                Gateway
              </th>
              <th className="py-1.5 px-2 text-left font-semibold text-gray-600">
                Monitor
              </th>
              <th className="py-1.5 px-2 text-center font-semibold text-gray-600">
                RTT
              </th>
              <th className="py-1.5 px-2 text-center font-semibold text-gray-600">
                RTTsd
              </th>
              <th className="py-1.5 px-2 text-center font-semibold text-gray-600">
                Loss
              </th>
              <th className="py-1.5 px-2 text-center font-semibold text-gray-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {gateways.map((gw, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="py-1.5 px-2 font-medium text-gray-700 border-b border-gray-100">
                  <div className="flex items-center gap-1">
                    <ArrowUpDown className="h-3 w-3 text-gray-400" />
                    {gw.name}
                  </div>
                </td>
                <td className="py-1.5 px-2 text-gray-600 border-b border-gray-100 font-mono">
                  {gw.gateway}
                </td>
                <td className="py-1.5 px-2 text-gray-600 border-b border-gray-100 font-mono">
                  {gw.monitor}
                </td>
                <td className="py-1.5 px-2 text-center text-gray-600 border-b border-gray-100">
                  {gw.rtt}
                </td>
                <td className="py-1.5 px-2 text-center text-gray-600 border-b border-gray-100">
                  {gw.rttsd}
                </td>
                <td className="py-1.5 px-2 text-center text-gray-600 border-b border-gray-100">
                  {gw.loss}
                </td>
                <td className="py-1.5 px-2 text-center border-b border-gray-100">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      gw.status === "Online"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {gw.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
