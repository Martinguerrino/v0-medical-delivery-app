import { insuranceOptions } from "@/lib/data/insurance"
import type { MedicationPrice } from "@/lib/data/medications-multi-pharmacy"
import type { ClientMedicationPrice } from "@/lib/types/client-medication"

export interface PriceCalculation {
  originalPrice: number
  discountedPrice?: number | null
  insuranceCoverage: number
  copayment: number
  finalPrice: number
  savings: number
}

type PriceInput = MedicationPrice | ClientMedicationPrice

export function calculateFinalPrice(medicationPrice: PriceInput, userInsurance: string): PriceCalculation {
  const insurance = insuranceOptions.find((ins) => ins.id === userInsurance)

  if (!insurance) {
    return {
      originalPrice: medicationPrice.price,
      discountedPrice: medicationPrice.discountedPrice ?? null,
      insuranceCoverage: 0,
      copayment: 0,
      finalPrice: medicationPrice.discountedPrice ?? medicationPrice.price,
      savings:
        medicationPrice.discountedPrice != null
          ? medicationPrice.price - medicationPrice.discountedPrice
          : 0,
    }
  }

  const basePrice = medicationPrice.discountedPrice ?? medicationPrice.price
  const coverageAmount = (basePrice * insurance.coverage) / 100
  const finalPrice = Math.max(basePrice - coverageAmount + insurance.copayment, insurance.copayment)
  const savings = basePrice - finalPrice

  return {
    originalPrice: medicationPrice.price,
    discountedPrice: medicationPrice.discountedPrice ?? null,
    insuranceCoverage: insurance.coverage,
    copayment: insurance.copayment,
    finalPrice: Math.round(finalPrice),
    savings: Math.round(savings),
  }
}

export function formatPrice(price: number): string {
  return `$${(price / 100).toFixed(2)}`
}
