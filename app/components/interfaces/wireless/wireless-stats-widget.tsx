import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wifi, Users, Signal, Activity } from "lucide-react";

const stats = {
  totalDevices: 42,
  connected: 38,
  guests: 5,
  averageSignal: 78,
  activeSessions: 29,
};

export function WirelessStatsWidget() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-100 flex items-center gap-2">
          <Wifi className="h-5 w-5" />
          Wireless Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-400" />
            <div>
              <div className="text-2xl font-bold text-gray-100">
                {stats.totalDevices}
              </div>
              <div className="text-sm text-gray-400">Total Devices</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-400" />
            <div>
              <div className="text-2xl font-bold text-gray-100">
                {stats.connected}
              </div>
              <div className="text-sm text-gray-400">Connected</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-yellow-400" />
            <div>
              <div className="text-2xl font-bold text-gray-100">
                {stats.guests}
              </div>
              <div className="text-sm text-gray-400">Guest Devices</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Signal className="h-5 w-5 text-purple-400" />
            <div>
              <div className="text-2xl font-bold text-gray-100">
                {stats.averageSignal}%
              </div>
              <div className="text-sm text-gray-400">Avg Signal</div>
            </div>
          </div>
        </div>
        <div className="pt-2">
          <div className="text-sm text-gray-400 mb-2">Status</div>
          <div className="flex gap-2">
            <Badge className="bg-green-500 text-white">
              {stats.connected} Connected
            </Badge>
            <Badge className="bg-yellow-500 text-black">
              {stats.totalDevices - stats.connected} Inactive
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
