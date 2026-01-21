"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Network,
  ArrowDown,
  ArrowUp,
  Play,
  Pause,
  RotateCw,
} from "lucide-react";
import { useLiveData } from "@/hooks/use-live-data";

interface InterfaceData {
  name: string;
  device: string;
  address: string;
  status: "up" | "down";
  packetsIn: number;
  packetsOut: number;
  bytesIn: number;
  bytesOut: number;
  errorsIn: number;
  errorsOut: number;
}

const generateInterfacesData = (): InterfaceData[] => {
  return [
    {
      name: "WAN",
      device: "em0",
      address: "192.168.1.100",
      status: "up",
      packetsIn: Math.floor(Math.random() * 1000000) + 1000000,
      packetsOut: Math.floor(Math.random() * 500000) + 500000,
      bytesIn: Math.floor(Math.random() * 1000000000) + 1000000000,
      bytesOut: Math.floor(Math.random() * 500000000) + 200000000,
      errorsIn: Math.floor(Math.random() * 3),
      errorsOut: 0,
    },
    {
      name: "LAN",
      device: "em1",
      address: "10.0.0.1",
      status: "up",
      packetsIn: Math.floor(Math.random() * 2000000) + 4000000,
      packetsOut: Math.floor(Math.random() * 1500000) + 3500000,
      bytesIn: Math.floor(Math.random() * 2000000000) + 3500000000,
      bytesOut: Math.floor(Math.random() * 1500000000) + 2500000000,
      errorsIn: 0,
      errorsOut: 0,
    },
    {
      name: "OPT1",
      device: "em2",
      address: "172.16.0.1",
      status: "up",
      packetsIn: Math.floor(Math.random() * 100000) + 150000,
      packetsOut: Math.floor(Math.random() * 50000) + 75000,
      bytesIn: Math.floor(Math.random() * 100000000) + 100000000,
      bytesOut: Math.floor(Math.random() * 50000000) + 40000000,
      errorsIn: Math.floor(Math.random() * 3),
      errorsOut: 0,
    },
    {
      name: "OPT2",
      device: "em3",
      address: "—",
      status: "down",
      packetsIn: 0,
      packetsOut: 0,
      bytesIn: 0,
      bytesOut: 0,
      errorsIn: 0,
      errorsOut: 0,
    },
  ];
};

const initialInterfacesData: InterfaceData[] = [
  {
    name: "WAN",
    device: "em0",
    address: "192.168.1.100",
    status: "up",
    packetsIn: 1234567,
    packetsOut: 987654,
    bytesIn: 1200000000,
    bytesOut: 456000000,
    errorsIn: 0,
    errorsOut: 0,
  },
  {
    name: "LAN",
    device: "em1",
    address: "10.0.0.1",
    status: "up",
    packetsIn: 5678901,
    packetsOut: 4567890,
    bytesIn: 4500000000,
    bytesOut: 3200000000,
    errorsIn: 0,
    errorsOut: 0,
  },
  {
    name: "OPT1",
    device: "em2",
    address: "172.16.0.1",
    status: "up",
    packetsIn: 234567,
    packetsOut: 123456,
    bytesIn: 128000000,
    bytesOut: 64000000,
    errorsIn: 2,
    errorsOut: 0,
  },
  {
    name: "OPT2",
    device: "em3",
    address: "—",
    status: "down",
    packetsIn: 0,
    packetsOut: 0,
    bytesIn: 0,
    bytesOut: 0,
    errorsIn: 0,
    errorsOut: 0,
  },
];

const formatBytes = (bytes: number): string => {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const formatPackets = (packets: number): string => {
  return packets.toLocaleString();
};

export function InterfacesWidget() {
  const {
    data: interfaces,
    isPlaying,
    toggle,
    reset,
  } = useLiveData<InterfaceData[]>({
    generateData: generateInterfacesData,
    interval: 1500,
    initialData: initialInterfacesData,
  });

  return (
    <Card className="border border-gray-700 bg-gray-900 shadow-sm">
      <CardHeader className="bg-gray-800 py-2 px-3 border-b border-gray-700">
        <CardTitle className="text-sm font-semibold text-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="h-4 w-4 text-orange-500" />
            Interfaces
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
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-800 border-b border-gray-700">
              <th className="py-1.5 px-2 text-left font-semibold text-gray-300">
                Name
              </th>
              <th className="py-1.5 px-2 text-left font-semibold text-gray-300">
                Device
              </th>
              <th className="py-1.5 px-2 text-left font-semibold text-gray-300">
                Address
              </th>
              <th className="py-1.5 px-2 text-center font-semibold text-gray-300">
                Status
              </th>
              <th className="py-1.5 px-2 text-right font-semibold text-gray-300">
                <span className="flex items-center justify-end gap-1">
                  <ArrowDown className="h-3 w-3" />
                  In
                </span>
              </th>
              <th className="py-1.5 px-2 text-right font-semibold text-gray-300">
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
                className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
              >
                <td className="py-1.5 px-2 font-medium text-blue-400 border-b border-gray-700">
                  <a href="#" className="hover:underline">
                    {iface.name}
                  </a>
                </td>
                <td className="py-1.5 px-2 text-gray-300 border-b border-gray-700 font-mono text-xs">
                  {iface.device}
                </td>
                <td className="py-1.5 px-2 text-gray-300 border-b border-gray-700 font-mono text-xs">
                  {iface.address}
                </td>
                <td className="py-1.5 px-2 text-center border-b border-gray-700">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      iface.status === "up"
                        ? "bg-green-900 text-green-300"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {iface.status}
                  </span>
                </td>
                <td className="py-1.5 px-2 text-right text-gray-300 border-b border-gray-700">
                  <div className="flex flex-col">
                    <span>{formatPackets(iface.packetsIn)} pkts</span>
                    <span className="text-gray-400">
                      {formatBytes(iface.bytesIn)}
                    </span>
                  </div>
                </td>
                <td className="py-1.5 px-2 text-right text-gray-300 border-b border-gray-700">
                  <div className="flex flex-col">
                    <span>{formatPackets(iface.packetsOut)} pkts</span>
                    <span className="text-gray-400">
                      {formatBytes(iface.bytesOut)}
                    </span>
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
