"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Building, FileText } from "lucide-react"
import type { UserRole } from "@/lib/types/user-types"

interface RegisterFormProps {
  onToggleMode: () => void
  onRegister: (userData: any) => void
}

export function RegisterForm({ onToggleMode, onRegister }: RegisterFormProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Cliente fields
  const [clienteData, setClienteData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
    esMayorDeEdad: false,
  })

  // Farmacia fields
  const [farmaciaData, setFarmaciaData] = useState({
    nombreFarmacia: "",
    cuit: "",
    avenida: "",
    calle: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // Repartidor fields
  const [repartidorData, setRepartidorData] = useState({
    nombreCompleto: "",
    dni: "",
    telefono: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    let userData: any = {}
    let password = ""
    let confirmPassword = ""

    if (selectedRole === "Cliente") {
      password = clienteData.password
      confirmPassword = clienteData.confirmPassword

      if (!clienteData.esMayorDeEdad) {
        setError("Debes confirmar que eres mayor de edad")
        setIsLoading(false)
        return
      }

      userData = {
        role: "Cliente",
        nombre: clienteData.nombre,
        email: clienteData.email,
        password: clienteData.password,
        esMayorDeEdad: clienteData.esMayorDeEdad,
      }
    } else if (selectedRole === "Farmacia") {
      password = farmaciaData.password
      confirmPassword = farmaciaData.confirmPassword

      const avenidaValue = Number.parseInt(farmaciaData.avenida, 10)
      const calleValue = Number.parseInt(farmaciaData.calle, 10)

      const isValidAvenida = Number.isInteger(avenidaValue) && avenidaValue > 0
      const isValidCalle = Number.isInteger(calleValue) && calleValue > 0

      if (!isValidAvenida || !isValidCalle) {
        setError("Avenida y Calle deben ser números enteros positivos")
        setIsLoading(false)
        return
      }

      userData = {
        role: "Farmacia",
        nombreFarmacia: farmaciaData.nombreFarmacia,
        cuit: farmaciaData.cuit,
        avenida: avenidaValue,
        calle: calleValue,
        email: farmaciaData.email,
        password: farmaciaData.password,
      }
    } else if (selectedRole === "Repartidor") {
      password = repartidorData.password
      confirmPassword = repartidorData.confirmPassword

      userData = {
        role: "Repartidor",
        nombreCompleto: repartidorData.nombreCompleto,
        dni: repartidorData.dni,
        telefono: repartidorData.telefono,
        email: repartidorData.email,
        password: repartidorData.password,
      }
    }

    // Validate password match
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const result = await response.json()

      if (result.success) {
        setSuccess(`¡Bienvenido! Tu cuenta de ${selectedRole} ha sido creada exitosamente`)
        setTimeout(() => {
          onRegister(result.user)
        }, 1500)
      } else {
        setError(result.message)
      }
    } catch (error) {
      console.error("Error registering user:", error)
      setError("Error al crear la cuenta. Inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary">Crear Cuenta</CardTitle>
        <CardDescription>Selecciona tu tipo de cuenta y completa el registro</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Tipo de Cuenta</Label>
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de cuenta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cliente">Cliente</SelectItem>
                <SelectItem value="Farmacia">Farmacia</SelectItem>
                <SelectItem value="Repartidor">Repartidor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedRole === "Cliente" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="cliente-nombre">Nombre</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cliente-nombre"
                    placeholder="Juan Pérez"
                    value={clienteData.nombre}
                    onChange={(e) => setClienteData({ ...clienteData, nombre: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cliente-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cliente-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={clienteData.email}
                    onChange={(e) => setClienteData({ ...clienteData, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cliente-password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cliente-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={clienteData.password}
                    onChange={(e) => setClienteData({ ...clienteData, password: e.target.value })}
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

              <div className="space-y-2">
                <Label htmlFor="cliente-confirm">Confirmar Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cliente-confirm"
                    type="password"
                    placeholder="••••••••"
                    value={clienteData.confirmPassword}
                    onChange={(e) => setClienteData({ ...clienteData, confirmPassword: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mayorEdad"
                  checked={clienteData.esMayorDeEdad}
                  onCheckedChange={(checked) => setClienteData({ ...clienteData, esMayorDeEdad: checked as boolean })}
                />
                <Label htmlFor="mayorEdad" className="text-sm font-normal cursor-pointer">
                  Confirmo que soy mayor de edad
                </Label>
              </div>
            </>
          )}

          {selectedRole === "Farmacia" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="farmacia-nombre">Nombre de la Farmacia</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="farmacia-nombre"
                    placeholder="Farmacia del Centro"
                    value={farmaciaData.nombreFarmacia}
                    onChange={(e) => setFarmaciaData({ ...farmaciaData, nombreFarmacia: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="farmacia-cuit">CUIT</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="farmacia-cuit"
                    placeholder="30-12345678-9"
                    value={farmaciaData.cuit}
                    onChange={(e) => setFarmaciaData({ ...farmaciaData, cuit: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="farmacia-avenida">Número de Avenida</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="farmacia-avenida"
                      type="number"
                      inputMode="numeric"
                      placeholder="1500"
                      min={1}
                      step={1}
                      value={farmaciaData.avenida}
                      onChange={(e) => setFarmaciaData({ ...farmaciaData, avenida: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="farmacia-calle">Número de Calle</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="farmacia-calle"
                      type="number"
                      inputMode="numeric"
                      placeholder="800"
                      min={1}
                      step={1}
                      value={farmaciaData.calle}
                      onChange={(e) => setFarmaciaData({ ...farmaciaData, calle: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="farmacia-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="farmacia-email"
                    type="email"
                    placeholder="contacto@farmacia.com"
                    value={farmaciaData.email}
                    onChange={(e) => setFarmaciaData({ ...farmaciaData, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="farmacia-password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="farmacia-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={farmaciaData.password}
                    onChange={(e) => setFarmaciaData({ ...farmaciaData, password: e.target.value })}
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

              <div className="space-y-2">
                <Label htmlFor="farmacia-confirm">Confirmar Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="farmacia-confirm"
                    type="password"
                    placeholder="••••••••"
                    value={farmaciaData.confirmPassword}
                    onChange={(e) => setFarmaciaData({ ...farmaciaData, confirmPassword: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {selectedRole === "Repartidor" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="repartidor-nombre">Nombre Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="repartidor-nombre"
                    placeholder="Carlos Rodríguez"
                    value={repartidorData.nombreCompleto}
                    onChange={(e) => setRepartidorData({ ...repartidorData, nombreCompleto: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="repartidor-dni">DNI</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="repartidor-dni"
                    placeholder="35123456"
                    value={repartidorData.dni}
                    onChange={(e) => setRepartidorData({ ...repartidorData, dni: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="repartidor-telefono">Teléfono</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="repartidor-telefono"
                    placeholder="+54 9 11 1234-5678"
                    value={repartidorData.telefono}
                    onChange={(e) => setRepartidorData({ ...repartidorData, telefono: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="repartidor-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="repartidor-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={repartidorData.email}
                    onChange={(e) => setRepartidorData({ ...repartidorData, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="repartidor-password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="repartidor-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={repartidorData.password}
                    onChange={(e) => setRepartidorData({ ...repartidorData, password: e.target.value })}
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

              <div className="space-y-2">
                <Label htmlFor="repartidor-confirm">Confirmar Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="repartidor-confirm"
                    type="password"
                    placeholder="••••••••"
                    value={repartidorData.confirmPassword}
                    onChange={(e) => setRepartidorData({ ...repartidorData, confirmPassword: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-primary bg-primary/10">
              <AlertDescription className="text-primary">{success}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isLoading || !selectedRole}
          >
            {isLoading ? "Creando cuenta..." : "Registrar"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80" onClick={onToggleMode}>
              Inicia sesión aquí
            </Button>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
