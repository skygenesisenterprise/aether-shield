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
  LucideIcon,
  Users,
  Key,
  Server,
  FlaskConical,
  Archive,
  Clock,
  Package,
  Puzzle,
  Cog,
  Wifi,
  Router,
  Heart,
  BarChart3,
  List,
  FileText as FileLog,
  Camera,
  Timer,
  ShieldCheck,
  Award as Certificate,
  Ban,
} from "lucide-react";
import { useState } from "react";

interface ChildMenuItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  children?: ChildMenuItem[];
}

interface MenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
  order: number;
  children?: ChildMenuItem[];
}

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
      {
        title: "Access",
        href: "/system/access",
        icon: Users,
        children: [
          { title: "Groups", href: "/system/access/groups" },
          { title: "Privileges", href: "/system/access/privileges" },
          { title: "Servers", href: "/system/access/servers" },
          { title: "Testers", href: "/system/access/testers" },
          { title: "Users", href: "/system/access/users" },
        ],
      },
      {
        title: "Configuration",
        href: "/system/config",
        icon: Cog,
        children: [
          { title: "Backup", href: "/system/config/backup" },
          { title: "Default", href: "/system/config/default" },
          { title: "History", href: "/system/config/history" },
          { title: "Wizard", href: "/system/config/wizard" },
        ],
      },
      {
        title: "Diagnostics",
        href: "/system/diagnostics",
        icon: Activity,
        children: [
          { title: "Activity", href: "/system/diagnostics/activity" },
          { title: "Services", href: "/system/diagnostics/services" },
          { title: "Statistics", href: "/system/diagnostics/statistics" },
        ],
      },
      {
        title: "Firmware",
        href: "/system/firmware",
        icon: Package,
        children: [
          { title: "Changelog", href: "/system/firmware/changelog" },
          { title: "Packages", href: "/system/firmware/packages" },
          { title: "Plugins", href: "/system/firmware/plugins" },
          { title: "Settings", href: "/system/firmware/settings" },
          { title: "Status", href: "/system/firmware/status" },
          { title: "Updates", href: "/system/firmware/updates" },
        ],
      },
      {
        title: "Gateways",
        href: "/system/gateways",
        icon: Router,
        children: [
          { title: "Configs", href: "/system/gateways/configs" },
          { title: "Groups", href: "/system/gateways/groups" },
          { title: "Log", href: "/system/gateways/log" },
        ],
      },
      {
        title: "High Availability",
        href: "/system/high-availability",
        icon: Heart,
        children: [
          { title: "Settings", href: "/system/high-availability/settings" },
          { title: "Status", href: "/system/high-availability/status" },
        ],
      },
      { title: "Logs", href: "/system/logs", icon: FileLog },
      {
        title: "Routes",
        href: "/system/routes",
        icon: List,
        children: [
          { title: "Configs", href: "/system/routes/configs" },
          { title: "Log", href: "/system/routes/log" },
          { title: "Status", href: "/system/routes/status" },
        ],
      },
      {
        title: "Settings",
        href: "/system/settings",
        icon: Settings,
        children: [
          { title: "Admin", href: "/system/settings/admin" },
          { title: "Cron", href: "/system/settings/cron" },
          { title: "General", href: "/system/settings/general" },
          { title: "Logging", href: "/system/settings/logging" },
          { title: "Miscellaneous", href: "/system/settings/miscellaneous" },
          { title: "Tunables", href: "/system/settings/tunables" },
        ],
      },
      { title: "Snapshots", href: "/system/snapshots", icon: Camera },
      {
        title: "Trust",
        href: "/system/trust",
        icon: ShieldCheck,
        children: [
          { title: "Authorities", href: "/system/trust/authorities" },
          { title: "Certificates", href: "/system/trust/certs" },
          { title: "Revocation", href: "/system/trust/revocation" },
          { title: "Settings", href: "/system/trust/settings" },
        ],
      },
    ],
  },
  {
    title: "Interfaces",
    href: "/interfaces",
    icon: Network,
    order: 2,
    children: [
      { title: "Assignments", href: "/interfaces/assignments" },
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
  item: MenuItem;
  level?: number;
  pathname: string;
  expandedItems: Set<string>;
  toggleExpanded: (item: string) => void;
}

function renderMenuItem(
  item: ChildMenuItem,
  level: number,
  pathname: string,
  expandedItems: Set<string>,
  toggleExpanded: (item: string) => void,
): React.ReactElement {
  // Check if current path is in children (recursive) to auto-expand
  const hasActiveChild = (children: ChildMenuItem[]): boolean => {
    return (
      children?.some((child) => {
        const isChildActive =
          pathname === child.href || pathname.startsWith(child.href + "/");
        const hasActiveGrandChildren = child.children
          ? hasActiveChild(child.children)
          : false;
        return isChildActive || hasActiveGrandChildren;
      }) ?? false
    );
  };

  const isExpanded =
    expandedItems.has(item.href) ||
    (hasActiveChild(item.children || []) && !expandedItems.has(item.href));
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + "/");
  const hasChildren = item.children && item.children.length > 0;

  const marginLeft = level * 12; // 12px per level

  if (hasChildren) {
    return (
      <Collapsible
        key={item.href}
        open={isExpanded}
        onOpenChange={() => toggleExpanded(item.href)}
        className="w-full"
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-between h-6 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide hover:bg-gray-100",
              isActive && "text-blue-600 hover:bg-blue-50",
            )}
            style={{ marginLeft: `${marginLeft}px` }}
          >
            <span className="text-left truncate max-w-[100px]">
              {item.title}
            </span>
            {item.icon && <item.icon className="h-3 w-3 shrink-0" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <div className="space-y-1">
            {item.children?.map((child) =>
              renderMenuItem(
                child,
                level + 1,
                pathname,
                expandedItems,
                toggleExpanded,
              ),
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Button
      key={item.href}
      asChild
      variant="ghost"
      className={cn(
        "w-full justify-between h-8 px-2 text-sm font-normal text-gray-700 hover:bg-gray-100",
        isActive && "bg-blue-50 text-blue-700 hover:bg-blue-100",
      )}
      style={{ marginLeft: `${marginLeft}px` }}
    >
      <Link
        href={item.href}
        className="flex justify-between items-center w-full"
      >
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-gray-400 rounded-full shrink-0" />
          <span className="truncate max-w-[100px]">{item.title}</span>
        </span>
        {item.icon && <item.icon className="h-3 w-3 shrink-0" />}
      </Link>
    </Button>
  );
}

function MenuItem({
  item,
  level = 0,
  pathname,
  expandedItems,
  toggleExpanded,
}: MenuItemProps) {
  // Check if current path is in children (recursive) to auto-expand
  const hasActiveChild = (children: ChildMenuItem[]): boolean => {
    return (
      children?.some((child) => {
        const isChildActive =
          pathname === child.href || pathname.startsWith(child.href + "/");
        const hasActiveGrandChildren = child.children
          ? hasActiveChild(child.children)
          : false;
        return isChildActive || hasActiveGrandChildren;
      }) ?? false
    );
  };

  const isExpanded =
    expandedItems.has(item.href) ||
    (hasActiveChild(item.children || []) && !expandedItems.has(item.href));
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + "/");
  const hasChildren = item.children && item.children.length > 0;

  const marginLeft = level * 12; // 12px per level

  if (hasChildren) {
    return (
      <Collapsible
        open={isExpanded}
        onOpenChange={() => toggleExpanded(item.href)}
        className="w-full"
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2 h-8 px-2 text-sm font-normal text-gray-700 hover:bg-gray-100",
              isActive && "bg-blue-50 text-blue-700 hover:bg-blue-100",
            )}
            style={{ marginLeft: `${marginLeft}px` }}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left truncate max-w-[120px]">
              {item.title}
            </span>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <div className="mt-1 space-y-1">
            {item.children?.map((child) =>
              renderMenuItem(
                child,
                level + 1,
                pathname,
                expandedItems,
                toggleExpanded,
              ),
            )}
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
      )}
      style={{ marginLeft: `${marginLeft}px` }}
    >
      <Link href={item.href}>
        {level > 0 ? (
          <span className="w-2 h-2 bg-gray-400 rounded-full shrink-0" />
        ) : (
          <item.icon className="h-4 w-4 shrink-0" />
        )}
        <span className="truncate max-w-[100px]">{item.title}</span>
      </Link>
    </Button>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (item: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(item)) {
        newSet.delete(item);
      } else {
        newSet.add(item);
      }
      return newSet;
    });
  };

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex h-14 items-center border-b border-gray-200 px-4">
        <h1 className="text-lg font-semibold text-gray-900">Aether Shield</h1>
      </div>
      <nav className="flex-1 overflow-hidden p-2 space-y-1 hover:overflow-auto">
        {menuItems
          .sort((a, b) => a.order - b.order)
          .map((item) => (
            <MenuItem
              key={item.href}
              item={item}
              pathname={pathname}
              expandedItems={expandedItems}
              toggleExpanded={toggleExpanded}
            />
          ))}
      </nav>
    </div>
  );
}
