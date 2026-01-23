import { WirelessDevicesList } from "@/components/interfaces/wireless/wireless-devices-list";
import { WirelessStatsWidget } from "@/components/interfaces/wireless/wireless-stats-widget";
import { WirelessSignalWidget } from "@/components/interfaces/wireless/wireless-signal-widget";
import { WirelessClientsWidget } from "@/components/interfaces/wireless/wireless-clients-widget";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, Wifi } from "lucide-react";

export default function WirelessDevicesPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <main className="p-4">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-100">
                Wireless Devices
              </h1>
              <p className="text-sm text-gray-300">
                Manage and monitor wireless devices connected to your network
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Device
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard Grid - Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Stats Column */}
          <div className="space-y-4">
            <WirelessStatsWidget />
          </div>

          {/* Clients Column */}
          <div className="space-y-4">
            <WirelessClientsWidget />
          </div>

          {/* Signal Strength Column */}
          <div className="space-y-4">
            <WirelessSignalWidget />
          </div>

          {/* List Column - Full Width on all screens */}
          <div className="space-y-4 lg:col-span-3">
            <WirelessDevicesList />
          </div>
        </div>
      </main>
    </div>
  );
}
