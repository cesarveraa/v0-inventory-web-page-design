'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Filter } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useInventoryStore } from '@/lib/store'
import { useMemo } from 'react'

export function ReportsPage() {
  const { sales, products, currentWarehouse } = useInventoryStore()

  const warehouseSales = useMemo(() => {
    if (!currentWarehouse) return []
    return sales.filter((s) => s.warehouseId === currentWarehouse.id)
  }, [sales, currentWarehouse])

  const stats = useMemo(() => {
    const totalRevenue = warehouseSales.reduce((sum, s) => sum + s.totalPrice, 0)
    const totalCost = warehouseSales.reduce((sum, s) => {
      const product = products.find((p) => p.id === s.productId)
      return sum + (product ? product.cost * s.quantity : 0)
    }, 0)
    const profit = totalRevenue - totalCost
    const avgTicket = warehouseSales.length > 0 ? totalRevenue / warehouseSales.length : 0

    return [
      { label: 'Ingresos Totales', value: `$${totalRevenue.toFixed(2)}`, change: '+23%' },
      { label: 'Ganancias', value: `$${profit.toFixed(2)}`, change: '+18%' },
      { label: 'Ticket Promedio', value: `$${avgTicket.toFixed(2)}`, change: '-5%' },
      { label: 'ROI', value: `${profit > 0 ? ((profit / totalCost) * 100).toFixed(0) : 0}%`, change: '+12%' },
    ]
  }, [warehouseSales, products])

  // Generate monthly data
  const monthlySalesData = useMemo(() => {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio']
    return months.map((month, index) => ({
      month,
      sales: Math.floor(Math.random() * 5000) + 2000,
      profit: Math.floor(Math.random() * 3000) + 1000,
    }))
  }, [])

  // Category distribution
  const categoryData = useMemo(() => {
    const categories: { [key: string]: number } = {}
    warehouseSales.forEach((sale) => {
      const product = products.find((p) => p.id === sale.productId)
      if (product) {
        categories[product.category] = (categories[product.category] || 0) + sale.totalPrice
      }
    })
    
    const total = Object.values(categories).reduce((a, b) => a + b, 0)
    return Object.entries(categories).map(([name, value], index) => ({
      name,
      value: total > 0 ? Math.round((value / total) * 100) : 0,
      color: ['hsl(var(--color-primary))', 'hsl(var(--color-secondary))', 'hsl(var(--color-accent))', 'hsl(var(--color-chart-4))'][index % 4],
    }))
  }, [warehouseSales, products])

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Reportes</h1>
          <p className="text-muted-foreground mt-2">Análisis de ventas en {currentWarehouse?.name}</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex items-center gap-2 text-xs md:text-base">
            <Filter size={16} className="md:size-20" />
            Filtrar
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 text-xs md:text-base">
            <Download size={16} className="md:size-20" />
            Descargar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="p-4">
            <p className="text-muted-foreground text-xs md:text-sm">{stat.label}</p>
            <p className="text-xl md:text-3xl font-bold text-foreground mt-2">{stat.value}</p>
            <p className="text-xs text-accent mt-2">↑ {stat.change} vs mes anterior</p>
          </Card>
        ))}
      </div>

      <Card className="p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-bold text-foreground mb-6">Ventas Mensuales</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlySalesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
            <XAxis stroke="hsl(var(--color-muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--color-muted-foreground))" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--color-card))', border: '1px solid hsl(var(--color-border))', borderRadius: '8px' }} />
            <Legend />
            <Bar dataKey="sales" fill="hsl(var(--color-primary))" radius={[8, 8, 0, 0]} />
            <Bar dataKey="profit" fill="hsl(var(--color-accent))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-6">Distribución por Categoría</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" labelLine={false} label={(entry) => `${entry.name}: ${entry.value}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-6">Detalles por Categoría</h2>
          <div className="space-y-4">
            {categoryData.length === 0 ? (
              <p className="text-muted-foreground text-sm">No hay datos de ventas</p>
            ) : (
              categoryData.map((category, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: category.color }}></div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{category.name}</p>
                      <p className="text-xs text-muted-foreground">{category.value}% del total</p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-foreground flex-shrink-0 ml-2">{category.value}%</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
