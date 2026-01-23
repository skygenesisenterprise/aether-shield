import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, Wifi as WifiIcon, Signal, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const wirelessDevices = [
  {
    id: "1",
    name: "Smartphone - John",
    mac: "00:1A:2B:3C:4D:5E",
    ip: "192.168.1.101",
    signal: 85,
    ssid: "Aether-Network",
    status: "connected",
    type: "mobile",
  },
  {
    id: "2",
    name: "Laptop - Office",
    mac: "00:1A:2B:3C:4D:5F",
    ip: "192.168.1.102",
    signal: 72,
    ssid: "Aether-Network",
    status: "connected",
    type: "laptop",
  },
  {
    id: "3",
    name: "Tablet - Guest",
    mac: "00:1A:2B:3C:4D:60",
    ip: "192.168.1.103",
    signal: 65,
    ssid: "Aether-Guest",
    status: "connected",
    type: "tablet",
  },
  {
    id: "4",
    name: "Smart TV",
    mac: "00:1A:2B:3C:4D:61",
    ip: "192.168.1.104",
    signal: 92,
    ssid: "Aether-Network",
    status: "connected",
    type: "tv",
  },
  {
    id: "5",
    name: "IoT Device",
    mac: "00:1A:2B:3C:4D:62",
    ip: "192.168.1.105",
    signal: 55,
    ssid: "Aether-IoT",
    status: "connected",
    type: "iot",
  },
];

export function WirelessDevicesList() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-gray-100">Wireless Devices</CardTitle>
          <CardDescription className="text-gray-400">
            All devices connected to wireless networks
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-gray-700 text-gray-200">
            {wirelessDevices.length} devices
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-gray-700 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-700 hover:bg-gray-600">
                <TableHead className="text-gray-300">Device</TableHead>
                <TableHead className="text-gray-300">MAC Address</TableHead>
                <TableHead className="text-gray-300">IP Address</TableHead>
                <TableHead className="text-gray-300">Signal</TableHead>
                <TableHead className="text-gray-300">SSID</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wirelessDevices.map((device) => (
                <TableRow
                  key={device.id}
                  className="hover:bg-gray-700 transition-colors"
                >
                  <TableCell className="text-gray-200">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      {device.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300 font-mono text-sm">
                    {device.mac}
                  </TableCell>
                  <TableCell className="text-gray-300 font-mono text-sm">
                    {device.ip}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Signal className="h-4 w-4 text-blue-400" />
                      <span className="text-gray-200">
                        {device.signal}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    <Badge variant="secondary" className="text-xs">
                      {device.ssid}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        device.status === "connected"
                          ? "bg-green-500 text-white"
                          : "bg-yellow-500 text-black"
                      }
                    >
                      {device.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                        <DropdownMenuItem className="focus:bg-gray-700">
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-gray-700">
                          Disconnect
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-gray-700">
                          Block Device
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-gray-700">
                          Edit Settings
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
