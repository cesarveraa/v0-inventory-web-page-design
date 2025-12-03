
// lib/api/products.ts
import type { Product } from "@/lib/types"

const API_PRODUCTS_BASE = "https://abyss-product-service.vercel.app/api/v1/products"

export interface BackendCategoria {
  id_categoria: number
  nombre: string
  descripcion?: string | null
}

export interface BackendProducto {
  id_producto: number
  codigo_sku: string
  codigo_barra?: string | null
  nombre: string
  descripcion?: string | null
  stock_minimo_global: number
  estado: boolean
  fecha_creacion: string
  precio: string | number
  proveedores_id_proveedor: number
  unidades_medida_id_unidad: number
  empresas_id_empresa: number
  categorias: BackendCategoria[]
  atributos: {
    id_atributo: number
    nombre_atributo: string
    valor?: string | null
  }[]
}

export async function fetchProductsFromApi(): Promise<BackendProducto[]> {
  const res = await fetch(`${API_PRODUCTS_BASE}?limit=100`, {
    method: "GET",
    credentials: "include", // manda cookie con el token del auth-service
  })

  if (!res.ok) {
    throw new Error(`Error al obtener productos (${res.status})`)
  }

  const data = (await res.json()) as BackendProducto[]
  return data
}

// Mapea del backend a tu tipo Product del front
export function mapBackendToFrontProduct(p: BackendProducto): Product {
  return {
    id: String(p.id_producto),
    sku: p.codigo_sku,
    name: p.nombre,
    category: p.categorias?.[0]?.nombre ?? "Sin categoría",
    price: Number(p.precio ?? 0),
    // Haces opcional cost y stock hasta que los soporte el backend
    cost: undefined,
    stock: undefined,
    // por si luego quieres debugear:
    _raw: p as any,
  } as Product
}
