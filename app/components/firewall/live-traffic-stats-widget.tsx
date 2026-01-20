"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Shield,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Globe,
  Zap,
  Target,
  Play,
  Pause,
  RotateCw,
} from "lucide-react";

// TypeScript interfaces
interface RealTimeStat {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<any>;
  color: string;
  trend: "up" | "down";
}

interface TopAttacker {
  country: string;
  code: string;
  flag: string;
  attacks: number;
  percentage: number;
  topTarget: string;
  status: "high" | "medium" | "low";
}

interface AttackType {
  type: string;
  count: number;
  percentage: number;
  color: string;
}

interface StatsControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
}

// Initial data
const initialStats: RealTimeStat[] = [
  {
    title: "Active Connections",
    value: "1,247",
    change: "+12%",
    icon: Activity,
    color: "text-blue-500",
    trend: "up",
  },
  {
    title: "Attack Rate",
    value: "89/s",
    change: "+5%",
    icon: Shield,
    color: "text-red-500",
    trend: "up",
  },
  {
    title: "Blocked Threats",
    value: "1,158",
    change: "+13%",
    icon: AlertTriangle,
    color: "text-orange-500",
    trend: "up",
  },
  {
    title: "Response Time",
    value: "0.3ms",
    change: "-2%",
    icon: Zap,
    color: "text-green-500",
    trend: "down",
  },
];

const initialTopAttackers: TopAttacker[] = [
  {
    country: "China",
    code: "CN",
    flag: "🇨🇳",
    attacks: 342,
    percentage: 28.5,
    topTarget: "Web Server",
    status: "high",
  },
  {
    country: "Russia",
    code: "RU",
    flag: "🇷🇺",
    attacks: 256,
    percentage: 21.3,
    topTarget: "SSH Service",
    status: "high",
  },
  {
    country: "Brazil",
    code: "BR",
    flag: "🇧🇷",
    attacks: 189,
    percentage: 15.8,
    topTarget: "RDP Service",
    status: "medium",
  },
  {
    country: "North Korea",
    code: "KP",
    flag: "🇰🇵",
    attacks: 145,
    percentage: 12.1,
    topTarget: "API Gateway",
    status: "high",
  },
];

const initialAttackTypes: AttackType[] = [
  { type: "DDoS", count: 45, percentage: 35, color: "bg-red-500" },
  { type: "Port Scan", count: 32, percentage: 25, color: "bg-orange-500" },
  { type: "Brute Force", count: 28, percentage: 22, color: "bg-yellow-500" },
  { type: "SQL Injection", count: 23, percentage: 18, color: "bg-purple-500" },
];

// Utility functions
const generateRandomStats = (): RealTimeStat[] => {
  return [
    {
      title: "Active Connections",
      value: Math.floor(1000 + Math.random() * 500).toLocaleString(),
      change: `${Math.random() > 0.5 ? "+" : "-"}${Math.floor(Math.random() * 20)}%`,
      icon: Activity,
      color: "text-blue-500",
      trend: Math.random() > 0.5 ? "up" : "down",
    },
    {
      title: "Attack Rate",
      value: `${Math.floor(50 + Math.random() * 100)}/s`,
      change: `${Math.random() > 0.5 ? "+" : "-"}${Math.floor(Math.random() * 15)}%`,
      icon: Shield,
      color: "text-red-500",
      trend: Math.random() > 0.5 ? "up" : "down",
    },
    {
      title: "Blocked Threats",
      value: Math.floor(1000 + Math.random() * 300).toLocaleString(),
      change: `${Math.random() > 0.5 ? "+" : "-"}${Math.floor(Math.random() * 25)}%`,
      icon: AlertTriangle,
      color: "text-orange-500",
      trend: Math.random() > 0.5 ? "up" : "down",
    },
    {
      title: "Response Time",
      value: `${(Math.random() * 2).toFixed(1)}ms`,
      change: `${Math.random() > 0.5 ? "+" : "-"}${Math.floor(Math.random() * 10)}%`,
      icon: Zap,
      color: "text-green-500",
      trend: Math.random() > 0.3 ? "down" : "up",
    },
  ];
};

const generateRandomTopAttackers = (): TopAttacker[] => {
  const countries = [
    { country: "China", code: "CN", flag: "🇨🇳" },
    { country: "Russia", code: "RU", flag: "🇷🇺" },
    { country: "Brazil", code: "BR", flag: "🇧🇷" },
    { country: "North Korea", code: "KP", flag: "🇰🇵" },
    { country: "United States", code: "US", flag: "🇺🇸" },
    { country: "India", code: "IN", flag: "🇮🇳" },
    { country: "Iran", code: "IR", flag: "🇮🇷" },
    { country: "Turkey", code: "TR", flag: "🇹🇷" },
  ];

  const targets = [
    "Web Server",
    "SSH Service",
    "RDP Service",
    "API Gateway",
    "Database",
    "Mail Server",
  ];
  const statuses: ("high" | "medium" | "low")[] = ["high", "medium", "low"];

  const selectedCountries = countries.slice(0, 4);
  const attackers = selectedCountries.map((country) => ({
    ...country,
    attacks: Math.floor(100 + Math.random() * 400),
    topTarget: targets[Math.floor(Math.random() * targets.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
  }));

  // Calculate percentages based on total attacks
  const totalAttacks = attackers.reduce(
    (sum, attacker) => sum + attacker.attacks,
    0,
  );

  return attackers
    .map((attacker) => ({
      ...attacker,
      percentage:
        totalAttacks > 0 ? (attacker.attacks / totalAttacks) * 100 : 0,
    }))
    .sort((a, b) => b.attacks - a.attacks);
};

const generateRandomAttackTypes = (): AttackType[] => {
  const types = ["DDoS", "Port Scan", "Brute Force", "SQL Injection"];
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-purple-500",
  ];

  const counts = types.map(() => Math.floor(20 + Math.random() * 60));
  const total = counts.reduce((sum, count) => sum + count, 0);

  return types.map((type, index) => ({
    type,
    count: counts[index],
    percentage: Math.round((counts[index] / total) * 100),
    color: colors[index],
  }));
};

// Stats controls component
const StatsControls: React.FC<StatsControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onReset,
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
  </div>
);

// Main component
export function LiveTrafficStatsWidget() {
  const [stats, setStats] = useState<RealTimeStat[]>(initialStats);
  const [topAttackers, setTopAttackers] =
    useState<TopAttacker[]>(initialTopAttackers);
  const [attackTypes, setAttackTypes] =
    useState<AttackType[]>(initialAttackTypes);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setStats(generateRandomStats());
        setTopAttackers(generateRandomTopAttackers());
        setAttackTypes(generateRandomAttackTypes());
      }, 3000);
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

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleReset = useCallback(() => {
    setStats(initialStats);
    setTopAttackers(initialTopAttackers);
    setAttackTypes(initialAttackTypes);
  }, []);

  const totalAttacks = useMemo(() => {
    return topAttackers.reduce((sum, attacker) => sum + attacker.attacks, 0);
  }, [topAttackers]);

  // Recalculate percentages for top attackers to ensure they sum to 100%
  const normalizedTopAttackers = useMemo(() => {
    const total = topAttackers.reduce(
      (sum, attacker) => sum + attacker.attacks,
      0,
    );
    if (total === 0) return topAttackers;

    return topAttackers.map((attacker) => ({
      ...attacker,
      percentage: (attacker.attacks / total) * 100,
    }));
  }, [topAttackers]);

  const totalAttacksByType = useMemo(() => {
    return attackTypes.reduce((sum, type) => sum + type.count, 0);
  }, [attackTypes]);

  // Recalculate percentages for attack types to ensure they sum to 100%
  const normalizedAttackTypes = useMemo(() => {
    const total = attackTypes.reduce((sum, type) => sum + type.count, 0);
    if (total === 0) return attackTypes;

    return attackTypes.map((type) => ({
      ...type,
      percentage: Math.round((type.count / total) * 100),
    }));
  }, [attackTypes]);

  return (
    <Card className="border border-gray-700 bg-gray-900 shadow-sm">
      <CardHeader className="bg-gray-800 py-3 px-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-200 flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            Live Traffic Statistics
            <div
              className={`w-2 h-2 rounded-full ${isPlaying ? "bg-green-500 animate-pulse" : "bg-gray-500"}`}
            />
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-xs bg-red-500/10 border-red-500/20 text-red-400"
            >
              <Shield className="h-3 w-3 mr-1" />
              {totalAttacks} Attacks
            </Badge>
            <Badge
              variant="outline"
              className="text-xs bg-orange-500/10 border-orange-500/20 text-orange-400"
            >
              <Target className="h-3 w-3 mr-1" />
              {totalAttacksByType} Total
            </Badge>
            <StatsControls
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              onReset={handleReset}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* Real-time Metrics */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-3 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <div className="flex items-center gap-1">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      stat.change.startsWith("+")
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className="text-lg font-semibold text-gray-200">
                {stat.value}
              </div>
              <div className="text-xs text-gray-400">{stat.title}</div>
            </div>
          ))}
        </div>

        {/* Top Attackers */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
            <Globe className="h-4 w-4 text-gray-400" />
            Top Attackers
          </h3>
          <div className="space-y-2">
            {normalizedTopAttackers.map((attacker, index) => (
              <div
                key={attacker.code}
                className="bg-gray-800 rounded-lg p-2 border border-gray-700"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{attacker.flag}</span>
                    <div>
                      <div className="text-xs font-medium text-gray-200">
                        {attacker.country}
                      </div>
                      <div className="text-xs text-gray-500">
                        {attacker.code}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-gray-200">
                      {attacker.attacks}
                    </div>
                    <div className="text-xs text-gray-400">
                      {attacker.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Attack bar */}
                <div className="w-full bg-gray-700 rounded-full h-1 mb-1">
                  <div
                    className={`h-1 rounded-full ${
                      attacker.status === "high"
                        ? "bg-red-500"
                        : attacker.status === "medium"
                          ? "bg-orange-500"
                          : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min(attacker.percentage, 100)}%` }}
                  />
                </div>

                <div className="text-xs text-gray-400">
                  Target: {attacker.topTarget}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attack Types Distribution */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
            <Target className="h-4 w-4 text-gray-400" />
            Attack Types
          </h3>
          <div className="space-y-2">
            {normalizedAttackTypes.map((attack) => (
              <div key={attack.type} className="flex items-center gap-3">
                <div className="w-16 text-xs text-gray-300">{attack.type}</div>
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${attack.color}`}
                    style={{ width: `${Math.min(attack.percentage, 100)}%` }}
                  />
                </div>
                <div className="w-8 text-xs text-gray-400 text-right">
                  {attack.count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Performance */}
        <div className="pt-3 border-t border-gray-700">
          <h3 className="text-sm font-medium text-gray-300 mb-2">
            System Performance
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">CPU:</span>
              <span className="text-gray-300">
                {Math.floor(15 + Math.random() * 30)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Memory:</span>
              <span className="text-gray-300">
                {Math.floor(100 + Math.random() * 200)}MB
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Network:</span>
              <span className="text-green-400">Optimal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Uptime:</span>
              <span className="text-gray-300">
                {(99 + Math.random()).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
