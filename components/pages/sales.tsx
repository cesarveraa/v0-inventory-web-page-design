'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { useState, useMemo, useRef, useEffect } from 'react'
import { useInventoryStore } from '@/lib/store'
import { QuickSaleForm } from '@/components/forms/quick-sale-form'
import { SalesTable } from '@/components/sales/sales-table'
import { useKeyboardShortcuts, type KeyboardShortcut } from '@/hooks/use-keyboard-shortcuts'
import { useShortcuts } from '@/components/shortcuts-provider'

export function SalesPage() {
  const { sales, currentWarehouse } = useInventoryStore()
  const [searchTerm, setSearchTerm] = useState('')
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  const { registerShortcuts } = useShortcuts()

  const shortcuts = useMemo<KeyboardShortcut[]>(
    () => [
      {
        key: 'f',
        ctrlKey: true,
        description: 'Buscar ventas',
        category: 'ventas',
        action: () => {
          searchInputRef.current?.focus()
        },
      },
    ],
    []
  )

  useKeyboardShortcuts(shortcuts)

  useEffect(() => {
    registerShortcuts(shortcuts)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const warehouseSales = useMemo(() => {
    if (!currentWarehouse) return []
    return sales
      .filter((s) => s.warehouseId === currentWarehouse.id)
      .filter((s) => s.notes?.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [sales, currentWarehouse, searchTerm])

  const totalSales = warehouseSales.reduce((sum, s) => sum + s.totalPrice, 0)

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Registro de Ventas</h1>
          <p className="text-muted-foreground mt-2">Gestiona tus ventas rápidamente</p>
        </div>
        <QuickSaleForm />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-muted-foreground text-sm">Total Ventas</p>
          <p className="text-2xl font-bold text-foreground mt-2">${totalSales.toFixed(2)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-muted-foreground text-sm">Número de Transacciones</p>
          <p className="text-2xl font-bold text-foreground mt-2">{warehouseSales.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-muted-foreground text-sm">Promedio por Venta</p>
          <p className="text-2xl font-bold text-foreground mt-2">
            ${warehouseSales.length > 0 ? (totalSales / warehouseSales.length).toFixed(2) : '0.00'}
          </p>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Buscar ventas... (Ctrl+F)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <Card className="overflow-hidden">
        <SalesTable sales={warehouseSales} />
      </Card>
    </div>
  )
}
