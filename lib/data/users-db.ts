import type { User, ClienteUser, FarmaciaUser, RepartidorUser } from "@/lib/types/user-types"

// Simulated database
const usersDatabase: User[] = [
  {
    id: "cliente-1",
    email: "cliente@test.com",
    password: "cliente123",
    role: "Cliente",
    nombre: "María González",
    esMayorDeEdad: true,
    phone: "+54 9 11 1234-5678",
    address: "Av. Santa Fe 1234, CABA",
    obraSocial: "OSDE",
    createdAt: new Date().toISOString(),
  } as ClienteUser,
  {
    id: "farmacia-1",
    email: "farmacia@test.com",
    password: "farmacia123",
    role: "Farmacia",
    nombreFarmacia: "Farmacia del Centro",
    cuit: "30-12345678-9",
    avenida: 1500,
    calle: 800,
    direccion: "Avenida 1500, Calle 800",
    telefono: "+54 11 4567-8900",
    createdAt: new Date().toISOString(),
  } as FarmaciaUser,
  {
    id: "repartidor-1",
    email: "repartidor@test.com",
    password: "repartidor123",
    role: "Repartidor",
    nombreCompleto: "Carlos Rodríguez",
    dni: "35123456",
    telefono: "+54 9 11 9876-5432",
    vehiculo: "Moto",
    createdAt: new Date().toISOString(),
  } as RepartidorUser,
  {
    id: "farmacia-farmacity",
    email: "farmacity@farmacia.com",
    password: "farmacity123",
    role: "Farmacia",
    nombreFarmacia: "Farmacity",
    cuit: "30-12345678-1",
    avenida: 1234,
    calle: 600,
    direccion: "Avenida 1234, Calle 600",
    telefono: "0800-333-2762",
    createdAt: new Date().toISOString(),
  } as FarmaciaUser,
  {
    id: "farmacia-dr-ahorro",
    email: "drahorro@farmacia.com",
    password: "drahorro123",
    role: "Farmacia",
    nombreFarmacia: "Dr. Ahorro",
    cuit: "30-12345678-2",
    avenida: 2456,
    calle: 450,
    direccion: "Avenida 2456, Calle 450",
    telefono: "0800-777-2467",
    createdAt: new Date().toISOString(),
  } as FarmaciaUser,
  {
    id: "farmacia-farmacias-del-dr-simi",
    email: "drsimi@farmacia.com",
    password: "drsimi123",
    role: "Farmacia",
    nombreFarmacia: "Farmacias del Dr. Simi",
    cuit: "30-12345678-3",
    avenida: 3789,
    calle: 320,
    direccion: "Avenida 3789, Calle 320",
    telefono: "0800-444-7464",
    createdAt: new Date().toISOString(),
  } as FarmaciaUser,
  {
    id: "farmacia-farmahorro",
    email: "farmahorro@farmacia.com",
    password: "farmahorro123",
    role: "Farmacia",
    nombreFarmacia: "Farmahorro",
    cuit: "30-12345678-4",
    avenida: 1567,
    calle: 510,
    direccion: "Avenida 1567, Calle 510",
    telefono: "0800-555-3276",
    createdAt: new Date().toISOString(),
  } as FarmaciaUser,
  {
    id: "farmacia-farmaplus",
    email: "farmaplus@farmacia.com",
    password: "farmaplus123",
    role: "Farmacia",
    nombreFarmacia: "Farmaplus",
    cuit: "30-12345678-5",
    avenida: 2890,
    calle: 275,
    direccion: "Avenida 2890, Calle 275",
    telefono: "0800-666-7587",
    createdAt: new Date().toISOString(),
  } as FarmaciaUser,
]

export const registerUser = (
  userData: Omit<User, "id" | "createdAt">,
): { success: boolean; message: string; user?: User } => {
  // Check if email already exists
  const existingUser = usersDatabase.find((u) => u.email === userData.email)
  if (existingUser) {
    return {
      success: false,
      message: "El email ya está en uso",
    }
  }

  // Create new user
  const newUser: User = {
    ...userData,
    id: `${userData.role.toLowerCase()}-${Date.now()}`,
    createdAt: new Date().toISOString(),
  } as User

  if (newUser.role === "Farmacia") {
    const farmaciaUser = newUser as FarmaciaUser
    farmaciaUser.avenida = Math.max(1, Math.abs(Math.trunc(farmaciaUser.avenida)))
    farmaciaUser.calle = Math.max(1, Math.abs(Math.trunc(farmaciaUser.calle)))
    farmaciaUser.direccion = farmaciaUser.direccion || `Avenida ${farmaciaUser.avenida}, Calle ${farmaciaUser.calle}`
  }

  usersDatabase.push(newUser)

  return {
    success: true,
    message: "Registro exitoso",
    user: newUser,
  }
}

export const authenticateUser = (
  email: string,
  password: string,
): { success: boolean; message: string; user?: User } => {
  const user = usersDatabase.find((u) => u.email === email)

  if (!user) {
    return {
      success: false,
      message: "El email ingresado no se encuentra registrado",
    }
  }

  if (user.password !== password) {
    return {
      success: false,
      message: "La contraseña no es válida. Intente nuevamente",
    }
  }

  return {
    success: true,
    message: "Inicio de sesión exitoso",
    user,
  }
}

export const getAllUsers = (): User[] => {
  return usersDatabase
}
