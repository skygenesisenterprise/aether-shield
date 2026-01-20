"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Globe, MapPin, List } from "lucide-react";

const aliasStats = {
  total: 24,
  active: 18,
  inactive: 6,
  byType: {
    Network: 8,
    Host: 6,
    GeoIP: 4,
    Port: 6,
  },
};

export function AliasStatsWidget() {
  return (
    <Card className="border border-gray-700 bg-gray-900 shadow-sm">
      <CardHeader className="bg-gray-800 py-3 px-4 border-b border-gray-700">
        <CardTitle className="text-sm font-semibold text-gray-200 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-purple-500" />
          Alias Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {aliasStats.total}
            </div>
            <div className="text-xs text-gray-400">Total Aliases</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {aliasStats.active}
            </div>
            <div className="text-xs text-gray-400">Active</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-600 rounded"></div>
              <span className="text-gray-400">Inactive</span>
            </div>
            <span className="text-gray-300 font-medium">
              {aliasStats.inactive}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
