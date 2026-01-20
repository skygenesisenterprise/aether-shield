"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bug, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TestersTableWidget } from "@/components/access/testers/testers-table-widget";
import { TestersStatsWidget } from "@/components/access/testers/testers-stats-widget";
import { TestersResultsWidget } from "@/components/access/testers/testers-results-widget";

export default function TestersPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <main className="p-4">
        {/* Page Title */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-100">
              Test Suite Management
            </h1>
            <p className="text-sm text-gray-300">
              Manage automated and manual testing suites
            </p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Add New Tester
          </Button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Column 1 */}
          <div className="space-y-4">
            <TestersStatsWidget />
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <TestersResultsWidget />
          </div>

          {/* Column 3 - Empty for now */}
          <div className="space-y-4">
            {/* Future widgets can be added here */}
          </div>
        </div>

        {/* Full Width Row */}
        <div className="mt-4">
          <TestersTableWidget />
        </div>
      </main>
    </div>
  );
}
