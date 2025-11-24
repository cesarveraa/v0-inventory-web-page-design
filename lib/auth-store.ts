// lib/auth-store.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface AuthUser {
  id: string
  email: string
  name: string
}

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  accessToken: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: AuthUser | null) => void
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1"

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,

      login: async (email: string, password: string) => {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })

        if (!res.ok) {
          const msg = await res.text()
          throw new Error(msg || "Error al iniciar sesión")
        }

        const data = await res.json()

        set({
          user: data.user,
          isAuthenticated: true,
          accessToken: data.access_token,
        })
      },

      logout: () => set({ user: null, isAuthenticated: false, accessToken: null }),

      setUser: (user) => set({ user, isAuthenticated: !!user }),
    }),
    {
      name: "auth-storage",
    },
  ),
)
