"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/lib/auth-store"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { DashboardPage } from "@/components/pages/dashboard"
import { ProductsPage } from "@/components/pages/products"
import { InventoryPage } from "@/components/pages/inventory"
import { SalesPage } from "@/components/pages/sales"
import { ReportsPage } from "@/components/pages/reports"
import { SettingsPage } from "@/components/pages/settings"
import { useInventoryStore } from "@/lib/store"
import { useKeyboardShortcuts, type KeyboardShortcut } from "@/hooks/use-keyboard-shortcuts"
import { useShortcuts } from "@/components/shortcuts-provider"
import { LoadingSpinner } from "@/components/loading-spinner"

// Fallback visual si aún no hay almacenes creados o algo falla
const SAMPLE_WAREHOUSES = [
  {
    id: "warehouse-1",
    name: "Almacén Principal",
    location: "La Paz",
    products: [],
    inventory: [],
    sales: [],
  },
  {
    id: "warehouse-2",
    name: "Almacén Secundario",
    location: "El Alto",
    products: [],
    inventory: [],
    sales: [],
  },
]

export default function DashboardPageRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const authUser = useAuthStore((s) => s.user)
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [mounted, setMounted] = useState(false)

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
    setMounted(true)
  }, [])

  // Redirige si no está autenticado
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router, mounted])

  // 🔥 Cargar almacenes reales y armar el user del inventory store
  useEffect(() => {
    if (!authUser) return

    let cancelled = false

    const { id_usuario, nombre, apellido, email } = authUser

    async function loadWarehouses() {
      try {
        const res = await fetch("/api/almacenes", {
          method: "GET",
          credentials: "include",
        })

        let almacenesData: any[] = []
        if (res.ok) {
          almacenesData = await res.json()
        }

        if (cancelled) return

        const warehouses = almacenesData.map((a) => ({
          id: String(a.id_almacen),
          name: a.nombre,
          location: a.descripcion || "Almacén",
          products: [],
          inventory: [],
          sales: [],
        }))

        const mappedUser = {
          id: String(id_usuario),
          name: [nombre, apellido].filter(Boolean).join(" "),
          email,
          warehouses: warehouses.length > 0 ? warehouses : SAMPLE_WAREHOUSES,
        }

        setUser(mappedUser)

        if (warehouses.length > 0) {
          setCurrentWarehouse(warehouses[0])
        } else {
          setCurrentWarehouse(SAMPLE_WAREHOUSES[0])
        }
      } catch (err) {
        console.error("Error cargando almacenes, usando SAMPLE_WAREHOUSES:", err)

        if (cancelled) return

        const mappedUser = {
          id: String(id_usuario),
          name: [nombre, apellido].filter(Boolean).join(" "),
          email,
          warehouses: SAMPLE_WAREHOUSES,
        }

        setUser(mappedUser)
        setCurrentWarehouse(SAMPLE_WAREHOUSES[0])
      }
    }

    loadWarehouses()

    return () => {
      cancelled = true
    }
  }, [authUser, setUser, setCurrentWarehouse])

  useEffect(() => {
    registerShortcuts(shortcuts)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!mounted || !isAuthenticated) {
    return <LoadingSpinner />
  }

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

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 overflow-auto">{renderPage()}</main>
    </div>
  )
}
