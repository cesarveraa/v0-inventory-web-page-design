'use client'

import { useState } from 'react'
import { useInventoryStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Plus, X, Check } from 'lucide-react'

export function QuickProductForm() {
  const addProduct = useInventoryStore((s) => s.addProduct)
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    cost: '',
    category: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (step === 1 && !formData.name) return
    if (step === 2 && !formData.sku) return

    if (step < 4) {
      setStep(step + 1)
      return
    }

    const product = {
      id: Date.now().toString(),
      name: formData.name,
      sku: formData.sku,
      price: parseFloat(formData.price) || 0,
      cost: parseFloat(formData.cost) || 0,
      category: formData.category || 'General',
      description: '',
    }

    addProduct(product)
    setFormData({ name: '', sku: '', price: '', cost: '', category: '' })
    setStep(1)
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit(e as any)
    }
    if (e.key === 'Escape') {
      setIsOpen(false)
      setStep(1)
    }
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="w-full md:w-auto text-xs md:text-base gap-2">
        <Plus className="w-4 h-4" />
        Nuevo Producto
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md shadow-xl">
        <div className="p-4 md:p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-base md:text-lg">Nuevo Producto</h3>
              <p className="text-xs text-muted-foreground mt-1">Paso {step} de 4</p>
            </div>
            <button 
              onClick={() => {
                setIsOpen(false)
                setStep(1)
              }} 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1 rounded-full transition-colors ${
                  s <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Form content */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <div className="space-y-2 animate-in fade-in">
                <Label className="text-sm">Nombre del Producto *</Label>
                <Input
                  autoFocus
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  onKeyDown={handleKeyDown}
                  placeholder="Ej: iPhone 15 Pro"
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground">¿Cuál es el nombre del producto?</p>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-2 animate-in fade-in">
                <Label className="text-sm">SKU/Código *</Label>
                <Input
                  autoFocus
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  onKeyDown={handleKeyDown}
                  placeholder="Ej: IPHONE15PRO"
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground">Código único del producto</p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-2 animate-in fade-in">
                <Label className="text-sm">Precio de Venta *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    autoFocus
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    onKeyDown={handleKeyDown}
                    placeholder="0.00"
                    className="text-sm pl-7"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Precio de venta al público</p>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-3 animate-in fade-in">
                <div className="space-y-2">
                  <Label className="text-sm">Costo</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      autoFocus
                      type="number"
                      step="0.01"
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                      onKeyDown={handleKeyDown}
                      placeholder="0.00"
                      className="text-sm pl-7"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Categoría</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    onKeyDown={handleKeyDown}
                    placeholder="Ej: Electrónica"
                    className="text-sm"
                  />
                </div>

                {/* Resumen */}
                <div className="bg-muted p-3 rounded-lg space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Producto:</span><span className="font-medium">{formData.name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">SKU:</span><span className="font-medium">{formData.sku}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Precio:</span><span className="font-medium">${parseFloat(formData.price || '0').toFixed(2)}</span></div>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (step > 1) {
                    setStep(step - 1)
                  } else {
                    setIsOpen(false)
                    setStep(1)
                  }
                }}
                className="flex-1 text-sm"
              >
                {step === 1 ? 'Cancelar' : 'Atrás'}
              </Button>
              <Button type="submit" className="flex-1 text-sm gap-2">
                {step === 4 ? (
                  <>
                    <Check size={16} />
                    Guardar
                  </>
                ) : (
                  'Siguiente'
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
