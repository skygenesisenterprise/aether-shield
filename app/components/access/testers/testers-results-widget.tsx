"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export function TestersResultsWidget() {
  const testResults = [
    {
      tester: "api-tester-01",
      passed: 145,
      failed: 5,
      total: 150,
      successRate: "96.7%",
      lastRun: "2 hours ago",
    },
    {
      tester: "ui-tester-01",
      passed: 89,
      failed: 11,
      total: 100,
      successRate: "89.0%",
      lastRun: "1 hour ago",
    },
    {
      tester: "load-tester-01",
      passed: 234,
      failed: 16,
      total: 250,
      successRate: "93.6%",
      lastRun: "30 minutes ago",
    },
    {
      tester: "security-tester-01",
      passed: 67,
      failed: 3,
      total: 70,
      successRate: "95.7%",
      lastRun: "4 hours ago",
    },
  ];

  const SuccessRateBadge = ({ rate }: { rate: string }) => {
    const numRate = parseFloat(rate);
    let colorClass = "bg-green-900 text-green-300";

    if (numRate < 90) colorClass = "bg-yellow-900 text-yellow-300";
    if (numRate < 80) colorClass = "bg-red-900 text-red-300";

    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}
      >
        {rate}
      </span>
    );
  };

  const ProgressBar = ({
    passed,
    total,
  }: {
    passed: number;
    total: number;
  }) => {
    const percentage = (passed / total) * 100;
    let colorClass = "bg-green-500";

    if (percentage < 90) colorClass = "bg-yellow-500";
    if (percentage < 80) colorClass = "bg-red-500";

    return (
      <div className="w-full bg-gray-700 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  return (
    <Card className="border border-gray-700 bg-gray-900 shadow-sm">
      <CardHeader className="bg-gray-800 py-2 px-3 border-b border-gray-700">
        <CardTitle className="text-sm font-semibold text-gray-200 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          Test Results
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-800 border-b border-gray-700">
              <th className="py-1.5 px-3 text-left font-semibold text-gray-300">
                Tester
              </th>
              <th className="py-1.5 px-3 text-center font-semibold text-gray-300">
                Passed
              </th>
              <th className="py-1.5 px-3 text-center font-semibold text-gray-300">
                Failed
              </th>
              <th className="py-1.5 px-3 text-center font-semibold text-gray-300">
                Success Rate
              </th>
              <th className="py-1.5 px-3 text-center font-semibold text-gray-300">
                Last Run
              </th>
            </tr>
          </thead>
          <tbody>
            {testResults.map((result, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
              >
                <td className="py-1.5 px-3 font-medium text-gray-200 border-b border-gray-700">
                  <div>
                    <div>{result.tester}</div>
                    <div className="text-xs text-gray-400">
                      Total: {result.total} tests
                    </div>
                  </div>
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <span className="text-green-400 font-medium">
                    {result.passed}
                  </span>
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <span className="text-red-400 font-medium">
                    {result.failed}
                  </span>
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <div className="space-y-1">
                    <SuccessRateBadge rate={result.successRate} />
                    <ProgressBar passed={result.passed} total={result.total} />
                  </div>
                </td>
                <td className="py-1.5 px-3 text-center border-b border-gray-700">
                  <span className="text-gray-300 text-xs">
                    {result.lastRun}
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
