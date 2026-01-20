import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, MapPin, AlertTriangle, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const geoAttacks = [
  {
    country: "China",
    code: "CN",
    attacks: 342,
    percentage: 28.5,
    flag: "🇨🇳",
    status: "high",
    topTarget: "Web Server",
    blocked: 298,
    allowed: 44,
  },
  {
    country: "Russia",
    code: "RU",
    attacks: 256,
    percentage: 21.3,
    flag: "🇷🇺",
    status: "high",
    topTarget: "SSH Service",
    blocked: 234,
    allowed: 22,
  },
  {
    country: "Brazil",
    code: "BR",
    attacks: 189,
    percentage: 15.8,
    flag: "🇧🇷",
    status: "medium",
    topTarget: "RDP Service",
    blocked: 156,
    allowed: 33,
  },
  {
    country: "United States",
    code: "US",
    attacks: 145,
    percentage: 12.1,
    flag: "🇺🇸",
    status: "low",
    topTarget: "API Gateway",
    blocked: 23,
    allowed: 122,
  },
  {
    country: "India",
    code: "IN",
    attacks: 98,
    percentage: 8.2,
    flag: "🇮🇳",
    status: "medium",
    topTarget: "Database",
    blocked: 67,
    allowed: 31,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "high":
      return "text-red-500 bg-red-500/10 border-red-500/20";
    case "medium":
      return "text-orange-500 bg-orange-500/10 border-orange-500/20";
    case "low":
      return "text-green-500 bg-green-500/10 border-green-500/20";
    default:
      return "text-gray-500 bg-gray-500/10 border-gray-500/20";
  }
};

export function GeoThreatMapWidget() {
  return (
    <Card className="border border-gray-700 bg-gray-900 shadow-sm">
      <CardHeader className="bg-gray-800 py-3 px-4 border-b border-gray-700">
        <CardTitle className="text-base font-semibold text-gray-200 flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-500" />
          Geographic Threat Map
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* World Map Placeholder */}
        <div className="bg-gray-800 rounded-lg p-4 mb-4 border border-gray-700">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <Globe className="h-12 w-12 text-gray-600 mx-auto mb-2" />
              <p className="text-xs text-gray-400">Interactive world map</p>
              <p className="text-xs text-gray-500">Click regions for details</p>
            </div>
          </div>
        </div>

        {/* Top Attacking Countries */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            Top Attacking Countries
          </h3>
          {geoAttacks.map((country) => (
            <div
              key={country.code}
              className="bg-gray-800 rounded-lg p-3 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{country.flag}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-200">
                      {country.country}
                    </div>
                    <div className="text-xs text-gray-400">{country.code}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-200">
                    {country.attacks}
                  </div>
                  <div className="text-xs text-gray-400">
                    {country.percentage}%
                  </div>
                </div>
              </div>

              {/* Attack Bar */}
              <div className="mb-2">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      country.status === "high"
                        ? "bg-red-500"
                        : country.status === "medium"
                          ? "bg-orange-500"
                          : "bg-green-500"
                    }`}
                    style={{ width: `${country.percentage * 3}%` }}
                  />
                </div>
              </div>

              {/* Details */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`text-xs ${getStatusColor(country.status)}`}
                  >
                    {country.status}
                  </Badge>
                  <span className="text-gray-400">
                    Target: {country.topTarget}
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="text-red-400">B: {country.blocked}</span>
                  <span className="text-green-400">A: {country.allowed}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-4 pt-3 border-t border-gray-700">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-400">Total Countries:</span>
              <span className="ml-2 text-gray-300">47</span>
            </div>
            <div>
              <span className="text-gray-400">Active Threats:</span>
              <span className="ml-2 text-red-400">1,030</span>
            </div>
            <div>
              <span className="text-gray-400">Top Region:</span>
              <span className="ml-2 text-gray-300">Asia Pacific</span>
            </div>
            <div>
              <span className="text-gray-400">Global Risk:</span>
              <span className="ml-2 text-orange-400">Elevated</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
