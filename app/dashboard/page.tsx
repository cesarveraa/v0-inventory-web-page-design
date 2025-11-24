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

const SAMPLE_WAREHOUSES = [
  {
    id: "warehouse-1",
    name: "Almacén Principal",
    location: "Bogotá",
    products: [],
    inventory: [],
    sales: [],
  },
  {
    id: "warehouse-2",
    name: "Almacén Secundario",
    location: "Medellín",
    products: [],
    inventory: [],
    sales: [],
  },
]

export default function DashboardPageRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user = useAuthStore((s) => s.user)
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

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router, mounted])

  useEffect(() => {
    if (user) {
      setUser({
        id: user.id,
        name: user.name,
        email: user.email,
        warehouses: SAMPLE_WAREHOUSES,
      })
      setCurrentWarehouse(SAMPLE_WAREHOUSES[0])
    }
  }, [user, setUser, setCurrentWarehouse])

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
