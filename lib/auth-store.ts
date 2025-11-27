// lib/auth-store.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Empresa {
  id_empresa: number
  nombre: string
  razon_social: string
  nit: string
}

export interface AuthUser {
  id_usuario: number
  nombre: string
  apellido: string
  email: string
  es_dueno: boolean
  empresa: Empresa | null
  roles: string[]
  permisos: string[]
}

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: AuthUser | null) => void
  fetchCurrentUser: () => Promise<void>
}

const API_AUTH_BASE = "/api/auth"

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const res = await fetch(`${API_AUTH_BASE}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include", // incluye cookie del dominio actual
        })

        if (!res.ok) {
          let msg = "Credenciales inválidas"
          try {
            const data = await res.json()
            msg = (data.detail as string) || (data.message as string) || msg
          } catch {
            // ignore
          }
          throw new Error(msg)
        }

        const data = (await res.json()) as { message: string; user: AuthUser }
        set({ user: data.user, isAuthenticated: true })
      },

      logout: async () => {
        try {
          await fetch(`${API_AUTH_BASE}/logout`, {
            method: "POST",
            credentials: "include",
          })
        } catch {
          // aunque falle, limpiamos estado local
        } finally {
          set({ user: null, isAuthenticated: false })
        }
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      fetchCurrentUser: async () => {
        try {
          const res = await fetch(`${API_AUTH_BASE}/me`, {
            method: "GET",
            credentials: "include",
          })

          if (!res.ok) {
            set({ user: null, isAuthenticated: false })
            return
          }

          const user = (await res.json()) as AuthUser
          set({ user, isAuthenticated: true })
        } catch {
          set({ user: null, isAuthenticated: false })
        }
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)
