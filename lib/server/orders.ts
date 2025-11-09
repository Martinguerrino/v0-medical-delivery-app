import { orderItemStatements } from "@/lib/database"
import type { OrderItemRecord, OrderStatus, OrderWithItems, PrescriptionStatus } from "@/lib/types/orders"

export const toBoolean = (value: unknown): boolean => {
  if (typeof value === "boolean") return value
  if (typeof value === "number") return value !== 0
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase()
    return normalized === "1" || normalized === "true" || normalized === "yes"
  }
  return Boolean(value)
}

export const toNullableString = (value: unknown): string | null => {
  if (value === null || value === undefined) return null
  const stringValue = String(value).trim()
  return stringValue.length === 0 ? null : stringValue
}

export const toNumber = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export const mapOrderItemRow = (row: any): OrderItemRecord => ({
  id: typeof row.id === "number" ? row.id : undefined,
  orderId: row.orderId,
  medicationId: Number(row.medicationId),
  medicationName: row.medicationName,
  brand: row.brand,
  quantity: Number(row.quantity),
  unitPrice: Number(row.unitPrice),
  totalPrice: Number(row.totalPrice),
  finalPrice: Number(row.finalPrice),
  insuranceSavings: Number(row.insuranceSavings ?? 0),
})

export const mapOrderRow = (row: any): OrderWithItems => {
  const items = orderItemStatements.getByOrderId.all(row.id).map(mapOrderItemRow)

  return {
    id: row.id,
    orderNumber: row.orderNumber,
    date: row.date,
    status: (row.status ?? "processing") as OrderStatus,
    customerId: row.customerId,
    pharmacyId: row.pharmacyId,
    pharmacyName: row.pharmacyName,
    courierId: toNullableString(row.courierId),
    subtotal: toNumber(row.subtotal),
    deliveryFee: toNumber(row.deliveryFee),
    insuranceDiscount: toNumber(row.insuranceDiscount),
    total: toNumber(row.total),
    deliveryAddress: row.deliveryAddress,
    deliveryInstructions: toNullableString(row.deliveryInstructions),
    prescriptionRequired: toBoolean(row.prescriptionRequired),
    prescriptionUploaded: toBoolean(row.prescriptionUploaded),
    prescriptionStatus: (row.prescriptionStatus ?? "pending") as PrescriptionStatus,
    prescriptionRejectionReason: toNullableString(row.prescriptionRejectionReason),
    prescriptionFileName: toNullableString(row.prescriptionFileName),
    estimatedDelivery: toNullableString(row.estimatedDelivery),
    actualDelivery: toNullableString(row.actualDelivery),
    paymentMethod: row.paymentMethod,
    insuranceUsed: toNullableString(row.insuranceUsed) ?? "",
    createdAt: row.createdAt ?? row.date,
    updatedAt: row.updatedAt ?? row.date,
    items,
  }
}
