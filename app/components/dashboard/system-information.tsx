"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Download, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface GitHubRelease {
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
  prerelease: boolean;
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
        // Le serveur gérera l'installation et redémarrera
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

  const systemData = [
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
    <Card className="border border-gray-700 bg-gray-900 shadow-sm">
      <CardHeader className="bg-gray-800 py-2 px-3 border-b border-gray-700">
        <CardTitle className="text-sm font-semibold text-gray-200 flex items-center gap-2">
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
