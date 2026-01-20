"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Shield, AlertTriangle } from "lucide-react";

const aliasUsageData = [
  { name: "LAN_Network", usage: 15, trend: "up" },
  { name: "DMZ_Servers", usage: 8, trend: "stable" },
  { name: "Blocked_Countries", usage: 12, trend: "up" },
  { name: "Allowed_Ports", usage: 6, trend: "down" },
  { name: "VPN_Users", usage: 4, trend: "stable" },
];

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up":
      return <TrendingUp className="h-3 w-3 text-green-500" />;
    case "down":
      return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />;
    default:
      return <div className="h-3 w-3 bg-gray-500 rounded-full"></div>;
  }
};

export function AliasUsageWidget() {
  return (
    <Card className="border border-gray-700 bg-gray-900 shadow-sm">
      <CardHeader className="bg-gray-800 py-3 px-4 border-b border-gray-700">
        <CardTitle className="text-sm font-semibold text-gray-200 flex items-center gap-2">
          <Shield className="h-4 w-4 text-green-500" />
          Top Usage (Last 24h)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {aliasUsageData.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-800 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="text-sm font-medium text-gray-200">
                  {item.name}
                </div>
                {getTrendIcon(item.trend)}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300">{item.usage} hits</span>
                {item.usage > 10 && (
                  <AlertTriangle className="h-3 w-3 text-yellow-500" />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-700">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Total hits:</span>
            <span className="text-gray-300 font-medium">
              {aliasUsageData.reduce((sum, item) => sum + item.usage, 0)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
