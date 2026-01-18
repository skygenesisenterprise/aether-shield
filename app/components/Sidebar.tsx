"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  LayoutDashboard,
  Shield,
  Network,
  Settings,
  FileText,
  Lock,
  Activity,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  {
    title: "Home",
    href: "/home",
    icon: LayoutDashboard,
    order: 0,
    children: [
      { title: "Dashboard", href: "/home/dashboard" },
      { title: "License", href: "/home/license" },
      { title: "Password", href: "/home/password" },
    ],
  },
  {
    title: "System",
    href: "/system",
    icon: Settings,
    order: 1,
    children: [
      { title: "Access", href: "/system/access" },
      { title: "Configuration", href: "/system/config" },
      { title: "Gateways", href: "/system/gateways" },
      { title: "High Availability", href: "/system/high-availability" },
      { title: "Routes", href: "/system/routes" },
      { title: "Trust", href: "/system/trust" },
      { title: "Logs", href: "/system/logs" },
    ],
  },
  {
    title: "Interfaces",
    href: "/interfaces",
    icon: Network,
    order: 2,
    children: [
      { title: "Assignments", href: "/interfaces/assignements" },
      { title: "Devices", href: "/interfaces/devices" },
      { title: "Diagnostics", href: "/interfaces/diagnostics" },
      { title: "Neighbors", href: "/interfaces/neighbors" },
      { title: "Overview", href: "/interfaces/overview" },
      { title: "Settings", href: "/interfaces/settings" },
      { title: "Virtual IPs", href: "/interfaces/virtual-ips" },
      { title: "WAN", href: "/interfaces/wan" },
      { title: "Wireless", href: "/interfaces/wireless" },
    ],
  },
  {
    title: "Firewall",
    href: "/firewall",
    icon: Shield,
    order: 3,
    children: [
      { title: "Aliases", href: "/firewall/aliases" },
      { title: "Automation", href: "/firewall/automation" },
      { title: "Categories", href: "/firewall/categories" },
      { title: "Groups", href: "/firewall/groups" },
      { title: "NAT", href: "/firewall/nat" },
      { title: "Rules", href: "/firewall/rules" },
      { title: "Shaper", href: "/firewall/shaper" },
      { title: "Settings", href: "/firewall/settings" },
      { title: "Log", href: "/firewall/log" },
    ],
  },
  {
    title: "VPN",
    href: "/vpn",
    icon: Lock,
    order: 4,
    children: [
      { title: "IPsec", href: "/vpn/ipsec" },
      { title: "OpenVPN", href: "/vpn/openvpn" },
      { title: "WireGuard", href: "/vpn/wireguard" },
    ],
  },
  {
    title: "Services",
    href: "/services",
    icon: Activity,
    order: 5,
    children: [
      { title: "DHCP", href: "/services/dhcp" },
      { title: "DHCP Relay", href: "/services/dhcprelay" },
      { title: "DHCPv4", href: "/services/dhcpv4" },
      { title: "DHCPv6", href: "/services/dhcpv6" },
      { title: "DNS Forwarder", href: "/services/dnsmasq" },
      { title: "IDS", href: "/services/ids" },
      { title: "OpenDNS", href: "/services/opendns" },
      { title: "Unbound DNS", href: "/services/unbound_dns" },
    ],
  },
  {
    title: "Reports",
    href: "/report",
    icon: FileText,
    order: 6,
    children: [
      { title: "Health", href: "/report/health" },
      { title: "Insight", href: "/report/insight" },
      { title: "Netflow", href: "/report/netflow" },
      { title: "Settings", href: "/report/settings" },
      { title: "Traffic", href: "/report/traffic" },
      { title: "Unbound DNS", href: "/report/unbound-dns" },
    ],
  },
];

interface MenuItemProps {
  item: (typeof menuItems)[0];
  level?: number;
  pathname: string;
}

function MenuItem({ item, level = 0, pathname }: MenuItemProps) {
  // Check if current path is in children to auto-expand
  const shouldAutoExpand =
    item.children?.some(
      (child) =>
        pathname === child.href || pathname.startsWith(child.href + "/"),
    ) ?? false;

  const [isExpanded, setIsExpanded] = useState(shouldAutoExpand);
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + "/");
  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren) {
    return (
      <Collapsible
        open={isExpanded}
        onOpenChange={setIsExpanded}
        className="w-full"
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2 h-8 px-2 text-sm font-normal text-gray-700 hover:bg-gray-100",
              isActive && "bg-blue-50 text-blue-700 hover:bg-blue-100",
              level > 0 && "ml-4",
            )}
          >
            <item.icon className="h-4 w-4" />
            <span className="flex-1 text-left">{item.title}</span>
            {isExpanded ? (
              <ChevronDown className="h-3 w-3 transition-transform duration-200" />
            ) : (
              <ChevronRight className="h-3 w-3 transition-transform duration-200" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="overflow-hidden">
          <div className="mt-1 space-y-1">
            {item.children.map((child) => (
              <Button
                key={child.href}
                asChild
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 h-8 px-2 text-sm font-normal ml-6 text-gray-700 hover:bg-gray-100",
                  pathname === child.href &&
                    "bg-blue-50 text-blue-700 hover:bg-blue-100",
                )}
              >
                <Link href={child.href}>
                  <span className="w-2 h-2 bg-muted rounded-full" />
                  {child.title}
                </Link>
              </Button>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "w-full justify-start gap-2 h-8 px-2 text-sm font-normal text-gray-700 hover:bg-gray-100",
        isActive && "bg-blue-50 text-blue-700 hover:bg-blue-100",
        level > 0 && "ml-4",
      )}
    >
      <Link href={item.href}>
        <item.icon className="h-4 w-4" />
        {item.title}
      </Link>
    </Button>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex h-14 items-center border-b border-gray-200 px-4">
        <h1 className="text-lg font-semibold text-gray-900">Aether Shield</h1>
      </div>
      <nav className="flex-1 overflow-hidden p-2 space-y-1 hover:overflow-auto">
        {menuItems
          .sort((a, b) => a.order - b.order)
          .map((item) => (
            <MenuItem key={item.href} item={item} pathname={pathname} />
          ))}
      </nav>
    </div>
  );
}
