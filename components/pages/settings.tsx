"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Save, Plus, Trash2, Edit2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useInventoryStore } from "@/lib/store"

interface Empresa {
  nombre: string
  razon_social: string
  nit: string
  telefono: string
  email_empresa: string
  direccion: string
  estado: boolean
}

interface Usuario {
  id_usuario: number
  nombre: string
  apellido: string
  email: string
  estado: boolean
  es_dueno: boolean
}

interface Sucursal {
  id_sucursal: number
  nombre: string
  direccion: string
  telefono: string
  estado: boolean
}

interface Almacen {
  id_almacen: number
  nombre: string
  descripcion: string
  es_principal: boolean
  estado: boolean
}

export function SettingsPage() {
  const { user, currentWarehouse } = useInventoryStore()
  const [activeTab, setActiveTab] = useState<"general" | "users" | "warehouses" | "security">("general")

  // Empresa
  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [empresaLoading, setEmpresaLoading] = useState(true)
  const [empresaError, setEmpresaError] = useState<string | null>(null)
  const [savingEmpresa, setSavingEmpresa] = useState(false)

  // Usuarios
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [usuariosLoading, setUsuariosLoading] = useState(true)
  const [usuariosError, setUsuariosError] = useState<string | null>(null)

  // Form crear usuario
  const [newUserNombre, setNewUserNombre] = useState("")
  const [newUserApellido, setNewUserApellido] = useState("")
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserPassword, setNewUserPassword] = useState("")
  const [creatingUser, setCreatingUser] = useState(false)

  // Usuario en edición simple (sólo nombre/apellido/email/estado)
  const [editingUserId, setEditingUserId] = useState<number | null>(null)
  const [editingNombre, setEditingNombre] = useState("")
  const [editingApellido, setEditingApellido] = useState("")
  const [editingEmail, setEditingEmail] = useState("")
  const [editingEstado, setEditingEstado] = useState(true)
  const [updatingUser, setUpdatingUser] = useState(false)

  // Sucursales
  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [sucursalesLoading, setSucursalesLoading] = useState(true)
  const [sucursalesError, setSucursalesError] = useState<string | null>(null)

  const [newSucursalNombre, setNewSucursalNombre] = useState("")
  const [newSucursalDireccion, setNewSucursalDireccion] = useState("")
  const [newSucursalTelefono, setNewSucursalTelefono] = useState("")
  const [creatingSucursal, setCreatingSucursal] = useState(false)

  const [editingSucursalId, setEditingSucursalId] = useState<number | null>(null)
  const [editingSucursalNombre, setEditingSucursalNombre] = useState("")
  const [editingSucursalDireccion, setEditingSucursalDireccion] = useState("")
  const [editingSucursalTelefono, setEditingSucursalTelefono] = useState("")
  const [editingSucursalEstado, setEditingSucursalEstado] = useState(true)
  const [updatingSucursal, setUpdatingSucursal] = useState(false)

  // Almacenes
  const [almacenes, setAlmacenes] = useState<Almacen[]>([])
  const [almacenesLoading, setAlmacenesLoading] = useState(true)
  const [almacenesError, setAlmacenesError] = useState<string | null>(null)

  const [newAlmacenNombre, setNewAlmacenNombre] = useState("")
  const [newAlmacenDescripcion, setNewAlmacenDescripcion] = useState("")
  const [newAlmacenEsPrincipal, setNewAlmacenEsPrincipal] = useState(false)
  const [newAlmacenSucursalId, setNewAlmacenSucursalId] = useState<number | "">("")
  const [creatingAlmacen, setCreatingAlmacen] = useState(false)

  const [editingAlmacenId, setEditingAlmacenId] = useState<number | null>(null)
  const [editingAlmacenNombre, setEditingAlmacenNombre] = useState("")
  const [editingAlmacenDescripcion, setEditingAlmacenDescripcion] = useState("")
  const [editingAlmacenEsPrincipal, setEditingAlmacenEsPrincipal] = useState(false)
  const [updatingAlmacen, setUpdatingAlmacen] = useState(false)

  const tabs = [
    { id: "general", label: "General" },
    { id: "users", label: "Usuarios" },
    { id: "warehouses", label: "Almacenes" },
    { id: "security", label: "Seguridad" },
  ] as const

  // Cargar empresa y usuarios al montar
  useEffect(() => {
    const loadEmpresa = async () => {
      try {
        setEmpresaLoading(true)
        const res = await fetch("/api/empresa", {
          method: "GET",
          credentials: "include",
        })
        if (!res.ok) {
          throw new Error("No se pudo obtener la información de la empresa")
        }
        const data = await res.json()
        const empresaData: Empresa = {
          nombre: data.nombre ?? "",
          razon_social: data.razon_social ?? "",
          nit: data.nit ?? "",
          telefono: data.telefono ?? "",
          email_empresa: data.email ?? "",
          direccion: data.direccion ?? "",
          estado: data.estado ?? true,
        }
        setEmpresa(empresaData)
        setEmpresaError(null)
      } catch (err) {
        setEmpresaError(
          err instanceof Error ? err.message : "Error al cargar la empresa",
        )
      } finally {
        setEmpresaLoading(false)
      }
    }

    const loadUsuarios = async () => {
      try {
        setUsuariosLoading(true)
        const res = await fetch("/api/usuarios", {
          method: "GET",
          credentials: "include",
        })
        if (!res.ok) {
          throw new Error("No se pudo obtener la lista de usuarios")
        }
        const data = (await res.json()) as Usuario[]
        setUsuarios(data)
        setUsuariosError(null)
      } catch (err) {
        setUsuariosError(
          err instanceof Error ? err.message : "Error al cargar usuarios",
        )
      } finally {
        setUsuariosLoading(false)
      }
    }

    const loadSucursales = async () => {
      try {
        setSucursalesLoading(true)
        const res = await fetch("/api/sucursales", {
          method: "GET",
          credentials: "include",
        })
        if (!res.ok) {
          throw new Error("No se pudo obtener la lista de sucursales")
        }
        const data = (await res.json()) as Sucursal[]
        setSucursales(data)
        setSucursalesError(null)
      } catch (err) {
        setSucursalesError(
          err instanceof Error ? err.message : "Error al cargar sucursales",
        )
      } finally {
        setSucursalesLoading(false)
      }
    }

    const loadAlmacenes = async () => {
      try {
        setAlmacenesLoading(true)
        const res = await fetch("/api/almacenes", {
          method: "GET",
          credentials: "include",
        })
        if (!res.ok) {
          throw new Error("No se pudo obtener la lista de almacenes")
        }
        const data = (await res.json()) as Almacen[]
        setAlmacenes(data)
        setAlmacenesError(null)
      } catch (err) {
        setAlmacenesError(
          err instanceof Error ? err.message : "Error al cargar almacenes",
        )
      } finally {
        setAlmacenesLoading(false)
      }
    }

    loadEmpresa()
    loadUsuarios()
    loadSucursales()
    loadAlmacenes()
  }, [])

  // Guardar empresa
  const handleSaveEmpresa = async () => {
    if (!empresa) return
    try {
      setSavingEmpresa(true)
      const res = await fetch("/api/empresa", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(empresa),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          data.detail || data.message || "No se pudo actualizar la empresa",
        )
      }
      const updated = await res.json()
      setEmpresa({
        nombre: updated.nombre ?? empresa.nombre,
        razon_social: updated.razon_social ?? empresa.razon_social,
        nit: updated.nit ?? empresa.nit,
        telefono: updated.telefono ?? empresa.telefono,
        email_empresa: updated.email_empresa ?? empresa.email_empresa,
        direccion: updated.direccion ?? empresa.direccion,
        estado: updated.estado ?? empresa.estado,
      })
      setEmpresaError(null)
    } catch (err) {
      setEmpresaError(
        err instanceof Error ? err.message : "Error al guardar empresa",
      )
    } finally {
      setSavingEmpresa(false)
    }
  }

  // Crear usuario
  const handleCreateUser = async () => {
    try {
      setCreatingUser(true)
      const res = await fetch("/api/usuarios", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: newUserNombre,
          apellido: newUserApellido,
          email: newUserEmail,
          password: newUserPassword,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          data.detail || data.message || "No se pudo crear el usuario",
        )
      }
      const created = (await res.json()) as Usuario
      setUsuarios((prev) => [...prev, created])
      setNewUserNombre("")
      setNewUserApellido("")
      setNewUserEmail("")
      setNewUserPassword("")
      setUsuariosError(null)
    } catch (err) {
      setUsuariosError(
        err instanceof Error ? err.message : "Error al crear usuario",
      )
    } finally {
      setCreatingUser(false)
    }
  }

  // Preparar edición de usuario
  const startEditUser = (u: Usuario) => {
    setEditingUserId(u.id_usuario)
    setEditingNombre(u.nombre)
    setEditingApellido(u.apellido)
    setEditingEmail(u.email)
    setEditingEstado(u.estado)
  }

  // Guardar cambios de usuario
  const handleUpdateUser = async () => {
    if (!editingUserId) return
    try {
      setUpdatingUser(true)
      const res = await fetch(`/api/usuarios/${editingUserId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: editingNombre,
          apellido: editingApellido,
          email: editingEmail,
          estado: editingEstado,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          data.detail || data.message || "No se pudo actualizar el usuario",
        )
      }
      const updated = (await res.json()) as Usuario
      setUsuarios((prev) =>
        prev.map((u) => (u.id_usuario === updated.id_usuario ? updated : u)),
      )
      setEditingUserId(null)
    } catch (err) {
      setUsuariosError(
        err instanceof Error ? err.message : "Error al actualizar usuario",
      )
    } finally {
      setUpdatingUser(false)
    }
  }

  // Eliminar usuario
  const handleDeleteUser = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return
    try {
      const res = await fetch(`/api/usuarios/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          data.detail || data.message || "No se pudo eliminar el usuario",
        )
      }
      setUsuarios((prev) => prev.filter((u) => u.id_usuario !== id))
    } catch (err) {
      setUsuariosError(
        err instanceof Error ? err.message : "Error al eliminar usuario",
      )
    }
  }

  // Crear sucursal
  const handleCreateSucursal = async () => {
    try {
      setCreatingSucursal(true)
      const res = await fetch("/api/sucursales", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: newSucursalNombre,
          direccion: newSucursalDireccion,
          telefono: newSucursalTelefono,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          data.detail || data.message || "No se pudo crear la sucursal",
        )
      }
      const created = (await res.json()) as Sucursal
      setSucursales((prev) => [...prev, created])
      setNewSucursalNombre("")
      setNewSucursalDireccion("")
      setNewSucursalTelefono("")
      setSucursalesError(null)
    } catch (err) {
      setSucursalesError(
        err instanceof Error ? err.message : "Error al crear sucursal",
      )
    } finally {
      setCreatingSucursal(false)
    }
  }

  const startEditSucursal = (s: Sucursal) => {
    setEditingSucursalId(s.id_sucursal)
    setEditingSucursalNombre(s.nombre)
    setEditingSucursalDireccion(s.direccion)
    setEditingSucursalTelefono(s.telefono)
    setEditingSucursalEstado(s.estado)
  }

  const handleUpdateSucursal = async () => {
    if (!editingSucursalId) return
    try {
      setUpdatingSucursal(true)
      const res = await fetch(`/api/sucursales/${editingSucursalId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: editingSucursalNombre,
          direccion: editingSucursalDireccion,
          telefono: editingSucursalTelefono,
          estado: editingSucursalEstado,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          data.detail || data.message || "No se pudo actualizar la sucursal",
        )
      }
      const updated = (await res.json()) as Sucursal
      setSucursales((prev) =>
        prev.map((s) =>
          s.id_sucursal === updated.id_sucursal ? updated : s,
        ),
      )
      setEditingSucursalId(null)
    } catch (err) {
      setSucursalesError(
        err instanceof Error ? err.message : "Error al actualizar sucursal",
      )
    } finally {
      setUpdatingSucursal(false)
    }
  }

  const handleDeleteSucursal = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar esta sucursal?")) return
    try {
      const res = await fetch(`/api/sucursales/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          data.detail || data.message || "No se pudo eliminar la sucursal",
        )
      }
      setSucursales((prev) => prev.filter((s) => s.id_sucursal !== id))
    } catch (err) {
      setSucursalesError(
        err instanceof Error ? err.message : "Error al eliminar sucursal",
      )
    }
  }

  // Crear almacén
  const handleCreateAlmacen = async () => {
    if (newAlmacenSucursalId === "") {
      alert("Selecciona una sucursal para el almacén")
      return
    }
    try {
      setCreatingAlmacen(true)
      const res = await fetch("/api/almacenes", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: newAlmacenNombre,
          descripcion: newAlmacenDescripcion,
          es_principal: newAlmacenEsPrincipal,
          sucursal_id: Number(newAlmacenSucursalId),
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          data.detail || data.message || "No se pudo crear el almacén",
        )
      }
      const created = (await res.json()) as Almacen
      setAlmacenes((prev) => [...prev, created])
      setNewAlmacenNombre("")
      setNewAlmacenDescripcion("")
      setNewAlmacenEsPrincipal(false)
      setNewAlmacenSucursalId("")
      setAlmacenesError(null)
    } catch (err) {
      setAlmacenesError(
        err instanceof Error ? err.message : "Error al crear almacén",
      )
    } finally {
      setCreatingAlmacen(false)
    }
  }

  const startEditAlmacen = (a: Almacen) => {
    setEditingAlmacenId(a.id_almacen)
    setEditingAlmacenNombre(a.nombre)
    setEditingAlmacenDescripcion(a.descripcion)
    setEditingAlmacenEsPrincipal(a.es_principal)
  }

  const handleUpdateAlmacen = async () => {
    if (!editingAlmacenId) return
    try {
      setUpdatingAlmacen(true)
      const res = await fetch(`/api/almacenes/${editingAlmacenId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: editingAlmacenNombre,
          descripcion: editingAlmacenDescripcion,
          es_principal: editingAlmacenEsPrincipal,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          data.detail || data.message || "No se pudo actualizar el almacén",
        )
      }
      const updated = (await res.json()) as Almacen
      setAlmacenes((prev) =>
        prev.map((a) =>
          a.id_almacen === updated.id_almacen ? updated : a,
        ),
      )
      setEditingAlmacenId(null)
    } catch (err) {
      setAlmacenesError(
        err instanceof Error ? err.message : "Error al actualizar almacén",
      )
    } finally {
      setUpdatingAlmacen(false)
    }
  }

  const handleDeleteAlmacen = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este almacén?")) return
    try {
      const res = await fetch(`/api/almacenes/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          data.detail || data.message || "No se pudo eliminar el almacén",
        )
      }
      setAlmacenes((prev) => prev.filter((a) => a.id_almacen !== id))
    } catch (err) {
      setAlmacenesError(
        err instanceof Error ? err.message : "Error al eliminar almacén",
      )
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Configuración
        </h1>
        <p className="text-muted-foreground mt-2">
          Administra tu sistema y usuarios
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 md:px-4 py-3 font-medium border-b-2 transition-colors text-xs md:text-base ${activeTab === tab.id
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* General - Empresa */}
      {activeTab === "general" && (
        <div className="space-y-6">
          <Card className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">
              Información General
            </h2>

            {empresaLoading && (
              <p className="text-sm text-muted-foreground">
                Cargando datos de la empresa...
              </p>
            )}

            {empresaError && (
              <p className="text-sm text-destructive mb-2">{empresaError}</p>
            )}

            {empresa && !empresaLoading && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-foreground mb-2">
                    Nombre de Empresa
                  </label>
                  <input
                    type="text"
                    value={empresa.nombre}
                    onChange={(e) =>
                      setEmpresa({ ...empresa, nombre: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-foreground mb-2">
                    Razón Social
                  </label>
                  <input
                    type="text"
                    value={empresa.razon_social}
                    onChange={(e) =>
                      setEmpresa({
                        ...empresa,
                        razon_social: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-foreground mb-2">
                    NIT
                  </label>
                  <input
                    type="text"
                    value={empresa.nit}
                    onChange={(e) =>
                      setEmpresa({ ...empresa, nit: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-foreground mb-2">
                    Email de Contacto
                  </label>
                  <input
                    type="email"
                    value={empresa.email_empresa}
                    onChange={(e) =>
                      setEmpresa({
                        ...empresa,
                        email_empresa: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-foreground mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={empresa.telefono}
                    onChange={(e) =>
                      setEmpresa({
                        ...empresa,
                        telefono: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-foreground mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={empresa.direccion}
                    onChange={(e) =>
                      setEmpresa({
                        ...empresa,
                        direccion: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleSaveEmpresa}
                  disabled={savingEmpresa}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground w-full md:w-auto"
                >
                  <Save size={16} className="md:size-20" />
                  {savingEmpresa ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Usuarios */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h2 className="text-lg md:text-xl font-bold text-foreground">
              Gestión de Usuarios
            </h2>
          </div>

          {usuariosError && (
            <p className="text-sm text-destructive">{usuariosError}</p>
          )}

          {/* Form crear usuario */}
          <Card className="p-4 md:p-6 space-y-4">
            <h3 className="font-semibold text-foreground text-sm md:text-base">
              Nuevo Usuario
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nombre"
                value={newUserNombre}
                onChange={(e) => setNewUserNombre(e.target.value)}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm"
              />
              <input
                type="text"
                placeholder="Apellido"
                value={newUserApellido}
                onChange={(e) => setNewUserApellido(e.target.value)}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm"
              />
              <input
                type="email"
                placeholder="Email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm"
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm"
              />
            </div>
            <Button
              type="button"
              onClick={handleCreateUser}
              disabled={creatingUser}
              className="bg-primary hover:bg-primary/90 text-primary-foreground w-full md:w-auto"
            >
              <Plus size={16} className="md:size-20" />
              {creatingUser ? "Creando..." : "Crear Usuario"}
            </Button>
          </Card>

          <Card className="overflow-hidden">
            {usuariosLoading ? (
              <p className="p-4 text-sm text-muted-foreground">
                Cargando usuarios...
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm md:text-base">
                  <thead>
                    <tr className="border-b border-border bg-card/50">
                      <th className="text-left p-3 md:p-4 font-semibold text-foreground">
                        Nombre
                      </th>
                      <th className="text-left p-3 md:p-4 font-semibold text-foreground">
                        Email
                      </th>
                      <th className="text-left p-3 md:p-4 font-semibold text-foreground">
                        Rol
                      </th>
                      <th className="text-left p-3 md:p-4 font-semibold text-foreground">
                        Estado
                      </th>
                      <th className="text-left p-3 md:p-4 font-semibold text-foreground">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((u) => (
                      <tr
                        key={u.id_usuario}
                        className="border-b border-border hover:bg-card/50 transition-colors"
                      >
                        <td className="p-3 md:p-4 font-medium text-foreground text-xs md:text-base">
                          {u.nombre} {u.apellido}
                        </td>
                        <td className="p-3 md:p-4 text-muted-foreground text-xs md:text-base">
                          {u.email}
                        </td>
                        <td className="p-3 md:p-4">
                          <span className="px-2 md:px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            Empleado
                          </span>
                        </td>
                        <td className="p-3 md:p-4">
                          <span
                            className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${u.estado
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-destructive/10 text-destructive"
                              }`}
                          >
                            {u.estado ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="p-3 md:p-4 flex gap-2">
                          <button
                            className="p-1.5 md:p-2 hover:bg-muted rounded-lg transition-colors"
                            onClick={() => startEditUser(u)}
                          >
                            <Edit2
                              size={16}
                              className="text-muted-foreground md:size-18"
                            />
                          </button>
                          <button
                            className="p-1.5 md:p-2 hover:bg-muted rounded-lg transition-colors"
                            onClick={() => handleDeleteUser(u.id_usuario)}
                          >
                            <Trash2
                              size={16}
                              className="text-destructive md:size-18"
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Panel edición usuario */}
          {editingUserId && (
            <Card className="p-4 md:p-6 space-y-4">
              <h3 className="font-semibold text-foreground text-sm md:text-base">
                Editar Usuario
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={editingNombre}
                  onChange={(e) => setEditingNombre(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm"
                />
                <input
                  type="text"
                  placeholder="Apellido"
                  value={editingApellido}
                  onChange={(e) => setEditingApellido(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={editingEmail}
                  onChange={(e) => setEditingEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm"
                />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editingEstado}
                    onChange={(e) => setEditingEstado(e.target.checked)}
                  />
                  <span>Activo</span>
                </label>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleUpdateUser}
                  disabled={updatingUser}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Save size={16} />
                  {updatingUser ? "Guardando..." : "Guardar cambios"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingUserId(null)}
                >
                  Cancelar
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Warehouses (igual que ya tenías) */}
      {/* Sucursales + Almacenes */}
      {activeTab === "warehouses" && (
        <div className="space-y-8">
          {/* Sucursales */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <h2 className="text-lg md:text-xl font-bold text-foreground">
                Sucursales
              </h2>
            </div>

            {sucursalesError && (
              <p className="text-sm text-destructive">{sucursalesError}</p>
            )}

            {/* Crear sucursal */}
            <Card className="p-4 md:p-6 space-y-4">
              <h3 className="font-semibold text-foreground text-sm md:text-base">
                Nueva Sucursal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={newSucursalNombre}
                  onChange={(e) => setNewSucursalNombre(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm"
                />
                <input
                  type="text"
                  placeholder="Dirección"
                  value={newSucursalDireccion}
                  onChange={(e) => setNewSucursalDireccion(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm"
                />
                <input
                  type="tel"
                  placeholder="Teléfono"
                  value={newSucursalTelefono}
                  onChange={(e) => setNewSucursalTelefono(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm"
                />
              </div>
              <Button
                type="button"
                onClick={handleCreateSucursal}
                disabled={creatingSucursal}
                className="bg-primary hover:bg-primary/90 text-primary-foreground w-full md:w-auto"
              >
                <Plus size={16} />
                {creatingSucursal ? "Creando..." : "Crear Sucursal"}
              </Button>
            </Card>

            <Card className="overflow-hidden">
              {sucursalesLoading ? (
                <p className="p-4 text-sm text-muted-foreground">
                  Cargando sucursales...
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm md:text-base">
                    <thead>
                      <tr className="border-b border-border bg-card/50">
                        <th className="text-left p-3 md:p-4 font-semibold text-foreground">
                          Nombre
                        </th>
                        <th className="text-left p-3 md:p-4 font-semibold text-foreground">
                          Dirección
                        </th>
                        <th className="text-left p-3 md:p-4 font-semibold text-foreground">
                          Teléfono
                        </th>
                        <th className="text-left p-3 md:p-4 font-semibold text-foreground">
                          Estado
                        </th>
                        <th className="text-left p-3 md:p-4 font-semibold text-foreground">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sucursales.map((s) => (
                        <tr
                          key={s.id_sucursal}
                          className="border-b border-border hover:bg-card/50 transition-colors"
                        >
                          <td className="p-3 md:p-4 font-medium text-foreground text-xs md:text-base">
                            {s.nombre}
                          </td>
                          <td className="p-3 md:p-4 text-muted-foreground text-xs md:text-base">
                            {s.direccion}
                          </td>
                          <td className="p-3 md:p-4 text-muted-foreground text-xs md:text-base">
                            {s.telefono}
                          </td>
                          <td className="p-3 md:p-4">
                            <span
                              className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${s.estado
                                  ? "bg-emerald-500/10 text-emerald-500"
                                  : "bg-destructive/10 text-destructive"
                                }`}
                            >
                              {s.estado ? "Activa" : "Inactiva"}
                            </span>
                          </td>
                          <td className="p-3 md:p-4 flex gap-2">
                            <button
                              className="p-1.5 md:p-2 hover:bg-muted rounded-lg transition-colors"
                              onClick={() => startEditSucursal(s)}
                            >
                              <Edit2
                                size={16}
                                className="text-muted-foreground md:size-18"
                              />
                            </button>
                            <button
                              className="p-1.5 md:p-2 hover:bg-muted rounded-lg transition-colors"
                              onClick={() => handleDeleteSucursal(s.id_sucursal)}
                            >
                              <Trash2
                                size={16}
                                className="text-destructive md:size-18"
                              />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            {editingSucursalId && (
              <Card className="p-4 md:p-6 space-y-4">
                <h3 className="font-semibold text-foreground text-sm md:text-base">
                  Editar Sucursal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={editingSucursalNombre}
                    onChange={(e) =>
                      setEditingSucursalNombre(e.target.value)
                    }
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Dirección"
                    value={editingSucursalDireccion}
                    onChange={(e) =>
                      setEditingSucursalDireccion(e.target.value)
                    }
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm"
                  />
                  <input
                    type="tel"
                    placeholder="Teléfono"
                    value={editingSucursalTelefono}
                    onChange={(e) =>
                      setEditingSucursalTelefono(e.target.value)
                    }
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm"
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={editingSucursalEstado}
                      onChange={(e) =>
                        setEditingSucursalEstado(e.target.checked)
                      }
                    />
                    <span>Activa</span>
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={handleUpdateSucursal}
                    disabled={updatingSucursal}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Save size={16} />
                    {updatingSucursal ? "Guardando..." : "Guardar cambios"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingSucursalId(null)}
                  >
                    Cancelar
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Almacenes */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <h2 className="text-lg md:text-xl font-bold text-foreground">
                Almacenes
              </h2>
            </div>

            {almacenesError && (
              <p className="text-sm text-destructive">{almacenesError}</p>
            )}

            {/* Crear almacén */}
            <Card className="p-4 md:p-6 space-y-4">
              <h3 className="font-semibold text-foreground text-sm md:text-base">
                Nuevo Almacén
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={newAlmacenNombre}
                  onChange={(e) => setNewAlmacenNombre(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm"
                />
                <input
                  type="text"
                  placeholder="Descripción"
                  value={newAlmacenDescripcion}
                  onChange={(e) => setNewAlmacenDescripcion(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm"
                />
                <select
                  value={newAlmacenSucursalId}
                  onChange={(e) =>
                    setNewAlmacenSucursalId(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm"
                >
                  <option value="">Sucursal asociada</option>
                  {sucursales.map((s) => (
                    <option key={s.id_sucursal} value={s.id_sucursal}>
                      {s.nombre}
                    </option>
                  ))}
                </select>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={newAlmacenEsPrincipal}
                    onChange={(e) =>
                      setNewAlmacenEsPrincipal(e.target.checked)
                    }
                  />
                  <span>Es principal</span>
                </label>
              </div>
              <Button
                type="button"
                onClick={handleCreateAlmacen}
                disabled={creatingAlmacen}
                className="bg-primary hover:bg-primary/90 text-primary-foreground w-full md:w-auto"
              >
                <Plus size={16} />
                {creatingAlmacen ? "Creando..." : "Crear Almacén"}
              </Button>
            </Card>

            <Card className="overflow-hidden">
              {almacenesLoading ? (
                <p className="p-4 text-sm text-muted-foreground">
                  Cargando almacenes...
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm md:text-base">
                    <thead>
                      <tr className="border-b border-border bg-card/50">
                        <th className="text-left p-3 md:p-4 font-semibold text-foreground">
                          Nombre
                        </th>
                        <th className="text-left p-3 md:p-4 font-semibold text-foreground">
                          Descripción
                        </th>
                        <th className="text-left p-3 md:p-4 font-semibold text-foreground">
                          Principal
                        </th>
                        <th className="text-left p-3 md:p-4 font-semibold text-foreground">
                          Estado
                        </th>
                        <th className="text-left p-3 md:p-4 font-semibold text-foreground">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {almacenes.map((a) => (
                        <tr
                          key={a.id_almacen}
                          className="border-b border-border hover:bg-card/50 transition-colors"
                        >
                          <td className="p-3 md:p-4 font-medium text-foreground text-xs md:text-base">
                            {a.nombre}
                          </td>
                          <td className="p-3 md:p-4 text-muted-foreground text-xs md:text-base">
                            {a.descripcion}
                          </td>
                          <td className="p-3 md:p-4">
                            <span
                              className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${a.es_principal
                                  ? "bg-indigo-500/10 text-indigo-500"
                                  : "bg-muted text-muted-foreground"
                                }`}
                            >
                              {a.es_principal ? "Principal" : "Secundario"}
                            </span>
                          </td>
                          <td className="p-3 md:p-4">
                            <span
                              className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${a.estado
                                  ? "bg-emerald-500/10 text-emerald-500"
                                  : "bg-destructive/10 text-destructive"
                                }`}
                            >
                              {a.estado ? "Activo" : "Inactivo"}
                            </span>
                          </td>
                          <td className="p-3 md:p-4 flex gap-2">
                            <button
                              className="p-1.5 md:p-2 hover:bg-muted rounded-lg transition-colors"
                              onClick={() => startEditAlmacen(a)}
                            >
                              <Edit2
                                size={16}
                                className="text-muted-foreground md:size-18"
                              />
                            </button>
                            <button
                              className="p-1.5 md:p-2 hover:bg-muted rounded-lg transition-colors"
                              onClick={() => handleDeleteAlmacen(a.id_almacen)}
                            >
                              <Trash2
                                size={16}
                                className="text-destructive md:size-18"
                              />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            {editingAlmacenId && (
              <Card className="p-4 md:p-6 space-y-4">
                <h3 className="font-semibold text-foreground text-sm md:text-base">
                  Editar Almacén
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={editingAlmacenNombre}
                    onChange={(e) =>
                      setEditingAlmacenNombre(e.target.value)
                    }
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Descripción"
                    value={editingAlmacenDescripcion}
                    onChange={(e) =>
                      setEditingAlmacenDescripcion(e.target.value)
                    }
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm"
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={editingAlmacenEsPrincipal}
                      onChange={(e) =>
                        setEditingAlmacenEsPrincipal(e.target.checked)
                      }
                    />
                    <span>Es principal</span>
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={handleUpdateAlmacen}
                    disabled={updatingAlmacen}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Save size={16} />
                    {updatingAlmacen ? "Guardando..." : "Guardar cambios"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingAlmacenId(null)}
                  >
                    Cancelar
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Seguridad (igual que ya tenías, aún sin hook al back) */}
      {activeTab === "security" && (
        <Card className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">
            Configuración de Seguridad
          </h2>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs md:text-sm font-medium text-foreground mb-2">
                Contraseña Actual
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-foreground mb-2">
                Nueva Contraseña
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-foreground mb-2">
                Confirmar Contraseña
              </label>
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
