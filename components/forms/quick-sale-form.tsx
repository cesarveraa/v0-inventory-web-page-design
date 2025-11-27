"use client"

import { useState, useMemo, useEffect } from "react"
import { useInventoryStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { ShoppingCart, X, Check, Search } from "lucide-react"
import {
  useKeyboardShortcuts,
  type KeyboardShortcut,
} from "@/hooks/use-keyboard-shortcuts"
import { useShortcuts } from "@/components/shortcuts-provider"

type BasicProduct = {
  id: string
  name: string
  sku: string
  price: number
}

export function QuickSaleForm() {
  const { currentWarehouse, products, addSale, inventory } = useInventoryStore()

  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    notes: "",
  })

  const { registerShortcuts } = useShortcuts()

  const shortcuts = useMemo<KeyboardShortcut[]>(
    () => [
      {
        key: "v",
        ctrlKey: true,
        shiftKey: true,
        description: "Abrir Venta Rápida",
        category: "ventas",
        action: () => setIsOpen(true),
      },
    ],
    [],
  )

  useKeyboardShortcuts(shortcuts)

  useEffect(() => {
    registerShortcuts(shortcuts)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 🔹 Productos demo para cuando no haya productos reales
  const demoProducts: BasicProduct[] = [
    {
      id: "P-DEMO-ESTANIO",
      name: "Concentrado de estaño",
      sku: "EST-01",
      price: 12000,
    },
    {
      id: "P-DEMO-ANFO",
      name: "Explosivos ANFO (fardos)",
      sku: "ANFO-25",
      price: 380,
    },
    {
      id: "P-DEMO-EPP",
      name: "Kit EPP minero completo",
      sku: "EPP-SET",
      price: 950,
    },
  ]

  const allProducts: BasicProduct[] =
    products.length > 0
      ? (products as any as BasicProduct[])
      : demoProducts

  // Ahora dejamos usar TODOS los productos, sin depender del inventario
  const warehouseProducts = useMemo(() => {
    if (!currentWarehouse) return []
    return allProducts
  }, [allProducts, currentWarehouse])

  // Filtro por nombre / SKU
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return warehouseProducts.slice(0, 8)
    const q = searchQuery.toLowerCase()
    return warehouseProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q),
    )
  }, [searchQuery, warehouseProducts])

  const selectedProduct = useMemo(
    () => allProducts.find((p) => p.id === formData.productId),
    [allProducts, formData.productId],
  )

  // Stock sólo como referencia (si existe)
  const stock =
    inventory.find(
      (inv) =>
        inv.productId === formData.productId &&
        inv.warehouseId === currentWarehouse?.id,
    )?.quantity ?? undefined

  const resetForm = () => {
    setFormData({ productId: "", quantity: "", notes: "" })
    setSearchQuery("")
  }

  const closeModal = () => {
    setIsOpen(false)
    resetForm()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentWarehouse || !selectedProduct) return

    const qty = parseInt(formData.quantity || "0", 10)
    if (!qty || qty <= 0) return

    const unitPrice = selectedProduct.price ?? 0

    const sale: any = {
      id: Date.now().toString(),
      warehouseId: currentWarehouse.id,
      productId: selectedProduct.id,
      productName: selectedProduct.name, // 👈 clave para que la tabla lo muestre bien
      quantity: qty,
      unitPrice,
      totalPrice: unitPrice * qty,
      date: new Date(),
      notes: formData.notes,
    }

    addSale(sale)
    resetForm()
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation()
      closeModal()
    }
  }

  // Abrir Venta Rápida desde evento global
  useEffect(() => {
    const open = () => setIsOpen(true)
    window.addEventListener("open-quick-sale-form", open)
    return () => window.removeEventListener("open-quick-sale-form", open)
  }, [])

  // Botón cuando está cerrado
  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="secondary"
        className="w-full md:w-auto text-xs md:text-base gap-2"
        title="Abrir Venta Rápida (Ctrl+Shift+V)"
      >
        <ShoppingCart className="w-4 h-4" />
        <span>Venta Rápida</span>
        <span className="hidden md:inline text-[10px] text-muted-foreground ml-1">
          (Ctrl+Shift+V)
        </span>
      </Button>
    )
  }

  // Modal
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md shadow-xl">
        <div className="p-4 md:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-base md:text-lg">
                Registrar Venta
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Tip: usa <span className="font-mono">Esc</span> para cerrar,{" "}
                <span className="font-mono">Ctrl+Shift+V</span> para abrir desde
                cualquier pantalla.
              </p>
            </div>
            <button
              onClick={closeModal}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Búsqueda de producto */}
            <div className="space-y-2">
              <Label className="text-sm">Producto *</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Buscar producto por nombre o SKU..."
                  className="text-sm pl-10"
                />
              </div>

              {/* Lista de sugerencias (también cuando search está vacío) */}
              {filteredProducts.length > 0 && (
                <div className="border border-border rounded-lg overflow-hidden bg-background mt-1 max-h-64 overflow-y-auto">
                  {filteredProducts.map((product) => {
                    const stockItem = inventory.find(
                      (inv) =>
                        inv.productId === product.id &&
                        inv.warehouseId === currentWarehouse?.id,
                    )
                    const availableStock = stockItem?.quantity

                    return (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            productId: product.id,
                            quantity: "1",
                          })
                          setSearchQuery(
                            product.name, // se queda el nombre en el input
                          )
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-muted transition-colors border-b border-border last:border-b-0 text-sm"
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {product.sku}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              Bs {product.price.toFixed(2)}
                            </p>
                            {availableStock !== undefined && (
                              <p
                                className={`text-xs ${
                                  availableStock > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                Stock: {availableStock}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}

              {selectedProduct && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mt-2">
                  <p className="text-sm font-medium text-foreground">
                    {selectedProduct.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    SKU: {selectedProduct.sku}
                  </p>
                  <p className="text-sm font-semibold mt-2">
                    Bs {selectedProduct.price.toFixed(2)} por unidad
                  </p>
                  {stock !== undefined && (
                    <p
                      className={`text-xs mt-1 ${
                        stock > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      Disponible: {stock} unidades
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Cantidad */}
            {selectedProduct && (
              <div className="space-y-2">
                <Label className="text-sm">Cantidad *</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: e.target.value,
                    })
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="1"
                  className="text-sm"
                  required
                />
                {stock !== undefined && (
                  <p className="text-xs text-muted-foreground">
                    Stock registrado: {stock}
                  </p>
                )}
              </div>
            )}

            {/* Total */}
            {selectedProduct && formData.quantity && (
              <div className="bg-muted rounded-lg p-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Precio unitario:
                  </span>
                  <span>Bs {selectedProduct.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cantidad:</span>
                  <span>{formData.quantity}</span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2 border-t border-border">
                  <span>Total:</span>
                  <span className="text-primary">
                    Bs
                    {(
                      selectedProduct.price *
                      parseInt(formData.quantity || "0", 10)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Notas */}
            <div className="space-y-2">
              <Label className="text-sm">Notas (opcional)</Label>
              <Input
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                onKeyDown={handleKeyDown}
                placeholder="Ej: Cliente VIP"
                className="text-sm"
              />
            </div>

            {/* Botones */}
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
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
