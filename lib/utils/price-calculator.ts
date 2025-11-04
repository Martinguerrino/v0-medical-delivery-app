import { insuranceOptions } from "@/lib/data/insurance"
import type { MedicationPrice } from "@/lib/data/medications-multi-pharmacy"

export interface PriceCalculation {
  originalPrice: number
  discountedPrice?: number
  insuranceCoverage: number
  copayment: number
  finalPrice: number
  savings: number
}

export function calculateFinalPrice(medicationPrice: MedicationPrice, userInsurance: string): PriceCalculation {
  const insurance = insuranceOptions.find((ins) => ins.id === userInsurance)

  if (!insurance) {
    return {
      originalPrice: medicationPrice.price,
      discountedPrice: medicationPrice.discountedPrice,
      insuranceCoverage: 0,
      copayment: 0,
      finalPrice: medicationPrice.discountedPrice || medicationPrice.price,
      savings: medicationPrice.discountedPrice ? medicationPrice.price - medicationPrice.discountedPrice : 0,
    }
  }

  const basePrice = medicationPrice.discountedPrice || medicationPrice.price
  const coverageAmount = (basePrice * insurance.coverage) / 100
  const finalPrice = Math.max(basePrice - coverageAmount + insurance.copayment, insurance.copayment)
  const savings = basePrice - finalPrice

  return {
    originalPrice: medicationPrice.price,
    discountedPrice: medicationPrice.discountedPrice,
    insuranceCoverage: insurance.coverage,
    copayment: insurance.copayment,
    finalPrice: Math.round(finalPrice),
    savings: Math.round(savings),
  }
}

export function formatPrice(price: number): string {
  return `$${(price / 100).toFixed(2)}`
}
