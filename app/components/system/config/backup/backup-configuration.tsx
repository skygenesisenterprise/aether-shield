"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Save, RotateCcw } from "lucide-react";
import { useState } from "react";

export function BackupConfiguration() {
  const [backupType, setBackupType] = useState("full");
  const [compression, setCompression] = useState("gzip");
  const [encryption, setEncryption] = useState(true);
  const [retentionDays, setRetentionDays] = useState(30);
  const [includeSystem, setIncludeSystem] = useState(true);
  const [includeConfig, setIncludeConfig] = useState(true);
  const [includeLogs, setIncludeLogs] = useState(false);

  const handleSave = () => {
    // Logique de sauvegarde
    console.log("Backup configuration saved");
  };

  const handleReset = () => {
    setBackupType("full");
    setCompression("gzip");
    setEncryption(true);
    setRetentionDays(30);
    setIncludeSystem(true);
    setIncludeConfig(true);
    setIncludeLogs(false);
  };

  return (
    <Card className="border border-gray-700 bg-gray-900 shadow-sm">
      <CardHeader className="bg-gray-800 py-2 px-3 border-b border-gray-700">
        <CardTitle className="text-sm font-semibold text-gray-200 flex items-center gap-2">
          <Settings className="h-4 w-4 text-blue-500" />
          Backup Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* Backup Type */}
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Backup Type
          </label>
          <select
            value={backupType}
            onChange={(e) => setBackupType(e.target.value)}
            className="w-full px-2 py-1 text-xs bg-gray-800 border border-gray-600 rounded text-gray-200 focus:border-blue-500 focus:outline-none"
          >
            <option value="full">Full Backup</option>
            <option value="incremental">Incremental</option>
            <option value="differential">Differential</option>
          </select>
        </div>

        {/* Compression */}
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Compression
          </label>
          <select
            value={compression}
            onChange={(e) => setCompression(e.target.value)}
            className="w-full px-2 py-1 text-xs bg-gray-800 border border-gray-600 rounded text-gray-200 focus:border-blue-500 focus:outline-none"
          >
            <option value="none">No Compression</option>
            <option value="gzip">Gzip</option>
            <option value="bzip2">Bzip2</option>
            <option value="lzma">LZMA</option>
          </select>
        </div>

        {/* Retention Days */}
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Retention Days
          </label>
          <input
            type="number"
            value={retentionDays}
            onChange={(e) => setRetentionDays(parseInt(e.target.value))}
            min="1"
            max="365"
            className="w-full px-2 py-1 text-xs bg-gray-800 border border-gray-600 rounded text-gray-200 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Checkboxes */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs text-gray-300">
            <input
              type="checkbox"
              checked={encryption}
              onChange={(e) => setEncryption(e.target.checked)}
              className="rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
            />
            Enable Encryption
          </label>

          <label className="flex items-center gap-2 text-xs text-gray-300">
            <input
              type="checkbox"
              checked={includeSystem}
              onChange={(e) => setIncludeSystem(e.target.checked)}
              className="rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
            />
            Include System Files
          </label>

          <label className="flex items-center gap-2 text-xs text-gray-300">
            <input
              type="checkbox"
              checked={includeConfig}
              onChange={(e) => setIncludeConfig(e.target.checked)}
              className="rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
            />
            Include Configuration
          </label>

          <label className="flex items-center gap-2 text-xs text-gray-300">
            <input
              type="checkbox"
              checked={includeLogs}
              onChange={(e) => setIncludeLogs(e.target.checked)}
              className="rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
            />
            Include Logs
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <Save className="h-3 w-3" />
            Save
          </button>
          <button
            onClick={handleReset}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
