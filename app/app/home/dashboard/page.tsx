import { SystemInformation } from "@/components/dashboard/system-information";
import { ServicesWidget } from "@/components/dashboard/services-widget";
import { GatewaysWidget } from "@/components/dashboard/gateways-widget";
import { InterfacesWidget } from "@/components/dashboard/interfaces-widget";
import { TrafficGraphWidget } from "@/components/dashboard/traffic-graph-widget";
import { FirewallLogsWidget } from "@/components/dashboard/firewall-logs-widget";
import { ThermalSensorsWidget } from "@/components/dashboard/thermal-sensors-widget";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <main className="p-4">
        {/* Dashboard Title */}
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-gray-100">
            Home - Dashboard
          </h1>
          <p className="text-sm text-gray-300">System overview and status</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Column 1 */}
          <div className="space-y-4">
            <SystemInformation />
            <ThermalSensorsWidget />
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <GatewaysWidget />
            <InterfacesWidget />
          </div>

          {/* Column 3 */}
          <div className="space-y-4 lg:col-span-2 xl:col-span-1">
            <TrafficGraphWidget />
            <FirewallLogsWidget />
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
