"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Settings, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function GroupsTableWidget() {
  const groups = [
    {
      name: "admins",
      description: "System administrators with full access",
      type: "System",
      members: 3,
      created: "2024-01-15",
      status: "active",
    },
    {
      name: "operators",
      description: "System operators with limited admin rights",
      type: "System",
      members: 5,
      created: "2024-01-15",
      status: "active",
    },
    {
      name: "users",
      description: "Regular users with standard access",
      type: "System",
      members: 12,
      created: "2024-01-15",
      status: "active",
    },
    {
      name: "guests",
      description: "Guest users with read-only access",
      type: "System",
      members: 2,
      created: "2024-01-15",
      status: "inactive",
    },
    {
      name: "developers",
      description: "Development team members",
      type: "Custom",
      members: 8,
      created: "2024-02-01",
      status: "active",
    },
    {
      name: "auditors",
      description: "Security auditors with read access",
      type: "Custom",
      members: 4,
      created: "2024-02-10",
      status: "active",
    },
  ];

  const StatusBadge = ({ status }: { status: string }) => (
    <Badge
      variant={status === "active" ? "default" : "secondary"}
      className={
        status === "active"
          ? "bg-green-900 text-green-300 hover:bg-green-800"
          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
      }
    >
      {status === "active" ? "Active" : "Inactive"}
    </Badge>
  );

  const TypeBadge = ({ type }: { type: string }) => (
    <Badge
      variant="outline"
      className={
        type === "System"
          ? "border-blue-500 text-blue-300"
          : "border-purple-500 text-purple-300"
      }
    >
      {type}
    </Badge>
  );

  return (
    <Card className="border border-gray-700 bg-gray-900 shadow-sm">
      <CardHeader className="bg-gray-800 py-2 px-3 border-b border-gray-700">
        <CardTitle className="text-sm font-semibold text-gray-200 flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-500" />
          User Groups
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-800 border-b border-gray-700">
              <th className="py-1.5 px-3 text-left font-semibold text-gray-300">
                Group Name
              </th>
              <th className="py-1.5 px-3 text-left font-semibold text-gray-300">
                Description
              </th>
              <th className="py-1.5 px-3 text-center font-semibold text-gray-300">
                Type
              </th>
              <th className="py-1.5 px-3 text-center font-semibold text-gray-300">
                Members
              </th>
              <th className="py-1.5 px-3 text-center font-semibold text-gray-300">
                Status
              </th>
              <th className="py-1.5 px-3 text-center font-semibold text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
              >
                <td className="py-1.5 px-3 font-medium text-gray-200 border-b border-gray-700">
                  <div>
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3 text-gray-400" />
                      <span>{group.name}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Created: {group.created}
                    </div>
                  </div>
                </td>
                <td className="py-1.5 px-3 text-gray-300 border-b border-gray-700 max-w-xs">
                  <div className="truncate" title={group.description}>
                    {group.description}
                  </div>
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <TypeBadge type={group.type} />
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <span className="text-gray-200 font-medium">
                    {group.members}
                  </span>
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <StatusBadge status={group.status} />
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto hover:bg-gray-700"
                      title="Edit Group"
                    >
                      <Edit className="h-3 w-3 text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto hover:bg-gray-700"
                      title="Group Settings"
                    >
                      <Settings className="h-3 w-3 text-gray-400" />
                    </Button>
                    {group.type === "Custom" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto hover:bg-gray-700"
                        title="Delete Group"
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
