"use client";

import { GroupListWidget } from "@/components/firewall/groups/group-list-widget";
import { GroupStatsWidget } from "@/components/firewall/groups/group-stats-widget";
import { GroupUsageWidget } from "@/components/firewall/groups/group-usage-widget";
import { GroupTypesWidget } from "@/components/firewall/groups/group-types-widget";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

export default function FirewallGroupsPage() {
  return (
    <div className="h-screen bg-gray-900 overflow-hidden">
      <main className="h-full p-4 overflow-auto">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-100">
                Firewall Groups
              </h1>
              <p className="text-sm text-gray-300">
                Manage and monitor firewall groups for efficient rule
                organization
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Group
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard Grid - Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Stats Column */}
          <div className="space-y-4">
            <GroupStatsWidget />
          </div>

          {/* Usage Column */}
          <div className="space-y-4">
            <GroupUsageWidget />
          </div>

          {/* Types Column */}
          <div className="space-y-4">
            <GroupTypesWidget />
          </div>

          {/* List Column - Full Width on all screens */}
          <div className="space-y-4 lg:col-span-3">
            <GroupListWidget />
          </div>
        </div>
      </main>
    </div>
  );
}
