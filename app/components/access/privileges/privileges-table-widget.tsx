"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Settings, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function PrivilegesTableWidget() {
  const privileges = [
    {
      name: "root",
      description: "Superuser access with all privileges",
      category: "System",
      users: 1,
      created: "2024-01-15",
      status: "active",
    },
    {
      name: "admin",
      description: "System administration privileges",
      category: "System",
      users: 3,
      created: "2024-01-15",
      status: "active",
    },
    {
      name: "sudo",
      description: "Elevated command execution",
      category: "System",
      users: 5,
      created: "2024-01-15",
      status: "active",
    },
    {
      name: "ssh",
      description: "Remote shell access",
      category: "Network",
      users: 8,
      created: "2024-01-15",
      status: "active",
    },
    {
      name: "ftp",
      description: "File transfer protocol access",
      category: "Network",
      users: 4,
      created: "2024-02-01",
      status: "active",
    },
    {
      name: "database",
      description: "Database management access",
      category: "Application",
      users: 2,
      created: "2024-02-10",
      status: "inactive",
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

  const CategoryBadge = ({ category }: { category: string }) => {
    const colors = {
      System: "border-red-500 text-red-300",
      Network: "border-blue-500 text-blue-300",
      Application: "border-green-500 text-green-300",
    };

    return (
      <Badge
        variant="outline"
        className={
          colors[category as keyof typeof colors] ||
          "border-gray-500 text-gray-300"
        }
      >
        {category}
      </Badge>
    );
  };

  return (
    <Card className="border border-gray-700 bg-gray-900 shadow-sm">
      <CardHeader className="bg-gray-800 py-2 px-3 border-b border-gray-700">
        <CardTitle className="text-sm font-semibold text-gray-200 flex items-center gap-2">
          <Shield className="h-4 w-4 text-green-500" />
          System Privileges
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-800 border-b border-gray-700">
              <th className="py-1.5 px-3 text-left font-semibold text-gray-300">
                Privilege Name
              </th>
              <th className="py-1.5 px-3 text-left font-semibold text-gray-300">
                Description
              </th>
              <th className="py-1.5 px-3 text-center font-semibold text-gray-300">
                Category
              </th>
              <th className="py-1.5 px-3 text-center font-semibold text-gray-300">
                Users
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
            {privileges.map((privilege, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
              >
                <td className="py-1.5 px-3 font-medium text-gray-200 border-b border-gray-700">
                  <div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-3 w-3 text-gray-400" />
                      <span>{privilege.name}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Created: {privilege.created}
                    </div>
                  </div>
                </td>
                <td className="py-1.5 px-3 text-gray-300 border-b border-gray-700 max-w-xs">
                  <div className="truncate" title={privilege.description}>
                    {privilege.description}
                  </div>
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <CategoryBadge category={privilege.category} />
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <span className="text-gray-200 font-medium">
                    {privilege.users}
                  </span>
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <StatusBadge status={privilege.status} />
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto hover:bg-gray-700"
                      title="Edit Privilege"
                    >
                      <Edit className="h-3 w-3 text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto hover:bg-gray-700"
                      title="Privilege Settings"
                    >
                      <Settings className="h-3 w-3 text-gray-400" />
                    </Button>
                    {privilege.category !== "System" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto hover:bg-gray-700"
                        title="Delete Privilege"
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
