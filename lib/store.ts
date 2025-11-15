// Global state management for inventory system
import { create } from 'zustand'
import { User, Warehouse, Product, Sale, InventoryItem } from './types'

interface InventoryStore {
  user: User | null
  currentWarehouse: Warehouse | null
  products: Product[]
  sales: Sale[]
  inventory: InventoryItem[]
  
  setUser: (user: User) => void
  setCurrentWarehouse: (warehouse: Warehouse) => void
  addProduct: (product: Product) => void
  addSale: (sale: Sale) => void
  updateInventory: (item: InventoryItem) => void
  getProductsByWarehouse: (warehouseId: string) => Product[]
  getSalesByWarehouse: (warehouseId: string) => Sale[]
}

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  user: null,
  currentWarehouse: null,
  products: [],
  sales: [],
  inventory: [],
  
  setUser: (user) => set({ user }),
  
  setCurrentWarehouse: (warehouse) => set({ currentWarehouse: warehouse }),
  
  addProduct: (product) => 
    set((state) => ({ products: [...state.products, product] })),
  
  addSale: (sale) => 
    set((state) => ({ sales: [...state.sales, sale] })),
  
  updateInventory: (item) => 
    set((state) => ({
      inventory: state.inventory.map((inv) =>
        inv.id === item.id ? item : inv
      ),
    })),
  
  getProductsByWarehouse: (warehouseId) => {
    const { products, inventory } = get()
    return products.filter((p) =>
      inventory.some((inv) => inv.productId === p.id && inv.warehouseId === warehouseId)
    )
  },
  
  getSalesByWarehouse: (warehouseId) => {
    return get().sales.filter((s) => s.warehouseId === warehouseId)
  },
}))
