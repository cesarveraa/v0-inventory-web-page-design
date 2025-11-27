"use client"

import { useInventoryStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"

export function WarehouseSelector() {
  // Solo leemos user y el setter. No leemos currentWarehouse.
  const user = useInventoryStore((s) => s.user)
  const setCurrentWarehouse = useInventoryStore((s) => s.setCurrentWarehouse)

  // 🔹 Caso 1: todavía no hay user en el store → estamos cargando
  if (!user) {
    return (
      <div className="flex items-center gap-2 p-2 md:p-3 bg-card rounded-lg border border-border">
        <span className="text-xs md:text-sm text-muted-foreground">
          Cargando almacenes...
        </span>
      </div>
    )
  }

  // 🔹 Caso 2: ya hay user, pero la respuesta fue lista vacía → realmente no hay almacenes
  if (!user.warehouses || user.warehouses.length === 0) {
    return (
      <div className="flex items-center gap-2 p-2 md:p-3 bg-card rounded-lg border border-border">
        <span className="text-xs md:text-sm text-muted-foreground">
          Sin almacenes
        </span>
        <Button size="sm" variant="ghost" className="text-xs md:text-sm">
          <Plus className="w-3 h-3 md:w-4 md:h-4" />
          Crear
        </Button>
      </div>
    )
  }

  // 🔹 Caso 3: ya hay almacenes → selector normal
  const defaultId = user.warehouses[0].id

  return (
    <Select
      // Importante: usamos defaultValue, NO value
      defaultValue={defaultId}
      onValueChange={(id) => {
        const warehouse = user.warehouses.find((w) => w.id === id)
        if (warehouse) {
          // Solo se llama cuando el usuario cambia el select
          setCurrentWarehouse(warehouse)
        }
      }}
    >
      <SelectTrigger className="w-full text-xs md:text-sm">
        <SelectValue placeholder="Seleccionar almacén" />
      </SelectTrigger>

      <SelectContent>
        {user.warehouses.map((warehouse) => (
          <SelectItem key={warehouse.id} value={warehouse.id}>
            <div className="flex items-center gap-2">
              <span className="text-xs md:text-sm">{warehouse.name}</span>
              <span className="text-xs text-muted-foreground">
                ({warehouse.location})
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
