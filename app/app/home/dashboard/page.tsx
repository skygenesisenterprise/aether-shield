"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Network,
  AlertTriangle,
  Bot,
  Activity,
  Lock,
  Unlock,
  Eye,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  Wifi,
  WifiOff,
  Globe,
  Server,
  Cpu,
  Zap,
  BarChart3,
  Bell,
  Settings,
  ChevronRight,
  AlertCircle,
  Info,
} from "lucide-react";

interface SecurityStatus {
  level: "secure" | "warning" | "critical";
  score: number;
  threats: number;
  blocked: number;
}

interface NetworkStatus {
  status: "online" | "offline" | "degraded";
  uptime: string;
  bandwidth: {
    used: number;
    total: number;
  };
  connections: {
    active: number;
    total: number;
  };
}

interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  description: string;
  time: string;
  source: string;
}

export default function Dashboard() {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    level: "secure",
    score: 94,
    threats: 0,
    blocked: 127,
  });

  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    status: "online",
    uptime: "15d 7h 32m",
    bandwidth: { used: 245, total: 1000 },
    connections: { active: 42, total: 256 },
  });

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "warning",
      title: "Trafic inhabituel détecté",
      description: "Pic de trafic sur le port 443 depuis une IP inhabituelle",
      time: "Il y a 2 min",
      source: "Firewall",
    },
    {
      id: "2",
      type: "info",
      title: "Mise à jour disponible",
      description: "Aether Shield 24.1.1 est prêt à être installé",
      time: "Il y a 15 min",
      source: "System",
    },
  ]);

  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

  useEffect(() => {
    // Simuler les mises à jour en temps réel
    const interval = setInterval(() => {
      setSecurityStatus((prev) => ({
        ...prev,
        blocked: prev.blocked + Math.floor(Math.random() * 3),
        score: Math.max(85, prev.score + (Math.random() - 0.5) * 2),
      }));

      setNetworkStatus((prev) => ({
        ...prev,
        bandwidth: {
          ...prev.bandwidth,
          used: Math.min(950, prev.bandwidth.used + (Math.random() - 0.5) * 10),
        },
        connections: {
          ...prev.connections,
          active: Math.max(
            20,
            prev.connections.active + Math.floor(Math.random() * 5) - 2,
          ),
        },
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getSecurityColor = (level: string) => {
    switch (level) {
      case "secure":
        return "text-green-600 bg-green-50 border-green-200";
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getNetworkColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-600";
      case "degraded":
        return "text-yellow-600";
      case "offline":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-600" />;
      default:
        return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Aether Shield
              </h1>
              <p className="text-slate-600 mt-1">
                Poste de commandement central
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:border-slate-300"
              >
                <Settings className="h-4 w-4 mr-2" />
                Configuration
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:border-slate-300"
              >
                <Bell className="h-4 w-4 mr-2" />
                Alertes
              </Button>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Security Status */}
          <Card className="lg:col-span-1 bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                  <div className="p-2 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  État de sécurité
                </CardTitle>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${getSecurityColor(securityStatus.level)}`}
                >
                  {securityStatus.level === "secure"
                    ? "Sécurisé"
                    : securityStatus.level === "warning"
                      ? "Attention"
                      : "Critique"}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    {securityStatus.score}%
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    Score de sécurité
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-green-50/50 to-emerald-50/30 rounded-xl border border-green-100/50">
                    <div className="text-3xl font-bold text-green-600">
                      {securityStatus.blocked}
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      Menaces bloquées
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-red-50/50 to-rose-50/30 rounded-xl border border-red-100/50">
                    <div className="text-3xl font-bold text-red-600">
                      {securityStatus.threats}
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      Menaces actives
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-slate-50/50 rounded-lg">
                    <span className="text-sm text-slate-700">Firewall</span>
                    <Lock className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50/50 rounded-lg">
                    <span className="text-sm text-slate-700">Antivirus</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50/50 rounded-lg">
                    <span className="text-sm text-slate-700">Intrusion</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Network Status */}
          <Card className="lg:col-span-1 bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                  <div className="p-2 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                    <Network className="h-5 w-5 text-blue-600" />
                  </div>
                  État réseau
                </CardTitle>
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${getNetworkColor(networkStatus.status)}`}
                >
                  {networkStatus.status === "online" ? (
                    <Wifi className="h-4 w-4" />
                  ) : (
                    <WifiOff className="h-4 w-4" />
                  )}
                  {networkStatus.status === "online"
                    ? "En ligne"
                    : networkStatus.status === "degraded"
                      ? "Dégradé"
                      : "Hors ligne"}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900">
                    {networkStatus.uptime}
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    Temps d'activité
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-700">Bande passante</span>
                      <span className="text-slate-900 font-medium">
                        {networkStatus.bandwidth.used} /{" "}
                        {networkStatus.bandwidth.total} Mbps
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                        style={{
                          width: `${(networkStatus.bandwidth.used / networkStatus.bandwidth.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-700">Connexions</span>
                      <span className="text-slate-900 font-medium">
                        {networkStatus.connections.active} /{" "}
                        {networkStatus.connections.total}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                        style={{
                          width: `${(networkStatus.connections.active / networkStatus.connections.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 p-2 bg-green-50/50 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-slate-700">Upload: 45 Mbps</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-blue-50/50 rounded-lg">
                    <TrendingDown className="h-4 w-4 text-blue-600" />
                    <span className="text-slate-700">Download: 245 Mbps</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Assistant */}
          <Card className="lg:col-span-1 bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                  <div className="p-2 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg">
                    <Bot className="h-5 w-5 text-purple-600" />
                  </div>
                  Assistant IA
                </CardTitle>
                <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse shadow-sm" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center p-6 bg-gradient-to-br from-purple-50/50 via-indigo-50/30 to-blue-50/20 rounded-xl border border-purple-100/50">
                  <Bot className="h-10 w-10 text-purple-600 mx-auto mb-3" />
                  <div className="text-base font-medium text-slate-900">
                    Aether IA
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    Votre assistant de sécurité
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full justify-start bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:border-slate-300"
                    onClick={() => setIsAiAssistantOpen(!isAiAssistantOpen)}
                  >
                    <Eye className="h-4 w-4 mr-3 text-purple-600" />
                    Analyse de sécurité
                  </Button>
                  <Button className="w-full justify-start bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:border-slate-300">
                    <Activity className="h-4 w-4 mr-3 text-purple-600" />
                    Optimisation réseau
                  </Button>
                  <Button className="w-full justify-start bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:border-slate-300">
                    <AlertCircle className="h-4 w-4 mr-3 text-purple-600" />
                    Diagnostic des menaces
                  </Button>
                </div>

                {isAiAssistantOpen && (
                  <div className="p-4 bg-gradient-to-br from-purple-50/30 to-indigo-50/20 rounded-xl border border-purple-100/50">
                    <div className="text-sm text-slate-700 mb-3 leading-relaxed">
                      💡 Analyse rapide : Votre système est sécurisé. Le trafic
                      réseau est normal. Aucune menace critique détectée.
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0"
                    >
                      Discussion complète
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Section */}
        <Card className="mb-8 bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                <div className="p-2 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                Alertes prioritaires
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:border-slate-300"
              >
                Voir toutes les alertes
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-4 p-4 bg-gradient-to-r from-slate-50/50 to-white/30 rounded-xl border border-slate-100/50 hover:from-slate-50/70 hover:to-white/50 transition-all"
                >
                  <div className="mt-1">{getAlertIcon(alert.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-slate-900">
                        {alert.title}
                      </div>
                      <div className="text-xs text-slate-500 bg-slate-100/50 px-2 py-1 rounded-full">
                        {alert.time}
                      </div>
                    </div>
                    <div className="text-sm text-slate-700 mb-2 leading-relaxed">
                      {alert.description}
                    </div>
                    <div className="text-xs text-slate-500 bg-slate-50/50 px-2 py-1 rounded inline-block">
                      Source: {alert.source}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-slate-900">Sécurité</div>
                <div className="text-sm text-slate-600">Gérer les règles</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                <Network className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-slate-900">Réseau</div>
                <div className="text-sm text-slate-600">Configuration</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl">
                <Server className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="font-medium text-slate-900">Système</div>
                <div className="text-sm text-slate-600">Monitoring</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="font-medium text-slate-900">Rapports</div>
                <div className="text-sm text-slate-600">Analytiques</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
