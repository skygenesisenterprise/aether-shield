"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileText, GitBranch, Building } from "lucide-react";

export default function LicensePage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">License</h1>
      </div>

      <div className="grid gap-6">
        {/* License Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              License Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Aether Shield is licensed under the MIT License, an OSI-approved
              open source license that gives you the freedom to use, copy,
              modify, merge, publish, distribute, sublicense, and/or sell copies
              of the software.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>License Type:</strong> MIT License
              </p>
              <p className="text-sm text-blue-800">
                <strong>Copyright:</strong> © 2025 Sky Genesis Enterprise
              </p>
              <p className="text-sm text-blue-800">
                <strong>Approval:</strong> Open Source Initiative (OSI) Approved
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Full License Text */}
        <Card>
          <CardHeader>
            <CardTitle>MIT License Text</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-6 font-mono text-sm whitespace-pre-wrap">
              {`MIT License

Copyright (c) 2025 Sky Genesis Enterprise

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                What this means for you:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>
                  You can freely use Aether Shield for commercial and
                  non-commercial purposes
                </li>
                <li>You can modify the source code to suit your needs</li>
                <li>You can distribute modified versions of the software</li>
                <li>You can include Aether Shield in proprietary software</li>
                <li>You are not required to release your modifications</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Requirements:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Include the original copyright notice</li>
                <li>Include the license text in copies of the software</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Source Code */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Source Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              The complete source code for Aether Shield is available for
              review, modification, and contribution.
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-mono text-gray-800">
                Repository: Available in your local installation
              </p>
              <p className="text-sm font-mono text-gray-800">
                License: MIT (see LICENSE file in repository root)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
