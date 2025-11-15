'use client'

import { useEffect } from 'react'
import { Sidebar } from '@/components/sidebar'
import { DashboardPage } from '@/components/pages/dashboard'
import { ProductsPage } from '@/components/pages/products'
import { InventoryPage } from '@/components/pages/inventory'
import { SalesPage } from '@/components/pages/sales'
import { ReportsPage } from '@/components/pages/reports'
import { SettingsPage } from '@/components/pages/settings'
import { useInventoryStore } from '@/lib/store'
import { useState } from 'react'

const SAMPLE_USER = {
  id: 'user-1',
  name: 'Admin',
  email: 'admin@example.com',
  warehouses: [
    {
      id: 'warehouse-1',
      name: 'Almacén Principal',
      location: 'Bogotá',
      products: [],
      inventory: [],
      sales: [],
    },
    {
      id: 'warehouse-2',
      name: 'Almacén Secundario',
      location: 'Medellín',
      products: [],
      inventory: [],
      sales: [],
    },
  ],
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const { setUser, setCurrentWarehouse, user } = useInventoryStore()

  useEffect(() => {
    setUser(SAMPLE_USER)
    setCurrentWarehouse(SAMPLE_USER.warehouses[0])
  }, [])

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />
      case 'products':
        return <ProductsPage />
      case 'inventory':
        return <InventoryPage />
      case 'sales':
        return <SalesPage />
      case 'reports':
        return <ReportsPage />
      case 'settings':
        return <SettingsPage />
      default:
        return <DashboardPage />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 overflow-auto">
        {renderPage()}
      </main>
    </div>
  )
}
