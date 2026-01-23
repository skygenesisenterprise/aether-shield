import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

export default function WANConfiguration() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">WAN Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="wan-interface" className="text-gray-300">Interface</Label>
          <Select defaultValue="wan0">
            <SelectTrigger id="wan-interface" className="w-full bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Select WAN interface" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="wan0" className="text-white hover:bg-gray-600">WAN0 (Ethernet)</SelectItem>
              <SelectItem value="wan1" className="text-white hover:bg-gray-600">WAN1 (PPPoE)</SelectItem>
              <SelectItem value="wan2" className="text-white hover:bg-gray-600">WAN2 (LTE)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ip-address" className="text-gray-300">IP Address</Label>
          <Input 
            id="ip-address" 
            type="text" 
            placeholder="DHCP or static IP"
            className="bg-gray-700 border-gray-600 text-white"
            defaultValue="DHCP"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gateway" className="text-gray-300">Gateway</Label>
          <Input 
            id="gateway" 
            type="text" 
            placeholder="Gateway IP"
            className="bg-gray-700 border-gray-600 text-white"
            defaultValue="0.0.0.0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dns" className="text-gray-300">DNS Servers</Label>
          <Input 
            id="dns" 
            type="text" 
            placeholder="DNS servers (comma separated)"
            className="bg-gray-700 border-gray-600 text-white"
            defaultValue="8.8.8.8, 8.8.4.4"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch id="wan-enabled" defaultChecked />
            <Label htmlFor="wan-enabled" className="text-gray-300">Enable WAN</Label>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Save Configuration</Button>
        </div>
      </CardContent>
    </Card>
  );
}
