import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const clientData = {
  total: 38,
  byType: {
    mobile: 22,
    laptop: 10,
    tablet: 4,
    tv: 2,
    iot: 5,
  },
};

const deviceTypes = [
  { value: "all", label: "All Devices" },
  { value: "mobile", label: "Mobile Phones" },
  { value: "laptop", label: "Laptops" },
  { value: "tablet", label: "Tablets" },
  { value: "tv", label: "TVs" },
  { value: "iot", label: "IoT Devices" },
];

export function WirelessClientsWidget() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-gray-100 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Wireless Clients
          </CardTitle>
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[160px] bg-gray-700 border-gray-600 text-gray-200">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            {deviceTypes.map((type) => (
              <SelectItem
                key={type.value}
                value={type.value}
                className="focus:bg-gray-700"
              >
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="text-3xl font-bold text-gray-100">
            {clientData.total}
          </div>
          <Badge variant="secondary" className="bg-gray-700 text-gray-200">
            Active Clients
          </Badge>
        </div>
        <div className="space-y-2">
          {Object.entries(clientData.byType).map(([type, count]) => (
            <div
              key={type}
              className="flex items-center justify-between p-2 rounded hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-blue-400" />
                <span className="text-gray-200 capitalize">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-200 font-medium">
                  {count} devices
                </span>
                <div className="w-full h-2 bg-gray-700 rounded mr-2">
                  <div
                    className="h-2 bg-blue-500 rounded"
                    style={{ width: `${(count / clientData.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
