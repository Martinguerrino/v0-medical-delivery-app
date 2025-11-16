export type UserRole = "Cliente" | "Farmacia" | "Repartidor"

export interface BaseUser {
  id: string
  email: string
  password: string
  role: UserRole
  createdAt: string
}

export interface ClienteUser extends BaseUser {
  role: "Cliente"
  nombre: string
  esMayorDeEdad: boolean
  phone?: string
  address?: string
  obraSocial?: string
}

export interface FarmaciaUser extends BaseUser {
  role: "Farmacia"
  nombreFarmacia: string
  cuit: string
  direccion: string
  avenida: number
  calle: number
  telefono?: string
  horarios?: string
}

export interface RepartidorUser extends BaseUser {
  role: "Repartidor"
  nombreCompleto: string
  dni: string
  telefono: string
  vehiculo?: string
  zonaCobertura?: string
}

export type User = ClienteUser | FarmaciaUser | RepartidorUser
