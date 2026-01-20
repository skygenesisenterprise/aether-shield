"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, ArrowDown, ArrowUp } from "lucide-react";

const interfaces = [
  {
    name: "WAN",
    device: "em0",
    address: "192.168.1.100",
    status: "up",
    packetsIn: "1,234,567",
    packetsOut: "987,654",
    bytesIn: "1.2 GB",
    bytesOut: "456 MB",
    errorsIn: "0",
    errorsOut: "0",
  },
  {
    name: "LAN",
    device: "em1",
    address: "10.0.0.1",
    status: "up",
    packetsIn: "5,678,901",
    packetsOut: "4,567,890",
    bytesIn: "4.5 GB",
    bytesOut: "3.2 GB",
    errorsIn: "0",
    errorsOut: "0",
  },
  {
    name: "OPT1",
    device: "em2",
    address: "172.16.0.1",
    status: "up",
    packetsIn: "234,567",
    packetsOut: "123,456",
    bytesIn: "128 MB",
    bytesOut: "64 MB",
    errorsIn: "2",
    errorsOut: "0",
  },
  {
    name: "OPT2",
    device: "em3",
    address: "—",
    status: "down",
    packetsIn: "0",
    packetsOut: "0",
    bytesIn: "0 B",
    bytesOut: "0 B",
    errorsIn: "0",
    errorsOut: "0",
  },
];

export function InterfacesWidget() {
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="bg-[#f5f5f5] py-2 px-3 border-b border-gray-200">
        <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Network className="h-4 w-4 text-orange-500" />
          Interfaces
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
                Device
              </th>
              <th className="py-1.5 px-2 text-left font-semibold text-gray-600">
                Address
              </th>
              <th className="py-1.5 px-2 text-center font-semibold text-gray-600">
                Status
              </th>
              <th className="py-1.5 px-2 text-right font-semibold text-gray-600">
                <span className="flex items-center justify-end gap-1">
                  <ArrowDown className="h-3 w-3" />
                  In
                </span>
              </th>
              <th className="py-1.5 px-2 text-right font-semibold text-gray-600">
                <span className="flex items-center justify-end gap-1">
                  <ArrowUp className="h-3 w-3" />
                  Out
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {interfaces.map((iface, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="py-1.5 px-2 font-medium text-blue-600 border-b border-gray-100">
                  <a href="#" className="hover:underline">
                    {iface.name}
                  </a>
                </td>
                <td className="py-1.5 px-2 text-gray-600 border-b border-gray-100 font-mono text-xs">
                  {iface.device}
                </td>
                <td className="py-1.5 px-2 text-gray-600 border-b border-gray-100 font-mono text-xs">
                  {iface.address}
                </td>
                <td className="py-1.5 px-2 text-center border-b border-gray-100">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      iface.status === "up"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {iface.status}
                  </span>
                </td>
                <td className="py-1.5 px-2 text-right text-gray-600 border-b border-gray-100">
                  <div className="flex flex-col">
                    <span>{iface.packetsIn} pkts</span>
                    <span className="text-gray-400">{iface.bytesIn}</span>
                  </div>
                </td>
                <td className="py-1.5 px-2 text-right text-gray-600 border-b border-gray-100">
                  <div className="flex flex-col">
                    <span>{iface.packetsOut} pkts</span>
                    <span className="text-gray-400">{iface.bytesOut}</span>
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
