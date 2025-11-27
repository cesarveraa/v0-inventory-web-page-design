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

    loadEmpresa()
    loadUsuarios()
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
      {activeTab === "warehouses" && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h2 className="text-lg md:text-xl font-bold text-foreground">
              Mis Almacenes
            </h2>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full md:w-auto">
              <Plus size={16} className="md:size-20" />
              Nuevo Almacén
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {user?.warehouses.map((warehouse: any) => (
              <Card key={warehouse.id} className="p-4 md:p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-bold text-foreground text-sm md:text-base">
                    {warehouse.name}
                  </h3>
                  <div className="flex gap-2">
                    <button className="p-1 hover:bg-muted rounded">
                      <Edit2
                        size={14}
                        className="text-muted-foreground md:size-16"
                      />
                    </button>
                    <button className="p-1 hover:bg-muted rounded">
                      <Trash2
                        size={14}
                        className="text-destructive md:size-16"
                      />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Ubicación: {warehouse.location}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Estado</p>
                      <p className="font-bold text-foreground text-sm">
                        Activo
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        Productos
                      </p>
                      <p className="font-bold text-accent text-sm">
                        {warehouse.products.length}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
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
