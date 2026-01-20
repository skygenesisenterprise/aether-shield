"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PrivilegesTableWidget } from "@/components/access/privileges/privileges-table-widget";
import { PrivilegesStatsWidget } from "@/components/access/privileges/privileges-stats-widget";
import { PrivilegesLevelsWidget } from "@/components/access/privileges/privileges-levels-widget";

export default function PrivilegesPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <main className="p-4">
        {/* Page Title */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-100">
              System Privileges Management
            </h1>
            <p className="text-sm text-gray-300">
              Manage system privileges and access levels
            </p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add New Privilege
          </Button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Column 1 */}
          <div className="space-y-4">
            <PrivilegesStatsWidget />
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <PrivilegesLevelsWidget />
          </div>

          {/* Column 3 - Empty for now */}
          <div className="space-y-4">
            {/* Future widgets can be added here */}
          </div>
        </div>

        {/* Full Width Row */}
        <div className="mt-4">
          <PrivilegesTableWidget />
        </div>
      </main>
    </div>
  );
}
