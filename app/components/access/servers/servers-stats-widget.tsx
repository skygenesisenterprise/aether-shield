"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server } from "lucide-react";

export function ServersStatsWidget() {
  const stats = [
    { label: "Total Servers", value: "8", icon: Server },
    { label: "Active Servers", value: "6", icon: Server },
    { label: "Linux Servers", value: "5", icon: Server },
    { label: "Windows Servers", value: "3", icon: Server },
  ];

  return (
    <Card className="border border-gray-700 bg-gray-900 shadow-sm">
      <CardHeader className="bg-gray-800 py-2 px-3 border-b border-gray-700">
        <CardTitle className="text-sm font-semibold text-gray-200 flex items-center gap-2">
          <Server className="h-4 w-4 text-orange-500" />
          Servers Statistics
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
                    <IconComponent className="h-4 w-4 text-orange-400" />
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
