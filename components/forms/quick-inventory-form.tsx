'use client'

import { useState, useEffect, useMemo } from 'react'
import { useInventoryStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, X } from 'lucide-react'
import { useKeyboardShortcuts, type KeyboardShortcut } from '@/hooks/use-keyboard-shortcuts'
import { useShortcuts } from '@/components/shortcuts-provider'

export function QuickInventoryForm() {
  const { currentWarehouse, products, updateInventory, inventory } = useInventoryStore()

  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    minStock: '',
    maxStock: '',
  })

  const { registerShortcuts } = useShortcuts()

  // ⭐ Atajo global: Ctrl + Shift + I → abrir Ajuste de Stock
  const shortcuts = useMemo<KeyboardShortcut[]>(
    () => [
      {
        key: 'i',
        ctrlKey: true,
        shiftKey: true,
        description: 'Ajustar Stock',
        category: 'inventario',
        action: () => setIsOpen(true),
      },
    ],
    []
  )

  useKeyboardShortcuts(shortcuts)

  useEffect(() => {
    registerShortcuts(shortcuts)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const resetForm = () => {
    setFormData({
      productId: '',
      quantity: '',
      minStock: '',
      maxStock: '',
    })
  }

  const closeModal = () => {
    resetForm()
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      closeModal()
    }
  }

  // ESC global mientras el modal esté abierto
  useEffect(() => {
    if (!isOpen) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeModal()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentWarehouse || !formData.productId) return

    const existingItem = inventory.find(
      (inv) =>
        inv.productId === formData.productId &&
        inv.warehouseId === currentWarehouse.id
    )

    const inventoryItem = {
      id: existingItem?.id || Date.now().toString(),
      productId: formData.productId,
      warehouseId: currentWarehouse.id,
      quantity: parseInt(formData.quantity || '0', 10),
      minStock: parseInt(formData.minStock || '0', 10),
      maxStock: parseInt(formData.maxStock || '0', 10),
      lastUpdated: new Date(),
    }

    updateInventory(inventoryItem)
    closeModal()
  }

  // 🔘 Botón cuando el modal está cerrado
  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full md:w-auto gap-2"
        title="Ajustar Stock (Ctrl+Shift+I)"
      >
        <Plus className="w-4 h-4" />
        Ajustar Stock
        <span className="hidden md:inline text-[10px] text-muted-foreground">
          (Ctrl+Shift+I)
        </span>
      </Button>
    )
  }

  // 🧾 Modal de ajuste de inventario
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="p-4 md:p-6 w-full max-w-md shadow-xl">
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          onKeyDown={handleKeyDown}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-base md:text-lg">
                Ajustar Inventario
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Tip: usa <span className="font-mono">Esc</span> para cerrar rápido.
              </p>
            </div>
            <button
              type="button"
              onClick={closeModal}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Producto */}
          <div className="space-y-2">
            <Label htmlFor="product">Producto</Label>
            <Select
              value={formData.productId}
              onValueChange={(id) =>
                setFormData({ ...formData, productId: id })
              }
            >
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

          {/* Cantidades */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Cantidad</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, minStock: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, maxStock: e.target.value })
                }
                placeholder="0"
                required
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
