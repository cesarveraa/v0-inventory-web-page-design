"use client"

import { useEffect, useState } from "react"
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

const SAMPLE_USER = {
  id: "user-1",
  name: "Admin",
  email: "admin@example.com",
  warehouses: [
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
  ],
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState("dashboard")

  // usar selectores de zustand
  const setUser = useInventoryStore((s) => s.setUser)
  const setCurrentWarehouse = useInventoryStore((s) => s.setCurrentWarehouse)

  const { registerShortcuts, openShortcutsModal } = useShortcuts()

 const shortcuts: KeyboardShortcut[] = [
  // Navegación
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

  // 💡 Atajo global: ir a Ventas y abrir Venta Rápida
  {
  key: "v",
  ctrlKey: true,
  shiftKey: true,
  description: "Ir a Ventas y abrir Venta rápida",
  category: "acciones",
  action: () => {
    // 1. Cambiar de pantalla
    setCurrentPage("sales");

    // 2. Esperar a que SalesPage monte y después abrir QuickSaleForm
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("open-quick-sale-form"));
    }, 50);
  },
},


  // Modal de ayuda general
  {
    key: "?",
    description: "Mostrar atajos de teclado",
    action: () => openShortcutsModal(),
    category: "otro",
  },
]


  // hook de atajos (esto normalmente solo registra listeners, sin problema)
  useKeyboardShortcuts(shortcuts)

  // ⚠️ ESTE ERA EL CULPABLE: lo dejamos para que corra solo una vez
  useEffect(() => {
    registerShortcuts(shortcuts)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // <- sin dependencias para que no se re-ejecute en cada render

  // inicializar usuario/almacén una sola vez
  useEffect(() => {
    setUser(SAMPLE_USER)
    setCurrentWarehouse(SAMPLE_USER.warehouses[0])
  }, [setUser, setCurrentWarehouse])

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
