import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Shield, Info, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const criticalEvents = [
  {
    id: 1,
    timestamp: "2025-01-20 14:32:15",
    severity: "critical",
    type: "Security Threat",
    message: "Multiple failed login attempts from 203.0.113.45",
    source: "WAN",
    action: "IP blocked automatically",
  },
  {
    id: 2,
    timestamp: "2025-01-20 14:28:33",
    severity: "high",
    type: "Port Scan",
    message: "Port scan detected from 198.51.100.23",
    source: "WAN",
    action: "Temporary block applied",
  },
  {
    id: 3,
    timestamp: "2025-01-20 14:15:12",
    severity: "medium",
    type: "Anomaly Detection",
    message: "Unusual traffic pattern on port 443",
    source: "LAN",
    action: "Monitoring increased",
  },
  {
    id: 4,
    timestamp: "2025-01-20 13:45:08",
    severity: "low",
    type: "Configuration Change",
    message: "Firewall rule updated by admin",
    source: "System",
    action: "Logged for audit",
  },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical":
      return "text-red-500 bg-red-500/10 border-red-500/20";
    case "high":
      return "text-orange-500 bg-orange-500/10 border-orange-500/20";
    case "medium":
      return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    case "low":
      return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    default:
      return "text-gray-500 bg-gray-500/10 border-gray-500/20";
  }
};

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "critical":
      return AlertTriangle;
    case "high":
      return Zap;
    case "medium":
      return Shield;
    case "low":
      return Info;
    default:
      return Info;
  }
};

export function CriticalEventsWidget() {
  return (
    <Card className="border border-gray-700 bg-gray-900 shadow-sm">
      <CardHeader className="bg-gray-800 py-3 px-4 border-b border-gray-700">
        <CardTitle className="text-base font-semibold text-gray-200 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Critical Events
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {criticalEvents.map((event) => {
            const Icon = getSeverityIcon(event.severity);
            return (
              <div
                key={event.id}
                className={`p-3 rounded-lg border ${getSeverityColor(event.severity)}`}
              >
                <div className="flex items-start gap-3">
                  <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline" className="text-xs capitalize">
                        {event.severity}
                      </Badge>
                      <span className="text-xs text-gray-400 font-mono">
                        {event.timestamp}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-200 mb-1">
                      {event.type}
                    </div>
                    <div className="text-xs text-gray-300 mb-2">
                      {event.message}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">
                        Source:{" "}
                        <span className="text-gray-300">{event.source}</span>
                      </span>
                      <span className="text-gray-400">
                        Action:{" "}
                        <span className="text-gray-300">{event.action}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-4 pt-3 border-t border-gray-700">
          <div className="flex justify-between text-xs text-gray-400">
            <span>
              Critical:{" "}
              {criticalEvents.filter((e) => e.severity === "critical").length}
            </span>
            <span>
              High: {criticalEvents.filter((e) => e.severity === "high").length}
            </span>
            <span>
              Medium:{" "}
              {criticalEvents.filter((e) => e.severity === "medium").length}
            </span>
            <span>
              Low: {criticalEvents.filter((e) => e.severity === "low").length}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
