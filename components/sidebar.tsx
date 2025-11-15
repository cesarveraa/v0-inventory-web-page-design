'use client'

import { LayoutDashboard, Package, TrendingUp, ShoppingCart, BarChart3, Settings, LogOut, Menu } from 'lucide-react'
import { useState } from 'react'
import { WarehouseSelector } from '@/components/warehouse-selector'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Productos', icon: Package },
  { id: 'inventory', label: 'Inventario', icon: TrendingUp },
  { id: 'sales', label: 'Ventas', icon: ShoppingCart },
  { id: 'reports', label: 'Reportes', icon: BarChart3 },
  { id: 'settings', label: 'Configuración', icon: Settings },
]

interface SidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden max-sm:fixed max-sm:block max-sm:top-4 max-sm:left-4 max-sm:z-50 max-sm:p-2 max-sm:bg-primary max-sm:text-primary-foreground max-sm:rounded-lg"
      >
        <Menu size={24} />
      </button>

      <aside
        className={`${
          isOpen ? 'w-64' : 'w-20'
        } transition-all duration-300 bg-card border-r border-border flex flex-col h-screen sticky top-0 max-sm:fixed max-sm:left-0 max-sm:top-0 max-sm:h-screen max-sm:z-40 ${
          !isOpen && 'max-sm:w-0'
        }`}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Package className="w-6 h-6 text-primary-foreground" />
            </div>
            {isOpen && (
              <div className="flex flex-col">
                <h1 className="font-bold text-sm text-foreground whitespace-nowrap">InventoryHub</h1>
                <p className="text-xs text-muted-foreground">Pro</p>
              </div>
            )}
          </div>
        </div>

        {isOpen && (
          <div className="p-4 border-b border-border">
            <WarehouseSelector />
          </div>
        )}

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <Icon size={20} />
                {isOpen && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors">
            <LogOut size={20} />
            {isOpen && <span className="text-sm font-medium">Salir</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
