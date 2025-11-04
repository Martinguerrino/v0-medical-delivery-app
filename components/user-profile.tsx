"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { User, Phone, MapPin, Shield, Calendar, Package, LogOut, Settings, Bell, Mail } from "lucide-react"
import type { TestUser } from "@/lib/data/test-users"

export function UserProfile() {
  const [user, setUser] = useState<TestUser | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    window.location.reload()
  }

  if (!user) {
    return null
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder.svg" alt={`${user.name} ${user.lastName}`} />
              <AvatarFallback>
                {user.name.charAt(0)}
                {user.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">
                {user.name} {user.lastName}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-1" />
            Cerrar sesión
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Información personal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-primary" />
              <span>{user.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{user.address}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span>Nacimiento: {new Date(user.birthDate).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-primary" />
              <span>{user.obraSocial}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-primary" />
              <span>Afiliado: {user.numeroAfiliado}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Preferencias */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" />
            Preferencias
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Bell className="h-4 w-4" />
                <span>Notificaciones</span>
              </div>
              <Badge variant={user.preferences.notifications ? "default" : "secondary"}>
                {user.preferences.notifications ? "Activadas" : "Desactivadas"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4" />
                <span>Newsletter</span>
              </div>
              <Badge variant={user.preferences.newsletter ? "default" : "secondary"}>
                {user.preferences.newsletter ? "Suscrito" : "No suscrito"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span>Ubicación preferida</span>
              </div>
              <Badge variant="outline">{user.preferences.location}</Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Historial de pedidos */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" />
            Historial de pedidos ({user.orderHistory.length})
          </h4>
          <div className="space-y-2">
            {user.orderHistory.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium text-sm">{order.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.date).toLocaleDateString()} • {order.pharmacy}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">${order.total.toLocaleString()}</p>
                  <Badge
                    variant={
                      order.status === "Entregado" ? "default" : order.status === "En camino" ? "secondary" : "outline"
                    }
                    className="text-xs"
                  >
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
