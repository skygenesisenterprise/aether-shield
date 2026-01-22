"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function GroupStatsWidget() {
  // Mock data - replace with actual API calls
  const stats = {
    totalGroups: 15,
    activeGroups: 10,
    inactiveGroups: 5,
    rulesUsingGroups: 62,
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">
          Group Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-bold text-gray-100">
              {stats.totalGroups}
            </p>
            <p className="text-xs text-gray-400">Total Groups</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-100">
              {stats.activeGroups}
            </p>
            <p className="text-xs text-gray-400">Active</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-bold text-gray-100">
              {stats.inactiveGroups}
            </p>
            <p className="text-xs text-gray-400">Inactive</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-100">
              {stats.rulesUsingGroups}
            </p>
            <p className="text-xs text-gray-400">Rules Using</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-xs">
            Active: {stats.activeGroups}
          </Badge>
          <Badge variant="destructive" className="text-xs">
            Inactive: {stats.inactiveGroups}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
