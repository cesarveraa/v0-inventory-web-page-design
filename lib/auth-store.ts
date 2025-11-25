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
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: AuthUser | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // Simulated login - in production, call an API
        if (email && password.length >= 6) {
          const user: AuthUser = {
            id: "user-" + Math.random().toString(36).substr(2, 9),
            email,
            name: email.split("@")[0],
          }
          set({ user, isAuthenticated: true })
        } else {
          throw new Error("Credenciales inválidas")
        }
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      setUser: (user) => set({ user, isAuthenticated: !!user }),
    }),
    {
      name: "auth-storage",
    },
  ),
)
