"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Menu, LogOut } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import type { User as UserType } from "@/lib/types/user-types"
import Image from "next/image"

export function Header() {
  const [user, setUser] = useState<UserType | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check for user in localStorage on component mount
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
        <div className="flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/rappifarma-logo.jpg" alt="RappiFarma Logo" width={60} height={60} className="rounded-full" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">RappiFarma</h1>
            </div>
          </Link>

          <div className="flex items-center gap-4 ml-auto">
            {user ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </Button>
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
              </>
            ) : (
              <Link href="/auth">
                <Button variant="secondary" size="sm" className="hidden md:flex">
                  <User className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </Button>
              </Link>
            )}

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
            <Link href="/pedidos">
              <Button variant="ghost" size="sm" className="text-foreground hover:text-secondary hover:bg-secondary/10">
                Pedidos
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
