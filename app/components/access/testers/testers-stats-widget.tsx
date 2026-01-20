"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bug } from "lucide-react";

export function TestersStatsWidget() {
  const stats = [
    { label: "Total Testers", value: "15", icon: Bug },
    { label: "Active Testers", value: "12", icon: Bug },
    { label: "Manual Testers", value: "8", icon: Bug },
    { label: "Automated Testers", value: "7", icon: Bug },
  ];

  return (
    <Card className="border border-gray-700 bg-gray-900 shadow-sm">
      <CardHeader className="bg-gray-800 py-2 px-3 border-b border-gray-700">
        <CardTitle className="text-sm font-semibold text-gray-200 flex items-center gap-2">
          <Bug className="h-4 w-4 text-purple-500" />
          Testers Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
              >
                <div className="p-3 rounded border border-gray-700">
                  <div className="flex items-center gap-2 mb-1">
                    <IconComponent className="h-4 w-4 text-purple-400" />
                    <span className="text-xs font-medium text-gray-300">
                      {stat.label}
                    </span>
                  </div>
                  <div className="text-lg font-semibold text-gray-100">
                    {stat.value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
