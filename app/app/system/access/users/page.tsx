"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UsersTableWidget } from "@/components/access/users/users-table-widget";
import { UsersStatsWidget } from "@/components/access/users/users-stats-widget";
import { UsersActivityWidget } from "@/components/access/users/users-activity-widget";

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <main className="p-4">
        {/* Page Title */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-100">
              User Management
            </h1>
            <p className="text-sm text-gray-300">
              Manage system users and access permissions
            </p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Add New User
          </Button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Column 1 */}
          <div className="space-y-4">
            <UsersStatsWidget />
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <UsersActivityWidget />
          </div>

          {/* Column 3 - Empty for now */}
          <div className="space-y-4">
            {/* Future widgets can be added here */}
          </div>
        </div>

        {/* Full Width Row */}
        <div className="mt-4">
          <UsersTableWidget />
        </div>
      </main>
    </div>
  );
}
