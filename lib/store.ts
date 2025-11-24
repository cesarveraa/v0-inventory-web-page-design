// lib/store.ts
import { create } from 'zustand'
import {
  User,
  Warehouse,
  Product,
  Sale,
  InventoryItem,
  mapProductoToProduct,   
} from './types'

import {
  listProductos,
  createProducto,
  updateProducto,
  deleteProducto,
  type ProductoCreateDTO,
  type ProductoUpdateDTO,
} from './api/products'


interface InventoryStore {
  user: User | null
  currentWarehouse: Warehouse | null
  products: Product[]
  sales: Sale[]
  inventory: InventoryItem[]
  loadingProducts: boolean

  // setters básicos
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

  // acciones async contra el backend de productos
  fetchProducts: (params?: { search?: string }) => Promise<void>
  createProductApi: (data: ProductoCreateDTO) => Promise<void>
  updateProductApi: (id: number, data: ProductoUpdateDTO) => Promise<void>
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
      inventory.some(
        (inv) => inv.productId === p.id && inv.warehouseId === warehouseId
      )
    )
  },

  getSalesByWarehouse: (warehouseId) => {
    return get().sales.filter((s) => s.warehouseId === warehouseId)
  },

  // -------- acciones async contra el microservicio de productos --------
  async fetchProducts(params) {
    set({ loadingProducts: true })
    try {
      const data = await listProductos({
        search: params?.search,
        only_active: true,
        limit: 200,
      })
      // data es ProductoRead[] del backend → los mapeamos a Product UI
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
  },

  async updateProductApi(id, data) {
    const updated = await updateProducto(id, data)
    const mapped = mapProductoToProduct(updated)
    get().updateProduct(mapped)
  },

  async deleteProductApi(id) {
    await deleteProducto(id)
    get().removeProduct(String(id))
  },
}))
