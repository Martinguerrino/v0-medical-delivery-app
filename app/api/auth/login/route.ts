import { NextRequest, NextResponse } from "next/server"
import { userStatements } from "@/lib/database"
import type { User } from "@/lib/types/user-types"

const normalizeUser = (record: any): User => {
  const baseFields = {
    id: record.id as string,
    email: record.email as string,
    password: record.password as string,
    role: record.role as string,
    createdAt: record.createdAt as string,
  }

  if (record.role === "Cliente") {
    return {
      ...baseFields,
      role: "Cliente",
      nombre: (record.nombre as string) ?? "",
      esMayorDeEdad: Boolean(record.esMayorDeEdad),
      phone: record.phone ?? undefined,
      address: record.address ?? undefined,
      obraSocial: record.obraSocial ?? undefined,
    }
  }

  if (record.role === "Farmacia") {
    return {
      ...baseFields,
      role: "Farmacia",
      nombreFarmacia: (record.nombreFarmacia as string) ?? "",
      cuit: (record.cuit as string) ?? "",
      direccion: (record.direccion as string) ?? "",
      telefono: record.telefono ?? undefined,
      horarios: record.horarios ?? undefined,
    }
  }

  return {
    ...baseFields,
    role: "Repartidor",
    nombreCompleto: (record.nombreCompleto as string) ?? "",
    dni: (record.dni as string) ?? "",
    telefono: (record.telefono as string) ?? "",
    vehiculo: record.vehiculo ?? undefined,
    zonaCobertura: record.zonaCobertura ?? undefined,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body ?? {}

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email y contraseña son requeridos" },
        { status: 400 },
      )
    }

    const userRecord = userStatements.getByEmail.get(email) as any

    if (!userRecord) {
      return NextResponse.json(
        { success: false, message: "El email ingresado no se encuentra registrado" },
        { status: 401 },
      )
    }

    if (userRecord.password !== password) {
      return NextResponse.json(
        { success: false, message: "La contraseña no es válida. Intente nuevamente" },
        { status: 401 },
      )
    }

    const user = normalizeUser(userRecord)

    return NextResponse.json({ success: true, message: "Inicio de sesión exitoso", user })
  } catch (error) {
    console.error("Error during login:", error)
    return NextResponse.json(
      { success: false, message: "Error al iniciar sesión" },
      { status: 500 },
    )
  }
}
