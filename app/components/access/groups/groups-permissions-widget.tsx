"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export function GroupsPermissionsWidget() {
  const permissions = [
    {
      group: "admins",
      read: true,
      write: true,
      execute: true,
      description: "System administrators",
    },
    {
      group: "operators",
      read: true,
      write: true,
      execute: false,
      description: "System operators",
    },
    {
      group: "users",
      read: true,
      write: false,
      execute: false,
      description: "Regular users",
    },
    {
      group: "guests",
      read: false,
      write: false,
      execute: false,
      description: "Guest access",
    },
  ];

  const PermissionBadge = ({ hasPermission }: { hasPermission: boolean }) => (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
        hasPermission
          ? "bg-green-900 text-green-300"
          : "bg-red-900 text-red-300"
      }`}
    >
      {hasPermission ? "Yes" : "No"}
    </span>
  );

  return (
    <Card className="border border-gray-700 bg-gray-900 shadow-sm">
      <CardHeader className="bg-gray-800 py-2 px-3 border-b border-gray-700">
        <CardTitle className="text-sm font-semibold text-gray-200 flex items-center gap-2">
          <Shield className="h-4 w-4 text-green-500" />
          Common Permissions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-800 border-b border-gray-700">
              <th className="py-1.5 px-3 text-left font-semibold text-gray-300">
                Group
              </th>
              <th className="py-1.5 px-3 text-center font-semibold text-gray-300">
                Read
              </th>
              <th className="py-1.5 px-3 text-center font-semibold text-gray-300">
                Write
              </th>
              <th className="py-1.5 px-3 text-center font-semibold text-gray-300">
                Execute
              </th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((permission, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
              >
                <td className="py-1.5 px-3 font-medium text-gray-200 border-b border-gray-700">
                  <div>
                    <div>{permission.group}</div>
                    <div className="text-xs text-gray-400">
                      {permission.description}
                    </div>
                  </div>
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <PermissionBadge hasPermission={permission.read} />
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <PermissionBadge hasPermission={permission.write} />
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <PermissionBadge hasPermission={permission.execute} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
