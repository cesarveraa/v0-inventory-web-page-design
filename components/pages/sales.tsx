"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Sparkles } from "lucide-react"
import { useState, useMemo, useRef, useEffect } from "react"
import { useInventoryStore } from "@/lib/store"
import { QuickSaleForm } from "@/components/forms/quick-sale-form"
import { SalesTable } from "@/components/sales/sales-table"
import {
  useKeyboardShortcuts,
  type KeyboardShortcut,
} from "@/hooks/use-keyboard-shortcuts"
import { useShortcuts } from "@/components/shortcuts-provider"

type DemoSale = {
  id: string
  warehouseId: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  date: Date
  notes?: string
}

export function SalesPage() {
  const { sales, currentWarehouse, products } = useInventoryStore()
  const [searchTerm, setSearchTerm] = useState("")
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  const { registerShortcuts } = useShortcuts()
  const [useDemoSales, setUseDemoSales] = useState(false)

  const shortcuts = useMemo<KeyboardShortcut[]>(
    () => [
      {
        key: "f",
        ctrlKey: true,
        description: "Buscar ventas",
        category: "ventas",
        action: () => {
          searchInputRef.current?.focus()
        },
      },
    ],
    [],
  )

  useKeyboardShortcuts(shortcuts)

  useEffect(() => {
    registerShortcuts(shortcuts)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const realWarehouseSales = useMemo(() => {
    if (!currentWarehouse) return []
    return sales.filter((s) => s.warehouseId === currentWarehouse.id)
  }, [sales, currentWarehouse])

  useEffect(() => {
    if (realWarehouseSales.length === 0) {
      setUseDemoSales(true)
    }
  }, [realWarehouseSales.length])

  // 🔹 Ventas demo con nombre de producto incluido
  const demoSales: DemoSale[] = useMemo(() => {
    if (!currentWarehouse) return []

    const baseProducts =
      products.length > 0
        ? products
        : [
            {
              id: "P-DEMO-ESTANIO",
              name: "Concentrado de estaño",
              price: 12000,
              sku: "EST-01",
            },
            {
              id: "P-DEMO-ANFO",
              name: "Explosivos ANFO (fardos)",
              price: 380,
              sku: "ANFO-25",
            },
            {
              id: "P-DEMO-EPP",
              name: "Kit EPP minero completo",
              price: 950,
              sku: "EPP-SET",
            },
          ]

    const today = new Date()
    const dayMs = 24 * 60 * 60 * 1000

    return [
      {
        id: "DEMO-1",
        warehouseId: currentWarehouse.id,
        productId: baseProducts[0].id,
        productName: baseProducts[0].name,
        quantity: 2,
        unitPrice: Number((baseProducts[0] as any).price ?? 12000),
        totalPrice: Number((baseProducts[0] as any).price ?? 12000) * 2,
        date: new Date(today.getTime() - dayMs * 1),
        notes: "Venta a Cooperativa San José",
      },
      {
        id: "DEMO-2",
        warehouseId: currentWarehouse.id,
        productId: baseProducts[1].id,
        productName: baseProducts[1].name,
        quantity: 30,
        unitPrice: Number((baseProducts[1] as any).price ?? 380),
        totalPrice: Number((baseProducts[1] as any).price ?? 380) * 30,
        date: new Date(today.getTime() - dayMs * 3),
        notes: "Pedido turno noche",
      },
      {
        id: "DEMO-3",
        warehouseId: currentWarehouse.id,
        productId: baseProducts[2].id,
        productName: baseProducts[2].name,
        quantity: 5,
        unitPrice: Number((baseProducts[2] as any).price ?? 950),
        totalPrice: Number((baseProducts[2] as any).price ?? 950) * 5,
        date: new Date(today.getTime() - dayMs * 7),
        notes: "Entrega a almacén interior mina",
      },
    ]
  }, [currentWarehouse, products])

  const warehouseSales = useMemo(() => {
    const base = realWarehouseSales as any[]

    const combined =
      useDemoSales && realWarehouseSales.length === 0
        ? [...base, ...demoSales]
        : base

    const term = searchTerm.toLowerCase()

    return combined
      .filter((s) => {
        if (!term) return true
        const notes = (s.notes ?? "").toLowerCase()
        const productName = (s.productName ?? "").toLowerCase()
        return notes.includes(term) || productName.includes(term)
      })
      .sort(
        (a, b) =>
          new Date(a.date).getTime() < new Date(b.date).getTime() ? 1 : -1,
      )
  }, [realWarehouseSales, demoSales, useDemoSales, searchTerm])

  const totalSales = warehouseSales.reduce(
    (sum, s) => sum + (Number(s.totalPrice) || 0),
    0,
  )

  const avgTicket =
    warehouseSales.length > 0 ? totalSales / warehouseSales.length : 0

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Registro de Ventas
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestiona tus ventas rápidamente en{" "}
            {currentWarehouse?.name ?? "el almacén"}
          </p>
          {useDemoSales && realWarehouseSales.length === 0 && (
            <p className="text-xs text-amber-500 mt-1">
              Mostrando datos de ejemplo para la demostración.
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <QuickSaleForm />
          <Button
            type="button"
            variant={useDemoSales ? "outline" : "secondary"}
            className="flex items-center gap-2 text-xs md:text-sm"
            onClick={() => setUseDemoSales((prev) => !prev)}
          >
            <Sparkles size={16} />
            {useDemoSales ? "Ocultar ventas demo" : "Cargar ventas demo"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-muted-foreground text-sm">Total Ventas</p>
          <p className="text-2xl font-bold text-foreground mt-2">
            Bs {totalSales.toFixed(2)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-muted-foreground text-sm">
            Número de Transacciones
          </p>
          <p className="text-2xl font-bold text-foreground mt-2">
            {warehouseSales.length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-muted-foreground text-sm">Promedio por Venta</p>
          <p className="text-2xl font-bold text-foreground mt-2">
            Bs {avgTicket.toFixed(2)}
          </p>
        </Card>
      </div>

      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={20}
        />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Buscar ventas por notas o producto... (Ctrl+F)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <Card className="overflow-hidden">
        <SalesTable sales={warehouseSales as any} />
      </Card>
    </div>
  )
}
