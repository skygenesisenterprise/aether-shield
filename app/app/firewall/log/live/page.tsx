import { WorldTrafficMapWidget } from "@/components/firewall/world-traffic-map-widget";
import { LiveTrafficStatsWidget } from "@/components/firewall/live-traffic-stats-widget";
import { LiveLogsWidget } from "@/components/firewall/live-logs-widget";

export default function FirewallLogLivePage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <main className="p-4">
        {/* Page Title */}
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-gray-100">
            Aether Shield - Live Firewall Logs
          </h1>
          <p className="text-sm text-gray-300">
            Real-time global firewall monitoring with interactive world map
          </p>
        </div>

        {/* Live Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Map - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <WorldTrafficMapWidget />
          </div>

          {/* Sidebar Stats - Takes 1 column on large screens */}
          <div className="space-y-4">
            <LiveTrafficStatsWidget />
          </div>

          {/* Bottom Logs Table - Full Width */}
          <div className="lg:col-span-3">
            <LiveLogsWidget />
          </div>
        </div>
      </main>
    </div>
  );
}
