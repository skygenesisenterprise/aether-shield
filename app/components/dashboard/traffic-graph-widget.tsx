"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"
import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"

// Generate mock traffic data
const generateTrafficData = () => {
  const data = []
  const now = new Date()
  for (let i = 60; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 1000)
    data.push({
      time: time.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      inbound: Math.floor(Math.random() * 50 + 20),
      outbound: Math.floor(Math.random() * 30 + 10),
    })
  }
  return data
}

const trafficData = generateTrafficData()

export function TrafficGraphWidget() {
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="bg-[#f5f5f5] py-2 px-3 border-b border-gray-200">
        <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Activity className="h-4 w-4 text-orange-500" />
          Traffic Graph (WAN)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trafficData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="inboundGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="outboundGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 9 }} 
                tickLine={false}
                axisLine={{ stroke: "#e5e7eb" }}
                interval={14}
              />
              <YAxis 
                tick={{ fontSize: 9 }} 
                tickLine={false}
                axisLine={{ stroke: "#e5e7eb" }}
                tickFormatter={(value) => `${value} Mb/s`}
                width={55}
              />
              <Tooltip
                contentStyle={{ fontSize: 11, backgroundColor: "white", border: "1px solid #e5e7eb" }}
                labelStyle={{ fontWeight: "bold" }}
              />
              <Legend 
                verticalAlign="top" 
                height={30}
                iconType="line"
                wrapperStyle={{ fontSize: 11 }}
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
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-green-500"></span>
              <span>In: 45.2 Mb/s</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-blue-500"></span>
              <span>Out: 23.8 Mb/s</span>
            </div>
          </div>
          <span>Last 60 seconds</span>
        </div>
      </CardContent>
    </Card>
  )
}
