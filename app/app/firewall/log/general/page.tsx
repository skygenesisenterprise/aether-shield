import { GeneralLogsWidget } from "@/components/firewall/general-logs-widget";
import { LogStatsWidget } from "@/components/firewall/log-stats-widget";
import { LogAnalyticsWidget } from "@/components/firewall/log-analytics-widget";
import { CriticalEventsWidget } from "@/components/firewall/critical-events-widget";

export default function FirewallLogGeneralPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <main className="p-4">
        {/* Page Title */}
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-gray-100">
            Aether Shield - Firewall Logs
          </h1>
          <p className="text-sm text-gray-300">
            General firewall logs and monitoring
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Row 1 - Side by side widgets */}
          <div className="space-y-4">
            <LogStatsWidget />
          </div>
          <div className="space-y-4">
            <LogAnalyticsWidget />
          </div>
          <div className="space-y-4">
            <CriticalEventsWidget />
          </div>

          {/* Row 2 - Full Width */}
          <div className="lg:col-span-2 xl:col-span-3">
            <GeneralLogsWidget />
          </div>
        </div>
      </main>
    </div>
  );
}
