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
// lib/types.ts
export interface Product {
  id: string
  sku: string
  name: string
  category: string
  price: number
  cost?: number
  stock?: number
  // opcional para debug
  _raw?: unknown
}
