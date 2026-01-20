import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Zap, Shield, TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const liveStats = [
  {
    title: "Connections/sec",
    value: "1,247",
    change: "+12%",
    icon: Activity,
    color: "text-blue-500",
    trend: "up",
  },
  {
    title: "Blocked/sec",
    value: "89",
    change: "+5%",
    icon: Shield,
    color: "text-red-500",
    trend: "up",
  },
  {
    title: "Allowed/sec",
    value: "1,158",
    change: "+13%",
    icon: TrendingUp,
    color: "text-green-500",
    trend: "up",
  },
  {
    title: "Threat Rate",
    value: "7.2%",
    change: "-2%",
    icon: Zap,
    color: "text-orange-500",
    trend: "down",
  },
];

const recentThreats = [
  {
    id: 1,
    type: "DDoS Attack",
    source: "203.0.113.45",
    target: "Web Server",
    severity: "high",
    timestamp: "14:32:15",
  },
  {
    id: 2,
    type: "Port Scan",
    source: "198.51.100.23",
    target: "SSH Service",
    severity: "medium",
    timestamp: "14:32:10",
  },
  {
    id: 3,
    type: "Brute Force",
    source: "192.0.2.100",
    target: "RDP Service",
    severity: "high",
    timestamp: "14:32:05",
  },
];

export function LiveStatsWidget() {
  return (
    <Card className="border border-gray-700 bg-gray-900 shadow-sm">
      <CardHeader className="bg-gray-800 py-3 px-4 border-b border-gray-700">
        <CardTitle className="text-base font-semibold text-gray-200 flex items-center gap-2">
          <Activity className="h-5 w-5 text-green-500" />
          Live Statistics
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* Real-time Metrics */}
        <div className="grid grid-cols-2 gap-3">
          {liveStats.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-3 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <div className="flex items-center gap-1">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      stat.change.startsWith("+")
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className="text-lg font-semibold text-gray-200">
                {stat.value}
              </div>
              <div className="text-xs text-gray-400">{stat.title}</div>
            </div>
          ))}
        </div>

        {/* Recent Threats */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3">
            Recent Threats
          </h3>
          <div className="space-y-2">
            {recentThreats.map((threat) => (
              <div
                key={threat.id}
                className="bg-gray-800 rounded-lg p-2 border border-gray-700"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-200">
                    {threat.type}
                  </span>
                  <Badge
                    variant={
                      threat.severity === "high" ? "destructive" : "outline"
                    }
                    className="text-xs"
                  >
                    {threat.severity}
                  </Badge>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>From: {threat.source}</span>
                  <span>{threat.timestamp}</span>
                </div>
                <div className="text-xs text-gray-400">
                  Target: {threat.target}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="pt-3 border-t border-gray-700">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">CPU Usage:</span>
              <span className="text-gray-300">23%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Memory:</span>
              <span className="text-gray-300">156MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Latency:</span>
              <span className="text-green-400">0.3ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Uptime:</span>
              <span className="text-gray-300">99.9%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
