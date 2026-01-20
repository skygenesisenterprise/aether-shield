import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, TrendingUp, TrendingDown } from "lucide-react";

const hourlyData = [
  { hour: "00", blocked: 12, allowed: 145 },
  { hour: "04", blocked: 8, allowed: 98 },
  { hour: "08", blocked: 15, allowed: 234 },
  { hour: "12", blocked: 22, allowed: 312 },
  { hour: "16", blocked: 18, allowed: 287 },
  { hour: "20", blocked: 14, allowed: 198 },
];

const weeklyData = [
  { day: "Mon", blocked: 89, allowed: 1158 },
  { day: "Tue", blocked: 92, allowed: 1203 },
  { day: "Wed", blocked: 78, allowed: 1098 },
  { day: "Thu", blocked: 95, allowed: 1234 },
  { day: "Fri", blocked: 103, allowed: 1345 },
  { day: "Sat", blocked: 65, allowed: 876 },
  { day: "Sun", blocked: 58, allowed: 743 },
];

export function LogAnalyticsWidget() {
  return (
    <Card className="border border-gray-700 bg-gray-900 shadow-sm">
      <CardHeader className="bg-gray-800 py-3 px-4 border-b border-gray-700">
        <CardTitle className="text-base font-semibold text-gray-200 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-purple-500" />
          Log Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        {/* Hourly Distribution */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              Hourly Distribution (Last 24h)
            </h3>
          </div>
          <div className="space-y-2">
            {hourlyData.map((hour) => (
              <div key={hour.hour} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-8">{hour.hour}h</span>
                <div className="flex-1 flex gap-1">
                  <div
                    className="bg-red-500 rounded-sm"
                    style={{
                      width: `${(hour.blocked / 50) * 100}%`,
                      height: "20px",
                    }}
                    title={`Blocked: ${hour.blocked}`}
                  />
                  <div
                    className="bg-green-500 rounded-sm"
                    style={{
                      width: `${(hour.allowed / 350) * 100}%`,
                      height: "20px",
                    }}
                    title={`Allowed: ${hour.allowed}`}
                  />
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="text-red-400">{hour.blocked}</span>
                  <span className="text-green-400">{hour.allowed}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Trend */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-300">Weekly Trend</h3>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weeklyData.map((day) => {
              const totalChange = day.blocked + day.allowed;
              const isIncreasing = totalChange > 1000;
              return (
                <div key={day.day} className="text-center">
                  <div className="text-xs text-gray-400 mb-1">{day.day}</div>
                  <div className="bg-gray-800 rounded p-2">
                    <div className="flex items-center justify-center mb-1">
                      {isIncreasing ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                    </div>
                    <div className="text-xs text-gray-300">{totalChange}</div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-red-400">{day.blocked}</span>
                      <span className="text-green-400">{day.allowed}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="pt-3 border-t border-gray-700">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-400">Peak Hour:</span>
              <span className="ml-2 text-gray-300">
                12:00 (334 connections)
              </span>
            </div>
            <div>
              <span className="text-gray-400">Peak Day:</span>
              <span className="ml-2 text-gray-300">
                Friday (1448 connections)
              </span>
            </div>
            <div>
              <span className="text-gray-400">Avg Block Rate:</span>
              <span className="ml-2 text-red-400">7.2%</span>
            </div>
            <div>
              <span className="text-gray-400">Total Weekly:</span>
              <span className="ml-2 text-gray-300">7,506 connections</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
