import { SystemInformation } from "@/components/dashboard/system-information";
import { ServicesWidget } from "@/components/dashboard/services-widget";
import { GatewaysWidget } from "@/components/dashboard/gateways-widget";
import { InterfacesWidget } from "@/components/dashboard/interfaces-widget";
import { TrafficGraphWidget } from "@/components/dashboard/traffic-graph-widget";
import { FirewallLogsWidget } from "@/components/dashboard/firewall-logs-widget";
import { ThermalSensorsWidget } from "@/components/dashboard/thermal-sensors-widget";

// Composants spécifiques pour la gestion WAN
import WANConfiguration from "@/components/interfaces/wan/wan-configuration";
import WANStatus from "@/components/interfaces/wan/wan-status";
import WANTraffic from "@/components/interfaces/wan/wan-traffic";
import WANConnectionHistory from "@/components/interfaces/wan/wan-connection-history";

export default function WANPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <main className="p-4">
        {/* WAN Title */}
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-gray-100">
            Interfaces - WAN
          </h1>
          <p className="text-sm text-gray-300">WAN interface configuration and monitoring</p>
        </div>

        {/* WAN Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Column 1 - Configuration */}
          <div className="space-y-4">
            <WANConfiguration />
            <WANStatus />
          </div>

          {/* Column 2 - Monitoring */}
          <div className="space-y-4">
            <GatewaysWidget />
            <WANTraffic />
          </div>

          {/* Column 3 - Analytics */}
          <div className="space-y-4 lg:col-span-2 xl:col-span-1">
            <TrafficGraphWidget />
            <WANConnectionHistory />
          </div>
        </div>

        {/* Full Width Row */}
        <div className="mt-4">
          <ServicesWidget />
        </div>
      </main>
    </div>
  );
}
