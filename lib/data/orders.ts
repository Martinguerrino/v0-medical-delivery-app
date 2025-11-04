export interface OrderItem {
  medicationId: number
  medicationName: string
  brand: string
  quantity: number
  unitPrice: number
  totalPrice: number
  finalPrice: number
  insuranceSavings: number
}

export interface Order {
  id: string
  orderNumber: string
  date: string
  status: "completed" | "processing" | "cancelled" | "delivered"
  pharmacyId: string
  pharmacyName: string
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  insuranceDiscount: number
  total: number
  deliveryAddress: string
  prescriptionRequired: boolean
  prescriptionUploaded: boolean
  prescriptionStatus: "approved" | "pending" | "rejected"
  prescriptionRejectionReason?: string
  estimatedDelivery: string
  actualDelivery?: string
  paymentMethod: string
  insuranceUsed: string
}

export const mockOrders: Order[] = [
  {
    id: "ord_001",
    orderNumber: "MR-2024-001",
    date: "2024-01-15T10:30:00Z",
    status: "delivered",
    pharmacyId: "farmacity",
    pharmacyName: "Farmacity",
    items: [
      {
        medicationId: 1,
        medicationName: "Amoxicilina 500mg",
        brand: "Amoxil",
        quantity: 1,
        unitPrice: 2599,
        totalPrice: 2599,
        finalPrice: 1079,
        insuranceSavings: 1520,
      },
      {
        medicationId: 4,
        medicationName: "Omeprazol 20mg",
        brand: "Prilosec",
        quantity: 2,
        unitPrice: 1530,
        totalPrice: 3060,
        finalPrice: 1260,
        insuranceSavings: 1800,
      },
    ],
    subtotal: 5659,
    deliveryFee: 350,
    insuranceDiscount: 3320,
    total: 2689,
    deliveryAddress: "Av. Corrientes 1234, CABA",
    prescriptionRequired: true,
    prescriptionUploaded: true,
    prescriptionStatus: "approved",
    estimatedDelivery: "2024-01-15T12:00:00Z",
    actualDelivery: "2024-01-15T11:45:00Z",
    paymentMethod: "Tarjeta de crédito",
    insuranceUsed: "OSDE",
  },
  {
    id: "ord_002",
    orderNumber: "MR-2024-002",
    date: "2024-01-10T14:20:00Z",
    status: "completed",
    pharmacyId: "dr-ahorro",
    pharmacyName: "Dr. Ahorro",
    items: [
      {
        medicationId: 2,
        medicationName: "Losartán 50mg",
        brand: "Cozaar",
        quantity: 1,
        unitPrice: 1650,
        totalPrice: 1650,
        finalPrice: 830,
        insuranceSavings: 820,
      },
    ],
    subtotal: 1650,
    deliveryFee: 300,
    insuranceDiscount: 820,
    total: 1130,
    deliveryAddress: "Av. Corrientes 1234, CABA",
    prescriptionRequired: true,
    prescriptionUploaded: true,
    prescriptionStatus: "approved",
    estimatedDelivery: "2024-01-10T16:00:00Z",
    actualDelivery: "2024-01-10T15:30:00Z",
    paymentMethod: "Efectivo",
    insuranceUsed: "OSDE",
  },
  {
    id: "ord_003",
    orderNumber: "MR-2024-003",
    date: "2024-01-05T09:15:00Z",
    status: "processing",
    pharmacyId: "farmacias-del-dr-simi",
    pharmacyName: "Farmacias del Dr. Simi",
    items: [
      {
        medicationId: 3,
        medicationName: "Metformina 850mg",
        brand: "Glucophage",
        quantity: 1,
        unitPrice: 1899,
        totalPrice: 1899,
        finalPrice: 919,
        insuranceSavings: 980,
      },
    ],
    subtotal: 1899,
    deliveryFee: 250,
    insuranceDiscount: 980,
    total: 1169,
    deliveryAddress: "Av. Corrientes 1234, CABA",
    prescriptionRequired: true,
    prescriptionUploaded: true,
    prescriptionStatus: "pending",
    estimatedDelivery: "2024-01-05T11:00:00Z",
    paymentMethod: "Tarjeta de débito",
    insuranceUsed: "OSDE",
  },
  {
    id: "ord_004",
    orderNumber: "MR-2023-045",
    date: "2023-12-20T16:45:00Z",
    status: "cancelled",
    pharmacyId: "farmahorro",
    pharmacyName: "Farmahorro",
    items: [
      {
        medicationId: 5,
        medicationName: "Atorvastatina 20mg",
        brand: "Lipitor",
        quantity: 1,
        unitPrice: 2450,
        totalPrice: 2450,
        finalPrice: 1205,
        insuranceSavings: 1245,
      },
    ],
    subtotal: 2450,
    deliveryFee: 400,
    insuranceDiscount: 1245,
    total: 1605,
    deliveryAddress: "Av. Corrientes 1234, CABA",
    prescriptionRequired: true,
    prescriptionUploaded: false,
    prescriptionStatus: "rejected",
    prescriptionRejectionReason: "Receta vencida o ilegible",
    estimatedDelivery: "2023-12-20T18:30:00Z",
    paymentMethod: "Tarjeta de crédito",
    insuranceUsed: "OSDE",
  },
]
