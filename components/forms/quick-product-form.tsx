'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useInventoryStore } from '@/lib/store'
import {
  listCategorias,
  listProveedores,
  listUnidadesMedida,
} from '@/lib/api/catalogs'
import type {
  CategoriaDTO,
  ProveedorDTO,
  UnidadMedidaDTO,
} from '@/lib/api/products'
import type { ProductoCreateDTO } from '@/lib/api/products'
import { Plus } from 'lucide-react'

interface QuickProductFormProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function QuickProductForm({
  open: controlledOpen,
  onOpenChange,
}: QuickProductFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [categorias, setCategorias] = useState<CategoriaDTO[]>([])
  const [proveedores, setProveedores] = useState<ProveedorDTO[]>([])
  const [unidades, setUnidades] = useState<UnidadMedidaDTO[]>([])

  const createProductApi = useInventoryStore((s) => s.createProductApi)

  const [form, setForm] = useState({
    nombre: '',
    codigo_sku: '',
    precio: '',
    stock_minimo_global: '0',
    descripcion: '',
    proveedorId: '',
    unidadId: '',
    categoriaId: '',
  })

  const realOpen = controlledOpen ?? open
  const handleOpenChange = (value: boolean) => {
    setOpen(value)
    onOpenChange?.(value)
  }

  useEffect(() => {
    // cargar catálogos al abrir por primera vez
    if (!realOpen) return
    ;(async () => {
      try {
        const [cats, provs, units] = await Promise.all([
          listCategorias(),
          listProveedores(),
          listUnidadesMedida(),
        ])
        setCategorias(cats)
        setProveedores(provs)
        setUnidades(units)
      } catch (e) {
        console.error(e)
      }
    })()
  }, [realOpen])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.proveedorId || !form.unidadId) return

    const payload: ProductoCreateDTO = {
      codigo_sku: form.codigo_sku.trim(),
      codigo_barra: null,
      nombre: form.nombre.trim(),
      descripcion: form.descripcion || null,
      stock_minimo_global: Number(form.stock_minimo_global) || 0,
      estado: true,
      precio: Number(form.precio) || 0,
      proveedores_id_proveedor: Number(form.proveedorId),
      unidades_medida_id_unidad: Number(form.unidadId),
      categorias_ids: form.categoriaId ? [Number(form.categoriaId)] : [],
      atributos: [],
    }

    try {
      setLoading(true)
      await createProductApi(payload)
      handleOpenChange(false)
      setForm({
        nombre: '',
        codigo_sku: '',
        precio: '',
        stock_minimo_global: '0',
        descripcion: '',
        proveedorId: '',
        unidadId: '',
        categoriaId: '',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={realOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden md:inline">Nuevo producto</span>
          <span className="md:hidden">Nuevo</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Crear producto rápido</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="codigo_sku">SKU</Label>
              <Input
                id="codigo_sku"
                name="codigo_sku"
                value={form.codigo_sku}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="precio">Precio</Label>
              <Input
                id="precio"
                name="precio"
                type="number"
                step="0.01"
                value={form.precio}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="stock_minimo_global">Stock mínimo global</Label>
              <Input
                id="stock_minimo_global"
                name="stock_minimo_global"
                type="number"
                value={form.stock_minimo_global}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Input
              id="descripcion"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="proveedorId">Proveedor</Label>
              <select
                id="proveedorId"
                name="proveedorId"
                value={form.proveedorId}
                onChange={handleChange}
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm"
                required
              >
                <option value="">Selecciona...</option>
                {proveedores.map((p) => (
                  <option key={p.id_proveedor} value={p.id_proveedor}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="unidadId">Unidad</Label>
              <select
                id="unidadId"
                name="unidadId"
                value={form.unidadId}
                onChange={handleChange}
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm"
                required
              >
                <option value="">Selecciona...</option>
                {unidades.map((u) => (
                  <option key={u.id_unidad} value={u.id_unidad}>
                    {u.nombre} ({u.abreviatura})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="categoriaId">Categoría</Label>
              <select
                id="categoriaId"
                name="categoriaId"
                value={form.categoriaId}
                onChange={handleChange}
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm"
              >
                <option value="">Sin categoría</option>
                {categorias.map((c) => (
                  <option key={c.id_categoria} value={c.id_categoria}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
