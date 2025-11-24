// lib/api/products.ts
import { apiFetch } from '../api-client'

export interface ProductoAtributoDTO {
  id_atributo?: number
  nombre_atributo: string
  valor: string
}

export interface CategoriaDTO {
  id_categoria: number
  nombre: string
}

export interface ProveedorDTO {
  id_proveedor: number
  nombre: string
}

export interface UnidadMedidaDTO {
  id_unidad: number
  nombre: string
  abreviatura: string
}

export interface ProductoReadDTO {
  id_producto: number
  codigo_sku: string
  codigo_barra?: string | null
  nombre: string
  descripcion?: string | null
  stock_minimo_global: number
  estado: boolean
  precio: number
  proveedor?: ProveedorDTO | null
  unidad_medida?: UnidadMedidaDTO | null
  categorias: CategoriaDTO[]
  atributos: ProductoAtributoDTO[]
}

export interface ProductoCreateDTO {
  codigo_sku: string
  codigo_barra?: string | null
  nombre: string
  descripcion?: string | null
  stock_minimo_global: number
  estado: boolean
  precio: number
  proveedores_id_proveedor: number
  unidades_medida_id_unidad: number
  categorias_ids?: number[]
  atributos: ProductoAtributoDTO[]
}

export type ProductoUpdateDTO = Partial<ProductoCreateDTO> & {
  categorias_ids?: number[] | null
  atributos?: ProductoAtributoDTO[] | null
}

export interface ProductListParams {
  skip?: number
  limit?: number
  search?: string
  categoria_id?: number
  proveedor_id?: number
  only_active?: boolean
}

export async function listProductos(params: ProductListParams = {}) {
  return apiFetch<ProductoReadDTO[]>('/products', { query: params })
}

export async function getProducto(id: number) {
  return apiFetch<ProductoReadDTO>(`/products/${id}`)
}

export async function createProducto(data: ProductoCreateDTO) {
  return apiFetch<ProductoReadDTO>('/products', {
    method: 'POST',
    body: data,
  })
}

export async function updateProducto(id: number, data: ProductoUpdateDTO) {
  return apiFetch<ProductoReadDTO>(`/products/${id}`, {
    method: 'PATCH',
    body: data,
  })
}

export async function deleteProducto(id: number) {
  return apiFetch<null>(`/products/${id}`, {
    method: 'DELETE',
  })
}
