"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

export function UsersStatsWidget() {
  const stats = [
    { label: "Total Users", value: "48", icon: User },
    { label: "Active Users", value: "42", icon: User },
    { label: "Admin Users", value: "5", icon: User },
    { label: "Regular Users", value: "43", icon: User },
  ];

  return (
    <Card className="border border-gray-700 bg-gray-900 shadow-sm">
      <CardHeader className="bg-gray-800 py-2 px-3 border-b border-gray-700">
        <CardTitle className="text-sm font-semibold text-gray-200 flex items-center gap-2">
          <User className="h-4 w-4 text-indigo-500" />
          Users Statistics
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
                    <IconComponent className="h-4 w-4 text-indigo-400" />
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
