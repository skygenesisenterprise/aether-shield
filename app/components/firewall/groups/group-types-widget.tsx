"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function GroupTypesWidget() {
  // Mock data - replace with actual API calls
  const groupTypes = [
    { name: "User Groups", count: 5, percentage: 33 },
    { name: "Device Groups", count: 4, percentage: 27 },
    { name: "Location Groups", count: 3, percentage: 20 },
    { name: "Custom Groups", count: 3, percentage: 20 },
  ];

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">
          Group Types
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {groupTypes.map((type, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-100">
                {type.name}
              </span>
              <span className="text-xs text-gray-400">
                {type.count} groups ({type.percentage}%)
              </span>
            </div>
            <Progress value={type.percentage} className="h-2 bg-gray-700" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
