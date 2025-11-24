'use client'

import { useAuthStore } from './auth-store'

/**
 * Base URL del microservicio de productos.
 * Ajusta la env si quieres otro host/puerto.
 *
 * Ejemplo .env.local:
 *   NEXT_PUBLIC_PRODUCTS_API_URL=http://localhost:8001/api/v1
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_PRODUCTS_API_URL ?? 'http://localhost:8000/api/v1'

// Opciones extra para apiFetch
export interface ApiOptions extends RequestInit {
  /**
   * Si false, NO manda Authorization (útil para /auth/login).
   * Por defecto true.
   */
  auth?: boolean
}

/**
 * Obtiene el token desde el auth-store o localStorage.
 * Se espera que el auth-store guarde el accessToken
 * y que también lo persista en localStorage con la key 'abyss.token'.
 */
function getTokenFromStore(): string | null {
  try {
    const state = useAuthStore.getState() as any
    if (state?.accessToken) {
      return state.accessToken as string
    }

    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('abyss.token')
      if (stored) return stored
    }
  } catch {
    // ignorar errores silenciosamente
  }
  return null
}

/**
 * Cliente genérico para consumir la API del backend.
 * - Agrega JWT en Authorization si auth !== false
 * - Usa credentials: 'include' por si usas cookies (Supabase, etc.)
 * - Devuelve JSON tipado (si el backend responde JSON)
 */

export async function apiFetch(path: string, options: ApiOptions = {}) {
  const { accessToken } = useAuthStore.getState()
  const headers = new Headers(options.headers || {})

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (options.auth !== false && accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      credentials: 'include',
    })

    if (!res.ok) {
      let msg = ''
      try {
        const data = await res.json()
        msg = (data as any).detail ?? JSON.stringify(data)
      } catch {
        msg = await res.text()
      }
      throw new Error(`API error (${res.status}): ${msg}`)
    }

    if (res.status === 204) return null
    return res.json()
  } catch (err) {
    console.error('❌ apiFetch error:', err)
    throw err
  }
}