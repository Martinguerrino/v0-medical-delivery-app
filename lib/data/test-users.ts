export interface TestUser {
  id: string
  email: string
  password: string
  name: string
  lastName: string
  phone: string
  address: string
  obraSocial: string
  numeroAfiliado: string
  birthDate: string
  preferences: {
    notifications: boolean
    newsletter: boolean
    location: string
  }
  orderHistory: Array<{
    id: string
    date: string
    pharmacy: string
    total: number
    status: string
  }>
}

export const testUsers: TestUser[] = [
  {
    id: "test-user-1",
    email: "demo@farmacia.com",
    password: "demo123",
    name: "María",
    lastName: "González",
    phone: "+54 9 11 1234-5678",
    address: "Av. Santa Fe 1234, Palermo, CABA",
    obraSocial: "OSDE",
    numeroAfiliado: "123456789",
    birthDate: "1985-03-15",
    preferences: {
      notifications: true,
      newsletter: true,
      location: "Palermo, CABA",
    },
    orderHistory: [
      {
        id: "ORD-001",
        date: "2024-01-15",
        pharmacy: "Farmacity",
        total: 2450,
        status: "Entregado",
      },
      {
        id: "ORD-002",
        date: "2024-01-10",
        pharmacy: "Dr. Ahorro",
        total: 1890,
        status: "Entregado",
      },
      {
        id: "ORD-003",
        date: "2024-01-05",
        pharmacy: "Farmahorro",
        total: 3200,
        status: "En camino",
      },
    ],
  },
  {
    id: "test-user-2",
    email: "usuario@test.com",
    password: "test123",
    name: "Carlos",
    lastName: "Rodríguez",
    phone: "+54 9 11 9876-5432",
    address: "Av. Corrientes 2456, San Nicolás, CABA",
    obraSocial: "Swiss Medical",
    numeroAfiliado: "987654321",
    birthDate: "1978-11-22",
    preferences: {
      notifications: false,
      newsletter: true,
      location: "San Nicolás, CABA",
    },
    orderHistory: [
      {
        id: "ORD-004",
        date: "2024-01-12",
        pharmacy: "Farmaplus",
        total: 1650,
        status: "Entregado",
      },
    ],
  },
]

export const authenticateUser = (email: string, password: string): TestUser | null => {
  const user = testUsers.find((u) => u.email === email && u.password === password)
  return user || null
}

export const getUserById = (id: string): TestUser | null => {
  return testUsers.find((u) => u.id === id) || null
}
