'use client'

import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Edit, Trash2 } from 'lucide-react'

interface IPRange {
  id: string
  name: string
  startIp: string
  endIp: string
  subnetMask: string
  gateway: string
  description: string
  status: 'active' | 'reserved' | 'inactive'
  dhcpEnabled: boolean
  dhcpRangeStart: string
  dhcpRangeEnd: string
}

interface IPRangeTableProps {
  ranges: IPRange[]
  onEdit: (range: IPRange) => void
  onDelete: (id: string) => void
}

export function IPRangeTable({ ranges, onEdit, onDelete }: IPRangeTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Network</TableHead>
          <TableHead>Gateway</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>DHCP</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ranges.map((range) => (
          <TableRow key={range.id}>
            <TableCell>{range.name}</TableCell>
            <TableCell>{range.startIp} - {range.endIp} ({range.subnetMask})</TableCell>
            <TableCell>{range.gateway}</TableCell>
            <TableCell>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                range.status === 'active' ? 'bg-green-100 text-green-800' : 
                range.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-gray-100 text-gray-800'
              }`}>
                {range.status}
              </span>
            </TableCell>
            <TableCell>
              {range.dhcpEnabled ? `${range.dhcpRangeStart} - ${range.dhcpRangeEnd}` : 'Disabled'}
            </TableCell>
            <TableCell>{range.description}</TableCell>
            <TableCell>
              <div className='flex space-x-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => onEdit(range)}
                >
                  <Edit className='h-4 w-4' />
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => onDelete(range.id)}
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
