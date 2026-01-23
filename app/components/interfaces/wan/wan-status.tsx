import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Signal, Wifi, WifiOff, Power, PowerOff } from 'lucide-react';

export default function WANStatus() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">WAN Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Connection Status</span>
            <Badge className="bg-green-600 hover:bg-green-700">Connected</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-300">Interface</span>
            <span className="text-white font-medium">WAN0</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-300">Type</span>
            <span className="text-white font-medium">Ethernet</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-300">IP Address</span>
            <span className="text-white font-medium">192.168.1.100</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-300">MAC Address</span>
            <span className="text-white font-medium text-sm">00:1A:2B:3C:4D:5E</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-300">Uptime</span>
            <span className="text-white font-medium">2 days, 3 hours</span>
          </div>

          <div className="space-y-2">
            <span className="text-gray-300">Signal Strength</span>
            <div className="flex items-center space-x-2">
              <Signal className="h-4 w-4 text-blue-400" />
              <Progress value={85} className="h-2 bg-gray-600 [&>div]:bg-blue-500" />
              <span className="text-white text-sm font-medium">85%</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-gray-300">Latency</span>
            <div className="flex items-center space-x-2">
              <Power className="h-4 w-4 text-green-400" />
              <span className="text-white text-sm font-medium">12ms</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
