"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Play, Pause, RotateCw } from "lucide-react";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useLiveData } from "@/hooks/use-live-data";

interface TrafficDataPoint {
  time: string;
  inbound: number;
  outbound: number;
}

const generateTrafficData = (): TrafficDataPoint[] => {
  const data = [];
  const now = new Date();
  for (let i = 60; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 1000);
    data.push({
      time: time.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      inbound: 35,
      outbound: 25,
    });
  }
  return data;
};

const generateUpdatedTrafficData = (
  currentData?: TrafficDataPoint[],
): TrafficDataPoint[] => {
  const data = currentData || initialTrafficData;
  const newData = [...data.slice(1)];
  const now = new Date();
  newData.push({
    time: now.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    inbound: Math.floor(Math.random() * 50 + 20),
    outbound: Math.floor(Math.random() * 30 + 10),
  });
  return newData;
};

const initialTrafficData: TrafficDataPoint[] = Array.from(
  { length: 61 },
  (_, i) => {
    const time = new Date(Date.now() - (60 - i) * 1000);
    return {
      time: time.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      inbound: 35,
      outbound: 25,
    };
  },
);

export function TrafficGraphWidget() {
  const {
    data: trafficData,
    isPlaying,
    toggle,
    reset,
  } = useLiveData<TrafficDataPoint[]>({
    generateData: (currentData?: TrafficDataPoint[]) =>
      generateUpdatedTrafficData(currentData),
    interval: 1000,
    initialData: initialTrafficData,
  });

  const currentInbound = trafficData[trafficData.length - 1]?.inbound || 0;
  const currentOutbound = trafficData[trafficData.length - 1]?.outbound || 0;

  return (
    <Card className="border border-gray-700 bg-gray-900 shadow-sm">
      <CardHeader className="bg-gray-800 py-2 px-3 border-b border-gray-700">
        <CardTitle className="text-sm font-semibold text-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-orange-500" />
            Traffic Graph (WAN)
            <div
              className={`w-2 h-2 rounded-full ${isPlaying ? "bg-green-500 animate-pulse" : "bg-gray-500"}`}
            />
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={toggle}
              className="p-1 text-gray-400 hover:text-gray-200 transition-colors"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-3 w-3" />
              ) : (
                <Play className="h-3 w-3" />
              )}
            </button>
            <button
              onClick={reset}
              className="p-1 text-gray-400 hover:text-gray-200 transition-colors"
              title="Reset"
            >
              <RotateCw className="h-3 w-3" />
            </button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={trafficData}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient
                  id="inboundGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="outboundGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                tick={{ fontSize: 9, fill: "#9ca3af" }}
                tickLine={false}
                axisLine={{ stroke: "#4b5563" }}
                interval={14}
              />
              <YAxis
                tick={{ fontSize: 9, fill: "#9ca3af" }}
                tickLine={false}
                axisLine={{ stroke: "#4b5563" }}
                tickFormatter={(value) => `${value} Mb/s`}
                width={55}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 11,
                  backgroundColor: "#1f2937",
                  border: "1px solid #4b5563",
                }}
                labelStyle={{ fontWeight: "bold", color: "#f3f4f6" }}
              />
              <YAxis
                tick={{ fontSize: 9 }}
                tickLine={false}
                axisLine={{ stroke: "#e5e7eb" }}
                tickFormatter={(value) => `${value} Mb/s`}
                width={55}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 11,
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                }}
                labelStyle={{ fontWeight: "bold" }}
              />
              <Legend
                verticalAlign="top"
                height={30}
                iconType="line"
                wrapperStyle={{ fontSize: 11, color: "#9ca3af" }}
              />
              <Area
                type="monotone"
                dataKey="inbound"
                name="Inbound"
                stroke="#22c55e"
                strokeWidth={1.5}
                fill="url(#inboundGradient)"
              />
              <Area
                type="monotone"
                dataKey="outbound"
                name="Outbound"
                stroke="#3b82f6"
                strokeWidth={1.5}
                fill="url(#outboundGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-green-500"></span>
              <span>In: {currentInbound} Mb/s</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-blue-500"></span>
              <span>Out: {currentOutbound} Mb/s</span>
            </div>
          </div>
          <span>Last 60 seconds</span>
        </div>
      </CardContent>
    </Card>
  );
}
