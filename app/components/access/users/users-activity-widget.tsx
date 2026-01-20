"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

export function UsersActivityWidget() {
  const recentActivity = [
    {
      user: "john.doe",
      action: "Login",
      timestamp: "5 minutes ago",
      ip: "192.168.1.100",
      status: "success",
    },
    {
      user: "jane.smith",
      action: "Password Change",
      timestamp: "15 minutes ago",
      ip: "192.168.1.101",
      status: "success",
    },
    {
      user: "admin",
      action: "Failed Login",
      timestamp: "1 hour ago",
      ip: "192.168.1.102",
      status: "failed",
    },
    {
      user: "bob.wilson",
      action: "Logout",
      timestamp: "2 hours ago",
      ip: "192.168.1.103",
      status: "success",
    },
    {
      user: "alice.brown",
      action: "Profile Update",
      timestamp: "3 hours ago",
      ip: "192.168.1.104",
      status: "success",
    },
  ];

  const StatusBadge = ({ status }: { status: string }) => (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
        status === "success"
          ? "bg-green-900 text-green-300"
          : "bg-red-900 text-red-300"
      }`}
    >
      {status === "success" ? "✓" : "✗"}
    </span>
  );

  const getActionColor = (action: string) => {
    const colors = {
      Login: "text-blue-400",
      Logout: "text-gray-400",
      "Password Change": "text-yellow-400",
      "Failed Login": "text-red-400",
      "Profile Update": "text-green-400",
    };
    return colors[action as keyof typeof colors] || "text-gray-400";
  };

  return (
    <Card className="border border-gray-700 bg-gray-900 shadow-sm">
      <CardHeader className="bg-gray-800 py-2 px-3 border-b border-gray-700">
        <CardTitle className="text-sm font-semibold text-gray-200 flex items-center gap-2">
          <Clock className="h-4 w-4 text-amber-500" />
          Recent User Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-800 border-b border-gray-700">
              <th className="py-1.5 px-3 text-left font-semibold text-gray-300">
                User
              </th>
              <th className="py-1.5 px-3 text-left font-semibold text-gray-300">
                Action
              </th>
              <th className="py-1.5 px-3 text-center font-semibold text-gray-300">
                Status
              </th>
              <th className="py-1.5 px-3 text-right font-semibold text-gray-300">
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {recentActivity.map((activity, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
              >
                <td className="py-1.5 px-3 font-medium text-gray-200 border-b border-gray-700">
                  <div>
                    <div>{activity.user}</div>
                    <div className="text-xs text-gray-400">
                      IP: {activity.ip}
                    </div>
                  </div>
                </td>
                <td className="py-1.5 px-3 border-b border-gray-700">
                  <span
                    className={`font-medium ${getActionColor(activity.action)}`}
                  >
                    {activity.action}
                  </span>
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <StatusBadge status={activity.status} />
                </td>
                <td className="py-1.5 px-3 text-right border-b border-gray-700">
                  <span className="text-gray-300 text-xs">
                    {activity.timestamp}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
