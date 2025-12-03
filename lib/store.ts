// lib/store.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product } from "@/lib/types"

interface InventoryItem {
  id: string
  productId: string
  warehouseId: string
  quantity: number
  minStock: number
  maxStock: number
  lastUpdated: Date
}

interface Warehouse {
  id: string
  name: string
}

interface InventoryState {
  products: Product[]
  inventory: InventoryItem[]
  currentWarehouse: Warehouse | null

  setProducts: (products: Product[]) => void
  // opcional: para añadir uno nuevo
  addProduct: (product: Product) => void

  updateInventory: (item: InventoryItem) => void
  setCurrentWarehouse: (warehouse: Warehouse | null) => void
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      products: [],
      inventory: [],
      currentWarehouse: null,

      setProducts: (products) => set({ products }),

      addProduct: (product) =>
        set((state) => ({ products: [...state.products, product] })),

      updateInventory: (item) => {
        set((state) => {
          const existsIndex = state.inventory.findIndex(
            (inv) =>
              inv.id === item.id ||
              (inv.productId === item.productId &&
                inv.warehouseId === item.warehouseId),
          )

          if (existsIndex !== -1) {
            const cloned = [...state.inventory]
            cloned[existsIndex] = item
            return { inventory: cloned }
          }

          return { inventory: [...state.inventory, item] }
        })
      },

      setCurrentWarehouse: (warehouse) => set({ currentWarehouse: warehouse }),
    }),
    {
      name: "inventory-storage",
    },
  ),
)
