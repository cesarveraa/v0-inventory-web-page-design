// lib/api/catalogs.ts
import { apiFetch } from './api-client'
import type { CategoriaDTO, ProveedorDTO, UnidadMedidaDTO } from './products'

export async function listCategorias() {
  return apiFetch<CategoriaDTO[]>('/categories')
}

export async function listProveedores() {
  return apiFetch<ProveedorDTO[]>('/suppliers')
}

export async function listUnidadesMedida() {
  return apiFetch<UnidadMedidaDTO[]>('/units')
}
// lib/api/catalogs.ts
import { apiFetch } from './api-client'
import type { CategoriaDTO, ProveedorDTO, UnidadMedidaDTO } from './products'

export async function listCategorias() {
  return apiFetch<CategoriaDTO[]>('/categories')
}

export async function listProveedores() {
  return apiFetch<ProveedorDTO[]>('/suppliers')
}

export async function listUnidadesMedida() {
  return apiFetch<UnidadMedidaDTO[]>('/units')
}
