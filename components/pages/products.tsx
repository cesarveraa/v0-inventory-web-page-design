'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Search, Edit2, Trash2 } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useInventoryStore } from '@/lib/store'
import { QuickProductForm } from '@/components/forms/quick-product-form'
import { ProductTable } from '@/components/products/product-table'

export function ProductsPage() {
  const { products } = useInventoryStore()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProducts = useMemo(() => {
    return products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [products, searchTerm])

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Productos</h1>
          <p className="text-muted-foreground mt-2">Gestiona tu catálogo de productos</p>
        </div>
        <QuickProductForm />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <Card className="overflow-hidden">
        <ProductTable products={filteredProducts} />
      </Card>
    </div>
  )
}
