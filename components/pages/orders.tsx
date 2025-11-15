'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Eye, Printer, DollarSign } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const ordersData = [
  { id: 'ORD-001', customer: 'Empresa ABC', date: '2025-01-15', total: '$2,450', status: 'completed', items: 5 },
  { id: 'ORD-002', customer: 'Corporativo XYZ', date: '2025-01-14', total: '$1,890', status: 'processing', items: 3 },
  { id: 'ORD-003', customer: 'Retail Plus', date: '2025-01-13', total: '$5,670', status: 'pending', items: 8 },
  { id: 'ORD-004', customer: 'Store 123', date: '2025-01-12', total: '$890', status: 'completed', items: 2 },
  { id: 'ORD-005', customer: 'Tech Solutions', date: '2025-01-11', total: '$3,200', status: 'cancelled', items: 4 },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-accent/10 text-accent'
    case 'processing':
      return 'bg-secondary/10 text-secondary'
    case 'pending':
      return 'bg-chart-4/10 text-chart-4'
    case 'cancelled':
      return 'bg-destructive/10 text-destructive'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Completada'
    case 'processing':
      return 'Procesando'
    case 'pending':
      return 'Pendiente'
    case 'cancelled':
      return 'Cancelada'
    default:
      return status
  }
}

export function OrdersPage() {
  return (
    <div className="p-6 space-y-6 max-sm:p-4">
      <div className="flex items-center justify-between max-sm:flex-col max-sm:gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground max-sm:text-2xl">Órdenes</h1>
          <p className="text-muted-foreground mt-2">Gestiona las órdenes de compra y venta</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground max-sm:w-full">
          <Plus size={20} />
          Nueva Orden
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-muted-foreground text-sm">Total Órdenes</p>
          <p className="text-3xl font-bold text-foreground mt-2">1,245</p>
          <p className="text-xs text-accent mt-2">↑ 12% este mes</p>
        </Card>
        <Card className="p-4">
          <p className="text-muted-foreground text-sm">Órdenes Pendientes</p>
          <p className="text-3xl font-bold text-chart-4 mt-2">23</p>
          <p className="text-xs text-muted-foreground mt-2">Requieren atención</p>
        </Card>
        <Card className="p-4">
          <p className="text-muted-foreground text-sm">Ingresos Totales</p>
          <p className="text-3xl font-bold text-primary mt-2">$125K</p>
          <p className="text-xs text-accent mt-2">Este mes</p>
        </Card>
        <Card className="p-4">
          <p className="text-muted-foreground text-sm">Tasa Completud</p>
          <p className="text-3xl font-bold text-secondary mt-2">94%</p>
          <p className="text-xs text-accent mt-2">↑ 2% desde ayer</p>
        </Card>
      </div>

      {/* Orders Table */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Órdenes Recientes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-card/50">
                <th className="text-left p-4 font-semibold text-foreground">Orden ID</th>
                <th className="text-left p-4 font-semibold text-foreground">Cliente</th>
                <th className="text-left p-4 font-semibold text-foreground">Fecha</th>
                <th className="text-left p-4 font-semibold text-foreground">Artículos</th>
                <th className="text-left p-4 font-semibold text-foreground">Total</th>
                <th className="text-left p-4 font-semibold text-foreground">Estado</th>
                <th className="text-left p-4 font-semibold text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordersData.map((order) => (
                <tr key={order.id} className="border-b border-border hover:bg-card/50 transition-colors">
                  <td className="p-4 font-mono text-sm text-primary font-medium">{order.id}</td>
                  <td className="p-4 font-medium text-foreground">{order.customer}</td>
                  <td className="p-4 text-muted-foreground text-sm">{order.date}</td>
                  <td className="p-4 text-foreground font-medium">{order.items}</td>
                  <td className="p-4 font-bold text-foreground">{order.total}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                      <Eye size={18} />
                    </button>
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                      <Printer size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
