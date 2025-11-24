'use client'

import { Card } from '@/components/ui/card'
import { Search, RefreshCw, Plus } from 'lucide-react'
import { useState, useMemo, useRef, useEffect } from 'react'
import { useInventoryStore } from '@/lib/store'
import { QuickProductForm } from '@/components/forms/quick-product-form'
import { ProductTable } from '@/components/products/product-table'
import {
  useKeyboardShortcuts,
  type KeyboardShortcut,
} from '@/hooks/use-keyboard-shortcuts'
import { useShortcuts } from '@/components/shortcuts-provider'
import { Button } from '@/components/ui/button'

export default function ProductsPage() {
  const {
    products,
    fetchProducts,
    loadingProducts,
    deleteProductApi,
  } = useInventoryStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [isQuickFormOpen, setIsQuickFormOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  const { registerShortcuts } = useShortcuts()

  // Atajos:
  // Ctrl+F -> foco en búsqueda
  // Ctrl+N -> abrir modal de nuevo producto
  // Ctrl+R -> recargar lista de productos
  const shortcuts = useMemo<KeyboardShortcut[]>(
    () => [
      {
        key: 'f',
        ctrlKey: true,
        description: 'Buscar productos',
        category: 'productos',
        action: () => {
          searchInputRef.current?.focus()
        },
      },
      {
        key: 'n',
        ctrlKey: true,
        description: 'Nuevo producto rápido',
        category: 'productos',
        action: () => setIsQuickFormOpen(true),
      },
      {
        key: 'r',
        ctrlKey: true,
        description: 'Recargar lista de productos',
        category: 'productos',
        action: () => {
          void fetchProducts({ search: searchTerm })
        },
      },
    ],
    [fetchProducts, searchTerm]
  )

  useKeyboardShortcuts(shortcuts)

  useEffect(() => {
    registerShortcuts(shortcuts)
    // Cargar productos al entrar a la pantalla
    void fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase()
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
    )
  }, [products, searchTerm])

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Productos
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestiona tu catálogo de productos
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => void fetchProducts({ search: searchTerm })}
            disabled={loadingProducts}
          >
            <RefreshCw
              className={`w-4 h-4 ${loadingProducts ? 'animate-spin' : ''}`}
            />
            <span className="hidden md:inline">Recargar</span>
          </Button>
          <QuickProductForm
            open={isQuickFormOpen}
            onOpenChange={setIsQuickFormOpen}
          />
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Buscar productos... (Ctrl+F)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <Card className="overflow-hidden">
        <ProductTable
          products={filteredProducts}
          onDelete={(id) => void deleteProductApi(Number(id))}
          // luego puedes pasar onEdit para abrir una pantalla/modal de edición
        />
      </Card>
    </div>
  )
}
