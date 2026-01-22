"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const chartData = [
  { month: "Jan", users: 350, devices: 200 },
  { month: "Feb", users: 400, devices: 220 },
  { month: "Mar", users: 380, devices: 210 },
  { month: "Apr", users: 450, devices: 240 },
  { month: "May", users: 420, devices: 230 },
  { month: "Jun", users: 480, devices: 260 },
  { month: "Jul", users: 500, devices: 280 },
];

const chartConfig = {
  users: {
    label: "Users",
    color: "#3b82f6",
  },
  devices: {
    label: "Devices",
    color: "#8b5cf6",
  },
};

export function GroupUsageWidget() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">
          Group Usage Over Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" tick={{ fill: "#9CA3AF" }} />
              <YAxis tick={{ fill: "#9CA3AF" }} />
              <ChartTooltip cursor={false} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="users" fill="var(--color-users)" radius={4} />
              <Bar dataKey="devices" fill="var(--color-devices)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
