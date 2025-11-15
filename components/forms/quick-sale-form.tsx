'use client'

import { useState, useMemo } from 'react'
import { useInventoryStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { ShoppingCart, X, Check, Search } from 'lucide-react'

export function QuickSaleForm() {
  const { currentWarehouse, products, addSale, inventory } = useInventoryStore()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    notes: '',
  })

  const warehouseProducts = useMemo(() => {
    if (!currentWarehouse) return []
    return products.filter((p) =>
      inventory.some((inv) => inv.productId === p.id && inv.warehouseId === currentWarehouse.id)
    )
  }, [currentWarehouse, products, inventory])

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return warehouseProducts.slice(0, 8)
    return warehouseProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, warehouseProducts])

  const selectedProduct = products.find((p) => p.id === formData.productId)
  const stock = inventory.find(
    (inv) => inv.productId === formData.productId && inv.warehouseId === currentWarehouse?.id
  )?.quantity || 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentWarehouse || !selectedProduct) return

    const sale = {
      id: Date.now().toString(),
      warehouseId: currentWarehouse.id,
      productId: formData.productId,
      quantity: parseInt(formData.quantity),
      unitPrice: selectedProduct.price,
      totalPrice: selectedProduct.price * parseInt(formData.quantity),
      date: new Date(),
      notes: formData.notes,
    }

    addSale(sale)
    setFormData({ productId: '', quantity: '', notes: '' })
    setSearchQuery('')
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} variant="secondary" className="w-full md:w-auto text-xs md:text-base gap-2">
        <ShoppingCart className="w-4 h-4" />
        Venta Rápida
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md shadow-xl">
        <div className="p-4 md:p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base md:text-lg">Registrar Venta</h3>
            <button 
              onClick={() => {
                setIsOpen(false)
                setFormData({ productId: '', quantity: '', notes: '' })
                setSearchQuery('')
              }}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Quick product search */}
            <div className="space-y-2">
              <Label className="text-sm">Producto *</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Buscar producto..."
                  className="text-sm pl-10"
                />
              </div>

              {/* Product suggestions */}
              {searchQuery && filteredProducts.length > 0 && (
                <div className="border border-border rounded-lg overflow-hidden bg-background">
                  {filteredProducts.map((product) => {
                    const stockItem = inventory.find(
                      (inv) => inv.productId === product.id && inv.warehouseId === currentWarehouse?.id
                    )
                    const availableStock = stockItem?.quantity || 0
                    return (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, productId: product.id, quantity: '1' })
                          setSearchQuery('')
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-muted transition-colors border-b border-border last:border-b-0 text-sm"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.sku}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${product.price.toFixed(2)}</p>
                            <p className={`text-xs ${availableStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              Stock: {availableStock}
                            </p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}

              {selectedProduct && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                  <p className="text-sm font-medium text-foreground">{selectedProduct.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">SKU: {selectedProduct.sku}</p>
                  <p className="text-sm font-semibold mt-2">${selectedProduct.price.toFixed(2)} por unidad</p>
                  <p className={`text-xs mt-1 ${stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Disponible: {stock} unidades
                  </p>
                </div>
              )}
            </div>

            {/* Quantity input */}
            {selectedProduct && (
              <div className="space-y-2">
                <Label className="text-sm">Cantidad *</Label>
                <Input
                  type="number"
                  min="1"
                  max={stock}
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  onKeyDown={handleKeyDown}
                  placeholder="1"
                  className="text-sm"
                  required
                />
                <p className="text-xs text-muted-foreground">Máximo disponible: {stock}</p>
              </div>
            )}

            {/* Total preview */}
            {selectedProduct && formData.quantity && (
              <div className="bg-muted rounded-lg p-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Precio unitario:</span>
                  <span>${selectedProduct.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cantidad:</span>
                  <span>{formData.quantity}</span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2 border-t border-border">
                  <span>Total:</span>
                  <span className="text-primary">${(selectedProduct.price * parseInt(formData.quantity || '0')).toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label className="text-sm">Notas (opcional)</Label>
              <Input
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                onKeyDown={handleKeyDown}
                placeholder="Ej: Cliente VIP"
                className="text-sm"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsOpen(false)
                  setFormData({ productId: '', quantity: '', notes: '' })
                  setSearchQuery('')
                }}
                className="flex-1 text-sm"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!selectedProduct || !formData.quantity}
                className="flex-1 text-sm gap-2"
              >
                <Check size={16} />
                Registrar
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
