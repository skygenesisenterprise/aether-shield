"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  History,
  Download,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { useState } from "react";

interface BackupEntry {
  id: string;
  date: string;
  type: "full" | "incremental" | "differential";
  size: string;
  status: "completed" | "failed" | "in-progress";
  location: string;
}

export function BackupHistory() {
  const [backups] = useState<BackupEntry[]>([
    {
      id: "1",
      date: "2024-01-20 03:00:00",
      type: "full",
      size: "2.4 GB",
      status: "completed",
      location: "/storage/backups/aether-shield-20240120-full.tar.gz",
    },
    {
      id: "2",
      date: "2024-01-19 03:00:00",
      type: "incremental",
      size: "156 MB",
      status: "completed",
      location: "/storage/backups/aether-shield-20240119-inc.tar.gz",
    },
    {
      id: "3",
      date: "2024-01-18 03:00:00",
      type: "full",
      size: "2.3 GB",
      status: "completed",
      location: "/storage/backups/aether-shield-20240118-full.tar.gz",
    },
    {
      id: "4",
      date: "2024-01-17 03:00:00",
      type: "incremental",
      size: "89 MB",
      status: "failed",
      location: "/storage/backups/aether-shield-20240117-inc.tar.gz",
    },
    {
      id: "5",
      date: "2024-01-16 03:00:00",
      type: "incremental",
      size: "124 MB",
      status: "completed",
      location: "/storage/backups/aether-shield-20240116-inc.tar.gz",
    },
  ]);

  const getStatusIcon = (status: BackupEntry["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case "failed":
        return <XCircle className="h-3 w-3 text-red-500" />;
      case "in-progress":
        return <Clock className="h-3 w-3 text-yellow-500" />;
    }
  };

  const getTypeBadge = (type: BackupEntry["type"]) => {
    const baseClass = "px-1.5 py-0.5 text-xs rounded";
    switch (type) {
      case "full":
        return `${baseClass} bg-blue-900 text-blue-200`;
      case "incremental":
        return `${baseClass} bg-green-900 text-green-200`;
      case "differential":
        return `${baseClass} bg-orange-900 text-orange-200`;
    }
  };

  const handleDownload = (backup: BackupEntry) => {
    console.log(`Download backup: ${backup.id}`);
  };

  const handleDelete = (backup: BackupEntry) => {
    console.log(`Delete backup: ${backup.id}`);
  };

  return (
    <Card className="border border-gray-700 bg-gray-900 shadow-sm">
      <CardHeader className="bg-gray-800 py-2 px-3 border-b border-gray-700">
        <CardTitle className="text-sm font-semibold text-gray-200 flex items-center gap-2">
          <History className="h-4 w-4 text-purple-500" />
          Backup History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-800">
                <th className="py-2 px-3 text-left font-medium text-gray-300">
                  Date & Time
                </th>
                <th className="py-2 px-3 text-left font-medium text-gray-300">
                  Type
                </th>
                <th className="py-2 px-3 text-left font-medium text-gray-300">
                  Size
                </th>
                <th className="py-2 px-3 text-left font-medium text-gray-300">
                  Status
                </th>
                <th className="py-2 px-3 text-left font-medium text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {backups.map((backup, index) => (
                <tr
                  key={backup.id}
                  className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
                >
                  <td className="py-2 px-3 text-gray-200 border-b border-gray-700">
                    {backup.date}
                  </td>
                  <td className="py-2 px-3 border-b border-gray-700">
                    <span className={getTypeBadge(backup.type)}>
                      {backup.type.charAt(0).toUpperCase() +
                        backup.type.slice(1)}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-gray-200 border-b border-gray-700">
                    {backup.size}
                  </td>
                  <td className="py-2 px-3 border-b border-gray-700">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(backup.status)}
                      <span className="text-gray-200">
                        {backup.status.charAt(0).toUpperCase() +
                          backup.status.slice(1).replace("-", " ")}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-3 border-b border-gray-700">
                    <div className="flex items-center gap-1">
                      {backup.status === "completed" && (
                        <button
                          onClick={() => handleDownload(backup)}
                          className="p-1 text-blue-400 hover:text-blue-300 hover:bg-gray-700 rounded"
                          title="Download"
                        >
                          <Download className="h-3 w-3" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(backup)}
                        className="p-1 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded"
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {backups.length === 0 && (
          <div className="py-8 text-center text-gray-400 text-xs">
            No backup history available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
