// lib/store.ts
import { create } from 'zustand'
import { User, Warehouse, Product, Sale, InventoryItem } from './types'
import {
  listProductos,
  createProducto,
  updateProducto,
  deleteProducto,
  type ProductoCreateDTO,
  type ProductoUpdateDTO,
  type ProductoReadDTO,
} from './api/products'
import { mapProductoToProduct } from './types'

interface InventoryStore {
  user: User | null
  currentWarehouse: Warehouse | null
  products: Product[]
  sales: Sale[]
  inventory: InventoryItem[]
  loadingProducts: boolean

  // actions sync
  setUser: (user: User) => void
  setCurrentWarehouse: (warehouse: Warehouse) => void
  setProducts: (products: Product[]) => void

  addProduct: (product: Product) => void
  updateProduct: (product: Product) => void
  removeProduct: (id: string) => void

  addSale: (sale: Sale) => void
  updateInventory: (item: InventoryItem) => void
  getProductsByWarehouse: (warehouseId: string) => Product[]
  getSalesByWarehouse: (warehouseId: string) => Sale[]

  // actions async (API)
  fetchProducts: (params?: { search?: string }) => Promise<void>
  createProductApi: (data: ProductoCreateDTO) => Promise<ProductoReadDTO>
  updateProductApi: (id: number, data: ProductoUpdateDTO) => Promise<ProductoReadDTO>
  deleteProductApi: (id: number) => Promise<void>
}

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  user: null,
  currentWarehouse: null,
  products: [],
  sales: [],
  inventory: [],
  loadingProducts: false,

  setUser: (user) => set({ user }),
  setCurrentWarehouse: (warehouse) => set({ currentWarehouse: warehouse }),
  setProducts: (products) => set({ products }),

  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),

  updateProduct: (product) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === product.id ? product : p)),
    })),

  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  addSale: (sale) => set((state) => ({ sales: [...state.sales, sale] })),

  updateInventory: (item) =>
    set((state) => ({
      inventory: state.inventory.map((inv) =>
        inv.id === item.id ? item : inv
      ),
    })),

  getProductsByWarehouse: (warehouseId) => {
    const { products, inventory } = get()
    return products.filter((p) =>
      inventory.some(
        (inv) => inv.productId === p.id && inv.warehouseId === warehouseId
      )
    )
  },

  getSalesByWarehouse: (warehouseId) => {
    return get().sales.filter((s) => s.warehouseId === warehouseId)
  },

  // ---- acciones async ligadas al backend ----
  async fetchProducts(params) {
    set({ loadingProducts: true })
    try {
      const data = await listProductos({
        search: params?.search,
        only_active: true,
        limit: 200,
      })
      const mapped = data.map(mapProductoToProduct)
      set({ products: mapped })
    } finally {
      set({ loadingProducts: false })
    }
  },

  async createProductApi(data) {
    const created = await createProducto(data)
    const mapped = mapProductoToProduct(created)
    get().addProduct(mapped)
    return created
  },

  async updateProductApi(id, data) {
    const updated = await updateProducto(id, data)
    const mapped = mapProductoToProduct(updated)
    get().updateProduct(mapped)
    return updated
  },

  async deleteProductApi(id) {
    await deleteProducto(id)
    get().removeProduct(String(id))
  },
}))
