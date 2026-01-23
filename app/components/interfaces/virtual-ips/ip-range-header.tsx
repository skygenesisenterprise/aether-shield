'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface IPRangeHeaderProps {
  onAddRange: () => void
  onImport: () => void
  onExport: () => void
  onRefresh: () => void
}

export function IPRangeHeader({ onAddRange, onImport, onExport, onRefresh }: IPRangeHeaderProps) {
  return (
    <div className='flex justify-between items-center mb-6'>
      <div>
        <h1 className='text-2xl font-bold'>IP Address Management</h1>
        <p className='text-muted-foreground'>Manage IP ranges and addresses with advanced features</p>
      </div>
      <div className='flex space-x-2'>
        <Button variant='outline' size='sm' onClick={onImport}>
          <Plus className='mr-2 h-4 w-4' />
          Import
        </Button>
        <Button variant='outline' size='sm' onClick={onExport}>
          <Plus className='mr-2 h-4 w-4' />
          Export
        </Button>
        <Button variant='outline' size='sm' onClick={onRefresh}>
          <Plus className='mr-2 h-4 w-4' />
          Refresh
        </Button>
        <Button onClick={onAddRange}>
          <Plus className='mr-2 h-4 w-4' />
          Add Range
        </Button>
      </div>
    </div>
  )
}
