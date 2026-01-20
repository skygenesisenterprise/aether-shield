"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { useState, useEffect } from "react";

export function SystemInformation() {
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [lastConfigChange, setLastConfigChange] = useState("");

  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleString("fr-FR");
    setCurrentDateTime(formatted);
    setLastConfigChange(formatted);
  }, []);

  const systemData = [
    { label: "Name", value: "AetherShield.localdomain" },
    { label: "Version", value: "Aether Shield 24.7.10-amd64" },
    { label: "Updates", value: "Click to check for updates", isLink: true },
    { label: "CPU Type", value: "Intel(R) Core(TM) i7-10700 CPU @ 2.90GHz" },
    { label: "CPU Usage", value: "3%", showBar: true, barValue: 3 },
    { label: "Memory Usage", value: "18%", showBar: true, barValue: 18 },
    { label: "SWAP Usage", value: "0%", showBar: true, barValue: 0 },
    { label: "Disk Usage", value: "12%", showBar: true, barValue: 12 },
    {
      label: "State table size",
      value: "0% (358/812000)",
      showBar: true,
      barValue: 0,
    },
    { label: "MBUF Usage", value: "0%", showBar: true, barValue: 0 },
    { label: "Load average", value: "0.08, 0.12, 0.09" },
    { label: "Uptime", value: "00:12:34" },
    { label: "Current date/time", value: currentDateTime },
    { label: "Last config change", value: lastConfigChange },
  ];

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="bg-[#f5f5f5] py-2 px-3 border-b border-gray-200">
        <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Info className="h-4 w-4 text-orange-500" />
          System Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-xs">
          <tbody>
            {systemData.map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="py-1.5 px-3 font-medium text-gray-600 w-1/3 border-b border-gray-100">
                  {item.label}
                </td>
                <td className="py-1.5 px-3 text-gray-700 border-b border-gray-100">
                  {item.showBar ? (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded h-4 overflow-hidden">
                        <div
                          className={`h-full ${
                            item.barValue < 50
                              ? "bg-green-500"
                              : item.barValue < 80
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${item.barValue}%` }}
                        />
                      </div>
                      <span className="text-xs w-16">{item.value}</span>
                    </div>
                  ) : item.isLink ? (
                    <a href="#" className="text-blue-600 hover:underline">
                      {item.value}
                    </a>
                  ) : (
                    item.value
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
