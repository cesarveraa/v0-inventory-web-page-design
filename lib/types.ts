// Core data types for the inventory system
export interface User {
  id: string
  name: string
  email: string
  warehouses: Warehouse[]
}

export interface Warehouse {
  id: string
  name: string
  location: string
  products: Product[]
  inventory: InventoryItem[]
  sales: Sale[]
}

export interface Product {
  id: string
  name: string
  sku: string
  price: number
  cost: number
  category: string
  description: string
  image?: string
}

export interface InventoryItem {
  id: string
  productId: string
  warehouseId: string
  quantity: number
  minStock: number
  maxStock: number
  lastUpdated: Date
}

export interface Sale {
  id: string
  warehouseId: string
  productId: string
  quantity: number
  unitPrice: number
  totalPrice: number
  date: Date
  notes?: string
}

export interface Order {
  id: string
  warehouseId: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  items: OrderItem[]
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  productId: string
  quantity: number
  price: number
}
import type { ProductoReadDTO } from './api/products'

export function mapProductoToProduct(p: ProductoReadDTO): Product {
  const mainCategory = p.categorias?.[0]?.nombre ?? 'Sin categoría'

  return {
    id: String(p.id_producto),
    name: p.nombre,
    sku: p.codigo_sku,
    price: p.precio,
    cost: p.precio, // o cámbialo cuando tengas campo "costo" real
    category: mainCategory,
    description: p.descripcion ?? '',
    image: undefined,
  }
}