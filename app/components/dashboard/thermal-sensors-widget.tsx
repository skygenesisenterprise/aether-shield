"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer } from "lucide-react";

const sensors = [
  { name: "CPU Core 0", temp: 42, max: 100 },
  { name: "CPU Core 1", temp: 44, max: 100 },
  { name: "CPU Core 2", temp: 41, max: 100 },
  { name: "CPU Core 3", temp: 43, max: 100 },
  { name: "System Board", temp: 38, max: 85 },
  { name: "PCH", temp: 45, max: 90 },
];

function getTemperatureColor(temp: number, max: number) {
  const percentage = (temp / max) * 100;
  if (percentage < 50) return "bg-green-500";
  if (percentage < 75) return "bg-yellow-500";
  return "bg-red-500";
}

function getTemperatureTextColor(temp: number, max: number) {
  const percentage = (temp / max) * 100;
  if (percentage < 50) return "text-green-700";
  if (percentage < 75) return "text-yellow-700";
  return "text-red-700";
}

export function ThermalSensorsWidget() {
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="bg-[#f5f5f5] py-2 px-3 border-b border-gray-200">
        <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Thermometer className="h-4 w-4 text-orange-500" />
          Thermal Sensors
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-3">
          {sensors.map((sensor, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600">{sensor.name}</span>
                <span
                  className={`text-xs font-medium ${getTemperatureTextColor(sensor.temp, sensor.max)}`}
                >
                  {sensor.temp}°C
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
                <div
                  className={`h-full ${getTemperatureColor(sensor.temp, sensor.max)} transition-all`}
                  style={{ width: `${(sensor.temp / sensor.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
