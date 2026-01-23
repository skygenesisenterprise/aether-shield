'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface IPAddress {
  id: string
  ip: string
  hostname: string
  macAddress: string
  status: 'assigned' | 'available' | 'reserved' | 'dhcp'
  rangeId: string
  interface: string
  description: string
  lastSeen: string
}

interface IPRange {
  id: string
  name: string
}

interface IPAddressTableProps {
  addresses: IPAddress[]
  ranges: IPRange[]
  searchTerm: string
  filterStatus: 'all' | 'assigned' | 'available' | 'reserved' | 'dhcp'
}

export function IPAddressTable({
  addresses,
  ranges,
  searchTerm,
  filterStatus,
}: IPAddressTableProps) {
  const filteredAddresses = addresses.filter((ip) => {
    const matchesSearch = ip.ip.includes(searchTerm) || ip.hostname.includes(searchTerm) || ip.macAddress.includes(searchTerm)
    const matchesFilter = filterStatus === 'all' || ip.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>IP Address</TableHead>
          <TableHead>Hostname</TableHead>
          <TableHead>MAC Address</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Interface</TableHead>
          <TableHead>Range</TableHead>
          <TableHead>Last Seen</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredAddresses.map((ip) => (
          <TableRow key={ip.id}>
            <TableCell>{ip.ip}</TableCell>
            <TableCell>{ip.hostname}</TableCell>
            <TableCell>{ip.macAddress || 'N/A'}</TableCell>
            <TableCell>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                ip.status === 'assigned' ? 'bg-blue-100 text-blue-800' : 
                ip.status === 'available' ? 'bg-green-100 text-green-800' : 
                ip.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-purple-100 text-purple-800'
              }`}>
                {ip.status}
              </span>
            </TableCell>
            <TableCell>{ip.interface}</TableCell>
            <TableCell>
              {ranges.find((range) => range.id === ip.rangeId)?.name || 'N/A'}
            </TableCell>
            <TableCell>{ip.lastSeen || 'Never'}</TableCell>
            <TableCell>{ip.description || '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
