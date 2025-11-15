'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, TrendingDown, Plus } from 'lucide-react'
import { useInventoryStore } from '@/lib/store'
import { useMemo } from 'react'
import { QuickInventoryForm } from '@/components/forms/quick-inventory-form'

export function InventoryPage() {
  const { inventory, currentWarehouse, products } = useInventoryStore()

  const warehouseInventory = useMemo(() => {
    if (!currentWarehouse) return []
    return inventory
      .filter((inv) => inv.warehouseId === currentWarehouse.id)
      .map((inv) => ({
        ...inv,
        product: products.find((p) => p.id === inv.productId),
      }))
      .filter((item) => item.product)
  }, [inventory, currentWarehouse, products])

  const criticalItems = warehouseInventory.filter((item) => item.quantity === 0)
  const lowStockItems = warehouseInventory.filter((item) => item.quantity > 0 && item.quantity < item.minStock)

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Control de Inventario</h1>
          <p className="text-muted-foreground mt-2">Monitorea niveles de stock en {currentWarehouse?.name}</p>
        </div>
        <QuickInventoryForm />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-4 border-destructive/50 bg-destructive/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-destructive mt-1" size={24} />
            <div>
              <h3 className="font-semibold text-foreground">Alertas Críticas</h3>
              <p className="text-sm text-muted-foreground mt-1">{criticalItems.length} productos agotados</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-chart-4/50 bg-chart-4/5">
          <div className="flex items-start gap-3">
            <TrendingDown className="text-chart-4 mt-1" size={24} />
            <div>
              <h3 className="font-semibold text-foreground">Bajo Stock</h3>
              <p className="text-sm text-muted-foreground mt-1">{lowStockItems.length} productos bajo mínimo</p>
            </div>
          </div>
        </Card>
      </div>

      {criticalItems.length > 0 && (
        <Card className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">Productos Agotados</h2>
          <div className="space-y-3">
            {criticalItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-destructive/5 rounded-lg border border-destructive/20 flex-wrap gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{item.product?.name}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">SKU: {item.product?.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-destructive">{item.quantity}</p>
                  <p className="text-xs text-muted-foreground">Mínimo: {item.minStock}</p>
                </div>
                <Button variant="outline" className="text-destructive border-destructive/50 hover:bg-destructive/10 text-xs md:text-base">
                  Reabastecer
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="p-4 md:p-6 border-b border-border">
          <h2 className="text-lg md:text-xl font-bold text-foreground">Niveles de Inventario</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="border-b border-border bg-card/50">
                <th className="text-left p-3 md:p-4 font-semibold text-foreground">Producto</th>
                <th className="text-right p-3 md:p-4 font-semibold text-foreground">Cantidad</th>
                <th className="text-right p-3 md:p-4 font-semibold text-foreground">Mínimo</th>
                <th className="text-right p-3 md:p-4 font-semibold text-foreground">Máximo</th>
                <th className="text-left p-3 md:p-4 font-semibold text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {warehouseInventory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No hay inventario registrado
                  </td>
                </tr>
              ) : (
                warehouseInventory.map((item) => (
                  <tr key={item.id} className="border-b border-border hover:bg-card/50 transition-colors">
                    <td className="p-3 md:p-4 font-medium text-foreground">{item.product?.name}</td>
                    <td className="p-3 md:p-4 text-right">
                      <span className={`px-3 py-1 rounded-lg font-bold text-xs md:text-base ${
                        item.quantity === 0
                          ? 'bg-destructive/20 text-destructive'
                          : item.quantity < item.minStock
                          ? 'bg-chart-4/20 text-chart-4'
                          : 'bg-accent/20 text-accent'
                      }`}>
                        {item.quantity}
                      </span>
                    </td>
                    <td className="p-3 md:p-4 text-right text-muted-foreground">{item.minStock}</td>
                    <td className="p-3 md:p-4 text-right text-muted-foreground">{item.maxStock}</td>
                    <td className="p-3 md:p-4">
                      <Button variant="outline" size="sm" className="text-xs">
                        Ajustar
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
