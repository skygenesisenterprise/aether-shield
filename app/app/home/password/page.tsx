"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key, Shield, Lock, AlertTriangle } from "lucide-react";

export default function PasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match");
      return;
    }

    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate password change
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      alert("Error changing password");
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = (password: string) => {
    if (password.length < 8)
      return { score: 0, color: "text-red-400", text: "Weak" };
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password))
      return { score: 1, color: "text-yellow-400", text: "Fair" };
    if (!/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password))
      return { score: 2, color: "text-yellow-400", text: "Good" };
    return { score: 3, color: "text-green-400", text: "Strong" };
  };

  const strength = passwordStrength(newPassword);

  return (
    <div className="min-h-screen bg-gray-900">
      <main className="p-4">
        {/* Page Title */}
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-gray-100">
            Aether Shield - Password Management
          </h1>
          <p className="text-sm text-gray-300">Change your system password</p>
        </div>

        {/* Password Management Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Password Form */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border border-gray-700 bg-gray-900 shadow-sm">
              <CardHeader className="bg-gray-800 py-2 px-3 border-b border-gray-700">
                <CardTitle className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-blue-400" />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-xs">
                  <tbody>
                    <tr className="bg-gray-900">
                      <td className="py-2 px-3 font-medium text-gray-300 w-1/3 border-b border-gray-700">
                        Current Password
                      </td>
                      <td className="py-2 px-3 border-b border-gray-700">
                        <Input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                          className="w-full bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500 text-xs h-6"
                          placeholder="Enter current password"
                        />
                      </td>
                    </tr>
                    <tr className="bg-gray-800">
                      <td className="py-2 px-3 font-medium text-gray-300 w-1/3 border-b border-gray-700">
                        New Password
                      </td>
                      <td className="py-2 px-3 border-b border-gray-700">
                        <Input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          className="w-full bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500 text-xs h-6"
                          placeholder="Enter new password"
                        />
                      </td>
                    </tr>
                    <tr className="bg-gray-900">
                      <td className="py-2 px-3 font-medium text-gray-300 w-1/3 border-b border-gray-700">
                        Confirm Password
                      </td>
                      <td className="py-2 px-3 border-b border-gray-700">
                        <Input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          className="w-full bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500 text-xs h-6"
                          placeholder="Confirm new password"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Password Strength Indicator */}
            <Card className="border border-gray-700 bg-gray-900 shadow-sm">
              <CardHeader className="bg-gray-800 py-2 px-3 border-b border-gray-700">
                <CardTitle className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-400" />
                  Password Strength
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-300">Strength:</span>
                    <span className={`text-xs font-medium ${strength.color}`}>
                      {strength.text}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded h-2 overflow-hidden">
                    <div
                      className={`h-full ${
                        strength.score === 0
                          ? "bg-red-500"
                          : strength.score === 1
                            ? "bg-yellow-500"
                            : strength.score === 2
                              ? "bg-yellow-500"
                              : "bg-green-500"
                      } transition-all`}
                      style={{ width: `${(strength.score / 3) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Button */}
            <Card className="border border-gray-700 bg-gray-900 shadow-sm">
              <CardContent className="p-3">
                <Button
                  onClick={handleSubmit}
                  disabled={
                    isLoading ||
                    !currentPassword ||
                    !newPassword ||
                    !confirmPassword
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm"
                >
                  {isLoading ? "Saving..." : "Save Password"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Information */}
          <div className="space-y-4">
            {/* Requirements */}
            <Card className="border border-gray-700 bg-gray-900 shadow-sm">
              <CardHeader className="bg-gray-800 py-2 px-3 border-b border-gray-700">
                <CardTitle className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                  <Key className="h-4 w-4 text-blue-400" />
                  Password Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-xs">
                  <tbody>
                    {[
                      "At least 8 characters",
                      "Mix of uppercase and lowercase",
                      "Include at least one number",
                      "Include at least one special character",
                    ].map((requirement, index) => (
                      <tr
                        key={index}
                        className={
                          index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                        }
                      >
                        <td className="py-2 px-3 text-gray-300 border-b border-gray-700">
                          • {requirement}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Security Tips */}
            <Card className="border border-gray-700 bg-gray-900 shadow-sm">
              <CardHeader className="bg-gray-800 py-2 px-3 border-b border-gray-700">
                <CardTitle className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  Security Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-xs">
                  <tbody>
                    {[
                      "Don't use common words",
                      "Avoid personal information",
                      "Don't reuse passwords",
                      "Change passwords regularly",
                    ].map((tip, index) => (
                      <tr
                        key={index}
                        className={
                          index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                        }
                      >
                        <td className="py-2 px-3 text-gray-300 border-b border-gray-700">
                          • {tip}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
