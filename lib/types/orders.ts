export type OrderStatus = "processing" | "accepted" | "delivering" | "delivered" | "cancelled"

export type PrescriptionStatus = "pending" | "approved" | "rejected"

export interface OrderItemRecord {
  id?: number
  orderId: string
  medicationId: number
  medicationName: string
  brand: string
  quantity: number
  unitPrice: number
  totalPrice: number
  finalPrice: number
  insuranceSavings: number
}

export interface OrderRecord {
  id: string
  orderNumber: string
  date: string
  status: OrderStatus
  customerId: string
  pharmacyId: string
  pharmacyName: string
  courierId?: string | null
  subtotal: number
  deliveryFee: number
  insuranceDiscount: number
  total: number
  deliveryAddress: string
  deliveryInstructions?: string | null
  prescriptionRequired: boolean
  prescriptionUploaded: boolean
  prescriptionStatus: PrescriptionStatus
  prescriptionRejectionReason?: string | null
  prescriptionFileName?: string | null
  prescriptionFilePath?: string | null
  prescriptionFileUrl?: string | null
  estimatedDelivery?: string | null
  actualDelivery?: string | null
  paymentMethod: string
  insuranceUsed?: string | null
  createdAt: string
  updatedAt: string
}

export interface OrderWithItems extends OrderRecord {
  items: OrderItemRecord[]
}

export const ORDER_STATUS_SEQUENCE: OrderStatus[] = [
  "processing",
  "accepted",
  "delivering",
  "delivered",
  "cancelled",
]

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  processing: "En proceso",
  accepted: "Aceptado",
  delivering: "Entregando",
  delivered: "Entregado",
  cancelled: "Cancelado",
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, { background: string; text: string }> = {
  processing: { background: "bg-blue-100", text: "text-blue-800" },
  accepted: { background: "bg-purple-100", text: "text-purple-800" },
  delivering: { background: "bg-amber-100", text: "text-amber-800" },
  delivered: { background: "bg-green-100", text: "text-green-800" },
  cancelled: { background: "bg-red-100", text: "text-red-800" },
}

export const PRESCRIPTION_STATUS_LABELS: Record<PrescriptionStatus, string> = {
  pending: "Receta pendiente",
  approved: "Receta aprobada",
  rejected: "Receta rechazada",
}

export function isOrderStatus(value: string): value is OrderStatus {
  return ORDER_STATUS_SEQUENCE.includes(value as OrderStatus)
}
