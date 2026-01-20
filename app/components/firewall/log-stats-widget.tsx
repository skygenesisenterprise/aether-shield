import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Activity, AlertTriangle, Shield } from "lucide-react";

const logStats = [
  {
    title: "Total Logs",
    value: "1,247",
    change: "+12%",
    icon: Activity,
    color: "text-blue-500",
  },
  {
    title: "Blocked Connections",
    value: "89",
    change: "+5%",
    icon: Shield,
    color: "text-red-500",
  },
  {
    title: "Allowed Connections",
    value: "1,158",
    change: "+13%",
    icon: TrendingUp,
    color: "text-green-500",
  },
  {
    title: "Critical Events",
    value: "3",
    change: "-2",
    icon: AlertTriangle,
    color: "text-orange-500",
  },
];

export function LogStatsWidget() {
  return (
    <Card className="border border-gray-700 bg-gray-900 shadow-sm">
      <CardHeader className="bg-gray-800 py-3 px-4 border-b border-gray-700">
        <CardTitle className="text-base font-semibold text-gray-200">
          Log Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {logStats.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-3 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <span
                  className={`text-xs font-medium ${
                    stat.change.startsWith("+")
                      ? "text-green-500"
                      : stat.change.startsWith("-")
                        ? "text-red-500"
                        : "text-gray-500"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <div className="text-lg font-semibold text-gray-200">
                {stat.value}
              </div>
              <div className="text-xs text-gray-400">{stat.title}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
