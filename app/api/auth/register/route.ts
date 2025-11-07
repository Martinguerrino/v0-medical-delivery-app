import { NextRequest, NextResponse } from 'next/server'
import { userStatements } from '@/lib/database'
import type { UserRole } from '@/lib/types/user-types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { role, ...userData } = body

    // Validate required fields
    if (!role || !userData.email || !userData.password) {
      return NextResponse.json(
        { success: false, message: 'Campos requeridos faltantes' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = userStatements.getByEmail.get(userData.email)
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'El email ya está en uso' },
        { status: 409 }
      )
    }

    // Create new user
    const newUserId = `${role.toLowerCase()}-${Date.now()}`
    const createdAt = new Date().toISOString()

    // Insert user into database
    userStatements.insert.run(
      newUserId,
      userData.email,
      userData.password,
      role,
      userData.nombre || null,
      userData.esMayorDeEdad ? 1 : 0,
      userData.phone || null,
      userData.address || null,
      userData.obraSocial || null,
      userData.nombreFarmacia || null,
      userData.cuit || null,
      userData.direccion || null,
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
      role: role,
      nombre: userData.nombre || null,
      esMayorDeEdad: userData.esMayorDeEdad || false,
      phone: userData.phone || null,
      address: userData.address || null,
      obraSocial: userData.obraSocial || null,
      nombreFarmacia: userData.nombreFarmacia || null,
      cuit: userData.cuit || null,
      direccion: userData.direccion || null,
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
