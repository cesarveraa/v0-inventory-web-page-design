'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Save, Plus, Trash2, Edit2 } from 'lucide-react'
import { useState } from 'react'
import { useInventoryStore } from '@/lib/store'

export function SettingsPage() {
  const { user, currentWarehouse } = useInventoryStore()
  const [activeTab, setActiveTab] = useState('general')

  const users = [
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'Admin', status: 'active' },
    { id: 2, name: 'María García', email: 'maria@example.com', role: 'Manager', status: 'active' },
    { id: 3, name: 'Carlos López', email: 'carlos@example.com', role: 'User', status: 'active' },
  ]

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'users', label: 'Usuarios' },
    { id: 'warehouses', label: 'Almacenes' },
    { id: 'security', label: 'Seguridad' },
  ]

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Configuración</h1>
        <p className="text-muted-foreground mt-2">Administra tu sistema y usuarios</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 md:px-4 py-3 font-medium border-b-2 transition-colors text-xs md:text-base ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <Card className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">Información General</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-foreground mb-2">Nombre de Empresa</label>
                <input
                  type="text"
                  defaultValue="Abyss Inventario Inc."
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-foreground mb-2">Email de Contacto</label>
                <input
                  type="email"
                  defaultValue="info@Abyss Inventario.com"
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-foreground mb-2">Teléfono</label>
                <input
                  type="tel"
                  defaultValue="+1 234 567 8900"
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full md:w-auto">
                <Save size={16} className="md:size-20" />
                Guardar Cambios
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Users Management */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h2 className="text-lg md:text-xl font-bold text-foreground">Gestión de Usuarios</h2>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full md:w-auto">
              <Plus size={16} className="md:size-20" />
              Nuevo Usuario
            </Button>
          </div>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm md:text-base">
                <thead>
                  <tr className="border-b border-border bg-card/50">
                    <th className="text-left p-3 md:p-4 font-semibold text-foreground">Nombre</th>
                    <th className="text-left p-3 md:p-4 font-semibold text-foreground">Email</th>
                    <th className="text-left p-3 md:p-4 font-semibold text-foreground">Rol</th>
                    <th className="text-left p-3 md:p-4 font-semibold text-foreground">Estado</th>
                    <th className="text-left p-3 md:p-4 font-semibold text-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-border hover:bg-card/50 transition-colors">
                      <td className="p-3 md:p-4 font-medium text-foreground text-xs md:text-base">{user.name}</td>
                      <td className="p-3 md:p-4 text-muted-foreground text-xs md:text-base">{user.email}</td>
                      <td className="p-3 md:p-4">
                        <span className="px-2 md:px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {user.role}
                        </span>
                      </td>
                      <td className="p-3 md:p-4">
                        <span className="px-2 md:px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                          {user.status}
                        </span>
                      </td>
                      <td className="p-3 md:p-4 flex gap-2">
                        <button className="p-1.5 md:p-2 hover:bg-muted rounded-lg transition-colors">
                          <Edit2 size={16} className="text-muted-foreground md:size-18" />
                        </button>
                        <button className="p-1.5 md:p-2 hover:bg-muted rounded-lg transition-colors">
                          <Trash2 size={16} className="text-destructive md:size-18" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Warehouses */}
      {activeTab === 'warehouses' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h2 className="text-lg md:text-xl font-bold text-foreground">Mis Almacenes</h2>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full md:w-auto">
              <Plus size={16} className="md:size-20" />
              Nuevo Almacén
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {user?.warehouses.map((warehouse) => (
              <Card key={warehouse.id} className="p-4 md:p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-bold text-foreground text-sm md:text-base">{warehouse.name}</h3>
                  <div className="flex gap-2">
                    <button className="p-1 hover:bg-muted rounded">
                      <Edit2 size={14} className="text-muted-foreground md:size-16" />
                    </button>
                    <button className="p-1 hover:bg-muted rounded">
                      <Trash2 size={14} className="text-destructive md:size-16" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs md:text-sm text-muted-foreground">Ubicación: {warehouse.location}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Estado</p>
                      <p className="font-bold text-foreground text-sm">Activo</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Productos</p>
                      <p className="font-bold text-accent text-sm">{warehouse.products.length}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Security */}
      {activeTab === 'security' && (
        <Card className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">Configuración de Seguridad</h2>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs md:text-sm font-medium text-foreground mb-2">Contraseña Actual</label>
              <input
                type="password"
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-foreground mb-2">Nueva Contraseña</label>
              <input
                type="password"
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-foreground mb-2">Confirmar Contraseña</label>
              <input
                type="password"
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full md:w-auto">
              <Save size={16} className="md:size-20" />
              Cambiar Contraseña
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
