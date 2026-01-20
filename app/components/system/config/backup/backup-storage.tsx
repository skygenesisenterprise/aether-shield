"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HardDrive,
  Database,
  Cloud,
  Plus,
  Settings,
  Trash2,
} from "lucide-react";
import { useState } from "react";

interface StorageLocation {
  id: string;
  name: string;
  type: "local" | "network" | "cloud";
  path: string;
  used: number;
  total: number;
  enabled: boolean;
}

export function BackupStorage() {
  const [storageLocations, setStorageLocations] = useState<StorageLocation[]>([
    {
      id: "1",
      name: "Local Storage",
      type: "local",
      path: "/storage/backups",
      used: 15.6,
      total: 100,
      enabled: true,
    },
    {
      id: "2",
      name: "Network Share",
      type: "network",
      path: "//nas01/backups",
      used: 45.2,
      total: 500,
      enabled: true,
    },
    {
      id: "3",
      name: "Cloud Storage",
      type: "cloud",
      path: "s3://aether-shield-backups",
      used: 8.3,
      total: 1000,
      enabled: false,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newLocation, setNewLocation] = useState({
    name: "",
    type: "local" as "local" | "network" | "cloud",
    path: "",
    total: 100,
  });

  const getStorageIcon = (type: StorageLocation["type"]) => {
    switch (type) {
      case "local":
        return <HardDrive className="h-4 w-4 text-blue-500" />;
      case "network":
        return <Database className="h-4 w-4 text-green-500" />;
      case "cloud":
        return <Cloud className="h-4 w-4 text-purple-500" />;
    }
  };

  const getTypeBadge = (type: StorageLocation["type"]) => {
    const baseClass = "px-1.5 py-0.5 text-xs rounded";
    switch (type) {
      case "local":
        return `${baseClass} bg-blue-900 text-blue-200`;
      case "network":
        return `${baseClass} bg-green-900 text-green-200`;
      case "cloud":
        return `${baseClass} bg-purple-900 text-purple-200`;
    }
  };

  const getUsageColor = (percentage: number) => {
    if (percentage < 50) return "bg-green-500";
    if (percentage < 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleToggleStorage = (id: string) => {
    setStorageLocations((prev) =>
      prev.map((location) =>
        location.id === id
          ? { ...location, enabled: !location.enabled }
          : location,
      ),
    );
  };

  const handleDeleteLocation = (id: string) => {
    setStorageLocations((prev) =>
      prev.filter((location) => location.id !== id),
    );
  };

  const handleAddLocation = () => {
    if (!newLocation.name || !newLocation.path) return;

    const location: StorageLocation = {
      id: Date.now().toString(),
      name: newLocation.name,
      type: newLocation.type,
      path: newLocation.path,
      used: 0,
      total: newLocation.total,
      enabled: true,
    };

    setStorageLocations((prev) => [...prev, location]);
    setNewLocation({ name: "", type: "local", path: "", total: 100 });
    setShowAddForm(false);
  };

  return (
    <Card className="border border-gray-700 bg-gray-900 shadow-sm">
      <CardHeader className="bg-gray-800 py-2 px-3 border-b border-gray-700">
        <CardTitle className="text-sm font-semibold text-gray-200 flex items-center gap-2">
          <HardDrive className="h-4 w-4 text-yellow-500" />
          Backup Storage
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* Add Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <Plus className="h-3 w-3" />
            Add Location
          </button>
        </div>

        {/* Storage Locations */}
        <div className="space-y-3">
          {storageLocations.map((location) => {
            const usagePercentage = (location.used / location.total) * 100;

            return (
              <div
                key={location.id}
                className={`p-3 border rounded ${location.enabled ? "bg-gray-800 border-gray-600" : "bg-gray-900 border-gray-700 opacity-60"}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStorageIcon(location.type)}
                    <h4 className="font-medium text-gray-200">
                      {location.name}
                    </h4>
                    <span className={getTypeBadge(location.type)}>
                      {location.type.charAt(0).toUpperCase() +
                        location.type.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      className="p-1 text-blue-400 hover:text-blue-300 rounded"
                      title="Configure"
                    >
                      <Settings className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteLocation(location.id)}
                      className="p-1 text-red-400 hover:text-red-300 rounded"
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-gray-300">
                  <div>Path: {location.path}</div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Usage:</span>
                      <span>
                        {location.used.toFixed(1)} GB / {location.total} GB
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded h-2 overflow-hidden">
                      <div
                        className={`h-full ${getUsageColor(usagePercentage)}`}
                        style={{ width: `${usagePercentage}%` }}
                      />
                    </div>
                    <div className="text-right mt-1 text-gray-400">
                      {usagePercentage.toFixed(1)}% used
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <span>Status:</span>
                    <span
                      className={
                        location.enabled ? "text-green-400" : "text-gray-500"
                      }
                    >
                      {location.enabled ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Location Form */}
        {showAddForm && (
          <div className="p-3 bg-gray-800 border border-gray-600 rounded">
            <h4 className="font-medium text-gray-200 mb-3">
              Add Storage Location
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newLocation.name}
                  onChange={(e) =>
                    setNewLocation((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-2 py-1 text-xs bg-gray-900 border border-gray-600 rounded text-gray-200 focus:border-blue-500 focus:outline-none"
                  placeholder="Storage location name"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Type
                </label>
                <select
                  value={newLocation.type}
                  onChange={(e) =>
                    setNewLocation((prev) => ({
                      ...prev,
                      type: e.target.value as StorageLocation["type"],
                    }))
                  }
                  className="w-full px-2 py-1 text-xs bg-gray-900 border border-gray-600 rounded text-gray-200 focus:border-blue-500 focus:outline-none"
                >
                  <option value="local">Local</option>
                  <option value="network">Network</option>
                  <option value="cloud">Cloud</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Path
                </label>
                <input
                  type="text"
                  value={newLocation.path}
                  onChange={(e) =>
                    setNewLocation((prev) => ({
                      ...prev,
                      path: e.target.value,
                    }))
                  }
                  className="w-full px-2 py-1 text-xs bg-gray-900 border border-gray-600 rounded text-gray-200 focus:border-blue-500 focus:outline-none"
                  placeholder="/path/to/backups or smb://server/share"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Total Storage (GB)
                </label>
                <input
                  type="number"
                  value={newLocation.total}
                  onChange={(e) =>
                    setNewLocation((prev) => ({
                      ...prev,
                      total: parseFloat(e.target.value),
                    }))
                  }
                  min="1"
                  className="w-full px-2 py-1 text-xs bg-gray-900 border border-gray-600 rounded text-gray-200 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAddLocation}
                  className="flex-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewLocation({
                      name: "",
                      type: "local",
                      path: "",
                      total: 100,
                    });
                  }}
                  className="flex-1 px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {storageLocations.length === 0 && (
          <div className="py-4 text-center text-gray-400 text-xs">
            No storage locations configured
          </div>
        )}
      </CardContent>
    </Card>
  );
}
