"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GroupsTableWidget } from "@/components/access/groups/groups-table-widget";
import { GroupsStatsWidget } from "@/components/access/groups/groups-stats-widget";
import { GroupsPermissionsWidget } from "@/components/access/groups/groups-permissions-widget";

export default function GroupsPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <main className="p-4">
        {/* Page Title */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-100">
              User Groups Management
            </h1>
            <p className="text-sm text-gray-300">
              Manage system groups and permissions
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add New Group
          </Button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Column 1 */}
          <div className="space-y-4">
            <GroupsStatsWidget />
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <GroupsPermissionsWidget />
          </div>

          {/* Column 3 - Empty for now */}
          <div className="space-y-4">
            {/* Future widgets can be added here */}
          </div>
        </div>

        {/* Full Width Row */}
        <div className="mt-4">
          <GroupsTableWidget />
        </div>
      </main>
    </div>
  );
}
