"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Activity,
  Shield,
  Play,
  Pause,
  RotateCw,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

// Dynamically import react-leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Loading map...</div>
      </div>
    ),
  },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false },
);

// TypeScript interfaces
interface TrafficSource {
  id: string;
  location: {
    lat: number;
    lng: number;
    city: string;
    country: string;
    code: string;
  };
  type: "attack" | "legitimate";
  protocol: "TCP" | "UDP" | "ICMP";
  port: number;
  severity: "high" | "medium" | "low";
  timestamp: string;
  intensity: number; // 1-10 for visual representation
}

interface MapControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  trafficFilter: "all" | "attack" | "legitimate";
  onFilterChange: (filter: "all" | "attack" | "legitimate") => void;
}

// Fix Leaflet default icon - will be handled client-side
const fixLeafletIcons = () => {
  if (typeof window !== "undefined") {
    import("leaflet").then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
    });
  }
};

// World locations with realistic attack patterns
const worldLocations = [
  {
    lat: 39.9042,
    lng: 116.4074,
    city: "Beijing",
    country: "China",
    code: "CN",
    riskLevel: "high",
  },
  {
    lat: 55.7558,
    lng: 37.6173,
    city: "Moscow",
    country: "Russia",
    code: "RU",
    riskLevel: "high",
  },
  {
    lat: -23.5505,
    lng: -46.6333,
    city: "São Paulo",
    country: "Brazil",
    code: "BR",
    riskLevel: "medium",
  },
  {
    lat: 35.6762,
    lng: 139.6503,
    city: "Tokyo",
    country: "Japan",
    code: "JP",
    riskLevel: "low",
  },
  {
    lat: 28.6139,
    lng: 77.209,
    city: "New Delhi",
    country: "India",
    code: "IN",
    riskLevel: "medium",
  },
  {
    lat: 51.5074,
    lng: -0.1278,
    city: "London",
    country: "UK",
    code: "GB",
    riskLevel: "low",
  },
  {
    lat: 52.52,
    lng: 13.405,
    city: "Berlin",
    country: "Germany",
    code: "DE",
    riskLevel: "low",
  },
  {
    lat: 40.7128,
    lng: -74.006,
    city: "New York",
    country: "USA",
    code: "US",
    riskLevel: "medium",
  },
  {
    lat: 37.7749,
    lng: -122.4194,
    city: "San Francisco",
    country: "USA",
    code: "US",
    riskLevel: "low",
  },
  {
    lat: -33.8688,
    lng: 151.2093,
    city: "Sydney",
    country: "Australia",
    code: "AU",
    riskLevel: "low",
  },
  {
    lat: 41.9028,
    lng: 12.4964,
    city: "Rome",
    country: "Italy",
    code: "IT",
    riskLevel: "medium",
  },
  {
    lat: 48.8566,
    lng: 2.3522,
    city: "Paris",
    country: "France",
    code: "FR",
    riskLevel: "low",
  },
];

// Initial traffic sources
const initialTrafficSources: TrafficSource[] = [
  {
    id: "1",
    location: worldLocations[0], // Beijing
    type: "attack",
    protocol: "TCP",
    port: 443,
    severity: "high",
    timestamp: new Date().toISOString(),
    intensity: 8,
  },
  {
    id: "2",
    location: worldLocations[1], // Moscow
    type: "attack",
    protocol: "UDP",
    port: 53,
    severity: "medium",
    timestamp: new Date().toISOString(),
    intensity: 6,
  },
  {
    id: "3",
    location: worldLocations[2], // São Paulo
    type: "legitimate",
    protocol: "TCP",
    port: 80,
    severity: "low",
    timestamp: new Date().toISOString(),
    intensity: 3,
  },
];

// Utility functions
const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case "high":
      return "#ef4444";
    case "medium":
      return "#f59e0b";
    case "low":
      return "#10b981";
    default:
      return "#6b7280";
  }
};

const getIntensityRadius = (intensity: number): number => {
  return intensity * 3 + 5; // Scale radius based on intensity
};

const generateRandomTrafficSource = (): TrafficSource => {
  const location =
    worldLocations[Math.floor(Math.random() * worldLocations.length)];
  const isAttack =
    location.riskLevel === "high"
      ? Math.random() > 0.3
      : location.riskLevel === "medium"
        ? Math.random() > 0.5
        : Math.random() > 0.7;

  return {
    id: `${Date.now()}-${Math.random()}`,
    location,
    type: isAttack ? "attack" : "legitimate",
    protocol: ["TCP", "UDP", "ICMP"][Math.floor(Math.random() * 3)] as
      | "TCP"
      | "UDP"
      | "ICMP",
    port: Math.floor(Math.random() * 65535),
    severity: isAttack
      ? (["high", "medium"][Math.floor(Math.random() * 2)] as "high" | "medium")
      : "low",
    timestamp: new Date().toISOString(),
    intensity: Math.floor(Math.random() * 10) + 1,
  };
};

// Map controls component
const MapControls: React.FC<MapControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onReset,
  trafficFilter,
  onFilterChange,
}) => (
  <div className="flex items-center gap-2">
    <Button
      variant="outline"
      size="sm"
      onClick={onTogglePlay}
      className="h-8 px-2 bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
    >
      {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={onReset}
      className="h-8 px-2 bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
    >
      <RotateCw className="h-3 w-3" />
    </Button>
    <div className="flex items-center gap-1 bg-gray-700 rounded-md p-1">
      <Button
        variant={trafficFilter === "all" ? "default" : "ghost"}
        size="sm"
        onClick={() => onFilterChange("all")}
        className="h-6 px-2 text-xs"
      >
        All
      </Button>
      <Button
        variant={trafficFilter === "attack" ? "default" : "ghost"}
        size="sm"
        onClick={() => onFilterChange("attack")}
        className="h-6 px-2 text-xs"
      >
        Attacks
      </Button>
      <Button
        variant={trafficFilter === "legitimate" ? "default" : "ghost"}
        size="sm"
        onClick={() => onFilterChange("legitimate")}
        className="h-6 px-2 text-xs"
      >
        Safe
      </Button>
    </div>
  </div>
);

// Traffic source marker component
const TrafficSourceMarker = React.memo<{ source: TrafficSource }>(
  ({ source }) => {
    return (
      <div key={source.id}>
        {/* Circle to show intensity */}
        <Circle
          center={[source.location.lat, source.location.lng]}
          radius={getIntensityRadius(source.intensity) * 10000} // Convert to meters
          pathOptions={{
            color: getSeverityColor(source.severity),
            fillColor: getSeverityColor(source.severity),
            fillOpacity: source.type === "attack" ? 0.3 : 0.1,
            weight: source.type === "attack" ? 2 : 1,
            dashArray: source.type === "attack" ? "5, 5" : "10, 5",
          }}
        />

        {/* Center marker */}
        <Marker position={[source.location.lat, source.location.lng]}>
          <Popup>
            <div className="text-xs min-w-48">
              <div className="font-semibold text-lg mb-2">
                {source.location.city}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">Country:</span>
                  <span className="font-medium">{source.location.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span
                    className={`font-medium ${
                      source.type === "attack"
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {source.type === "attack" ? "🔴 Attack" : "🟢 Legitimate"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Protocol:</span>
                  <span className="font-medium">{source.protocol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Port:</span>
                  <span className="font-medium">{source.port}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Severity:</span>
                  <span
                    className={`font-medium capitalize ${
                      source.severity === "high"
                        ? "text-red-400"
                        : source.severity === "medium"
                          ? "text-orange-400"
                          : "text-green-400"
                    }`}
                  >
                    {source.severity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Intensity:</span>
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 h-2 ${
                            i < source.intensity
                              ? "bg-yellow-400"
                              : "bg-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">{source.intensity}/10</span>
                  </div>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      </div>
    );
  },
);

TrafficSourceMarker.displayName = "TrafficSourceMarker";

// Main component
export function WorldTrafficMapWidget() {
  const [isClient, setIsClient] = useState(false);
  const [trafficSources, setTrafficSources] = useState<TrafficSource[]>(
    initialTrafficSources,
  );
  const [isPlaying, setIsPlaying] = useState(true);
  const [trafficFilter, setTrafficFilter] = useState<
    "all" | "attack" | "legitimate"
  >("all");
  const [mapLoaded, setMapLoaded] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Set client-side flag and fix Leaflet icons on mount
  useEffect(() => {
    setIsClient(true);
    fixLeafletIcons();
    // Add a small delay to ensure Leaflet is fully loaded
    const timer = setTimeout(() => setMapLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle traffic generation interval
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        const newSource = generateRandomTrafficSource();
        setTrafficSources((prev) => {
          const updated = [...prev, newSource];
          // Keep only last 30 sources for performance
          return updated.slice(-30);
        });
      }, 1500);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  const filteredSources = useMemo(() => {
    if (trafficFilter === "all") return trafficSources;
    return trafficSources.filter((source) => source.type === trafficFilter);
  }, [trafficSources, trafficFilter]);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleReset = useCallback(() => {
    setTrafficSources(initialTrafficSources);
  }, []);

  const handleFilterChange = useCallback(
    (filter: "all" | "attack" | "legitimate") => {
      setTrafficFilter(filter);
    },
    [],
  );

  const topCountries = useMemo(() => {
    const countryCounts = trafficSources.reduce(
      (acc, source) => {
        const country = source.location.country;
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(countryCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([country, count]) => ({ country, count: count as number }));
  }, [trafficSources]);

  const trafficStats = useMemo(
    () => ({
      total: trafficSources.length,
      attacks: trafficSources.filter((s) => s.type === "attack").length,
      highSeverity: trafficSources.filter((s) => s.severity === "high").length,
      legitimate: trafficSources.filter((s) => s.type === "legitimate").length,
      topCountries,
    }),
    [trafficSources, topCountries],
  );

  if (!isClient) {
    return (
      <Card className="border border-gray-700 bg-gray-900 shadow-sm">
        <CardHeader className="bg-gray-800 py-3 px-4 border-b border-gray-700">
          <CardTitle className="text-base font-semibold text-gray-200 flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-500" />
            Global Traffic Sources
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-center h-80 bg-gray-800 rounded-lg border border-gray-700">
            <div className="text-center">
              <Globe className="h-12 w-12 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Loading world map...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-700 bg-gray-900 shadow-sm">
      <CardHeader className="bg-gray-800 py-3 px-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-200 flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-500" />
            Global Traffic Sources
            <div
              className={`w-2 h-2 rounded-full ${isPlaying ? "bg-blue-500 animate-pulse" : "bg-gray-500"}`}
            />
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-xs bg-red-500/10 border-red-500/20 text-red-400"
            >
              <AlertTriangle className="h-3 w-3 mr-1" />
              {trafficStats.attacks} Attacks
            </Badge>
            <Badge
              variant="outline"
              className="text-xs bg-green-500/10 border-green-500/20 text-green-400"
            >
              <Shield className="h-3 w-3 mr-1" />
              {trafficStats.legitimate} Safe
            </Badge>
            <MapControls
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              onReset={handleReset}
              trafficFilter={trafficFilter}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* Map Container */}
        <div className="relative h-80 bg-gray-800 rounded-lg border border-gray-700">
          {isClient ? (
            <MapContainer
              center={[20, 0]}
              zoom={2}
              style={{ height: "100%", width: "100%" }}
              className="rounded-lg"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {filteredSources.map((source) => (
                <TrafficSourceMarker key={source.id} source={source} />
              ))}
            </MapContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Globe className="h-12 w-12 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Loading world map...</p>
              </div>
            </div>
          )}
        </div>

        {/* Traffic Statistics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <div className="text-lg font-semibold text-gray-200">
              {trafficStats.total}
            </div>
            <div className="text-xs text-gray-400">Total Sources</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <div className="text-lg font-semibold text-red-400">
              {trafficStats.attacks}
            </div>
            <div className="text-xs text-gray-400">Active Attacks</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <div className="text-lg font-semibold text-orange-400">
              {trafficStats.highSeverity}
            </div>
            <div className="text-xs text-gray-400">High Severity</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <div className="text-lg font-semibold text-green-400">
              {trafficStats.legitimate}
            </div>
            <div className="text-xs text-gray-400">Legitimate Traffic</div>
          </div>
        </div>

        {/* Top Source Countries */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-gray-400" />
            Top Source Countries
          </h3>
          <div className="space-y-2">
            {trafficStats.topCountries.map((country) => (
              <div
                key={country.country}
                className="bg-gray-800 rounded-lg p-2 border border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div>
                      <div className="text-xs font-medium text-gray-200">
                        {country.country}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-gray-200">
                      {country.count}
                    </div>
                    <div className="text-xs text-gray-400">sources</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Sources */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
            <Activity className="h-4 w-4 text-gray-400" />
            Recent Traffic Sources
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {filteredSources
              .slice(-5)
              .reverse()
              .map((source) => (
                <div
                  key={source.id}
                  className="bg-gray-800 rounded-lg p-2 border border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          source.type === "attack"
                            ? "bg-red-500"
                            : "bg-green-500"
                        }`}
                      />
                      <div>
                        <div className="text-xs font-medium text-gray-200">
                          {source.location.city}, {source.location.country}
                        </div>
                        <div className="text-xs text-gray-500">
                          {source.protocol}:{source.port} • Intensity{" "}
                          {source.intensity}/10
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          source.severity === "high"
                            ? "bg-red-500/10 border-red-500/20 text-red-400"
                            : source.severity === "medium"
                              ? "bg-orange-500/10 border-orange-500/20 text-orange-400"
                              : "bg-green-500/10 border-green-500/20 text-green-400"
                        }`}
                      >
                        {source.severity}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
