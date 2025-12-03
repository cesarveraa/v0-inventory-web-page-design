"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardPage } from "@/components/pages/dashboard"
import  ProductsPage  from "@/components/pages/products"
import { InventoryPage } from "@/components/pages/inventory"
import { SalesPage } from "@/components/pages/sales"
import { ReportsPage } from "@/components/pages/reports"
import { SettingsPage } from "@/components/pages/settings"
import { useInventoryStore } from "@/lib/store"
import { useKeyboardShortcuts, type KeyboardShortcut } from "@/hooks/use-keyboard-shortcuts"
import { useShortcuts } from "@/components/shortcuts-provider"
import { useAuthStore } from "@/lib/auth-store"
import { useRouter } from "next/navigation"
import { Landing } from "@/components/landing"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Menu } from "lucide-react"

export default function Home() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const setUser = useInventoryStore((s) => s.setUser)
  const setCurrentWarehouse = useInventoryStore((s) => s.setCurrentWarehouse)

  const { registerShortcuts, openShortcutsModal } = useShortcuts()

  const shortcuts: KeyboardShortcut[] = [
    {
      key: "1",
      ctrlKey: true,
      description: "Ir a Dashboard",
      action: () => setCurrentPage("dashboard"),
      category: "navegación",
    },
    {
      key: "2",
      ctrlKey: true,
      description: "Ir a Productos",
      action: () => setCurrentPage("products"),
      category: "navegación",
    },
    {
      key: "3",
      ctrlKey: true,
      description: "Ir a Inventario",
      action: () => setCurrentPage("inventory"),
      category: "navegación",
    },
    {
      key: "4",
      ctrlKey: true,
      description: "Ir a Ventas",
      action: () => setCurrentPage("sales"),
      category: "navegación",
    },
    {
      key: "5",
      ctrlKey: true,
      description: "Ir a Reportes",
      action: () => setCurrentPage("reports"),
      category: "navegación",
    },
    {
      key: "6",
      ctrlKey: true,
      description: "Ir a Configuración",
      action: () => setCurrentPage("settings"),
      category: "navegación",
    },
    {
      key: "v",
      ctrlKey: true,
      shiftKey: true,
      description: "Ir a Ventas y abrir Venta rápida",
      category: "acciones",
      action: () => {
        setCurrentPage("sales")
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("open-quick-sale-form"))
        }, 50)
      },
    },
    {
      key: "?",
      description: "Mostrar atajos de teclado",
      action: () => openShortcutsModal(),
      category: "otro",
    },
  ]

  useKeyboardShortcuts(shortcuts)

  useEffect(() => {
    registerShortcuts(shortcuts)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router, mounted])

  useEffect(() => {
    if (!isAuthenticated) return

    let cancelled = false

    async function loadUserAndWarehouses() {
      try {
        // Usuario actual (backend: /auth/me -> proxy: /api/auth)
        const userRes = await fetch("/api/auth", {
          method: "GET",
          credentials: "include",
        })

        if (!userRes.ok) {
          throw new Error("No se pudo obtener el usuario actual")
        }

        const userData = await userRes.json()

        // Almacenes reales (backend: /almacenes -> proxy: /api/almacenes)
        const almacenesRes = await fetch("/api/almacenes", {
          method: "GET",
          credentials: "include",
        })

        let almacenesData: any[] = []
        if (almacenesRes.ok) {
          almacenesData = await almacenesRes.json()
        }

        if (cancelled) return

        const warehouses = almacenesData.map((a) => ({
          id: String(a.id_almacen),
          name: a.nombre,
          // De momento usamos la descripción como "ubicación" visible
          location: a.descripcion || "Almacén",
          products: [],
          inventory: [],
          sales: [],
        }))

        const mappedUser = {
          id: String(userData.id_usuario ?? userData.id ?? "user-unknown"),
          name:
            [userData.nombre, userData.apellido].filter(Boolean).join(" ") ||
            userData.name ||
            "Sin nombre",
          email: userData.email ?? "sin-email",
          warehouses,
        }

        setUser(mappedUser)

        if (warehouses.length > 0) {
          setCurrentWarehouse(warehouses[0])
        }
      } catch (err) {
        console.error("Error cargando datos reales, usando SAMPLE_USER como fallback:", err)
        if (cancelled) return
      }
    }

    loadUserAndWarehouses()

    return () => {
      cancelled = true
    }
  }, [isAuthenticated, setUser, setCurrentWarehouse])

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />
      case "products":
        return <ProductsPage />
      case "inventory":
        return <InventoryPage />
      case "sales":
        return <SalesPage />
      case "reports":
        return <ReportsPage />
      case "settings":
        return <SettingsPage />
      default:
        return <DashboardPage />
    }
  }

  if (!mounted) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Landing />
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      <main className="flex-1 overflow-auto">
        {renderPage()}
      </main>
    </div>
  )

}
