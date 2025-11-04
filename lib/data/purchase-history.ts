export interface PurchaseHistoryItem {
  id: string
  medicationName: string
  medicationId: string
  quantity: number
  price: number
  pharmacy: {
    id: string
    name: string
    address: string
  }
  purchaseDate: Date
  status: "completed" | "delivered" | "cancelled"
  prescriptionNumber?: string
  deliveryMethod: "pickup" | "delivery"
  totalAmount: number
}

// Datos de ejemplo del historial de compras
export const purchaseHistory: PurchaseHistoryItem[] = [
  {
    id: "PH001",
    medicationName: "Amoxicilina 500mg",
    medicationId: "MED001",
    quantity: 2,
    price: 15.5,
    pharmacy: {
      id: "FARM001",
      name: "Farmacia San José",
      address: "Av. Principal 123, Centro",
    },
    purchaseDate: new Date("2024-01-15"),
    status: "completed",
    prescriptionNumber: "RX-2024-001",
    deliveryMethod: "delivery",
    totalAmount: 31.0,
  },
  {
    id: "PH002",
    medicationName: "Ibuprofeno 400mg",
    medicationId: "MED002",
    quantity: 1,
    price: 8.75,
    pharmacy: {
      id: "FARM002",
      name: "Farmacia Central",
      address: "Calle 5 #45-67, Norte",
    },
    purchaseDate: new Date("2024-01-10"),
    status: "completed",
    prescriptionNumber: "RX-2024-002",
    deliveryMethod: "pickup",
    totalAmount: 8.75,
  },
  {
    id: "PH003",
    medicationName: "Losartán 50mg",
    medicationId: "MED003",
    quantity: 3,
    price: 22.3,
    pharmacy: {
      id: "FARM001",
      name: "Farmacia San José",
      address: "Av. Principal 123, Centro",
    },
    purchaseDate: new Date("2024-01-05"),
    status: "delivered",
    prescriptionNumber: "RX-2024-003",
    deliveryMethod: "delivery",
    totalAmount: 66.9,
  },
  {
    id: "PH004",
    medicationName: "Omeprazol 20mg",
    medicationId: "MED004",
    quantity: 1,
    price: 12.4,
    pharmacy: {
      id: "FARM003",
      name: "Farmacia del Norte",
      address: "Carrera 15 #23-45, Norte",
    },
    purchaseDate: new Date("2023-12-28"),
    status: "completed",
    prescriptionNumber: "RX-2023-045",
    deliveryMethod: "pickup",
    totalAmount: 12.4,
  },
  {
    id: "PH005",
    medicationName: "Metformina 850mg",
    medicationId: "MED005",
    quantity: 2,
    price: 18.9,
    pharmacy: {
      id: "FARM002",
      name: "Farmacia Central",
      address: "Calle 5 #45-67, Norte",
    },
    purchaseDate: new Date("2023-12-20"),
    status: "completed",
    prescriptionNumber: "RX-2023-042",
    deliveryMethod: "delivery",
    totalAmount: 37.8,
  },
]

export function getPurchaseHistory(): PurchaseHistoryItem[] {
  return purchaseHistory.sort((a, b) => b.purchaseDate.getTime() - a.purchaseDate.getTime())
}

export function getPurchaseById(id: string): PurchaseHistoryItem | undefined {
  return purchaseHistory.find((item) => item.id === id)
}

export function getMedicationPurchaseHistory(medicationId: string): PurchaseHistoryItem[] {
  return purchaseHistory.filter((item) => item.medicationId === medicationId)
}
