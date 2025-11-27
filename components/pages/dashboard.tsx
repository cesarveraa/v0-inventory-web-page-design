"use client"

import { useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Package, TrendingUp, AlertCircle, DollarSign } from "lucide-react"
import { useInventoryStore } from "@/lib/store"

// ---------- Tipos auxiliares ----------

type StatCardProps = {
  label: string
  value: string
  icon: React.ElementType
  color: string
}

type LineChartCardProps = {
  title: string
  data: DashboardPoint[]
}

type BarChartCardProps = {
  title: string
  data: DashboardPoint[]
}

type PieChartCardProps = {
  title: string
  data: StockPoint[]
}

type DashboardPoint = {
  month: string
  products: number
  revenue: number
  movimientos: number
  devoluciones: number
}

type StockPoint = {
  name: string
  value: number
  color: string
}
type MineralPrice = {
  metal: string
  currency?: string
  pricePerOunce?: number | string
  pricePerGram?: number | string
  timestamp?: string
}


// ---------- Componentes reutilizables ----------

function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden p-4 md:p-6 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-muted-foreground text-xs md:text-sm font-medium uppercase tracking-wide">
            {label}
          </p>
          <p className="text-2xl md:text-3xl font-bold text-foreground mt-3 tabular-nums">
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-xl ${color} backdrop-blur-sm border border-white/10 shadow-lg`}>
          <Icon size={24} className="transition-transform duration-300" />
        </div>
      </div>
    </Card>
  )
}

function LineChartCard({ title, data }: LineChartCardProps) {
  return (
    <Card className="p-4 md:p-6 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
      <div className="mb-6">
        <h2 className="text-lg md:text-xl font-bold text-foreground">{title}</h2>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          {/* Colores fijos para evitar el bug en negro */}
          <defs>
            <linearGradient id="colorProducts" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.15} />
            </linearGradient>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16a34a" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#16a34a" stopOpacity={0.15} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.7} />
          <XAxis
            dataKey="month"
            stroke="#6b7280"
            style={{ fontSize: "12px" }}
          />
          <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
            }}
            cursor={{ stroke: "#2563eb", strokeWidth: 2 }}
          />
          <Legend wrapperStyle={{ paddingTop: "20px" }} />
          <Area
            type="monotone"
            dataKey="products"
            stroke="#2563eb"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorProducts)"
            name="Productos"
            dot={{ fill: "#2563eb", r: 5 }}
            activeDot={{ r: 7 }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#16a34a"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRevenue)"
            name="Ingresos"
            dot={{ fill: "#16a34a", r: 5 }}
            activeDot={{ r: 7 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}

function BarChartCard({ title, data }: BarChartCardProps) {
  return (
    <Card className="p-4 md:p-6 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
      <div className="mb-6">
        <h2 className="text-lg md:text-xl font-bold text-foreground">{title}</h2>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.7} />
          <XAxis
            dataKey="month"
            stroke="#6b7280"
            style={{ fontSize: "12px" }}
          />
          <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
            }}
            cursor={{ fill: "rgba(37,99,235,0.06)" }}
          />
          <Legend wrapperStyle={{ paddingTop: "20px" }} />
          <Bar
            dataKey="movimientos"
            fill="#2563eb"
            name="Movimientos"
            radius={[8, 8, 0, 0]}
          />
          <Bar
            dataKey="devoluciones"
            fill="#f97316"
            name="Devoluciones"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

function PieChartCard({ title, data }: PieChartCardProps) {
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
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          {data.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-muted-foreground">
                {item.name}: {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

// ---------- Dashboard principal ----------

export function DashboardPage() {
  const sales = useInventoryStore((s) => s.sales)
  const products = useInventoryStore((s) => s.products)
  const inventory = useInventoryStore((s) => s.inventory)
  const currentWarehouse = useInventoryStore((s) => s.currentWarehouse)

  const [mineralPrices, setMineralPrices] = useState<MineralPrice[] | null>(null)
  const [loadingMinerals, setLoadingMinerals] = useState(false)
  const [mineralsError, setMineralsError] = useState<string | null>(null)

  // Cargar precios de minerales desde /api/mineral-prices
  useEffect(() => {
    const fetchMineralPrices = async () => {
      setLoadingMinerals(true)
      setMineralsError(null)
      try {
        const res = await fetch("/api/mineral-prices")
        if (!res.ok) {
          throw new Error("Error al cargar precios")
        }
        const json = await res.json()
        setMineralPrices(json.data)
      } catch (err) {
        console.error(err)
        setMineralsError("No se pudieron cargar los precios de minerales.")
      } finally {
        setLoadingMinerals(false)
      }
    }

    fetchMineralPrices()
  }, [])

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
        label: "Total Productos",
        value: warehouseProducts.length.toString(),
        icon: Package,
        color: "bg-gradient-to-br from-blue-500/15 to-blue-500/5 text-blue-600",
      },
      {
        label: "Valor Inventario",
        value: `Bs ${warehouseProducts
          .reduce((sum, p) => sum + p.price, 0)
          .toFixed(0)}`,
        icon: DollarSign,
        color: "bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 text-emerald-600",
      },
      {
        label: "Bajo Stock",
        value: "0",
        icon: AlertCircle,
        color: "bg-gradient-to-br from-amber-500/15 to-amber-500/5 text-amber-600",
      },
      {
        label: "Ventas Hoy",
        value: warehouseSales.length.toString(),
        icon: TrendingUp,
        color: "bg-gradient-to-br from-purple-500/15 to-purple-500/5 text-purple-600",
      },
    ]
  }, [currentWarehouse, products, inventory, sales])

  const dashboardData: DashboardPoint[] = [
    { month: "Ene", products: 120, revenue: 4000, movimientos: 45, devoluciones: 5 },
    { month: "Feb", products: 132, revenue: 3000, movimientos: 52, devoluciones: 3 },
    { month: "Mar", products: 101, revenue: 2000, movimientos: 38, devoluciones: 8 },
    { month: "Abr", products: 145, revenue: 2780, movimientos: 61, devoluciones: 4 },
    { month: "May", products: 155, revenue: 1890, movimientos: 73, devoluciones: 6 },
    { month: "Jun", products: 160, revenue: 2390, movimientos: 85, devoluciones: 2 },
  ]

  const stockData: StockPoint[] = [
    { name: "En Stock", value: 60, color: "#2563eb" },
    { name: "Bajo Stock", value: 25, color: "#f59e0b" },
    { name: "Agotado", value: 15, color: "#ef4444" },
  ]

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Resumen de {currentWarehouse?.name || "tu inventario"}
        </p>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-max">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Gráfica de tendencia + estado de stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LineChartCard
            title="Tendencia de Inventario e Ingresos"
            data={dashboardData}
          />
        </div>
        <div>
          <PieChartCard title="Estado de Stock" data={stockData} />
        </div>
      </div>

      {/* Movimientos vs devoluciones + resumen rápido */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartCard title="Movimientos vs Devoluciones" data={dashboardData} />
        <Card className="p-4 md:p-6 backdrop-blur-sm border border-white/10">
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-6">
            Resumen Rápido
          </h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20">
              <p className="text-sm text-muted-foreground">Inventario Total</p>
              <p className="text-2xl font-bold text-blue-600">
                {products.length} productos
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
              <p className="text-sm text-muted-foreground">Ingresos Este Mes</p>
              <p className="text-2xl font-bold text-emerald-600">
                $12,050
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-purple-500/5 border border-purple-500/20">
              <p className="text-sm text-muted-foreground">Valor Total Stock</p>
              <p className="text-2xl font-bold text-purple-600">
                $45,230
              </p>
            </div>
          </div>
        </Card>
      </div>

      {mineralPrices && !loadingMinerals && !mineralsError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {mineralPrices.map((m) => {
            const pricePerOunceNum = Number(m.pricePerOunce)
            const pricePerGramNum = Number(m.pricePerGram)

            const ounceText = Number.isFinite(pricePerOunceNum)
              ? `Bs ${pricePerOunceNum.toFixed(2)}`
              : "—"

            const gramText = Number.isFinite(pricePerGramNum)
              ? `Bs ${pricePerGramNum.toFixed(2)} / g`
              : "—"

            return (
              <div
                key={m.metal}
                className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col gap-1"
              >
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {m.metal === "gold" && "Oro"}
                  {m.metal === "silver" && "Plata"}
                  {m.metal === "copper" && "Cobre"}
                  {m.metal === "zinc" && "Zinc"}
                  {m.metal === "lead" && "Plomo"}
                  {!["gold", "silver", "copper", "zinc", "lead"].includes(m.metal) &&
                    m.metal}
                </p>
                <p className="text-xs text-muted-foreground">Por onza troy</p>
                <p className="text-xl font-semibold tabular-nums">
                  {ounceText}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  ≈ {gramText}
                </p>
                {m.timestamp && (
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Actualizado:{" "}
                    {new Date(m.timestamp).toLocaleString("es-BO")}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}


    </div>
  )
}
