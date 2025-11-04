"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, ShoppingCart, User, Menu, LogOut } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import type { User as UserType } from "@/lib/types/user-types"
import Image from "next/image"

export function Header() {
  const [cartItems, setCartItems] = useState(0)
  const [user, setUser] = useState<UserType | null>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.isAuthenticated) {
        setUser(parsedUser)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)

    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    })

    router.push("/auth")
  }

  const getUserDisplayName = () => {
    if (!user) return "Usuario"

    if (user.role === "Cliente") {
      return user.nombre
    } else if (user.role === "Farmacia") {
      return user.nombreFarmacia
    } else if (user.role === "Repartidor") {
      return user.nombreCompleto
    }
    return "Usuario"
  }

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/rappifarma-logo.jpg" alt="RappiFarma Logo" width={60} height={60} className="rounded-full" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">RappiFarma</h1>
            </div>
          </Link>

          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary h-4 w-4" />
              <Input
                placeholder="Buscar medicamentos con receta..."
                className="pl-10 pr-4 py-3 text-base focus:ring-secondary"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="sm" className="hidden md:flex">
                    <User className="h-4 w-4 mr-2" />
                    {getUserDisplayName()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="h-4 w-4 mr-2" />
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span className="text-xs text-muted-foreground">Rol: {user.role}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button variant="secondary" size="sm" className="hidden md:flex">
                  <User className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </Button>
              </Link>
            )}

            <Button variant="outline" size="sm" className="relative bg-transparent">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Carrito
              {cartItems > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-secondary text-secondary-foreground">
                  {cartItems}
                </Badge>
              )}
            </Button>

            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <nav className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8 py-3">
            <Link href="/medicamentos">
              <Button variant="ghost" size="sm" className="text-foreground hover:text-secondary hover:bg-secondary/10">
                Medicamentos
              </Button>
            </Link>
            <Link href="/historial">
              <Button variant="ghost" size="sm" className="text-foreground hover:text-secondary hover:bg-secondary/10">
                Historial
              </Button>
            </Link>
            <Link href="/pedidos">
              <Button variant="ghost" size="sm" className="text-foreground hover:text-secondary hover:bg-secondary/10">
                Pedidos
              </Button>
            </Link>
            <Link href="/ayuda">
              <Button variant="ghost" size="sm" className="text-foreground hover:text-secondary hover:bg-secondary/10">
                Ayuda
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
