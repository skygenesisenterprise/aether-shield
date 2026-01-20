"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Plus, Edit, Trash2, Play, Pause } from "lucide-react";
import { useState } from "react";

interface ScheduledBackup {
  id: string;
  name: string;
  schedule: string;
  type: "full" | "incremental" | "differential";
  enabled: boolean;
  lastRun?: string;
  nextRun?: string;
}

export function ScheduledBackups() {
  const [schedules, setSchedules] = useState<ScheduledBackup[]>([
    {
      id: "1",
      name: "Daily Full Backup",
      schedule: "0 3 * * *",
      type: "full",
      enabled: true,
      lastRun: "2024-01-20 03:00:00",
      nextRun: "2024-01-21 03:00:00",
    },
    {
      id: "2",
      name: "Hourly Incremental",
      schedule: "0 * * * *",
      type: "incremental",
      enabled: true,
      lastRun: "2024-01-20 14:00:00",
      nextRun: "2024-01-20 15:00:00",
    },
    {
      id: "3",
      name: "Weekly Maintenance",
      schedule: "0 2 * * 0",
      type: "differential",
      enabled: false,
      lastRun: "2024-01-14 02:00:00",
      nextRun: "2024-01-21 02:00:00",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    name: "",
    schedule: "",
    type: "full" as "full" | "incremental" | "differential",
  });

  const getTypeBadge = (type: ScheduledBackup["type"]) => {
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

  const handleToggleSchedule = (id: string) => {
    setSchedules((prev) =>
      prev.map((schedule) =>
        schedule.id === id
          ? { ...schedule, enabled: !schedule.enabled }
          : schedule,
      ),
    );
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((schedule) => schedule.id !== id));
  };

  const handleAddSchedule = () => {
    if (!newSchedule.name || !newSchedule.schedule) return;

    const schedule: ScheduledBackup = {
      id: Date.now().toString(),
      name: newSchedule.name,
      schedule: newSchedule.schedule,
      type: newSchedule.type,
      enabled: true,
      nextRun: "Next run calculated",
    };

    setSchedules((prev) => [...prev, schedule]);
    setNewSchedule({ name: "", schedule: "", type: "full" });
    setShowAddForm(false);
  };

  const parseCronDescription = (cron: string) => {
    // Simple cron parser for display
    if (cron === "0 3 * * *") return "Daily at 3:00 AM";
    if (cron === "0 * * * *") return "Every hour";
    if (cron === "0 2 * * 0") return "Weekly on Sunday at 2:00 AM";
    return cron; // Return raw cron if no match
  };

  return (
    <Card className="border border-gray-700 bg-gray-900 shadow-sm">
      <CardHeader className="bg-gray-800 py-2 px-3 border-b border-gray-700">
        <CardTitle className="text-sm font-semibold text-gray-200 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-green-500" />
          Scheduled Backups
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* Add Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            <Plus className="h-3 w-3" />
            Add Schedule
          </button>
        </div>

        {/* Schedules List */}
        <div className="space-y-2">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="p-3 bg-gray-800 border border-gray-600 rounded text-xs"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-200">{schedule.name}</h4>
                  <span className={getTypeBadge(schedule.type)}>
                    {schedule.type.charAt(0).toUpperCase() +
                      schedule.type.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleSchedule(schedule.id)}
                    className={`p-1 rounded ${schedule.enabled ? "text-green-400 hover:text-green-300" : "text-gray-500 hover:text-gray-400"}`}
                    title={schedule.enabled ? "Disable" : "Enable"}
                  >
                    {schedule.enabled ? (
                      <Play className="h-3 w-3" />
                    ) : (
                      <Pause className="h-3 w-3" />
                    )}
                  </button>
                  <button
                    className="p-1 text-blue-400 hover:text-blue-300 rounded"
                    title="Edit"
                  >
                    <Edit className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleDeleteSchedule(schedule.id)}
                    className="p-1 text-red-400 hover:text-red-300 rounded"
                    title="Delete"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-1 text-xs text-gray-300">
                <div>Schedule: {parseCronDescription(schedule.schedule)}</div>
                <div className="text-gray-400">{schedule.schedule}</div>
                {schedule.lastRun && <div>Last run: {schedule.lastRun}</div>}
                {schedule.nextRun && <div>Next run: {schedule.nextRun}</div>}
                <div className="flex items-center gap-1">
                  <span>Status:</span>
                  <span
                    className={
                      schedule.enabled ? "text-green-400" : "text-gray-500"
                    }
                  >
                    {schedule.enabled ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Schedule Form */}
        {showAddForm && (
          <div className="p-3 bg-gray-800 border border-gray-600 rounded">
            <h4 className="font-medium text-gray-200 mb-3">Add New Schedule</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newSchedule.name}
                  onChange={(e) =>
                    setNewSchedule((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-2 py-1 text-xs bg-gray-900 border border-gray-600 rounded text-gray-200 focus:border-blue-500 focus:outline-none"
                  placeholder="Schedule name"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Cron Expression
                </label>
                <input
                  type="text"
                  value={newSchedule.schedule}
                  onChange={(e) =>
                    setNewSchedule((prev) => ({
                      ...prev,
                      schedule: e.target.value,
                    }))
                  }
                  className="w-full px-2 py-1 text-xs bg-gray-900 border border-gray-600 rounded text-gray-200 focus:border-blue-500 focus:outline-none"
                  placeholder="0 3 * * *"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Type
                </label>
                <select
                  value={newSchedule.type}
                  onChange={(e) =>
                    setNewSchedule((prev) => ({
                      ...prev,
                      type: e.target.value as ScheduledBackup["type"],
                    }))
                  }
                  className="w-full px-2 py-1 text-xs bg-gray-900 border border-gray-600 rounded text-gray-200 focus:border-blue-500 focus:outline-none"
                >
                  <option value="full">Full</option>
                  <option value="incremental">Incremental</option>
                  <option value="differential">Differential</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAddSchedule}
                  className="flex-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewSchedule({ name: "", schedule: "", type: "full" });
                  }}
                  className="flex-1 px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {schedules.length === 0 && (
          <div className="py-4 text-center text-gray-400 text-xs">
            No scheduled backups configured
          </div>
        )}
      </CardContent>
    </Card>
  );
}
