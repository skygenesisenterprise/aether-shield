"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bug, Settings, Trash2, Edit, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function TestersTableWidget() {
  const testers = [
    {
      name: "api-tester-01",
      description: "Automated API testing for REST endpoints",
      type: "Automated",
      category: "API",
      tests: 150,
      created: "2024-01-15",
      status: "active",
      schedule: "Every 2 hours",
    },
    {
      name: "ui-tester-01",
      description: "User interface testing with Selenium",
      type: "Automated",
      category: "UI",
      tests: 100,
      created: "2024-01-20",
      status: "active",
      schedule: "Daily at 3 AM",
    },
    {
      name: "load-tester-01",
      description: "Performance and load testing",
      type: "Automated",
      category: "Performance",
      tests: 250,
      created: "2024-02-01",
      status: "active",
      schedule: "Weekly on Sundays",
    },
    {
      name: "security-tester-01",
      description: "Security vulnerability scanning",
      type: "Automated",
      category: "Security",
      tests: 70,
      created: "2024-02-10",
      status: "maintenance",
      schedule: "Monthly on 1st",
    },
    {
      name: "manual-tester-01",
      description: "Manual testing procedures and checklists",
      type: "Manual",
      category: "Manual",
      tests: 45,
      created: "2024-03-01",
      status: "inactive",
      schedule: "On demand",
    },
    {
      name: "integration-tester-01",
      description: "System integration testing",
      type: "Automated",
      category: "Integration",
      tests: 120,
      created: "2024-03-15",
      status: "active",
      schedule: "Every 6 hours",
    },
  ];

  const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig = {
      active: { bg: "bg-green-900", text: "text-green-300", label: "Active" },
      maintenance: {
        bg: "bg-yellow-900",
        text: "text-yellow-300",
        label: "Maintenance",
      },
      inactive: { bg: "bg-gray-700", text: "text-gray-300", label: "Inactive" },
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

  const TypeBadge = ({ type }: { type: string }) => {
    const colors = {
      Automated: "border-blue-500 text-blue-300",
      Manual: "border-orange-500 text-orange-300",
    };

    return (
      <Badge
        variant="outline"
        className={
          colors[type as keyof typeof colors] || "border-gray-500 text-gray-300"
        }
      >
        {type}
      </Badge>
    );
  };

  const CategoryBadge = ({ category }: { category: string }) => {
    const colors = {
      API: "border-purple-500 text-purple-300",
      UI: "border-cyan-500 text-cyan-300",
      Performance: "border-green-500 text-green-300",
      Security: "border-red-500 text-red-300",
      Manual: "border-yellow-500 text-yellow-300",
      Integration: "border-indigo-500 text-indigo-300",
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
          <Bug className="h-4 w-4 text-purple-500" />
          Test Suite Inventory
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-800 border-b border-gray-700">
              <th className="py-1.5 px-3 text-left font-semibold text-gray-300">
                Tester Name
              </th>
              <th className="py-1.5 px-3 text-left font-semibold text-gray-300">
                Description
              </th>
              <th className="py-1.5 px-3 text-center font-semibold text-gray-300">
                Type
              </th>
              <th className="py-1.5 px-3 text-center font-semibold text-gray-300">
                Category
              </th>
              <th className="py-1.5 px-3 text-center font-semibold text-gray-300">
                Tests
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
            {testers.map((tester, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
              >
                <td className="py-1.5 px-3 font-medium text-gray-200 border-b border-gray-700">
                  <div>
                    <div className="flex items-center gap-2">
                      <Bug className="h-3 w-3 text-gray-400" />
                      <span>{tester.name}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Created: {tester.created} | {tester.schedule}
                    </div>
                  </div>
                </td>
                <td className="py-1.5 px-3 text-gray-300 border-b border-gray-700 max-w-xs">
                  <div className="truncate" title={tester.description}>
                    {tester.description}
                  </div>
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <TypeBadge type={tester.type} />
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <CategoryBadge category={tester.category} />
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <span className="text-gray-200 font-medium">
                    {tester.tests}
                  </span>
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <StatusBadge status={tester.status} />
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto hover:bg-gray-700"
                      title="Run Test"
                      disabled={tester.status !== "active"}
                    >
                      <Play
                        className={`h-3 w-3 ${tester.status === "active" ? "text-green-500" : "text-gray-500"}`}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto hover:bg-gray-700"
                      title="Edit Tester"
                    >
                      <Edit className="h-3 w-3 text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto hover:bg-gray-700"
                      title="Tester Settings"
                    >
                      <Settings className="h-3 w-3 text-gray-400" />
                    </Button>
                    {tester.type === "Manual" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto hover:bg-gray-700"
                        title="Delete Tester"
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
