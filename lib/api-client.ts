// lib/api-client.ts
import { useAuthStore } from '@/lib/auth-store'

const PRODUCT_API_BASE =
  process.env.NEXT_PUBLIC_PRODUCT_API_URL ?? 'http://localhost:8002/api/v1'

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'

interface ApiOptions {
  method?: HttpMethod
  body?: any
  query?: Record<string, any>
  signal?: AbortSignal
}

/**
 * Wrapper genérico para llamar a tu product-service.
 * - Adjunta Authorization: Bearer <token> si existe en auth-store
 * - Envía cookies (para el caso de auth por cookie)
 */
export async function apiFetch<T>(
  path: string,
  { method = 'GET', body, query, signal }: ApiOptions = {}
): Promise<T> {
  const token = useAuthStore.getState().accessToken // ajusta el nombre si es distinto

  const url = new URL(path.startsWith('http') ? path : PRODUCT_API_BASE + path)

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null) return
      url.searchParams.set(key, String(value))
    })
  }

  const res = await fetch(url.toString(), {
    method,
    signal,
    credentials: 'include', // para cookies http-only
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    // Si es 401, puedes disparar logout automáticamente si quieres
    let errorText = ''
    try {
      const data = await res.json()
      errorText = data.detail ?? JSON.stringify(data)
    } catch {
      errorText = await res.text()
    }
    throw new Error(`API error (${res.status}): ${errorText}`)
  }

  if (res.status === 204) {
    // no content
    // @ts-expect-error
    return null
  }

  return (await res.json()) as T
}
