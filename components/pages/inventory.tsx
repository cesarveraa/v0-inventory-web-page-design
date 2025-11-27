"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, TrendingDown, Plus } from "lucide-react"
import { useInventoryStore } from "@/lib/store"
import { useMemo, useState, FormEvent, useEffect } from "react"
import { QuickInventoryForm } from "@/components/forms/quick-inventory-form"

type DemoProduct = {
  id: string
  name: string
  sku: string
}

type DemoInventoryItem = {
  id: string
  productId: string
  warehouseId: string
  quantity: number
  minStock: number
  maxStock: number
}

export function InventoryPage() {
  const { inventory, currentWarehouse, products } = useInventoryStore()

  /* 🔹 Productos demo SOLO para esta pantalla */
  const demoProducts: DemoProduct[] = [
    { id: "D-ANFO", name: "Explosivo ANFO 25kg", sku: "ANFO-25" },
    { id: "D-CASCO", name: "Casco minero", sku: "CASCO-MIN" },
    { id: "D-GUANTES", name: "Guantes reforzados", sku: "GUANTE-CUERO" },
    { id: "D-PERF", name: "Perforadora neumática", sku: "PERF-01" },
  ]

  const usableProducts =
    products.length > 0 ? products : demoProducts

  const [useDemoInventory, setUseDemoInventory] = useState(true)
  const [customInventory, setCustomInventory] = useState<DemoInventoryItem[]>([])

  /* 🔹 Inventario demo fijo */
  const demoInventory = useMemo<DemoInventoryItem[]>(() => {
    if (!currentWarehouse) return []
    return usableProducts.map((p, i) => ({
      id: `demo-${p.id}`,
      productId: p.id,
      warehouseId: currentWarehouse.id,
      quantity: [0, 8, 25, 120][i] ?? 15,
      minStock: 20,
      maxStock: 200,
    }))
  }, [usableProducts, currentWarehouse])

  const allInventory = [...demoInventory, ...customInventory]

  const warehouseInventory = useMemo(() => {
    if (!currentWarehouse) return []
    return allInventory
      .filter(i => i.warehouseId === currentWarehouse.id)
      .map(i => ({
        ...i,
        product: usableProducts.find(p => p.id === i.productId),
      }))
  }, [allInventory, usableProducts, currentWarehouse])

  const criticalItems = warehouseInventory.filter(i => i.quantity === 0)
  const lowStockItems = warehouseInventory.filter(
    i => i.quantity > 0 && i.quantity < i.minStock
  )

  /* ➕ Agregar inventario */
  const [newItem, setNewItem] = useState({
    productId: "",
    quantity: "",
    minStock: "",
    maxStock: "",
  })

  const handleAddInventory = (e: FormEvent) => {
    e.preventDefault()
    if (!currentWarehouse || !newItem.productId) return

    setCustomInventory(prev => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        warehouseId: currentWarehouse.id,
        productId: newItem.productId,
        quantity: Number(newItem.quantity) || 0,
        minStock: Number(newItem.minStock) || 20,
        maxStock: Number(newItem.maxStock) || 200,
      },
    ])

    setNewItem({ productId: "", quantity: "", minStock: "", maxStock: "" })
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Control de Inventario</h1>
          <p className="text-muted-foreground">
            Monitoreo de stock en {currentWarehouse?.name ?? "almacén demo"}
          </p>
        </div>
        <QuickInventoryForm />
      </div>

      {/* Alertas */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="p-4 bg-destructive/5 border-destructive/30">
          <div className="flex gap-3">
            <AlertTriangle className="text-destructive" />
            <div>
              <p className="font-semibold">Productos agotados</p>
              <p className="text-sm">{criticalItems.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-chart-4/5 border-chart-4/30">
          <div className="flex gap-3">
            <TrendingDown className="text-chart-4" />
            <div>
              <p className="font-semibold">Bajo stock</p>
              <p className="text-sm">{lowStockItems.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* ➕ Formulario inventario */}
      <Card className="p-4">
        <h2 className="font-semibold mb-3">Agregar inventario (demo)</h2>
        <form onSubmit={handleAddInventory} className="grid md:grid-cols-5 gap-3">
          <select
            className="border rounded-lg p-2"
            value={newItem.productId}
            onChange={e =>
              setNewItem(p => ({ ...p, productId: e.target.value }))
            }
          >
            <option value="">Producto</option>
            {usableProducts.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <input type="number" placeholder="Cantidad"
            className="border p-2 rounded-lg"
            value={newItem.quantity}
            onChange={e =>
              setNewItem(p => ({ ...p, quantity: e.target.value }))
            }
          />

          <input type="number" placeholder="Mínimo"
            className="border p-2 rounded-lg"
            value={newItem.minStock}
            onChange={e =>
              setNewItem(p => ({ ...p, minStock: e.target.value }))
            }
          />

          <input type="number" placeholder="Máximo"
            className="border p-2 rounded-lg"
            value={newItem.maxStock}
            onChange={e =>
              setNewItem(p => ({ ...p, maxStock: e.target.value }))
            }
          />

          <Button type="submit" className="flex gap-2">
            <Plus size={14} /> Agregar
          </Button>
        </form>
      </Card>

      {/* Tabla */}
      <Card>
        <table className="w-full text-sm">
          <thead className="bg-card/50">
            <tr>
              <th className="p-3 text-left">Producto</th>
              <th className="p-3 text-right">Cantidad</th>
              <th className="p-3 text-right">Min</th>
              <th className="p-3 text-right">Max</th>
            </tr>
          </thead>
          <tbody>
            {warehouseInventory.map(i => (
              <tr key={i.id} className="border-t">
                <td className="p-3">{i.product?.name}</td>
                <td className="p-3 text-right font-bold">{i.quantity}</td>
                <td className="p-3 text-right">{i.minStock}</td>
                <td className="p-3 text-right">{i.maxStock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
