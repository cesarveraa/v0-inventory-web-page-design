"use client"

import { useState, useMemo, useRef, useEffect, FormEvent } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, PackagePlus } from "lucide-react"

import { useInventoryStore } from "@/lib/store"
import { useAuthStore } from "@/lib/auth-store"
import { ProductTable } from "@/components/products/product-table"
import { QuickProductForm } from "@/components/forms/quick-product-form"
import {
  useKeyboardShortcuts,
  type KeyboardShortcut,
} from "@/hooks/use-keyboard-shortcuts"
import { useShortcuts } from "@/components/shortcuts-provider"

import {
  fetchProductsFromApi,
  mapBackendToFrontProduct,
} from "@/lib/api/products"

type DemoProduct = {
  id: string
  sku: string
  name: string
  category: string
  price: number
  cost?: number
  stock?: number
}

function formatMoney(value: string) {
  const num = Number(value || 0)
  return num.toFixed(2)
}

export default function ProductsPage() {
  const { user } = useAuthStore()
  const { products, setProducts } = useInventoryStore()

  const [searchTerm, setSearchTerm] = useState("")
  const [useDemoProducts, setUseDemoProducts] = useState(false)
  const [customProducts, setCustomProducts] = useState<DemoProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const { registerShortcuts } = useShortcuts()

  // 🔹 Productos DEMO solo para la demo (no tocan el store real)
  const demoProducts = useMemo<DemoProduct[]>(
    () => [
      {
        id: "P-001",
        sku: "ANFO-25",
        name: "Explosivo ANFO 25 kg",
        category: "Explosivos",
        price: 350.5,
        cost: 260,
        stock: 40,
      },
      {
        id: "P-002",
        sku: "CONC-EST-60",
        name: "Concentrado estaño 60%",
        category: "Mineral concentrado",
        price: 14500,
        cost: 11000,
        stock: 18,
      },
      {
        id: "P-003",
        sku: "CASCO-LAMP",
        name: "Casco minero con lámpara",
        category: "Seguridad industrial",
        price: 420,
        cost: 300,
        stock: 32,
      },
      {
        id: "P-004",
        sku: "PERF-NEU-01",
        name: "Perforadora neumática",
        category: "Equipos",
        price: 12500,
        cost: 9100,
        stock: 6,
      },
      {
        id: "P-005",
        sku: "GUANTES-CUERO",
        name: "Guantes de cuero reforzados",
        category: "Seguridad industrial",
        price: 85,
        cost: 55,
        stock: 120,
      },
    ],
    [],
  )

  // 🔌 Cargar productos reales del backend
  useEffect(() => {
    const loadProducts = async () => {
      // si no hay usuario o no tiene empresa, usamos solo demo
      if (!user || !user.empresa) {
        if (products.length === 0) setUseDemoProducts(true)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const backendProducts = await fetchProductsFromApi()

        // multi-tenant: solo productos de la empresa actual
        const filtered = backendProducts.filter(
          (p) => p.empresas_id_empresa === user.empresa!.id_empresa,
        )

        const mapped = filtered.map(mapBackendToFrontProduct)

        setProducts(mapped)

        if (mapped.length === 0) {
          setUseDemoProducts(true)
        } else {
          setUseDemoProducts(false)
        }
      } catch (err: any) {
        console.error("Error cargando productos:", err)
        setError(err.message ?? "Error al cargar productos")
        if (products.length === 0) {
          setUseDemoProducts(true)
        }
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  // 🧠 Atajo de teclado Ctrl+F para enfocar el buscador
  const shortcuts = useMemo<KeyboardShortcut[]>(
    () => [
      {
        key: "f",
        ctrlKey: true,
        description: "Buscar productos",
        category: "productos",
        action: () => {
          searchInputRef.current?.focus()
        },
      },
    ],
    [],
  )

  useKeyboardShortcuts(shortcuts)

  useEffect(() => {
    registerShortcuts(shortcuts)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ⭐ Formulario para agregar producto rápido (demo solo frontend)
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    cost: "",
  })

  const handleAddProduct = (e: FormEvent) => {
    e.preventDefault()
    if (!newProduct.name.trim() || !newProduct.sku.trim()) return

    const priceNum = parseFloat(newProduct.price) || 0
    const costNum = parseFloat(newProduct.cost) || 0

    const product: DemoProduct = {
      id: `demo-${Date.now()}`,
      name: newProduct.name.trim(),
      sku: newProduct.sku.trim(),
      category: newProduct.category.trim() || "Sin categoría",
      price: priceNum,
      cost: costNum,
      stock: 0,
    }

    setCustomProducts((prev) => [...prev, product])

    setNewProduct({
      name: "",
      sku: "",
      category: "",
      price: "",
      cost: "",
    })
  }

  // Lista que realmente se muestra (reales + demo + agregados en front)
  const allProducts = useMemo(() => {
    const base = useDemoProducts
      ? products.length
        ? products
        : demoProducts
      : products

    return [...(base as any[]), ...customProducts]
  }, [products, demoProducts, useDemoProducts, customProducts])

  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase()
    return (allProducts as any[]).filter((p) => {
      const name = (p.name ?? "").toLowerCase()
      const sku = (p.sku ?? "").toLowerCase()
      const category = (p.category ?? "").toLowerCase()
      return (
        name.includes(term) ||
        sku.includes(term) ||
        category.includes(term)
      )
    })
  }, [allProducts, searchTerm])

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Productos
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestiona tu catálogo de productos para la cooperativa / almacén
          </p>
          {user?.empresa && (
            <p className="text-xs text-muted-foreground mt-1">
              Empresa activa:{" "}
              <span className="font-medium">{user.empresa.nombre}</span> (ID{" "}
              {user.empresa.id_empresa})
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          {/* Formulario real para ajustar stock (usa productos del store) */}
          <QuickProductForm />

          {/* Botón para cargar / ocultar productos de ejemplo */}
          <Button
            type="button"
            variant={useDemoProducts ? "outline" : "secondary"}
            className="flex items-center gap-2"
            onClick={() => setUseDemoProducts((prev) => !prev)}
          >
            <PackagePlus size={16} />
            {useDemoProducts
              ? "Ocultar productos de ejemplo"
              : "Cargar productos de ejemplo"}
          </Button>
        </div>
      </div>

      {/* Buscador */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={20}
        />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Buscar productos... (Ctrl+F)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {loading && (
        <p className="text-xs text-muted-foreground">Cargando productos...</p>
      )}
      {error && (
        <p className="text-xs text-destructive">
          Error al cargar productos: {error}
        </p>
      )}

      {/* Formulario rápido para agregar producto (solo front / demo) */}
      <Card className="p-4 md:p-5 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm md:text-base font-semibold text-foreground">
              Agregar producto rápido (demo frontend)
            </h2>
            <p className="text-xs text-muted-foreground">
              Los productos agregados aquí se guardan solo en esta sesión para
              la demostración. No se crean en el backend.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleAddProduct}
          className="grid grid-cols-1 md:grid-cols-5 gap-3"
        >
          <input
            type="text"
            placeholder="Nombre"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct((p) => ({ ...p, name: e.target.value }))
            }
            className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm"
          />
          <input
            type="text"
            placeholder="SKU"
            value={newProduct.sku}
            onChange={(e) =>
              setNewProduct((p) => ({ ...p, sku: e.target.value }))
            }
            className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm"
          />
          <input
            type="text"
            placeholder="Categoría"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct((p) => ({ ...p, category: e.target.value }))
            }
            className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Precio (Bs)"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct((p) => ({ ...p, price: e.target.value }))
            }
            className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm"
          />
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              placeholder="Costo (Bs)"
              value={newProduct.cost}
              onChange={(e) =>
                setNewProduct((p) => ({ ...p, cost: e.target.value }))
              }
              className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm"
            />
            <Button
              type="submit"
              className="whitespace-nowrap text-xs md:text-sm px-3"
            >
              Agregar
            </Button>
          </div>
        </form>
      </Card>

      {/* Tabla de productos */}
      <Card className="overflow-hidden">
        <ProductTable products={filteredProducts as any} />
      </Card>

      {allProducts.length === 0 && !useDemoProducts && !loading && (
        <p className="text-xs text-muted-foreground mt-2">
          Aún no tienes productos registrados para esta empresa. Puedes usar el
          formulario rápido (solo demo) o cargar productos de ejemplo.
        </p>
      )}
    </div>
  )
}
