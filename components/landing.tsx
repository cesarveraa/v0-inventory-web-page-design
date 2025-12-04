"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, BarChart3, Package, Zap, Users, Cloud, Lock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center">
              <Image
                src="/logo.svg"
                alt="Pneuma logo"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>


            <span className="text-white font-bold text-xl">Pneuma</span>
          </div>
          <Link href="/login">
            <Button variant="outline" className="border-slate-600 hover:border-blue-500/50 hover:bg-blue-500/10 bg-transparent text-slate-200 hover:text-blue-300 transition-all">
              Ingresar
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="space-y-8 text-center">
          <div className="inline-block">
            <div className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
              <p className="text-sm font-medium text-blue-400">Bienvenido a Pneuma</p>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            Soluciones de Software
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {" "}
              para tu negocio
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Plataforma integral diseñada para optimizar tus operaciones empresariales. Desde gestión de inventarios
            hasta análisis avanzados.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/login">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold gap-2 shadow-lg hover:shadow-blue-500/50 transition-all duration-200">
              Comenzar Ahora <ArrowRight className="w-4 h-4" />
            </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-slate-600 hover:border-blue-500/50 hover:bg-blue-500/10 bg-transparent text-slate-200 hover:text-blue-300 font-semibold transition-all">
              Ver Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-white">Nuestros Servicios</h2>
            <p className="text-slate-300 text-lg">Herramientas poderosas para gestionar tu negocio</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Inventory Management */}
            <Card className="bg-slate-900/50 border-slate-800 hover:border-blue-500/50 transition-colors p-6 space-y-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Gestión de Inventarios</h3>
              <p className="text-slate-300">
                Control total de tu inventario con múltiples almacenes, seguimiento de stock en tiempo real y alertas
                automáticas.
              </p>
            </Card>

            {/* Analytics */}
            <Card className="bg-slate-900/50 border-slate-800 hover:border-purple-500/50 transition-colors p-6 space-y-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Reportes Avanzados</h3>
              <p className="text-slate-300">
                Análisis detallados con gráficos interactivos para tomar decisiones basadas en datos reales.
              </p>
            </Card>

            {/* Fast Operations */}
            <Card className="bg-slate-900/50 border-slate-800 hover:border-green-500/50 transition-colors p-6 space-y-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Operaciones Rápidas</h3>
              <p className="text-slate-300">
                Registro veloz de ventas y productos. Atajos de teclado para máxima productividad.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-white">Diseñado para Profesionales</h2>

            <div className="space-y-4">
              {[
                { icon: Users, title: "Multi-usuario", desc: "Gestiona múltiples almacenes y usuarios" },
                { icon: Cloud, title: "Cloud-based", desc: "Accede desde cualquier dispositivo" },
                { icon: Lock, title: "Seguro", desc: "Autenticación segura y datos protegidos" },
              ].map((feature, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-blue-400 mt-1" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{feature.title}</h3>
                    <p className="text-slate-400">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20 p-8 h-80 flex items-center justify-center">
            <div className="text-center text-slate-400">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Visualización de datos en tiempo real</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 md:p-16 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">¿Listo para transformar tu negocio?</h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Únete a empresas que ya están optimizando sus operaciones con Pneuma
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100">
              Acceder Ahora
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center">
                <Image
                  src="/logo.svg"
                  alt="Pneuma logo"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>


              <span className="text-white font-bold">Pneuma</span>
            </div>
            <p className="text-slate-400 text-sm">© 2025 Pneuma Software. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
