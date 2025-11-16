import { NextRequest, NextResponse } from 'next/server'
import { userStatements } from '@/lib/database'
import type { UserRole } from '@/lib/types/user-types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { role, ...userData } = body

    const normalizeNumericField = (value: unknown) => {
      const numericValue = typeof value === "number" ? value : Number.parseInt(String(value ?? ""), 10)
      return Number.isFinite(numericValue) ? Math.trunc(numericValue) : NaN
    }

    // Validate required fields
    if (!role || !userData.email || !userData.password) {
      return NextResponse.json(
        { success: false, message: 'Campos requeridos faltantes' },
        { status: 400 }
      )
    }

    const typedRole = role as UserRole

    // Check if email already exists
    const existingUser = userStatements.getByEmail.get(userData.email)
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'El email ya está en uso' },
        { status: 409 }
      )
    }

    // Create new user
    const newUserId = `${typedRole.toLowerCase()}-${Date.now()}`
    const createdAt = new Date().toISOString()

    let avenidaValue: number | null = null
    let calleValue: number | null = null
    let direccionValue: string | null = userData.direccion || null

    if (typedRole === 'Farmacia') {
      avenidaValue = normalizeNumericField(userData.avenida)
      calleValue = normalizeNumericField(userData.calle)

      const isValidAvenida = Number.isInteger(avenidaValue) && avenidaValue > 0
      const isValidCalle = Number.isInteger(calleValue) && calleValue > 0

      if (!isValidAvenida || !isValidCalle) {
        return NextResponse.json(
          { success: false, message: 'Avenida y Calle deben ser números enteros positivos' },
          { status: 400 }
        )
      }

      direccionValue = direccionValue ?? `Avenida ${avenidaValue}, Calle ${calleValue}`
    }

    // Insert user into database
    userStatements.insert.run(
      newUserId,
      userData.email,
      userData.password,
      typedRole,
      userData.nombre || null,
      userData.esMayorDeEdad ? 1 : 0,
      userData.phone || null,
      userData.address || null,
      userData.obraSocial || null,
      userData.nombreFarmacia || null,
      userData.cuit || null,
      direccionValue,
      avenidaValue,
      calleValue,
      userData.telefono || null,
      userData.nombreCompleto || null,
      userData.dni || null,
      userData.vehiculo || null,
      createdAt
    )

    // Create user object for response
    const newUser = {
      id: newUserId,
      email: userData.email,
      password: userData.password,
      role: typedRole,
      nombre: userData.nombre || null,
      esMayorDeEdad: userData.esMayorDeEdad || false,
      phone: userData.phone || null,
      address: userData.address || null,
      obraSocial: userData.obraSocial || null,
      nombreFarmacia: userData.nombreFarmacia || null,
      cuit: userData.cuit || null,
      direccion: direccionValue,
      avenida: avenidaValue,
      calle: calleValue,
      telefono: userData.telefono || null,
      nombreCompleto: userData.nombreCompleto || null,
      dni: userData.dni || null,
      vehiculo: userData.vehiculo || null,
      createdAt,
    }

    return NextResponse.json({
      success: true,
      message: 'Registro exitoso',
      user: newUser
    })

  } catch (error) {
    console.error('Error registering user:', error)
    return NextResponse.json(
      { success: false, message: 'Error al crear la cuenta' },
      { status: 500 }
    )
  }
}
