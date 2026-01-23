'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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

interface IPRangeFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  range: Partial<IPRange>
  onChange: (field: string, value: string | boolean) => void
  onStatusChange: (status: 'active' | 'reserved' | 'inactive') => void
  onSubmit: () => void
  isEditing: boolean
}

export function IPRangeFormDialog({
  open,
  onOpenChange,
  range,
  onChange,
  onStatusChange,
  onSubmit,
  isEditing,
}: IPRangeFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit IP Range' : 'Add New IP Range'}</DialogTitle>
        </DialogHeader>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Name *</Label>
            <Input
              id='name'
              value={range.name || ''}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder='e.g. LAN Office'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='startIp'>Start IP *</Label>
            <Input
              id='startIp'
              value={range.startIp || ''}
              onChange={(e) => onChange('startIp', e.target.value)}
              placeholder='e.g. 192.168.1.1'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='endIp'>End IP *</Label>
            <Input
              id='endIp'
              value={range.endIp || ''}
              onChange={(e) => onChange('endIp', e.target.value)}
              placeholder='e.g. 192.168.1.254'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='subnetMask'>Subnet Mask *</Label>
            <Input
              id='subnetMask'
              value={range.subnetMask || ''}
              onChange={(e) => onChange('subnetMask', e.target.value)}
              placeholder='e.g. 255.255.255.0'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='gateway'>Gateway *</Label>
            <Input
              id='gateway'
              value={range.gateway || ''}
              onChange={(e) => onChange('gateway', e.target.value)}
              placeholder='e.g. 192.168.1.254'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='status'>Status</Label>
            <Select
              value={range.status || 'active'}
              onValueChange={(value) => onStatusChange(value as 'active' | 'reserved' | 'inactive')}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='active'>Active</SelectItem>
                <SelectItem value='reserved'>Reserved</SelectItem>
                <SelectItem value='inactive'>Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2 md:col-span-2'>
            <Label htmlFor='description'>Description</Label>
            <Input
              id='description'
              value={range.description || ''}
              onChange={(e) => onChange('description', e.target.value)}
              placeholder='Optional description'
            />
          </div>
          <div className='space-y-2 md:col-span-2'>
            <Label htmlFor='dhcpEnabled'>DHCP Configuration</Label>
            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='dhcpEnabled'
                checked={range.dhcpEnabled || false}
                onChange={(e) => onChange('dhcpEnabled', e.target.checked)}
                className='h-4 w-4'
              />
              <Label htmlFor='dhcpEnabled'>Enable DHCP</Label>
            </div>
          </div>
          {range.dhcpEnabled && (
            <>
              <div className='space-y-2'>
                <Label htmlFor='dhcpRangeStart'>DHCP Range Start</Label>
                <Input
                  id='dhcpRangeStart'
                  value={range.dhcpRangeStart || ''}
                  onChange={(e) => onChange('dhcpRangeStart', e.target.value)}
                  placeholder='e.g. 192.168.1.100'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='dhcpRangeEnd'>DHCP Range End</Label>
                <Input
                  id='dhcpRangeEnd'
                  value={range.dhcpRangeEnd || ''}
                  onChange={(e) => onChange('dhcpRangeEnd', e.target.value)}
                  placeholder='e.g. 192.168.1.200'
                />
              </div>
            </>
          )}
        </div>
        <div className='flex justify-end space-x-2'>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>{isEditing ? 'Save Changes' : 'Add Range'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
