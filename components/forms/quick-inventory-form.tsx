'use client'

import { useState } from 'react'
import { useInventoryStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus } from 'lucide-react'

export function QuickInventoryForm() {
  const { currentWarehouse, products, updateInventory, inventory } = useInventoryStore()
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    minStock: '',
    maxStock: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentWarehouse || !formData.productId) return

    const existingItem = inventory.find(
      (inv) => inv.productId === formData.productId && inv.warehouseId === currentWarehouse.id
    )

    const inventoryItem = {
      id: existingItem?.id || Date.now().toString(),
      productId: formData.productId,
      warehouseId: currentWarehouse.id,
      quantity: parseInt(formData.quantity),
      minStock: parseInt(formData.minStock),
      maxStock: parseInt(formData.maxStock),
      lastUpdated: new Date(),
    }

    updateInventory(inventoryItem)
    setFormData({ productId: '', quantity: '', minStock: '', maxStock: '' })
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="w-full md:w-auto">
        <Plus className="w-4 h-4 mr-2" />
        Ajustar Stock
      </Button>
    )
  }

  return (
    <Card className="p-4 md:p-6 w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="font-semibold">Ajustar Inventario</h3>

        <div className="space-y-2">
          <Label htmlFor="product">Producto</Label>
          <Select value={formData.productId} onValueChange={(id) => setFormData({ ...formData, productId: id })}>
            <SelectTrigger id="product">
              <SelectValue placeholder="Seleccionar producto" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Cantidad</Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="min">Mínimo</Label>
            <Input
              id="min"
              type="number"
              min="0"
              value={formData.minStock}
              onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
              placeholder="0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max">Máximo</Label>
            <Input
              id="max"
              type="number"
              min="0"
              value={formData.maxStock}
              onChange={(e) => setFormData({ ...formData, maxStock: e.target.value })}
              placeholder="0"
              required
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </Card>
  )
}
