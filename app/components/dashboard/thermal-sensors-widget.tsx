"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Play, Pause, RotateCw } from "lucide-react";
import { useLiveData } from "@/hooks/use-live-data";

interface SensorData {
  name: string;
  temp: number;
  max: number;
}

const generateSensorData = (): SensorData[] => {
  const baseTemp = 40 + Math.random() * 10;
  return [
    {
      name: "CPU Core 0",
      temp: Math.round(baseTemp + Math.random() * 4 - 2),
      max: 100,
    },
    {
      name: "CPU Core 1",
      temp: Math.round(baseTemp + Math.random() * 4 - 2),
      max: 100,
    },
    {
      name: "CPU Core 2",
      temp: Math.round(baseTemp + Math.random() * 4 - 2),
      max: 100,
    },
    {
      name: "CPU Core 3",
      temp: Math.round(baseTemp + Math.random() * 4 - 2),
      max: 100,
    },
    {
      name: "System Board",
      temp: Math.round(baseTemp - 5 + Math.random() * 2),
      max: 85,
    },
    {
      name: "PCH",
      temp: Math.round(baseTemp + 2 + Math.random() * 2),
      max: 90,
    },
  ];
};

const initialSensorData: SensorData[] = [
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
  if (percentage < 50) return "text-green-400";
  if (percentage < 75) return "text-yellow-400";
  return "text-red-400";
}

export function ThermalSensorsWidget() {
  const {
    data: sensors,
    isPlaying,
    toggle,
    reset,
  } = useLiveData<SensorData[]>({
    generateData: generateSensorData,
    interval: 3000,
    initialData: initialSensorData,
  });

  return (
    <Card className="border border-gray-700 bg-gray-900 shadow-sm">
      <CardHeader className="bg-gray-800 py-2 px-3 border-b border-gray-700">
        <CardTitle className="text-sm font-semibold text-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-orange-500" />
            Thermal Sensors
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
      <CardContent className="p-0">
        <table className="w-full text-xs">
          <tbody>
            {sensors.map((sensor, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
              >
                <td className="py-1.5 px-3 font-medium text-gray-300 w-1/3 border-b border-gray-700">
                  {sensor.name}
                </td>
                <td className="py-1.5 px-3 text-gray-200 border-b border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-700 rounded h-4 overflow-hidden">
                      <div
                        className={`h-full ${getTemperatureColor(sensor.temp, sensor.max)}`}
                        style={{
                          width: `${(sensor.temp / sensor.max) * 100}%`,
                        }}
                      />
                    </div>
                    <span
                      className={`text-xs w-16 ${getTemperatureTextColor(sensor.temp, sensor.max)}`}
                    >
                      {sensor.temp}°C
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
