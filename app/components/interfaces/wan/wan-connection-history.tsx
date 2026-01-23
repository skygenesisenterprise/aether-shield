import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock, Wifi, Power, PowerOff, AlertCircle } from 'lucide-react';

export default function WANConnectionHistory() {
  // Données d'historique simulées
  const historyData = [
    {
      id: 1,
      date: '2024-05-20',
      time: '14:32:15',
      event: 'Connection Established',
      interface: 'WAN0',
      status: 'success',
      ip: '192.168.1.100'
    },
    {
      id: 2,
      date: '2024-05-20',
      time: '10:15:42',
      event: 'IP Address Changed',
      interface: 'WAN0',
      status: 'info',
      ip: '192.168.1.101'
    },
    {
      id: 3,
      date: '2024-05-19',
      time: '22:45:18',
      event: 'Connection Lost',
      interface: 'WAN0',
      status: 'error',
      ip: 'N/A'
    },
    {
      id: 4,
      date: '2024-05-19',
      time: '22:46:30',
      event: 'Connection Restored',
      interface: 'WAN0',
      status: 'success',
      ip: '192.168.1.100'
    },
    {
      id: 5,
      date: '2024-05-18',
      time: '08:22:05',
      event: 'DHCP Renewal',
      interface: 'WAN0',
      status: 'info',
      ip: '192.168.1.100'
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <Power className="h-4 w-4 text-green-400" />;
      case 'error':
        return <PowerOff className="h-4 w-4 text-red-400" />;
      case 'info':
        return <Clock className="h-4 w-4 text-blue-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-600 hover:bg-green-700">Success</Badge>;
      case 'error':
        return <Badge className="bg-red-600 hover:bg-red-700">Error</Badge>;
      case 'info':
        return <Badge className="bg-blue-600 hover:bg-blue-700">Info</Badge>;
      default:
        return <Badge className="bg-yellow-600 hover:bg-yellow-700">Warning</Badge>;
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Connection History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Date</TableHead>
                <TableHead className="text-gray-300">Time</TableHead>
                <TableHead className="text-gray-300">Event</TableHead>
                <TableHead className="text-gray-300">Interface</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historyData.map((item) => (
                <TableRow key={item.id} className="border-gray-700 hover:bg-gray-700">
                  <TableCell className="text-white font-medium">{item.date}</TableCell>
                  <TableCell className="text-white">{item.time}</TableCell>
                  <TableCell className="text-white flex items-center">
                    {getStatusIcon(item.status)}
                    <span className="ml-2">{item.event}</span>
                  </TableCell>
                  <TableCell className="text-white">{item.interface}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-white">{item.ip}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
