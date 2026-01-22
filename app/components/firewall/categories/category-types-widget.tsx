"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function CategoryTypesWidget() {
  // Mock data - replace with actual API calls
  const categoryTypes = [
    { name: "Security", count: 4, percentage: 33 },
    { name: "Application", count: 3, percentage: 25 },
    { name: "Network", count: 2, percentage: 17 },
    { name: "Custom", count: 3, percentage: 25 },
  ];

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">
          Category Types
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {categoryTypes.map((type, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-100">
                {type.name}
              </span>
              <span className="text-xs text-gray-400">
                {type.count} categories ({type.percentage}%)
              </span>
            </div>
            <Progress value={type.percentage} className="h-2 bg-gray-700" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
