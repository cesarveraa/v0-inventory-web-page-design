"use client"

import { LayoutDashboard, Package, TrendingUp, ShoppingCart, BarChart3, Settings, LogOut } from "lucide-react"
import { WarehouseSelector } from "@/components/warehouse-selector"
import { ThemeToggle } from "@/components/theme-toggle"

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Productos", icon: Package },
  { id: "inventory", label: "Inventario", icon: TrendingUp },
  { id: "sales", label: "Ventas", icon: ShoppingCart },
  { id: "reports", label: "Reportes", icon: BarChart3 },
  { id: "settings", label: "Configuración", icon: Settings },
]

interface SidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  return (
    <aside
      className={`w-64 transition-all duration-300 bg-card border-r border-border flex flex-col h-screen sticky top-0
      max-sm:fixed max-sm:left-0 max-sm:top-0 max-sm:h-screen max-sm:z-40`}
    >
      {/* Header / Logo */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Package className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold text-sm text-foreground whitespace-nowrap">Abyss Inventario</h1>
            <p className="text-xs text-muted-foreground">Pro</p>
          </div>
        </div>
      </div>

      {/* Selector de almacén */}
      <div className="p-4 border-b border-border">
        <WarehouseSelector />
      </div>

      {/* Menú */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
              }`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Tema + Salir */}
      <div className="p-4 border-t border-border space-y-2">
        <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground">
          <span>Tema</span>
          <ThemeToggle />
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors">
          <LogOut size={20} />
          <span className="text-sm font-medium">Salir</span>
        </button>
      </div>
    </aside>
  )
}
