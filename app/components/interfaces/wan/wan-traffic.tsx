"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Clock } from "lucide-react";

export default function WANTraffic() {
  // Données de trafic simulées
  const trafficData = [
    { time: "00:00", download: 50, upload: 20 },
    { time: "04:00", download: 80, upload: 30 },
    { time: "08:00", download: 120, upload: 45 },
    { time: "12:00", download: 180, upload: 60 },
    { time: "16:00", download: 220, upload: 75 },
    { time: "20:00", download: 150, upload: 50 },
  ];

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">WAN Traffic</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <ArrowDown className="h-4 w-4 mr-2 text-blue-400" />
              <span className="text-gray-300 text-sm">Download</span>
            </div>
            <div className="text-2xl font-bold text-white">1.2 GB</div>
            <div className="text-sm text-gray-400">Last 24h</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <ArrowUp className="h-4 w-4 mr-2 text-green-400" />
              <span className="text-gray-300 text-sm">Upload</span>
            </div>
            <div className="text-2xl font-bold text-white">350 MB</div>
            <div className="text-sm text-gray-400">Last 24h</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-4 w-4 mr-2 text-purple-400" />
              <span className="text-gray-300 text-sm">Speed</span>
            </div>
            <div className="text-2xl font-bold text-white">85 Mbps</div>
            <div className="text-sm text-gray-400">Current</div>
          </div>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={trafficData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" tick={{ fill: "#9ca3af" }} />
              <YAxis tick={{ fill: "#9ca3af" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  borderColor: "#374151",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="download"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.2}
                name="Download"
              />
              <Area
                type="monotone"
                dataKey="upload"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.2}
                name="Upload"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-300 text-sm">Download</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-300 text-sm">Upload</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
