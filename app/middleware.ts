import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Liste des routes valides dans /app
const validRoutes = [
  "/",
  "/home/dashboard",
  "/home/license",
  "/home/password",
  "/login",
  "/login/options",
  "/install",
  "/get-cli",
  "/oauth/authorize",
  "/report/health",
  "/report/insight",
  "/report/netflow",
  "/report/traffic",
  "/report/unbound-dns",
  "/report/settings",
  // Firewall routes
  "/firewall/aliases",
  "/firewall/automation/filter",
  "/firewall/automation/source_nat",
  "/firewall/log/general",
  "/firewall/log/live",
  "/firewall/log/overview",
  "/firewall/log/plain_view",
  "/firewall/nat/nptv6",
  "/firewall/nat/one_to_one",
  "/firewall/nat/outbound",
  "/firewall/nat/port_froward",
  "/firewall/rules/floating",
  "/firewall/rules/wan",
  // Interfaces routes
  "/interfaces/assignements",
  "/interfaces/devices/bridges",
  "/interfaces/devices/gif",
  "/interfaces/devices/gre",
  "/interfaces/devices/lagg",
  "/interfaces/devices/loopback",
  "/interfaces/devices/point-to-point",
  "/interfaces/devices/vlan",
  "/interfaces/devices/vxlan",
  "/interfaces/diagnostics/arp-tables",
  "/interfaces/diagnostics/dns-lookup",
  "/interfaces/diagnostics/netstat",
  "/interfaces/diagnostics/packet_capture",
  "/interfaces/diagnostics/ping",
  "/interfaces/diagnostics/portprobe",
  "/interfaces/diagnostics/traceroute",
  "/interfaces/neighbors",
  "/interfaces/overview",
  "/interfaces/settings",
  "/interfaces/virtual-ips/settings",
  "/interfaces/virtual-ips/status",
  "/interfaces/wan",
  "/interfaces/wireless/devices",
  // System routes
  "/system/access/groups",
  "/system/access/privileges",
  "/system/access/servers",
  "/system/access/testers",
  "/system/access/users",
  "/system/firmware/changelog",
  "/system/firmware/packages",
  "/system/firmware/plugins",
  "/system/firmware/settings",
  "/system/firmware/status",
  "/system/firmware/updates",
  "/system/gateways/configs",
  "/system/gateways/groups",
  "/system/gateways/log",
  "/system/high-availability/settings",
  "/system/high-availability/status",
  "/system/logs/backend",
  "/system/routes/configs",
  "/system/routes/log",
  "/system/routes/status",
  "/system/settings/admin",
  "/system/settings/cron",
  "/system/settings/general",
  "/system/settings/logging",
  "/system/settings/miscellaneous",
  "/system/settings/tunables",
  "/system/trust/authorities",
  "/system/trust/certs",
  "/system/trust/revocation",
  "/system/trust/settings",
  // VPN routes
  "/vpn/ipsec/leases",
  "/vpn/ipsec/log",
  "/vpn/ipsec/sad",
  "/vpn/ipsec/spd",
  "/vpn/ipsec/vti",
  "/vpn/openvpn/client_overwrites",
  "/vpn/openvpn/export",
  "/vpn/openvpn/instances",
  "/vpn/openvpn/log",
  "/vpn/openvpn/status",
  "/vpn/wireguard/instances",
  "/vpn/wireguard/log",
  "/vpn/wireguard/peer_generator",
  "/vpn/wireguard/peers",
  "/vpn/wireguard/status",
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Si la route demandée n'existe pas dans /app, afficher /app/not-found
  if (
    !pathname.startsWith("/app/not-found") &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next") &&
    !pathname.includes(".")
  ) {
    // Vérifier si la route est dans notre liste de routes valides
    if (!validRoutes.includes(pathname)) {
      // Réécrire l'URL pour afficher la page not-found tout en gardant l'URL originale
      return NextResponse.rewrite(new URL("/app/not-found", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - app/not-found (pour éviter la boucle de réécriture)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|app/not-found).*)",
  ],
};
