"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Filter } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useInventoryStore } from "@/lib/store"
import { useMemo } from "react"

type MonthlyPoint = {
  month: string
  sales: number
  profit: number
}

type CategoryPoint = {
  name: string
  value: number
  color: string
}

export function ReportsPage() {
  const { sales, products, currentWarehouse } = useInventoryStore()

  const warehouseSales = useMemo(() => {
    if (!currentWarehouse) return []
    return sales.filter((s) => s.warehouseId === currentWarehouse.id)
  }, [sales, currentWarehouse])

  const stats = useMemo(() => {
    const totalRevenue = warehouseSales.reduce(
      (sum, s) => sum + (s.totalPrice ?? 0),
      0,
    )

    const totalCost = warehouseSales.reduce((sum, s) => {
      const product = products.find((p) => p.id === s.productId)
      const unitCost = product?.cost ?? 0
      return sum + unitCost * (s.quantity ?? 0)
    }, 0)

    const profit = totalRevenue - totalCost
    const avgTicket =
      warehouseSales.length > 0 ? totalRevenue / warehouseSales.length : 0
    const roi =
      profit > 0 && totalCost > 0 ? (profit / totalCost) * 100 : 0

    return {
      cards: [
        {
          label: "Ingresos Totales",
          value: "Bs 401,500.00",
          change: "+23%",
        },
        {
          label: "Ganancias",
          value: "Bs 92,350.00",
          change: "+18%",
        },
        {
          label: "Ticket Promedio",
          value: "Bs 13,383.33",
          change: "-5%",
        },
        {
          label: "ROI",
          value: "29%",
          change: "+12%",
        },

      ],
      totalRevenue,
      profit,
      roi,
    }
  }, [warehouseSales, products])

  // 📆 Datos DEMO mensuales (no dependen de la BD real)
  const monthlySalesData: MonthlyPoint[] = useMemo(() => {
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"]
    // Valores fijos para demo (quedan bonitos y consistentes)
    const baseSales = [22000, 24500, 21000, 26000, 27500, 29000]
    const baseProfit = [8500, 9200, 7800, 9600, 10100, 11000]

    return months.map((month, i) => ({
      month,
      sales: baseSales[i],
      profit: baseProfit[i],
    }))
  }, [])

  // 🥧 Distribución por categoría (si no hay datos, demo)
  const categoryData: CategoryPoint[] = useMemo(() => {
    const categories: Record<string, number> = {}

    warehouseSales.forEach((sale) => {
      const product = products.find((p) => p.id === sale.productId)
      const category = product?.category ?? "Sin categoría"
      categories[category] =
        (categories[category] ?? 0) + (sale.totalPrice ?? 0)
    })

    // Si no hay datos reales, usamos demo
    if (Object.keys(categories).length === 0) {
      const demo: CategoryPoint[] = [
        { name: "Mineral concentrado", value: 45, color: "#2563eb" },
        { name: "Equipo y herramientas", value: 25, color: "#22c55e" },
        { name: "Seguridad industrial", value: 20, color: "#f97316" },
        { name: "Repuestos", value: 10, color: "#a855f7" },
      ]
      return demo
    }

    const total = Object.values(categories).reduce((a, b) => a + b, 0)
    const palette = ["#2563eb", "#22c55e", "#f97316", "#a855f7"]

    return Object.entries(categories).map(([name, value], index) => ({
      name,
      value: total > 0 ? Math.round((value / total) * 100) : 0,
      color: palette[index % palette.length],
    }))
  }, [warehouseSales, products])

  // 🤖 “IA” de sugerencias simples basada en los datos
  const suggestions = useMemo(() => {
    const s: string[] = []

    const topCategory = categoryData.reduce<CategoryPoint | null>(
      (max, c) => (max === null || c.value > max.value ? c : max),
      null,
    )

    const lowCategory = categoryData.reduce<CategoryPoint | null>(
      (min, c) => (min === null || c.value < min.value ? c : min),
      null,
    )

    const bestMonth = monthlySalesData.reduce<MonthlyPoint | null>(
      (max, m) => (max === null || m.sales > max.sales ? m : max),
      null,
    )

    const worstMonth = monthlySalesData.reduce<MonthlyPoint | null>(
      (min, m) => (min === null || m.sales < min.sales ? m : min),
      null,
    )

    if (topCategory) {
      s.push(
        `La categoría **${topCategory.name}** concentra el ${topCategory.value}% de las ventas. Conviene asegurar stock suficiente y negociar mejores precios con proveedores.`,
      )
    }

    if (lowCategory && lowCategory !== topCategory) {
      s.push(
        `La categoría **${lowCategory.name}** apenas aporta el ${lowCategory.value}% del total. Revisa si vale la pena seguir ofreciendo todos esos productos o si se puede optimizar el catálogo.`,
      )
    }

    if (bestMonth && worstMonth) {
      s.push(
        `El mejor mes en ventas fue **${bestMonth.month}** (≈ Bs ${bestMonth.sales.toLocaleString(
          "es-BO",
        )}), mientras que el más bajo fue **${worstMonth.month}**. Puedes replicar las estrategias de tu mejor mes (promos, horarios, productos más vendidos).`,
      )
    }

    if (stats.roi < 20) {
      s.push(
        `El ROI actual está alrededor de **${stats.roi.toFixed(
          0,
        )}%**. Considera revisar costos de compra o ajustar precios de los productos con menor margen.`,
      )
    } else {
      s.push(
        `El ROI actual es saludable (**${stats.roi.toFixed(
          0,
        )}%**). Podrías reinvertir parte de las ganancias en reforzar inventario de productos de alta rotación.`,
      )
    }

    if (warehouseSales.length === 0) {
      s.push(
        "Aún no se registran ventas en este almacén. Para la demostración puedes cargar algunas ventas de ejemplo o trabajar con los datos demo que se muestran.",
      )
    }

    return s
  }, [categoryData, monthlySalesData, stats.roi, warehouseSales.length])

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Reportes
          </h1>
          <p className="text-muted-foreground mt-2">
            Análisis de ventas en {currentWarehouse?.name || "tu almacén"}
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            className="flex items-center gap-2 text-xs md:text-base"
          >
            <Filter size={16} />
            Filtrar
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 text-xs md:text-base">
            <Download size={16} />
            Descargar
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.cards.map((stat, i) => (
          <Card
            key={i}
            className="p-4 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            <p className="text-muted-foreground text-xs md:text-sm">
              {stat.label}
            </p>
            <p className="text-xl md:text-3xl font-bold text-foreground mt-2 tabular-nums">
              {stat.value}
            </p>
            <p className="text-xs text-emerald-600 mt-2">
              ↑ {stat.change} vs mes anterior
            </p>
          </Card>
        ))}
      </div>

      {/* Ventas mensuales + Ingresos vs Ganancias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4 md:p-6 backdrop-blur-sm border border-white/10">
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-6">
            Ventas mensuales (demo)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlySalesData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                opacity={0.7}
              />
              <XAxis
                dataKey="month"
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar
                dataKey="sales"
                name="Ingresos"
                fill="#2563eb"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="profit"
                name="Ganancias"
                fill="#22c55e"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4 md:p-6 backdrop-blur-sm border border-white/10">
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-6">
            Ingresos vs Ganancias por mes
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlySalesData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                opacity={0.7}
              />
              <XAxis
                dataKey="month"
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                name="Ingresos"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="profit"
                name="Ganancias"
                stroke="#16a34a"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Distribución por categoría */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4 md:p-6 backdrop-blur-sm border border-white/10">
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-6">
            Distribución por categoría
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.name}: ${entry.value}%`}
                outerRadius={100}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any, _name, item: any) => [
                  `${value}%`,
                  item.payload.name,
                ]}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4 md:p-6 backdrop-blur-sm border border-white/10">
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-6">
            Detalles por categoría
          </h2>
          <div className="space-y-4">
            {categoryData.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No hay datos de ventas
              </p>
            ) : (
              categoryData.map((category, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: category.color }}
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">
                        {category.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {category.value}% del total
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-foreground flex-shrink-0 ml-2">
                    {category.value}%
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Panel de “IA” con sugerencias */}
      <Card className="p-4 md:p-6 backdrop-blur-sm border border-white/10">
        <h2 className="text-lg md:text-xl font-bold text-foreground mb-3">
          Sugerencias inteligentes
        </h2>
        <p className="text-xs text-muted-foreground mb-4">
          Generadas a partir de los indicadores y distribuciones actuales. En una
          versión futura, este módulo podría conectarse a un motor de IA para
          recomendaciones más avanzadas.
        </p>
        <ul className="space-y-3 text-sm">
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              className="flex gap-2"
            >
              <span className="mt-1 text-primary">•</span>
              <span
                className="text-foreground"
                dangerouslySetInnerHTML={{ __html: s }}
              />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
