"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function CategoryStatsWidget() {
  // Mock data - replace with actual API calls
  const stats = {
    totalCategories: 12,
    activeCategories: 8,
    inactiveCategories: 4,
    rulesUsingCategories: 45,
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">
          Category Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-bold text-gray-100">
              {stats.totalCategories}
            </p>
            <p className="text-xs text-gray-400">Total Categories</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-100">
              {stats.activeCategories}
            </p>
            <p className="text-xs text-gray-400">Active</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-bold text-gray-100">
              {stats.inactiveCategories}
            </p>
            <p className="text-xs text-gray-400">Inactive</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-100">
              {stats.rulesUsingCategories}
            </p>
            <p className="text-xs text-gray-400">Rules Using</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-xs">
            Active: {stats.activeCategories}
          </Badge>
          <Badge variant="destructive" className="text-xs">
            Inactive: {stats.inactiveCategories}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
