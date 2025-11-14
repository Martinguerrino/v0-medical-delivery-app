"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, Info } from "lucide-react"

interface LoginFormProps {
  onToggleMode: () => void
  onLogin: (user: any) => void
}

export function LoginForm({ onToggleMode, onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const result = (await response.json()) as { success: boolean; message: string; user?: any }

      if (!response.ok || !result.success) {
        setError(result?.message || "No se pudo iniciar sesión")
        return
      }

      if (result.user) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...result.user,
            isAuthenticated: true,
          }),
        )
        onLogin(result.user)
      } else {
        setError("Respuesta inválida del servidor")
      }
    } catch (error) {
      console.error("Error logging in:", error)
      setError("Error al conectar con el servidor. Inténtalo nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = (role: "Cliente" | "Farmacia" | "Repartidor") => {
    if (role === "Cliente") {
      setEmail("cliente@test.com")
      setPassword("cliente123")
    } else if (role === "Farmacia") {
      setEmail("farmacia@test.com")
      setPassword("farmacia123")
    } else if (role === "Repartidor") {
      setEmail("repartidor@test.com")
      setPassword("repartidor123")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary">Iniciar Sesión</CardTitle>
        <CardDescription>Ingresa a tu cuenta para acceder a la plataforma</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Credenciales de prueba:</strong>
            <div className="mt-2 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span>Cliente: cliente@test.com / cliente123</span>
                <Button
                  variant="link"
                  className="p-0 h-auto text-xs underline"
                  onClick={() => handleDemoLogin("Cliente")}
                >
                  Usar
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Farmacia: farmacia@test.com / farmacia123</span>
                <Button
                  variant="link"
                  className="p-0 h-auto text-xs underline"
                  onClick={() => handleDemoLogin("Farmacia")}
                >
                  Usar
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Repartidor: repartidor@test.com / repartidor123</span>
                <Button
                  variant="link"
                  className="p-0 h-auto text-xs underline"
                  onClick={() => handleDemoLogin("Repartidor")}
                >
                  Usar
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-primary hover:text-primary/80 underline"
              onClick={onToggleMode}
            >
              Regístrate aquí
            </Button>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
