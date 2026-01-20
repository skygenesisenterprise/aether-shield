"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Settings, Trash2, Edit, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function UsersTableWidget() {
  const users = [
    {
      username: "john.doe",
      email: "john.doe@company.com",
      role: "Admin",
      status: "active",
      lastLogin: "2 hours ago",
      created: "2024-01-15",
      groups: ["admins", "developers"],
    },
    {
      username: "jane.smith",
      email: "jane.smith@company.com",
      role: "User",
      status: "active",
      lastLogin: "1 day ago",
      created: "2024-01-20",
      groups: ["users", "developers"],
    },
    {
      username: "bob.wilson",
      email: "bob.wilson@company.com",
      role: "User",
      status: "active",
      lastLogin: "3 days ago",
      created: "2024-02-01",
      groups: ["users"],
    },
    {
      username: "alice.brown",
      email: "alice.brown@company.com",
      role: "Manager",
      status: "active",
      lastLogin: "5 hours ago",
      created: "2024-02-10",
      groups: ["managers", "users"],
    },
    {
      username: "charlie.davis",
      email: "charlie.davis@company.com",
      role: "User",
      status: "inactive",
      lastLogin: "2 weeks ago",
      created: "2024-03-01",
      groups: ["users"],
    },
    {
      username: "admin",
      email: "admin@company.com",
      role: "Super Admin",
      status: "active",
      lastLogin: "30 minutes ago",
      created: "2024-01-01",
      groups: ["admins", "superusers"],
    },
  ];

  const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig = {
      active: { bg: "bg-green-900", text: "text-green-300", label: "Active" },
      inactive: { bg: "bg-gray-700", text: "text-gray-300", label: "Inactive" },
      suspended: { bg: "bg-red-900", text: "text-red-300", label: "Suspended" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.inactive;

    return (
      <Badge
        variant="default"
        className={`${config.bg} ${config.text} hover:opacity-80`}
      >
        {config.label}
      </Badge>
    );
  };

  const RoleBadge = ({ role }: { role: string }) => {
    const colors = {
      "Super Admin": "border-red-500 text-red-300",
      Admin: "border-orange-500 text-orange-300",
      Manager: "border-blue-500 text-blue-300",
      User: "border-green-500 text-green-300",
    };

    return (
      <Badge
        variant="outline"
        className={
          colors[role as keyof typeof colors] || "border-gray-500 text-gray-300"
        }
      >
        {role}
      </Badge>
    );
  };

  return (
    <Card className="border border-gray-700 bg-gray-900 shadow-sm">
      <CardHeader className="bg-gray-800 py-2 px-3 border-b border-gray-700">
        <CardTitle className="text-sm font-semibold text-gray-200 flex items-center gap-2">
          <User className="h-4 w-4 text-indigo-500" />
          User Directory
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-800 border-b border-gray-700">
              <th className="py-1.5 px-3 text-left font-semibold text-gray-300">
                Username
              </th>
              <th className="py-1.5 px-3 text-left font-semibold text-gray-300">
                Email
              </th>
              <th className="py-1.5 px-3 text-center font-semibold text-gray-300">
                Role
              </th>
              <th className="py-1.5 px-3 text-center font-semibold text-gray-300">
                Groups
              </th>
              <th className="py-1.5 px-3 text-center font-semibold text-gray-300">
                Status
              </th>
              <th className="py-1.5 px-3 text-center font-semibold text-gray-300">
                Last Login
              </th>
              <th className="py-1.5 px-3 text-center font-semibold text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
              >
                <td className="py-1.5 px-3 font-medium text-gray-200 border-b border-gray-700">
                  <div>
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 text-gray-400" />
                      <span>{user.username}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Created: {user.created}
                    </div>
                  </div>
                </td>
                <td className="py-1.5 px-3 text-gray-300 border-b border-gray-700">
                  <span className="text-xs">{user.email}</span>
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <RoleBadge role={user.role} />
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {user.groups.map((group, groupIndex) => (
                      <span
                        key={groupIndex}
                        className="inline-block px-1 py-0.5 text-xs bg-gray-700 text-gray-300 rounded"
                      >
                        {group}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <StatusBadge status={user.status} />
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <span className="text-gray-300 text-xs">
                    {user.lastLogin}
                  </span>
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto hover:bg-gray-700"
                      title="Edit User"
                    >
                      <Edit className="h-3 w-3 text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto hover:bg-gray-700"
                      title="User Settings"
                    >
                      <Settings className="h-3 w-3 text-gray-400" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto hover:bg-gray-700"
                      title="Manage Permissions"
                    >
                      <Shield className="h-3 w-3 text-yellow-500" />
                    </Button>
                    {user.role !== "Super Admin" && user.role !== "Admin" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto hover:bg-gray-700"
                        title="Delete User"
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    )}
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
