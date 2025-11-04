"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bike, Package, CheckCircle, Clock, LogOut } from "lucide-react"
import type { RepartidorUser } from "@/lib/types/user-types"

export default function RepartidorPanelPage() {
  const router = useRouter()
  const [repartidor, setRepartidor] = useState<RepartidorUser | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      if (user.role === "Repartidor") {
        setRepartidor(user)
      } else {
        router.push("/auth")
      }
    } else {
      router.push("/auth")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/auth")
  }

  if (!repartidor) {
    return null
  }

  const pedidosPendientes = [
    {
      id: "PED-001",
      cliente: "María González",
      direccion: "Av. Santa Fe 1234, CABA",
      farmacia: "Farmacity",
      estado: "Listo para recoger",
    },
    {
      id: "PED-002",
      cliente: "Carlos Rodríguez",
      direccion: "Av. Corrientes 2456, CABA",
      farmacia: "Dr. Ahorro",
      estado: "En preparación",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-primary">Panel de Repartidor</h1>
            <Button onClick={handleLogout} variant="outline" className="gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
          <p className="text-muted-foreground">Bienvenido, {repartidor.nombreCompleto}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Entregas Hoy</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">2 pendientes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-muted-foreground">75% del día</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28 min</div>
              <p className="text-xs text-muted-foreground">Por entrega</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ganancia Hoy</CardTitle>
              <Bike className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2,400</div>
              <p className="text-xs text-muted-foreground">6 entregas completadas</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Información del Repartidor</CardTitle>
              <CardDescription>Tus datos registrados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="font-semibold">Nombre:</span> {repartidor.nombreCompleto}
              </div>
              <div>
                <span className="font-semibold">DNI:</span> {repartidor.dni}
              </div>
              <div>
                <span className="font-semibold">Teléfono:</span> {repartidor.telefono}
              </div>
              <div>
                <span className="font-semibold">Email:</span> {repartidor.email}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pedidos Pendientes</CardTitle>
              <CardDescription>Entregas asignadas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pedidosPendientes.map((pedido) => (
                <div key={pedido.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{pedido.id}</span>
                    <Badge variant={pedido.estado === "Listo para recoger" ? "default" : "secondary"}>
                      {pedido.estado}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div>Cliente: {pedido.cliente}</div>
                    <div>Farmacia: {pedido.farmacia}</div>
                    <div>Destino: {pedido.direccion}</div>
                  </div>
                  <Button size="sm" className="w-full">
                    Ver Detalles
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
