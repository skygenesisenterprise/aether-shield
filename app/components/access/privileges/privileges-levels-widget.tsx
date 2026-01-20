"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Key } from "lucide-react";

export function PrivilegesLevelsWidget() {
  const privileges = [
    {
      level: "root",
      read: true,
      write: true,
      execute: true,
      description: "Superuser access",
    },
    {
      level: "admin",
      read: true,
      write: true,
      execute: true,
      description: "System administration",
    },
    {
      level: "power",
      read: true,
      write: true,
      execute: false,
      description: "Power user access",
    },
    {
      level: "user",
      read: true,
      write: false,
      execute: false,
      description: "Standard user access",
    },
    {
      level: "guest",
      read: false,
      write: false,
      execute: false,
      description: "Limited guest access",
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
          <Key className="h-4 w-4 text-yellow-500" />
          Privilege Levels
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-800 border-b border-gray-700">
              <th className="py-1.5 px-3 text-left font-semibold text-gray-300">
                Level
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
            {privileges.map((privilege, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
              >
                <td className="py-1.5 px-3 font-medium text-gray-200 border-b border-gray-700">
                  <div>
                    <div>{privilege.level}</div>
                    <div className="text-xs text-gray-400">
                      {privilege.description}
                    </div>
                  </div>
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <PermissionBadge hasPermission={privilege.read} />
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <PermissionBadge hasPermission={privilege.write} />
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <PermissionBadge hasPermission={privilege.execute} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
