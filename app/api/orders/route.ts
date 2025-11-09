import { randomUUID } from "crypto"
import { NextRequest, NextResponse } from "next/server"
import { orderStatements, orderItemStatements, userStatements } from "@/lib/database"
import type { OrderStatus, OrderWithItems, PrescriptionStatus } from "@/lib/types/orders"
import { ORDER_STATUS_SEQUENCE } from "@/lib/types/orders"
import { mapOrderRow, toNumber } from "@/lib/server/orders"

interface CreateOrderItemPayload {
  medicationId: number
  medicationName: string
  brand?: string
  quantity: number
  unitPrice: number
  finalPrice?: number
  insuranceSavings?: number
}

interface CreateOrderPayload {
  customerId: string
  pharmacyId: string
  pharmacyName: string
  deliveryAddress: string
  deliveryInstructions?: string | null
  paymentMethod: string
  insuranceUsed?: string | null
  prescriptionRequired?: boolean
  prescriptionUploaded?: boolean
  prescriptionStatus?: PrescriptionStatus
  prescriptionRejectionReason?: string | null
  prescriptionFileName?: string | null
  items: CreateOrderItemPayload[]
  deliveryFee: number
  estimatedDelivery?: string
}

const STATUS_PARAM_KEY = "status"

const ORDER_STATUS_SET = new Set<OrderStatus>(ORDER_STATUS_SEQUENCE)

const getOrdersByFilters = (params: URLSearchParams): OrderWithItems[] => {
  const customerId = params.get("customerId")
  const pharmacyId = params.get("pharmacyId")
  const courierId = params.get("courierId")
  const availableForCouriers = params.get("availableForCouriers") === "true"

  let rows: any[] = []

  if (availableForCouriers) {
    rows = orderStatements.getAvailableForCouriers.all()
  } else if (customerId) {
    rows = orderStatements.getByCustomerId.all(customerId)
  } else if (pharmacyId) {
    rows = orderStatements.getByPharmacyId.all(pharmacyId)
  } else if (courierId) {
    rows = orderStatements.getByCourierId.all(courierId)
  } else {
    rows = orderStatements.getAll.all()
  }

  const statusFilters = params
    .getAll(STATUS_PARAM_KEY)
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter((value) => ORDER_STATUS_SET.has(value as OrderStatus)) as OrderStatus[]

  const filteredRows = statusFilters.length > 0 ? rows.filter((row) => statusFilters.includes(row.status)) : rows

  return filteredRows.map(mapOrderRow)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orders = getOrdersByFilters(searchParams)
    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Error al obtener los pedidos" }, { status: 500 })
  }
}

const buildOrderNumber = () => {
  const timestamp = Date.now()
  const randomSuffix = Math.floor(Math.random() * 1000)
  return `PED-${timestamp}-${randomSuffix}`
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<CreateOrderPayload>

    if (!body?.customerId || !body.pharmacyId || !body.pharmacyName) {
      return NextResponse.json({ error: "Datos obligatorios incompletos" }, { status: 400 })
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "El pedido debe incluir al menos un medicamento" }, { status: 400 })
    }

    if (!body.deliveryAddress || !body.paymentMethod) {
      return NextResponse.json({ error: "Faltan datos de entrega o pago" }, { status: 400 })
    }

  const customer = userStatements.getById.get(body.customerId) as any
    if (!customer) {
      return NextResponse.json({ error: "El cliente no existe" }, { status: 400 })
    }

  const pharmacy = userStatements.getById.get(body.pharmacyId) as any
    if (!pharmacy || pharmacy.role !== "Farmacia") {
      return NextResponse.json({ error: "La farmacia no es válida" }, { status: 400 })
    }

    const now = new Date().toISOString()
    const orderId = randomUUID()
    const orderNumber = buildOrderNumber()

    const normalizedItems = body.items.map((item) => {
      const quantity = Math.max(1, toNumber(item.quantity))
      const unitPrice = toNumber(item.unitPrice)
      const finalPrice = item.finalPrice !== undefined ? toNumber(item.finalPrice) : unitPrice * quantity
      const totalPrice = unitPrice * quantity
      const insuranceSavings = item.insuranceSavings !== undefined ? toNumber(item.insuranceSavings) : totalPrice - finalPrice
      return {
        medicationId: Number(item.medicationId),
        medicationName: item.medicationName,
        brand: item.brand ?? "",
        quantity,
        unitPrice,
        finalPrice,
        totalPrice,
        insuranceSavings: Math.max(0, insuranceSavings),
      }
    })

    const subtotal = normalizedItems.reduce((sum, item) => sum + item.finalPrice, 0)
    const deliveryFee = Math.max(0, toNumber(body.deliveryFee))
    const insuranceDiscount = normalizedItems.reduce((sum, item) => sum + item.insuranceSavings, 0)
    const total = subtotal + deliveryFee

    const estimatedDelivery = body.estimatedDelivery ?? new Date(Date.now() + 45 * 60 * 1000).toISOString()
    const prescriptionRequired = Boolean(body.prescriptionRequired)
    const prescriptionUploaded = Boolean(body.prescriptionUploaded)
    const prescriptionStatus: PrescriptionStatus = body.prescriptionStatus ?? "pending"

    orderStatements.insert.run(
      orderId,
      orderNumber,
      now,
      "processing",
      body.customerId,
      body.pharmacyId,
      body.pharmacyName,
      null,
      subtotal,
      deliveryFee,
      insuranceDiscount,
      total,
      body.deliveryAddress,
      body.deliveryInstructions ?? null,
      prescriptionRequired ? 1 : 0,
      prescriptionUploaded ? 1 : 0,
      prescriptionStatus,
      body.prescriptionRejectionReason ?? null,
      body.prescriptionFileName ?? null,
      estimatedDelivery,
      null,
      body.paymentMethod,
      body.insuranceUsed ?? "",
      now,
      now,
    )

    normalizedItems.forEach((item) => {
      orderItemStatements.insert.run(
        orderId,
        item.medicationId,
        item.medicationName,
        item.brand,
        item.quantity,
        item.unitPrice,
        item.totalPrice,
        item.finalPrice,
        item.insuranceSavings,
      )
    })

    const createdOrderRow = orderStatements.getById.get(orderId)
    const createdOrder = createdOrderRow ? mapOrderRow(createdOrderRow) : null

    return NextResponse.json(createdOrder, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Error al crear el pedido" }, { status: 500 })
  }
}
