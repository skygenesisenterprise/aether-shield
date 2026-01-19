# API Routes Documentation

This document describes all the API routes defined in the Aether Shield server application. The routes are organized into logical groups and include HTTP methods, middleware, and controller actions.

## Base URL

All routes are prefixed with `/api/v1`

## Authentication Routes (`/auth`)

| Method | Endpoint                | Description            | Authentication |
| ------ | ----------------------- | ---------------------- | -------------- |
| POST   | `/auth/login`           | User login             | ❌             |
| POST   | `/auth/logout`          | User logout            | ❌             |
| POST   | `/auth/refresh`         | Refresh access token   | ❌             |
| GET    | `/auth/me`              | Get current user info  | ✅             |
| POST   | `/auth/forgot-password` | Request password reset | ❌             |
| POST   | `/auth/reset-password`  | Reset password         | ❌             |
| GET    | `/auth/oauth/authorize` | OAuth authorization    | ❌             |

## Home Dashboard Routes (`/home`)

All home routes require authentication and apply rate limiting and CORS middleware.

| Method | Endpoint                          | Description              |
| ------ | --------------------------------- | ------------------------ |
| GET    | `/home/dashboard/system-info`     | Get system information   |
| GET    | `/home/dashboard/cpu-info`        | Get CPU information      |
| GET    | `/home/dashboard/memory-info`     | Get memory information   |
| GET    | `/home/dashboard/disk-info`       | Get disk information     |
| GET    | `/home/dashboard/interface-stats` | Get interface statistics |
| GET    | `/home/dashboard/firewall-info`   | Get firewall information |
| GET    | `/home/dashboard/services`        | Get services status      |
| GET    | `/home/dashboard/announcements`   | Get announcements        |
| GET    | `/home/dashboard/traffic-data`    | Get traffic data         |
| GET    | `/home/license/info`              | Get license information  |
| PUT    | `/home/password/change`           | Change user password     |

## System Management Routes (`/system`)

All system routes require authentication and system access validation.

### Access Management (`/system/access`)

| Method | Endpoint                    | Description     |
| ------ | --------------------------- | --------------- |
| GET    | `/system/access/users`      | List users      |
| POST   | `/system/access/users`      | Create user     |
| PUT    | `/system/access/users/:id`  | Update user     |
| DELETE | `/system/access/users/:id`  | Delete user     |
| GET    | `/system/access/groups`     | List groups     |
| POST   | `/system/access/groups`     | Create group    |
| PUT    | `/system/access/groups/:id` | Update group    |
| DELETE | `/system/access/groups/:id` | Delete group    |
| GET    | `/system/access/privileges` | List privileges |
| GET    | `/system/access/servers`    | List servers    |
| GET    | `/system/access/testers`    | List testers    |

### Configuration (`/system/config`)

| Method | Endpoint                 | Description               |
| ------ | ------------------------ | ------------------------- |
| GET    | `/system/config/backup`  | Get backup configuration  |
| POST   | `/system/config/backup`  | Create backup             |
| GET    | `/system/config/default` | Get default configuration |
| GET    | `/system/config/history` | Get configuration history |
| GET    | `/system/config/wizard`  | Get configuration wizard  |

### Diagnostics (`/system/diagnostics`)

| Method | Endpoint                         | Description           |
| ------ | -------------------------------- | --------------------- |
| GET    | `/system/diagnostics/activity`   | Get system activity   |
| GET    | `/system/diagnostics/services`   | Get system services   |
| GET    | `/system/diagnostics/statistics` | Get system statistics |

### Firmware (`/system/firmware`)

| Method | Endpoint                     | Description            |
| ------ | ---------------------------- | ---------------------- |
| GET    | `/system/firmware/changelog` | Get firmware changelog |
| GET    | `/system/firmware/packages`  | Get firmware packages  |
| GET    | `/system/firmware/plugins`   | Get firmware plugins   |
| GET    | `/system/firmware/settings`  | Get firmware settings  |
| GET    | `/system/firmware/status`    | Get firmware status    |
| POST   | `/system/firmware/updates`   | Check for updates      |

### Gateways (`/system/gateways`)

| Method | Endpoint                   | Description                |
| ------ | -------------------------- | -------------------------- |
| GET    | `/system/gateways/configs` | Get gateway configurations |
| GET    | `/system/gateways/groups`  | Get gateway groups         |
| GET    | `/system/gateways/log`     | Get gateway log            |

### High Availability (`/system/high-availability`)

| Method | Endpoint                             | Description        |
| ------ | ------------------------------------ | ------------------ |
| GET    | `/system/high-availability/status`   | Get HA status      |
| GET    | `/system/high-availability/settings` | Get HA settings    |
| PUT    | `/system/high-availability/settings` | Update HA settings |

### Routes (`/system/routes`)

| Method | Endpoint                 | Description              |
| ------ | ------------------------ | ------------------------ |
| GET    | `/system/routes/configs` | Get route configurations |
| GET    | `/system/routes/log`     | Get route log            |
| GET    | `/system/routes/status`  | Get route status         |

### Settings (`/system/settings`)

| Method | Endpoint                         | Description                   |
| ------ | -------------------------------- | ----------------------------- |
| GET    | `/system/settings/admin`         | Get admin settings            |
| PUT    | `/system/settings/admin`         | Update admin settings         |
| GET    | `/system/settings/cron`          | Get cron settings             |
| PUT    | `/system/settings/cron`          | Update cron settings          |
| GET    | `/system/settings/general`       | Get general settings          |
| PUT    | `/system/settings/general`       | Update general settings       |
| GET    | `/system/settings/logging`       | Get logging settings          |
| PUT    | `/system/settings/logging`       | Update logging settings       |
| GET    | `/system/settings/miscellaneous` | Get miscellaneous settings    |
| PUT    | `/system/settings/miscellaneous` | Update miscellaneous settings |
| GET    | `/system/settings/tunables`      | Get tunables                  |
| PUT    | `/system/settings/tunables`      | Update tunables               |

### Trust & Certificates (`/system/trust`)

| Method | Endpoint                     | Description                  |
| ------ | ---------------------------- | ---------------------------- |
| GET    | `/system/trust/authorities`  | Get certificate authorities  |
| POST   | `/system/trust/authorities`  | Create certificate authority |
| GET    | `/system/trust/certificates` | Get certificates             |
| POST   | `/system/trust/certificates` | Create certificate           |
| GET    | `/system/trust/revocation`   | Get revocation list          |
| GET    | `/system/trust/settings`     | Get trust settings           |

## Interface Management Routes (`/interfaces`)

All interface routes require authentication and interface access validation.

### Basic Interface Operations

| Method | Endpoint                             | Description                  |
| ------ | ------------------------------------ | ---------------------------- |
| GET    | `/interfaces/assignments`            | Get interface assignments    |
| PUT    | `/interfaces/assignments`            | Update interface assignments |
| GET    | `/interfaces/devices`                | Get interface devices        |
| GET    | `/interfaces/devices/gif`            | Get GIF devices              |
| GET    | `/interfaces/devices/gre`            | Get GRE devices              |
| GET    | `/interfaces/devices/lagg`           | Get LAGG devices             |
| GET    | `/interfaces/devices/vlan`           | Get VLAN devices             |
| GET    | `/interfaces/devices/vxlan`          | Get VXLAN devices            |
| GET    | `/interfaces/devices/loopback`       | Get loopback devices         |
| GET    | `/interfaces/devices/point-to-point` | Get point-to-point devices   |
| GET    | `/interfaces/devices/bridges`        | Get bridge devices           |

### Interface Diagnostics (`/interfaces/diagnostics`)

| Method | Endpoint                                 | Description                      |
| ------ | ---------------------------------------- | -------------------------------- |
| GET    | `/interfaces/diagnostics/ping`           | Get ping configuration           |
| POST   | `/interfaces/diagnostics/ping`           | Execute ping                     |
| GET    | `/interfaces/diagnostics/traceroute`     | Get traceroute configuration     |
| POST   | `/interfaces/diagnostics/traceroute`     | Execute traceroute               |
| GET    | `/interfaces/diagnostics/netstat`        | Get netstat information          |
| GET    | `/interfaces/diagnostics/dns-lookup`     | Get DNS lookup configuration     |
| POST   | `/interfaces/diagnostics/dns-lookup`     | Execute DNS lookup               |
| GET    | `/interfaces/diagnostics/packet-capture` | Get packet capture configuration |
| POST   | `/interfaces/diagnostics/packet-capture` | Execute packet capture           |
| GET    | `/interfaces/diagnostics/arp-tables`     | Get ARP tables                   |
| GET    | `/interfaces/diagnostics/portprobe`      | Get port probe configuration     |
| POST   | `/interfaces/diagnostics/portprobe`      | Execute port probe               |

### Additional Interface Operations

| Method | Endpoint                | Description               |
| ------ | ----------------------- | ------------------------- |
| GET    | `/interfaces/neighbors` | Get interface neighbors   |
| GET    | `/interfaces/overview`  | Get interface overview    |
| GET    | `/interfaces/settings`  | Get interface settings    |
| PUT    | `/interfaces/settings`  | Update interface settings |

### Virtual IPs (`/interfaces/virtual-ips`)

| Method | Endpoint                           | Description                |
| ------ | ---------------------------------- | -------------------------- |
| GET    | `/interfaces/virtual-ips/status`   | Get virtual IP status      |
| GET    | `/interfaces/virtual-ips/settings` | Get virtual IP settings    |
| PUT    | `/interfaces/virtual-ips/settings` | Update virtual IP settings |

### Other Interface Routes

| Method | Endpoint                       | Description              |
| ------ | ------------------------------ | ------------------------ |
| GET    | `/interfaces/wan`              | Get WAN configuration    |
| PUT    | `/interfaces/wan`              | Update WAN configuration |
| GET    | `/interfaces/wireless/devices` | Get wireless devices     |

## Firewall Management Routes (`/firewall`)

All firewall routes require authentication and firewall access validation.

### Rules Management (`/firewall/rules`)

| Method | Endpoint                   | Description        |
| ------ | -------------------------- | ------------------ |
| GET    | `/firewall/rules/wan`      | Get WAN rules      |
| GET    | `/firewall/rules/floating` | Get floating rules |
| POST   | `/firewall/rules`          | Create rule        |
| PUT    | `/firewall/rules/:id`      | Update rule        |
| DELETE | `/firewall/rules/:id`      | Delete rule        |

### Aliases & Categories

| Method | Endpoint                | Description    |
| ------ | ----------------------- | -------------- |
| GET    | `/firewall/aliases`     | Get aliases    |
| POST   | `/firewall/aliases`     | Create alias   |
| PUT    | `/firewall/aliases/:id` | Update alias   |
| DELETE | `/firewall/aliases/:id` | Delete alias   |
| GET    | `/firewall/categories`  | Get categories |
| GET    | `/firewall/groups`      | Get groups     |

### Automation (`/firewall/automation`)

| Method | Endpoint                          | Description               |
| ------ | --------------------------------- | ------------------------- |
| GET    | `/firewall/automation/filter`     | Get automation filter     |
| GET    | `/firewall/automation/source-nat` | Get automation source NAT |

### NAT (`/firewall/nat`)

| Method | Endpoint                     | Description            |
| ------ | ---------------------------- | ---------------------- |
| GET    | `/firewall/nat/one-to-one`   | Get one-to-one NAT     |
| GET    | `/firewall/nat/outbound`     | Get outbound NAT       |
| GET    | `/firewall/nat/port-forward` | Get port forward rules |
| GET    | `/firewall/nat/nptv6`        | Get NPTv6 NAT          |

### Traffic Shaping (`/firewall/shaper`)

| Method | Endpoint                  | Description                |
| ------ | ------------------------- | -------------------------- |
| GET    | `/firewall/shaper/queues` | Get traffic shaping queues |
| GET    | `/firewall/shaper/rules`  | Get traffic shaping rules  |
| GET    | `/firewall/shaper/pipes`  | Get traffic shaping pipes  |
| GET    | `/firewall/shaper/status` | Get traffic shaping status |

### Settings (`/firewall/settings`)

| Method | Endpoint                           | Description                   |
| ------ | ---------------------------------- | ----------------------------- |
| GET    | `/firewall/settings/advanced`      | Get advanced settings         |
| PUT    | `/firewall/settings/advanced`      | Update advanced settings      |
| GET    | `/firewall/settings/normalization` | Get normalization settings    |
| PUT    | `/firewall/settings/normalization` | Update normalization settings |
| GET    | `/firewall/settings/schedules`     | Get schedules                 |
| PUT    | `/firewall/settings/schedules`     | Update schedules              |

### Logs (`/firewall/log`)

| Method | Endpoint                   | Description        |
| ------ | -------------------------- | ------------------ |
| GET    | `/firewall/log/general`    | Get general log    |
| GET    | `/firewall/log/live`       | Get live log       |
| GET    | `/firewall/log/overview`   | Get log overview   |
| GET    | `/firewall/log/plain-view` | Get plain view log |

### Diagnostics (`/firewall/diagnostics`)

| Method | Endpoint                           | Description             |
| ------ | ---------------------------------- | ----------------------- |
| GET    | `/firewall/diagnostics/statistics` | Get firewall statistics |
| GET    | `/firewall/diagnostics/states`     | Get firewall states     |
| GET    | `/firewall/diagnostics/aliases`    | Get alias diagnostics   |
| GET    | `/firewall/diagnostics/sessions`   | Get firewall sessions   |

## VPN Management Routes (`/vpn`)

All VPN routes require authentication and VPN access validation.

### OpenVPN (`/vpn/openvpn`)

| Method | Endpoint                         | Description                   |
| ------ | -------------------------------- | ----------------------------- |
| GET    | `/vpn/openvpn/instances`         | Get OpenVPN instances         |
| POST   | `/vpn/openvpn/instances`         | Create OpenVPN instance       |
| PUT    | `/vpn/openvpn/instances/:id`     | Update OpenVPN instance       |
| DELETE | `/vpn/openvpn/instances/:id`     | Delete OpenVPN instance       |
| GET    | `/vpn/openvpn/status`            | Get OpenVPN status            |
| GET    | `/vpn/openvpn/log`               | Get OpenVPN log               |
| GET    | `/vpn/openvpn/export`            | Export OpenVPN configuration  |
| GET    | `/vpn/openvpn/client-overwrites` | Get OpenVPN client overwrites |

### WireGuard (`/vpn/wireguard`)

| Method | Endpoint                        | Description                  |
| ------ | ------------------------------- | ---------------------------- |
| GET    | `/vpn/wireguard/instances`      | Get WireGuard instances      |
| POST   | `/vpn/wireguard/instances`      | Create WireGuard instance    |
| PUT    | `/vpn/wireguard/instances/:id`  | Update WireGuard instance    |
| DELETE | `/vpn/wireguard/instances/:id`  | Delete WireGuard instance    |
| GET    | `/vpn/wireguard/status`         | Get WireGuard status         |
| GET    | `/vpn/wireguard/log`            | Get WireGuard log            |
| GET    | `/vpn/wireguard/peers`          | Get WireGuard peers          |
| POST   | `/vpn/wireguard/peers`          | Create WireGuard peer        |
| PUT    | `/vpn/wireguard/peers/:id`      | Update WireGuard peer        |
| DELETE | `/vpn/wireguard/peers/:id`      | Delete WireGuard peer        |
| GET    | `/vpn/wireguard/peer-generator` | Get WireGuard peer generator |

### IPsec (`/vpn/ipsec`)

| Method | Endpoint                     | Description                             |
| ------ | ---------------------------- | --------------------------------------- |
| GET    | `/vpn/ipsec/connections`     | Get IPsec connections                   |
| GET    | `/vpn/ipsec/sessions`        | Get IPsec sessions                      |
| GET    | `/vpn/ipsec/settings`        | Get IPsec settings                      |
| PUT    | `/vpn/ipsec/settings`        | Update IPsec settings                   |
| GET    | `/vpn/ipsec/pre-shared-keys` | Get IPsec pre-shared keys               |
| GET    | `/vpn/ipsec/key-pairs`       | Get IPsec key pairs                     |
| GET    | `/vpn/ipsec/sad`             | Get IPsec Security Association Database |
| GET    | `/vpn/ipsec/spd`             | Get IPsec Security Policy Database      |
| GET    | `/vpn/ipsec/vti`             | Get IPsec Virtual Tunnel Interface      |
| GET    | `/vpn/ipsec/leases`          | Get IPsec leases                        |
| GET    | `/vpn/ipsec/log`             | Get IPsec log                           |

## Services Management Routes (`/services`)

All services routes require authentication and services access validation.

### DHCP Services (`/services/dhcp`)

| Method | Endpoint                 | Description              |
| ------ | ------------------------ | ------------------------ |
| GET    | `/services/dhcp/v4`      | Get DHCPv4 configuration |
| GET    | `/services/dhcp/log`     | Get DHCP log             |
| GET    | `/services/dhcp/leases6` | Get DHCPv6 leases        |
| GET    | `/services/dhcp/status`  | Get DHCP status          |

### DHCP Relay (`/services/dhcprelay`)

| Method | Endpoint                      | Description                   |
| ------ | ----------------------------- | ----------------------------- |
| GET    | `/services/dhcprelay/configs` | Get DHCP relay configurations |
| GET    | `/services/dhcprelay/log`     | Get DHCP relay log            |

### DHCPv4 Static (`/services/dhcpv4`)

| Method | Endpoint                      | Description                  |
| ------ | ----------------------------- | ---------------------------- |
| GET    | `/services/dhcpv4/leases`     | Get DHCPv4 leases            |
| GET    | `/services/dhcpv4/log`        | Get DHCPv4 log               |
| GET    | `/services/dhcpv4/static`     | Get DHCPv4 static mappings   |
| POST   | `/services/dhcpv4/static`     | Create DHCPv4 static mapping |
| PUT    | `/services/dhcpv4/static/:id` | Update DHCPv4 static mapping |
| DELETE | `/services/dhcpv4/static/:id` | Delete DHCPv4 static mapping |

### DNS Services (`/services/unbound-dns`)

| Method | Endpoint                           | Description                 |
| ------ | ---------------------------------- | --------------------------- |
| GET    | `/services/unbound-dns/statistics` | Get Unbound DNS statistics  |
| GET    | `/services/unbound-dns/blocklist`  | Get Unbound DNS blocklist   |
| GET    | `/services/unbound-dns/settings`   | Get Unbound DNS settings    |
| PUT    | `/services/unbound-dns/settings`   | Update Unbound DNS settings |

### Other DNS Services

| Method | Endpoint            | Description               |
| ------ | ------------------- | ------------------------- |
| GET    | `/services/opendns` | Get OpenDNS configuration |

### Monitoring Services (`/services/monit`)

| Method | Endpoint                   | Description           |
| ------ | -------------------------- | --------------------- |
| GET    | `/services/monit/status`   | Get Monit status      |
| GET    | `/services/monit/log`      | Get Monit log         |
| GET    | `/services/monit/settings` | Get Monit settings    |
| PUT    | `/services/monit/settings` | Update Monit settings |

### Network Services (`/services/network`)

| Method | Endpoint                   | Description        |
| ------ | -------------------------- | ------------------ |
| GET    | `/services/network/log`    | Get network log    |
| GET    | `/services/network/status` | Get network status |

### Additional Services

| Method | Endpoint                  | Description       |
| ------ | ------------------------- | ----------------- |
| GET    | `/services/ntp/status`    | Get NTP status    |
| GET    | `/services/snmp/status`   | Get SNMP status   |
| GET    | `/services/syslog/status` | Get Syslog status |

## Middleware

### Global Middleware

- **AuthMiddleware**: `RequireAuth()` - Validates JWT tokens for protected routes
- **Rate Limiting**: Applied to home routes for rate limiting
- **CORS**: Applied to home routes for cross-origin requests

### Route-Specific Middleware

- **HomeMiddleware**: Rate limiting, CORS, and JSON validation for home routes
- **SystemMiddleware**: System access validation and JSON validation
- **InterfaceMiddleware**: Interface access validation and JSON validation
- **FirewallMiddleware**: Firewall access validation and JSON validation
- **VPNMiddleware**: VPN access validation and JSON validation
- **ServicesMiddleware**: Services access validation and JSON validation

## Controllers

The routes are handled by the following controllers:

- **AuthController**: Handles authentication and authorization
- **HomeController**: Manages dashboard and home functionality
- **SystemController**: Manages system configuration and administration
- **InterfaceController**: Handles network interface management
- **FirewallController**: Manages firewall rules and settings
- **VPNController**: Handles VPN configurations and management
- **ServicesController**: Manages network services

## Error Handling

All routes return appropriate HTTP status codes:

- `200 OK`: Successful GET requests
- `201 Created`: Successful POST requests
- `204 No Content`: Successful DELETE requests
- `400 Bad Request`: Invalid request body
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Implementation Details

- **Framework**: Built with Gin web framework
- **Authentication**: JWT-based authentication
- **Validation**: JSON schema validation for POST/PUT requests
- **Rate Limiting**: Applied to protect against abuse
- **Logging**: Comprehensive logging for debugging and monitoring
