"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Edit, Trash2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockGroups = [
  {
    id: "1",
    name: "Administrators",
    type: "User Groups",
    status: "active",
    members: 8,
    lastUpdated: "2024-01-15",
  },
  {
    id: "2",
    name: "Developers",
    type: "User Groups",
    status: "active",
    members: 15,
    lastUpdated: "2024-01-10",
  },
  {
    id: "3",
    name: "Servers",
    type: "Device Groups",
    status: "inactive",
    members: 12,
    lastUpdated: "2023-12-20",
  },
  {
    id: "4",
    name: "Workstations",
    type: "Device Groups",
    status: "active",
    members: 25,
    lastUpdated: "2024-01-18",
  },
  {
    id: "5",
    name: "Remote Users",
    type: "Location Groups",
    status: "active",
    members: 10,
    lastUpdated: "2024-01-12",
  },
];

export function GroupListWidget() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">
          All Groups
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-400 text-xs">Name</TableHead>
              <TableHead className="text-gray-400 text-xs">Type</TableHead>
              <TableHead className="text-gray-400 text-xs">Status</TableHead>
              <TableHead className="text-gray-400 text-xs">Members</TableHead>
              <TableHead className="text-gray-400 text-xs">
                Last Updated
              </TableHead>
              <TableHead className="text-gray-400 text-xs text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockGroups.map((group) => (
              <TableRow key={group.id}>
                <TableCell className="text-gray-100 text-sm">
                  {group.name}
                </TableCell>
                <TableCell className="text-gray-300 text-sm">
                  {group.type}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      group.status === "active" ? "secondary" : "destructive"
                    }
                    className="text-xs"
                  >
                    {group.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-300 text-sm">
                  {group.members}
                </TableCell>
                <TableCell className="text-gray-400 text-sm">
                  {group.lastUpdated}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
