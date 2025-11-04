"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@/lib/types/user-types"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: Array<"Cliente" | "Farmacia" | "Repartidor">
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem("user")

    if (!userData) {
      // No hay usuario autenticado, redirigir a login
      router.push("/auth")
      return
    }

    const user: User = JSON.parse(userData)

    if (!user.isAuthenticated) {
      // Usuario no autenticado, redirigir a login
      router.push("/auth")
      return
    }

    // Si se especifican roles permitidos, verificar que el usuario tenga uno de ellos
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      // Usuario no tiene el rol adecuado, redirigir según su rol
      if (user.role === "Cliente") {
        router.push("/")
      } else if (user.role === "Farmacia") {
        router.push("/farmacia/panel")
      } else if (user.role === "Repartidor") {
        router.push("/repartidor/panel")
      }
      return
    }

    setIsAuthorized(true)
    setIsLoading(false)
  }, [router, allowedRoles])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
