"use client"

import { Sale } from "@/lib/types"
import { useInventoryStore } from "@/lib/store"
import { Trash2 } from "lucide-react"

function formatMoney(value: number | undefined | null) {
  const num = Number(value ?? 0)
  if (!Number.isFinite(num)) return "Bs 0.00"
  return `Bs ${num.toFixed(2)}`
}

interface SalesTableProps {
  sales: (Sale | any)[]
}

export function SalesTable({ sales }: SalesTableProps) {
  const { products } = useInventoryStore()

  const getProductNameFromStore = (productId: string) => {
    return products.find((p) => p.id === productId)?.name
  }

  const getProductName = (sale: any) => {
    // 1) si viene de demo o del modal con nombre
    if (sale.productName) return sale.productName
    // 2) buscar en store
    const fromStore = getProductNameFromStore(sale.productId)
    if (fromStore) return fromStore
    // 3) fallback
    return "Producto desconocido"
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-card/50">
            <th className="text-left p-3 md:p-4 font-semibold text-foreground text-sm md:text-base">
              Producto
            </th>
            <th className="text-right p-3 md:p-4 font-semibold text-foreground text-sm md:text-base">
              Cantidad
            </th>
            <th className="text-right p-3 md:p-4 font-semibold text-foreground text-sm md:text-base">
              Precio
            </th>
            <th className="text-right p-3 md:p-4 font-semibold text-foreground text-sm md:text-base">
              Total
            </th>
            <th className="text-left p-3 md:p-4 font-semibold text-foreground text-sm md:text-base">
              Fecha
            </th>
            <th className="text-left p-3 md:p-4 font-semibold text-foreground text-sm md:text-base">
              Notas
            </th>
            <th className="text-left p-3 md:p-4 font-semibold text-foreground text-sm md:text-base">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {sales.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="p-8 text-center text-muted-foreground"
              >
                No hay ventas registradas
              </td>
            </tr>
          ) : (
            sales.map((sale: any) => (
              <tr
                key={sale.id}
                className="border-b border-border hover:bg-card/50 transition-colors"
              >
                <td className="p-3 md:p-4 font-medium text-foreground text-sm md:text-base">
                  {getProductName(sale)}
                </td>
                <td className="p-3 md:p-4 text-right text-foreground text-sm md:text-base">
                  {sale.quantity}
                </td>
                <td className="p-3 md:p-4 text-right text-foreground text-sm md:text-base">
                  {formatMoney(sale.unitPrice)}
                </td>
                <td className="p-3 md:p-4 font-bold text-right text-accent text-sm md:text-base">
                  {formatMoney(sale.totalPrice)}
                </td>
                <td className="p-3 md:p-4 text-muted-foreground text-xs md:text-sm">
                  {sale.date
                    ? new Date(sale.date).toLocaleDateString("es-BO")
                    : "-"}
                </td>
                <td className="p-3 md:p-4 text-muted-foreground text-xs md:text-sm truncate">
                  {sale.notes || "-"}
                </td>
                <td className="p-3 md:p-4">
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
