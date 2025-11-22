'use client'

import { Card } from '@/components/ui/card'
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { Package, TrendingUp, AlertCircle, DollarSign } from 'lucide-react'
import { useInventoryStore } from '@/lib/store'
import { useMemo } from 'react'

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <Card className="relative overflow-hidden p-4 md:p-6 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-muted-foreground text-xs md:text-sm font-medium uppercase tracking-wide">{label}</p>
          <p className="text-2xl md:text-3xl font-bold text-foreground mt-3 tabular-nums">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${color} backdrop-blur-sm border border-white/10 shadow-lg`}>
          <Icon size={24} className="transition-transform duration-300" />
        </div>
      </div>
    </Card>
  )
}

function LineChartCard({ title, data }) {
  return (
    <Card className="p-4 md:p-6 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
      <div className="mb-6">
        <h2 className="text-lg md:text-xl font-bold text-foreground">{title}</h2>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorProducts" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--color-primary))" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(var(--color-primary))" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--color-secondary))" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(var(--color-secondary))" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" opacity={0.5} />
          <XAxis stroke="hsl(var(--color-muted-foreground))" style={{ fontSize: '12px' }} />
          <YAxis stroke="hsl(var(--color-muted-foreground))" style={{ fontSize: '12px' }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--color-card))', 
              border: '1px solid hsl(var(--color-border))', 
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
            }} 
            cursor={{ stroke: 'hsl(var(--color-primary))', strokeWidth: 2 }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Area 
            type="monotone" 
            dataKey="products" 
            stroke="hsl(var(--color-primary))" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorProducts)" 
            name="Productos"
            dot={{ fill: 'hsl(var(--color-primary))', r: 5 }}
            activeDot={{ r: 7 }}
          />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="hsl(var(--color-secondary))" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorRevenue)"
            name="Ingresos"
            dot={{ fill: 'hsl(var(--color-secondary))', r: 5 }}
            activeDot={{ r: 7 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}

function BarChartCard({ title, data }) {
  return (
    <Card className="p-4 md:p-6 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
      <div className="mb-6">
        <h2 className="text-lg md:text-xl font-bold text-foreground">{title}</h2>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" opacity={0.5} />
          <XAxis stroke="hsl(var(--color-muted-foreground))" style={{ fontSize: '12px' }} />
          <YAxis stroke="hsl(var(--color-muted-foreground))" style={{ fontSize: '12px' }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--color-card))', 
              border: '1px solid hsl(var(--color-border))', 
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
            }}
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar 
            dataKey="movimientos" 
            fill="hsl(var(--color-accent))" 
            name="Movimientos"
            radius={[8, 8, 0, 0]}
            animationDuration={800}
          />
          <Bar 
            dataKey="devoluciones" 
            fill="hsl(var(--color-chart-4))" 
            name="Devoluciones"
            radius={[8, 8, 0, 0]}
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

function PieChartCard({ title, data }) {
  return (
    <Card className="p-4 md:p-6 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
      <div className="mb-6">
        <h2 className="text-lg md:text-xl font-bold text-foreground">{title}</h2>
      </div>
      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie 
              data={data} 
              cx="50%" 
              cy="50%" 
              innerRadius={60} 
              outerRadius={100} 
              paddingAngle={2}
              dataKey="value"
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--color-card))', 
                border: '1px solid hsl(var(--color-border))', 
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          {data.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-muted-foreground">{item.name}: {item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

export function DashboardPage() {
 const sales = useInventoryStore((s) => s.sales)
  const products = useInventoryStore((s) => s.products)
  const inventory = useInventoryStore((s) => s.inventory)
  const currentWarehouse = useInventoryStore((s) => s.currentWarehouse)

  const stats = useMemo(() => {
    if (!currentWarehouse) return []

    const warehouseProducts = products.filter((p) =>
      inventory.some(
        (inv) => inv.productId === p.id && inv.warehouseId === currentWarehouse.id,
      ),
    )

    const warehouseSales = sales.filter(
      (s) => s.warehouseId === currentWarehouse.id,
    )
    const totalRevenue = warehouseSales.reduce(
      (sum, s) => sum + s.totalPrice,
      0,
    )

    return [
      {
        label: 'Total Productos',
        value: warehouseProducts.length.toString(),
        icon: Package,
        color:
          'bg-gradient-to-br from-primary/20 to-primary/5 text-primary',
      },
      {
        label: 'Valor Inventario',
        value: `$${warehouseProducts
          .reduce((sum, p) => sum + p.price, 0)
          .toFixed(0)}`,
        icon: DollarSign,
        color:
          'bg-gradient-to-br from-secondary/20 to-secondary/5 text-secondary',
      },
      {
        label: 'Bajo Stock',
        value: '0',
        icon: AlertCircle,
        color:
          'bg-gradient-to-br from-chart-4/20 to-chart-4/5 text-chart-4',
      },
      {
        label: 'Ventas Hoy',
        value: warehouseSales.length.toString(),
        icon: TrendingUp,
        color:
          'bg-gradient-to-br from-accent/20 to-accent/5 text-accent',
      },
    ]
  }, [currentWarehouse, products, inventory, sales])
  const dashboardData = [
    { month: 'Ene', products: 120, revenue: 4000, movimientos: 45, devoluciones: 5 },
    { month: 'Feb', products: 132, revenue: 3000, movimientos: 52, devoluciones: 3 },
    { month: 'Mar', products: 101, revenue: 2000, movimientos: 38, devoluciones: 8 },
    { month: 'Abr', products: 145, revenue: 2780, movimientos: 61, devoluciones: 4 },
    { month: 'May', products: 155, revenue: 1890, movimientos: 73, devoluciones: 6 },
    { month: 'Jun', products: 160, revenue: 2390, movimientos: 85, devoluciones: 2 },
  ]

  const stockData = [
    { name: 'En Stock', value: 60, color: 'hsl(var(--color-accent))' },
    { name: 'Bajo Stock', value: 25, color: 'hsl(var(--color-chart-4))' },
    { name: 'Agotado', value: 15, color: 'hsl(var(--color-destructive))' },
  ]

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Resumen de {currentWarehouse?.name || 'tu inventario'}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-max">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LineChartCard title="Tendencia de Inventario e Ingresos" data={dashboardData} />
        </div>
        <div>
          <PieChartCard title="Estado de Stock" data={stockData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartCard title="Movimientos vs Devoluciones" data={dashboardData} />
        <Card className="p-4 md:p-6 backdrop-blur-sm border border-white/10">
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-6">Resumen Rápido</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
              <p className="text-sm text-muted-foreground">Inventario Total</p>
              <p className="text-2xl font-bold text-primary">{products.length} productos</p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-r from-secondary/10 to-secondary/5 border border-secondary/20">
              <p className="text-sm text-muted-foreground">Ingresos Este Mes</p>
              <p className="text-2xl font-bold text-secondary">$12,050</p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20">
              <p className="text-sm text-muted-foreground">Valor Total Stock</p>
              <p className="text-2xl font-bold text-accent">$45,230</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
