"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building, Package, TrendingUp, Users, LogOut } from "lucide-react"
import type { FarmaciaUser } from "@/lib/types/user-types"

export default function FarmaciaPanelPage() {
  const router = useRouter()
  const [farmacia, setFarmacia] = useState<FarmaciaUser | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      if (user.role === "Farmacia") {
        setFarmacia(user)
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

  if (!farmacia) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-primary">Panel de Gestión de Farmacia</h1>
            <Button onClick={handleLogout} variant="outline" className="gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
          <p className="text-muted-foreground">Bienvenido, {farmacia.nombreFarmacia}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Hoy</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 desde ayer</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas del Mes</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231</div>
              <p className="text-xs text-muted-foreground">+15% desde el mes pasado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">234</div>
              <p className="text-xs text-muted-foreground">+12 nuevos esta semana</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Productos requieren reposición</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Información de la Farmacia</CardTitle>
              <CardDescription>Datos registrados de tu farmacia</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="font-semibold">Nombre:</span> {farmacia.nombreFarmacia}
              </div>
              <div>
                <span className="font-semibold">CUIT:</span> {farmacia.cuit}
              </div>
              <div>
                <span className="font-semibold">Dirección:</span> {farmacia.direccion}
              </div>
              <div>
                <span className="font-semibold">Email:</span> {farmacia.email}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Gestiona tu farmacia</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-transparent" variant="outline">
                Ver Pedidos Pendientes
              </Button>
              <Button className="w-full bg-transparent" variant="outline" onClick={() => router.push("/farmacia/panel/inventario")}>
                Gestionar Inventario
              </Button>
              <Button className="w-full bg-transparent" variant="outline">
                Actualizar Precios
              </Button>
              <Button className="w-full bg-transparent" variant="outline">
                Ver Estadísticas
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
