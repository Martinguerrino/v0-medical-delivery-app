export interface CoordinatePoint {
  avenida: number
  calle: number
}

export const DELIVERY_FEE_FACTOR = 20

export const buildCoordinate = (avenida?: unknown, calle?: unknown): CoordinatePoint | null => {
  const avenidaValue = Number(avenida)
  const calleValue = Number(calle)

  if (!Number.isFinite(avenidaValue) || !Number.isFinite(calleValue)) {
    return null
  }

  if (avenidaValue <= 0 || calleValue <= 0) {
    return null
  }

  return {
    avenida: avenidaValue,
    calle: calleValue,
  }
}

export interface DeliveryQuoteResult {
  distance: number | null
  fee: number
}

export const calculateDeliveryQuote = (
  pharmacy: CoordinatePoint | null,
  delivery: CoordinatePoint | null,
): DeliveryQuoteResult => {
  if (!pharmacy || !delivery) {
    return { distance: null, fee: 0 }
  }

  const deltaAvenida = delivery.avenida - pharmacy.avenida
  const deltaCalle = delivery.calle - pharmacy.calle
  const distance = Math.hypot(deltaAvenida, deltaCalle)
  const rawFee = distance * DELIVERY_FEE_FACTOR
  const fee = Number.isFinite(rawFee) ? Math.max(0, Math.round(rawFee)) : 0

  return { distance, fee }
}
