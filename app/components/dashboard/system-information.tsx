"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Info,
  Download,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  RotateCw,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLiveData } from "@/hooks/use-live-data";

interface GitHubRelease {
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
  prerelease: boolean;
}

interface SystemData {
  cpuUsage: number;
  memoryUsage: number;
  swapUsage: number;
  diskUsage: number;
  stateTableSize: number;
  stateTableCurrent: number;
  stateTableMax: number;
  mbufUsage: number;
  loadAverage: string;
  uptime: string;
}

export function SystemInformation() {
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [lastConfigChange, setLastConfigChange] = useState("");
  const [updateStatus, setUpdateStatus] = useState<
    | "idle"
    | "checking"
    | "up-to-date"
    | "available"
    | "error"
    | "downloading"
    | "installing"
  >("idle");
  const [latestRelease, setLatestRelease] = useState<GitHubRelease | null>(
    null,
  );
  const [currentVersion] = useState("24.7.10");

  const generateSystemData = (): SystemData => {
    const cpuUsage = Math.random() * 15 + 2;
    const memoryUsage = Math.random() * 25 + 10;
    const swapUsage = Math.random() * 5;
    const diskUsage = Math.random() * 10 + 8;
    const stateTableCurrent = Math.floor(Math.random() * 200 + 258);
    const stateTableMax = 812000;
    const stateTableSize = (stateTableCurrent / stateTableMax) * 100;
    const mbufUsage = Math.random() * 3;
    const load1 = (Math.random() * 0.5 + 0.05).toFixed(2);
    const load5 = (Math.random() * 0.6 + 0.08).toFixed(2);
    const load15 = (Math.random() * 0.4 + 0.07).toFixed(2);

    const now = Date.now();
    const uptimeSeconds = Math.floor(now / 1000) % 60;
    const uptimeMinutes = Math.floor(now / 60000) % 60;
    const uptimeHours = Math.floor(now / 3600000) % 24;
    const uptime = `${uptimeHours.toString().padStart(2, "0")}:${uptimeMinutes.toString().padStart(2, "0")}:${uptimeSeconds.toString().padStart(2, "0")}`;

    return {
      cpuUsage: Math.round(cpuUsage * 10) / 10,
      memoryUsage: Math.round(memoryUsage * 10) / 10,
      swapUsage: Math.round(swapUsage * 10) / 10,
      diskUsage: Math.round(diskUsage * 10) / 10,
      stateTableSize: Math.round(stateTableSize * 100) / 100,
      stateTableCurrent,
      stateTableMax,
      mbufUsage: Math.round(mbufUsage * 10) / 10,
      loadAverage: `${load1}, ${load5}, ${load15}`,
      uptime,
    };
  };

  const initialSystemData: SystemData = {
    cpuUsage: 3,
    memoryUsage: 18,
    swapUsage: 0,
    diskUsage: 12,
    stateTableSize: 0,
    stateTableCurrent: 358,
    stateTableMax: 812000,
    mbufUsage: 0,
    loadAverage: "0.08, 0.12, 0.09",
    uptime: "00:12:34",
  };

  const {
    data: systemData,
    isPlaying,
    toggle,
    reset,
  } = useLiveData<SystemData>({
    generateData: generateSystemData,
    interval: 2000,
    initialData: initialSystemData,
  });

  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleString("fr-FR");
    setCurrentDateTime(formatted);
    setLastConfigChange(formatted);
  }, []);

  const checkForUpdates = async () => {
    setUpdateStatus("checking");
    try {
      const response = await fetch("/api/updates/check");
      const data = await response.json();

      if (data.error) {
        setUpdateStatus("error");
        return;
      }

      setLatestRelease(data.latestRelease);

      if (data.hasUpdate) {
        setUpdateStatus("available");
      } else {
        setUpdateStatus("up-to-date");
      }
    } catch (error) {
      setUpdateStatus("error");
    }
  };

  const installUpdate = async () => {
    if (!latestRelease) return;

    setUpdateStatus("downloading");
    try {
      const response = await fetch("/api/updates/install", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ release: latestRelease }),
      });

      if (response.ok) {
        setUpdateStatus("installing");
      } else {
        setUpdateStatus("error");
      }
    } catch (error) {
      setUpdateStatus("error");
    }
  };

  const getUpdateDisplay = () => {
    switch (updateStatus) {
      case "idle":
        return "Click to check for updates";
      case "checking":
        return "Checking for updates...";
      case "up-to-date":
        return "Up to date ✓";
      case "available":
        return `Update available: ${latestRelease?.tag_name}`;
      case "downloading":
        return "Downloading update...";
      case "installing":
        return "Installing update...";
      case "error":
        return "Error checking updates";
      default:
        return "Click to check for updates";
    }
  };

  const handleUpdateClick = () => {
    if (updateStatus === "idle" || updateStatus === "error") {
      checkForUpdates();
    } else if (updateStatus === "available") {
      installUpdate();
    }
  };

  const systemInfo = [
    { label: "Name", value: "AetherShield.localdomain" },
    { label: "Version", value: "Aether Shield 24.7.10-amd64" },
    {
      label: "Updates",
      value: getUpdateDisplay(),
      isLink:
        updateStatus === "idle" ||
        updateStatus === "error" ||
        updateStatus === "available",
    },
    { label: "CPU Type", value: "Intel(R) Core(TM) i7-10700 CPU @ 2.90GHz" },
    {
      label: "CPU Usage",
      value: `${systemData.cpuUsage}%`,
      showBar: true,
      barValue: systemData.cpuUsage,
    },
    {
      label: "Memory Usage",
      value: `${systemData.memoryUsage}%`,
      showBar: true,
      barValue: systemData.memoryUsage,
    },
    {
      label: "SWAP Usage",
      value: `${systemData.swapUsage}%`,
      showBar: true,
      barValue: systemData.swapUsage,
    },
    {
      label: "Disk Usage",
      value: `${systemData.diskUsage}%`,
      showBar: true,
      barValue: systemData.diskUsage,
    },
    {
      label: "State table size",
      value: `${systemData.stateTableSize}% (${systemData.stateTableCurrent}/${systemData.stateTableMax})`,
      showBar: true,
      barValue: systemData.stateTableSize,
    },
    {
      label: "MBUF Usage",
      value: `${systemData.mbufUsage}%`,
      showBar: true,
      barValue: systemData.mbufUsage,
    },
    { label: "Load average", value: systemData.loadAverage },
    { label: "Uptime", value: systemData.uptime },
    { label: "Current date/time", value: currentDateTime },
    { label: "Last config change", value: lastConfigChange },
  ];

  return (
    <Card className="border border-gray-700 bg-gray-900 shadow-sm">
      <CardHeader className="bg-gray-800 py-2 px-3 border-b border-gray-700">
        <CardTitle className="text-sm font-semibold text-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-orange-500" />
            System Information
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
            {systemInfo.map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
              >
                <td className="py-1.5 px-3 font-medium text-gray-300 w-1/3 border-b border-gray-700">
                  {item.label}
                </td>
                <td className="py-1.5 px-3 text-gray-200 border-b border-gray-700">
                  {item.showBar ? (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-700 rounded h-4 overflow-hidden">
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
                    <button
                      onClick={
                        item.label === "Updates" ? handleUpdateClick : undefined
                      }
                      className={`${
                        item.label === "Updates"
                          ? updateStatus === "up-to-date"
                            ? "text-green-400"
                            : updateStatus === "available"
                              ? "text-orange-400 hover:text-orange-300"
                              : updateStatus === "error"
                                ? "text-red-400 hover:text-red-300"
                                : "text-blue-400 hover:underline"
                          : "text-blue-400 hover:underline"
                      } ${item.label === "Updates" ? "flex items-center gap-1" : ""}`}
                      disabled={
                        item.label === "Updates" &&
                        ["checking", "downloading", "installing"].includes(
                          updateStatus,
                        )
                      }
                    >
                      {item.value}
                      {item.label === "Updates" && (
                        <>
                          {updateStatus === "checking" && (
                            <div className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin" />
                          )}
                          {updateStatus === "downloading" && (
                            <Download className="w-3 h-3" />
                          )}
                          {updateStatus === "installing" && (
                            <div className="w-3 h-3 border border-orange-400 border-t-transparent rounded-full animate-spin" />
                          )}
                          {updateStatus === "up-to-date" && (
                            <CheckCircle className="w-3 h-3" />
                          )}
                          {updateStatus === "error" && (
                            <AlertCircle className="w-3 h-3" />
                          )}
                        </>
                      )}
                    </button>
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
