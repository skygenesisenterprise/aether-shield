"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Globe, Users, MapPin, List } from "lucide-react";

const aliasTypes = [
  { type: "Network", count: 8, color: "bg-blue-500", icon: Globe },
  { type: "Host", count: 6, color: "bg-green-500", icon: Users },
  { type: "GeoIP", count: 4, color: "bg-orange-500", icon: MapPin },
  { type: "Port", count: 6, color: "bg-purple-500", icon: List },
];

export function AliasTypesWidget() {
  const total = aliasTypes.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="border border-gray-700 bg-gray-900 shadow-sm">
      <CardHeader className="bg-gray-800 py-3 px-4 border-b border-gray-700">
        <CardTitle className="text-sm font-semibold text-gray-200 flex items-center gap-2">
          <PieChart className="h-4 w-4 text-orange-500" />
          Alias Types
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {aliasTypes.map((item, index) => {
            const Icon = item.icon;
            const percentage = total > 0 ? (item.count / total) * 100 : 0;

            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-300">{item.type}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-200">
                    {item.count}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
