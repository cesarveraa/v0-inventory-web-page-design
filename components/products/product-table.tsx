"use client"

import { Product } from "@/lib/types"
import { Edit2, Trash2 } from "lucide-react"

interface ProductTableProps {
  products: Product[]
}

// Helper para formatear dinero sin romperse
function formatMoney(value: number | undefined | null) {
  const num = Number(value ?? 0)
  return `Bs ${num.toFixed(2)}`
}

export function ProductTable({ products }: ProductTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-card/50">
            <th className="text-left p-3 md:p-4 font-semibold text-foreground text-sm md:text-base">
              Producto
            </th>
            <th className="text-left p-3 md:p-4 font-semibold text-foreground text-sm md:text-base">
              SKU
            </th>
            <th className="text-left p-3 md:p-4 font-semibold text-foreground text-sm md:text-base">
              Categoría
            </th>
            <th className="text-right p-3 md:p-4 font-semibold text-foreground text-sm md:text-base">
              Precio
            </th>
            <th className="text-right p-3 md:p-4 font-semibold text-foreground text-sm md:text-base">
              Costo
            </th>
            <th className="text-left p-3 md:p-4 font-semibold text-foreground text-sm md:text-base">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="p-8 text-center text-muted-foreground"
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
                <td className="p-3 md:p-4 font-medium text-foreground text-sm md:text-base">
                  {product.name}
                </td>
                <td className="p-3 md:p-4 text-muted-foreground text-xs md:text-sm">
                  {product.sku}
                </td>
                <td className="p-3 md:p-4 text-muted-foreground text-xs md:text-sm">
                  {product.category}
                </td>
                <td className="p-3 md:p-4 font-medium text-foreground text-right text-sm md:text-base">
                  {formatMoney((product as any).price)}
                </td>
                <td className="p-3 md:p-4 text-muted-foreground text-right text-sm md:text-base">
                  {formatMoney((product as any).cost)}
                </td>
                <td className="p-3 md:p-4 flex gap-2">
                  <button className="p-1.5 md:p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                    <Edit2 size={16} className="md:size-18" />
                  </button>
                  <button className="p-1.5 md:p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-destructive">
                    <Trash2 size={16} className="md:size-18" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
