'use client'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter } from 'lucide-react'

interface IPAddressFilterProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  filterStatus: 'all' | 'assigned' | 'available' | 'reserved' | 'dhcp'
  onFilterChange: (value: 'all' | 'assigned' | 'available' | 'reserved' | 'dhcp') => void
}

export function IPAddressFilter({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterChange,
}: IPAddressFilterProps) {
  return (
    <div className='flex justify-between items-center mb-4 space-x-4'>
      <div className='relative flex-1'>
        <Search className='absolute left-2 top-2 h-4 w-4 text-muted-foreground' />
        <Input
          placeholder='Search by IP, hostname or MAC...'
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className='pl-8 w-full'
        />
      </div>
      <div className='flex items-center space-x-2'>
        <Select value={filterStatus} onValueChange={(value) => onFilterChange(value as any)}>
          <SelectTrigger className='w-[180px]'>
            <Filter className='mr-2 h-4 w-4' />
            <SelectValue placeholder='Filter status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Statuses</SelectItem>
            <SelectItem value='assigned'>Assigned</SelectItem>
            <SelectItem value='available'>Available</SelectItem>
            <SelectItem value='reserved'>Reserved</SelectItem>
            <SelectItem value='dhcp'>DHCP</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
