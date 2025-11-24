'use client'

import { Product } from '@/lib/types'
import { Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProductTableProps {
  products: Product[]
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm md:text-base">
        <thead>
          <tr className="border-b border-border bg-card/50">
            <th className="text-left p-3 md:p-4 font-semibold text-foreground">
              Producto
            </th>
            <th className="text-left p-3 md:p-4 font-semibold text-foreground">
              SKU
            </th>
            <th className="text-left p-3 md:p-4 font-semibold text-foreground">
              Categoría
            </th>
            <th className="text-right p-3 md:p-4 font-semibold text-foreground">
              Precio
            </th>
            <th className="text-right p-3 md:p-4 font-semibold text-foreground">
              Costo
            </th>
            <th className="text-left p-3 md:p-4 font-semibold text-foreground">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="p-8 text-center text-muted-foreground text-sm"
              >
                No hay productos registrados
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-border hover:bg-card/50 transition-colors"
              >
                <td className="p-3 md:p-4 font-medium text-foreground">
                  {product.name}
                </td>
                <td className="p-3 md:p-4 text-muted-foreground text-xs md:text-sm">
                  {product.sku}
                </td>
                <td className="p-3 md:p-4 text-muted-foreground text-xs md:text-sm">
                  {product.category}
                </td>
                <td className="p-3 md:p-4 font-medium text-foreground text-right">
                  ${product.price.toFixed(2)}
                </td>
                <td className="p-3 md:p-4 text-muted-foreground text-right">
                  ${product.cost.toFixed(2)}
                </td>
                <td className="p-3 md:p-4 flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"
                    onClick={() => onEdit?.(product.id)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="hover:bg-muted rounded-lg text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete?.(product.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
