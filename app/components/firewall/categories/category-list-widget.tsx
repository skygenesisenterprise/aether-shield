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

const mockCategories = [
  {
    id: "1",
    name: "Security Policies",
    type: "Security",
    status: "active",
    rules: 12,
    lastUpdated: "2024-01-15",
  },
  {
    id: "2",
    name: "Web Applications",
    type: "Application",
    status: "active",
    rules: 8,
    lastUpdated: "2024-01-10",
  },
  {
    id: "3",
    name: "Internal Network",
    type: "Network",
    status: "inactive",
    rules: 5,
    lastUpdated: "2023-12-20",
  },
  {
    id: "4",
    name: "Custom Rules",
    type: "Custom",
    status: "active",
    rules: 23,
    lastUpdated: "2024-01-18",
  },
  {
    id: "5",
    name: "Database Access",
    type: "Security",
    status: "active",
    rules: 15,
    lastUpdated: "2024-01-12",
  },
];

export function CategoryListWidget() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">
          All Categories
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-400 text-xs">Name</TableHead>
              <TableHead className="text-gray-400 text-xs">Type</TableHead>
              <TableHead className="text-gray-400 text-xs">Status</TableHead>
              <TableHead className="text-gray-400 text-xs">Rules</TableHead>
              <TableHead className="text-gray-400 text-xs">
                Last Updated
              </TableHead>
              <TableHead className="text-gray-400 text-xs text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="text-gray-100 text-sm">
                  {category.name}
                </TableCell>
                <TableCell className="text-gray-300 text-sm">
                  {category.type}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      category.status === "active" ? "secondary" : "destructive"
                    }
                    className="text-xs"
                  >
                    {category.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-300 text-sm">
                  {category.rules}
                </TableCell>
                <TableCell className="text-gray-400 text-sm">
                  {category.lastUpdated}
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
