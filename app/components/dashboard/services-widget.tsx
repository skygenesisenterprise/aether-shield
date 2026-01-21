"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Settings,
  Play,
  Square,
  RotateCcw,
  Pause,
  RotateCw,
} from "lucide-react";
import { useLiveData } from "@/hooks/use-live-data";

interface ServiceData {
  name: string;
  description: string;
  running: boolean;
}

const generateServicesData = (): ServiceData[] => {
  const services = [
    {
      name: "configd",
      description: "System Configuration Daemon",
      critical: true,
    },
    { name: "dhcpd", description: "ISC DHCP Server", critical: false },
    { name: "dnsmasq", description: "Dnsmasq DNS Forwarder", critical: false },
    {
      name: "dpinger",
      description: "Gateway Monitoring Daemon",
      critical: true,
    },
    { name: "ntpd", description: "NTP Daemon", critical: false },
    { name: "openssh", description: "Secure Shell Daemon", critical: true },
    { name: "syslog-ng", description: "Syslog-ng Daemon", critical: true },
    { name: "unbound", description: "Unbound DNS Resolver", critical: false },
    { name: "webgui", description: "Web GUI", critical: true },
  ];

  return services.map((service) => ({
    ...service,
    running: service.critical || Math.random() > 0.2,
  }));
};

const initialServicesData: ServiceData[] = [
  {
    name: "configd",
    description: "System Configuration Daemon",
    running: true,
  },
  { name: "dhcpd", description: "ISC DHCP Server", running: true },
  { name: "dnsmasq", description: "Dnsmasq DNS Forwarder", running: false },
  { name: "dpinger", description: "Gateway Monitoring Daemon", running: true },
  { name: "ntpd", description: "NTP Daemon", running: true },
  { name: "openssh", description: "Secure Shell Daemon", running: true },
  { name: "syslog-ng", description: "Syslog-ng Daemon", running: true },
  { name: "unbound", description: "Unbound DNS Resolver", running: true },
  { name: "webgui", description: "Web GUI", running: true },
];

export function ServicesWidget() {
  const {
    data: services,
    isPlaying,
    toggle,
    reset,
  } = useLiveData<ServiceData[]>({
    generateData: generateServicesData,
    interval: 5000,
    initialData: initialServicesData,
  });

  return (
    <Card className="border border-gray-700 bg-gray-900 shadow-sm">
      <CardHeader className="bg-gray-800 py-2 px-3 border-b border-gray-700">
        <CardTitle className="text-sm font-semibold text-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-orange-500" />
            Services
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
              <th className="py-1.5 px-3 text-left font-semibold text-gray-300">
                Service
              </th>
              <th className="py-1.5 px-3 text-left font-semibold text-gray-300">
                Description
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
            {services.map((service, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
              >
                <td className="py-1.5 px-3 font-medium text-gray-200 border-b border-gray-700">
                  {service.name}
                </td>
                <td className="py-1.5 px-3 text-gray-300 border-b border-gray-700">
                  {service.description}
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      service.running
                        ? "bg-green-900 text-green-300"
                        : "bg-red-900 text-red-300"
                    }`}
                  >
                    {service.running ? "Running" : "Stopped"}
                  </span>
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <div className="flex items-center justify-center gap-1">
                    {service.running ? (
                      <>
                        <button
                          className="p-1 hover:bg-gray-700 rounded"
                          title="Stop"
                        >
                          <Square className="h-3 w-3 text-red-500" />
                        </button>
                        <button
                          className="p-1 hover:bg-gray-700 rounded"
                          title="Restart"
                        >
                          <RotateCcw className="h-3 w-3 text-blue-500" />
                        </button>
                      </>
                    ) : (
                      <button
                        className="p-1 hover:bg-gray-700 rounded"
                        title="Start"
                      >
                        <Play className="h-3 w-3 text-green-500" />
                      </button>
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
