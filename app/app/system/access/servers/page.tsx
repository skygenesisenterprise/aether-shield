"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ServersTableWidget } from "@/components/access/servers/servers-table-widget";
import { ServersStatsWidget } from "@/components/access/servers/servers-stats-widget";
import { ServersStatusWidget } from "@/components/access/servers/servers-status-widget";

export default function ServersPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <main className="p-4">
        {/* Page Title */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-100">
              Server Management
            </h1>
            <p className="text-sm text-gray-300">
              Manage system servers and infrastructure
            </p>
          </div>
          <Button className="bg-orange-600 hover:bg-orange-700">
            <Plus className="h-4 w-4 mr-2" />
            Add New Server
          </Button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Column 1 */}
          <div className="space-y-4">
            <ServersStatsWidget />
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <ServersStatusWidget />
          </div>

          {/* Column 3 - Empty for now */}
          <div className="space-y-4">
            {/* Future widgets can be added here */}
          </div>
        </div>

        {/* Full Width Row */}
        <div className="mt-4">
          <ServersTableWidget />
        </div>
      </main>
    </div>
  );
}
