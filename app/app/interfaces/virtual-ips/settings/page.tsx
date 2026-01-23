'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { useState, useRef } from 'react'
import { IPRangeHeader } from '@/components/interfaces/virtual-ips/ip-range-header'
import { IPRangeFormDialog } from '@/components/interfaces/virtual-ips/ip-range-form-dialog'
import { IPRangeTable } from '@/components/interfaces/virtual-ips/ip-range-table'
import { IPAddressFilter } from '@/components/interfaces/virtual-ips/ip-address-filter'
import { IPAddressTable } from '@/components/interfaces/virtual-ips/ip-address-table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Upload, Download, FileText } from 'lucide-react'

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

const mockIPRanges: IPRange[] = [
  {
    id: '1',
    name: 'LAN Office',
    startIp: '192.168.1.1',
    endIp: '192.168.1.254',
    subnetMask: '255.255.255.0',
    gateway: '192.168.1.254',
    description: 'Main office network',
    status: 'active',
    dhcpEnabled: true,
    dhcpRangeStart: '192.168.1.100',
    dhcpRangeEnd: '192.168.1.200',
  },
  {
    id: '2',
    name: 'DMZ Servers',
    startIp: '192.168.2.1',
    endIp: '192.168.2.254',
    subnetMask: '255.255.255.0',
    gateway: '192.168.2.254',
    description: 'DMZ for public-facing servers',
    status: 'active',
    dhcpEnabled: false,
    dhcpRangeStart: '',
    dhcpRangeEnd: '',
  },
  {
    id: '3',
    name: 'Guest Network',
    startIp: '192.168.3.1',
    endIp: '192.168.3.254',
    subnetMask: '255.255.255.0',
    gateway: '192.168.3.254',
    description: 'Guest WiFi network',
    status: 'active',
    dhcpEnabled: true,
    dhcpRangeStart: '192.168.3.100',
    dhcpRangeEnd: '192.168.3.200',
  },
]

const mockIPAddresses: IPAddress[] = [
  {
    id: '1',
    ip: '192.168.1.100',
    hostname: 'server-web-01',
    macAddress: '00:1A:2B:3C:4D:5E',
    status: 'assigned',
    rangeId: '1',
    interface: 'eth0',
    description: 'Web server',
    lastSeen: '2024-01-20 14:30:00',
  },
  {
    id: '2',
    ip: '192.168.1.101',
    hostname: 'workstation-01',
    macAddress: '00:1A:2B:3C:4D:5F',
    status: 'assigned',
    rangeId: '1',
    interface: 'eth0',
    description: 'Office workstation',
    lastSeen: '2024-01-20 14:25:00',
  },
  {
    id: '3',
    ip: '192.168.1.150',
    hostname: 'available-ip',
    macAddress: '',
    status: 'available',
    rangeId: '1',
    interface: 'eth0',
    description: '',
    lastSeen: '',
  },
  {
    id: '4',
    ip: '192.168.2.10',
    hostname: 'firewall',
    macAddress: '00:1A:2B:3C:4D:60',
    status: 'assigned',
    rangeId: '2',
    interface: 'eth0',
    description: 'Perimeter firewall',
    lastSeen: '2024-01-20 14:30:00',
  },
  {
    id: '5',
    ip: '192.168.3.150',
    hostname: 'guest-device',
    macAddress: '00:1A:2B:3C:4D:61',
    status: 'dhcp',
    rangeId: '3',
    interface: 'wlan0',
    description: 'Guest device',
    lastSeen: '2024-01-20 14:15:00',
  },
]

export default function VirtualIPSettings() {
  const { toast } = useToast()
  const [ipRanges, setIpRanges] = useState<IPRange[]>(mockIPRanges)
  const [ipAddresses] = useState<IPAddress[]>(mockIPAddresses)
  const [selectedRange, setSelectedRange] = useState<IPRange | null>(null)
  const [isAddRangeDialogOpen, setIsAddRangeDialogOpen] = useState(false)
  const [isEditRangeDialogOpen, setIsEditRangeDialogOpen] = useState(false)
  const [newRange, setNewRange] = useState<Partial<IPRange>>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'assigned' | 'available' | 'reserved' | 'dhcp'>('all')
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFieldChange = (field: string, value: string | boolean) => {
    setNewRange({ ...newRange, [field]: value })
  }

  const handleStatusChange = (status: 'active' | 'reserved' | 'inactive') => {
    setNewRange({ ...newRange, status })
  }

  const handleAddRange = () => {
    if (!newRange.name || !newRange.startIp || !newRange.endIp || !newRange.subnetMask || !newRange.gateway) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }

    const newId = (ipRanges.length + 1).toString()
    setIpRanges([...ipRanges, { ...newRange as IPRange, id: newId }])
    resetForm()
    setIsAddRangeDialogOpen(false)
    toast({
      title: 'Success',
      description: 'IP range added successfully',
    })
  }

  const handleEditRange = (range: IPRange) => {
    setSelectedRange(range)
    setNewRange(range)
    setIsEditRangeDialogOpen(true)
  }

  const handleUpdateRange = () => {
    if (!newRange.name || !newRange.startIp || !newRange.endIp || !newRange.subnetMask || !newRange.gateway) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }

    setIpRanges(
      ipRanges.map((range) => 
        range.id === selectedRange?.id ? { ...newRange as IPRange, id: selectedRange.id } : range
      )
    )
    resetForm()
    setIsEditRangeDialogOpen(false)
    setSelectedRange(null)
    toast({
      title: 'Success',
      description: 'IP range updated successfully',
    })
  }

  const handleDeleteRange = (id: string) => {
    setIpRanges(ipRanges.filter((range) => range.id !== id))
    toast({
      title: 'Success',
      description: 'IP range deleted successfully',
    })
  }

  const resetForm = () => {
    setNewRange({})
  }

  const handleImport = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        try {
          toast({
            title: 'Success',
            description: `Imported ${file.name} successfully`,
          })
          setIsImportDialogOpen(false)
        } catch {
          toast({
            title: 'Error',
            description: 'Failed to import file',
            variant: 'destructive',
          })
        }
      }
      reader.readAsText(file)
    }
  }

  const handleExport = (format: 'csv' | 'json' | 'xml') => {
    let content: string
    let filename: string
    let mimeType: string

    switch (format) {
      case 'csv':
        content = 'IP,Hostname,MAC Address,Status,Range\n'
        ipAddresses.forEach(ip => {
          content += `${ip.ip},${ip.hostname},${ip.macAddress},${ip.status},${ipRanges.find(r => r.id === ip.rangeId)?.name || ''}\n`
        })
        filename = 'ip_addresses.csv'
        mimeType = 'text/csv'
        break
      case 'json':
        content = JSON.stringify(ipAddresses, null, 2)
        filename = 'ip_addresses.json'
        mimeType = 'application/json'
        break
      case 'xml':
        content = '<?xml version="1.0" encoding="UTF-8"?>\n<ip_addresses>\n'
        ipAddresses.forEach(ip => {
          content += `  <address>\n    <ip>${ip.ip}</ip>\n    <hostname>${ip.hostname}</hostname>\n    <mac>${ip.macAddress}</mac>\n    <status>${ip.status}</status>\n  </address>\n`
        })
        content += '</ip_addresses>\n'
        filename = 'ip_addresses.xml'
        mimeType = 'application/xml'
        break
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: 'Success',
      description: `Exported to ${format.toUpperCase()} successfully`,
    })
    setIsExportDialogOpen(false)
  }

  return (
    <div className='container mx-auto px-4 py-6'>
      <IPRangeHeader
        onAddRange={() => setIsAddRangeDialogOpen(true)}
        onImport={() => setIsImportDialogOpen(true)}
        onExport={() => setIsExportDialogOpen(true)}
        onRefresh={() => window.location.reload()}
      />

      <Tabs defaultValue='ranges' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='ranges'>IP Ranges</TabsTrigger>
          <TabsTrigger value='addresses'>IP Addresses</TabsTrigger>
        </TabsList>

        <TabsContent value='ranges' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>IP Ranges</CardTitle>
              <CardDescription>Manage IP address ranges with DHCP configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <IPRangeTable
                ranges={ipRanges}
                onEdit={handleEditRange}
                onDelete={handleDeleteRange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='addresses' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>IP Addresses</CardTitle>
              <CardDescription>View and manage individual IP addresses with advanced filtering</CardDescription>
            </CardHeader>
            <CardContent>
              <IPAddressFilter
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filterStatus={filterStatus}
                onFilterChange={setFilterStatus}
              />
              <IPAddressTable
                addresses={ipAddresses}
                ranges={ipRanges}
                searchTerm={searchTerm}
                filterStatus={filterStatus}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <IPRangeFormDialog
        open={isAddRangeDialogOpen}
        onOpenChange={setIsAddRangeDialogOpen}
        range={newRange}
        onChange={handleFieldChange}
        onStatusChange={handleStatusChange}
        onSubmit={handleAddRange}
        isEditing={false}
      />

      <IPRangeFormDialog
        open={isEditRangeDialogOpen}
        onOpenChange={setIsEditRangeDialogOpen}
        range={newRange}
        onChange={handleFieldChange}
        onStatusChange={handleStatusChange}
        onSubmit={handleUpdateRange}
        isEditing={true}
      />

      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import IP Configuration</DialogTitle>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <p>Import IP addresses from a file (CSV, JSON, XML)</p>
            <Button onClick={handleImport}>
              <Upload className='mr-2 h-4 w-4' />
              Select File
            </Button>
            <input
              type='file'
              ref={fileInputRef}
              onChange={handleFileChange}
              accept='.csv,.json,.xml'
              className='hidden'
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export IP Configuration</DialogTitle>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <p>Export IP addresses to:</p>
            <div className='grid grid-cols-3 gap-2'>
              <Button onClick={() => handleExport('csv')} variant='outline'>
                <FileText className='mr-2 h-4 w-4' />
                CSV
              </Button>
              <Button onClick={() => handleExport('json')} variant='outline'>
                <FileText className='mr-2 h-4 w-4' />
                JSON
              </Button>
              <Button onClick={() => handleExport('xml')} variant='outline'>
                <FileText className='mr-2 h-4 w-4' />
                XML
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
