"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Building2, Clock, Star, Truck, Package, ShoppingCart, Check } from "lucide-react"
import { pharmacies as fallbackPharmacies } from "@/lib/data/pharmacies"
import { insuranceOptions } from "@/lib/data/insurance"
import { calculateFinalPrice, type PriceCalculation } from "@/lib/utils/price-calculator"
import type { ClientMedication, ClientMedicationPrice } from "@/lib/types/client-medication"
import { OrderForm } from "./order-form"

interface MedicationCardWithPharmaciesProps {
  medication: ClientMedication
}

interface AvailablePharmacyEntry {
  id: string
  name: string
  rating: number
  deliveryTime: string | null
  deliveryFee: number
  isOpen: boolean
  originalPrice: number
  hasDiscount: boolean
  priceCalculation: PriceCalculation
  priceData: ClientMedicationPrice
}

const fallbackPharmacyMap = new Map(
  fallbackPharmacies.flatMap((pharmacy) => [
    [pharmacy.id, pharmacy],
    [pharmacy.id.toLowerCase(), pharmacy],
  ]),
)

export function MedicationCardWithPharmacies({ medication }: MedicationCardWithPharmaciesProps) {
  const [selectedPharmacy, setSelectedPharmacy] = useState<AvailablePharmacyEntry | null>(null)
  const [showOrderForm, setShowOrderForm] = useState(false)

  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : {}
  const userInsurance = user.obraSocial || ""
  const userInsuranceData = insuranceOptions.find((ins) => ins.name.toLowerCase() === userInsurance.toLowerCase())

  const availablePharmacies: AvailablePharmacyEntry[] = medication.prices
    .filter((price) => price.inStock)
    .map((price) => {
      const fallback =
        fallbackPharmacyMap.get(price.pharmacyId) ||
        (price.pharmacySlug ? fallbackPharmacyMap.get(price.pharmacySlug) : undefined)

      const priceCalculation = calculateFinalPrice(price, userInsuranceData?.id || "")

      return {
        id: price.pharmacyId,
        name: price.pharmacyName ?? fallback?.name ?? price.pharmacyId,
        rating: price.rating ?? fallback?.rating ?? 0,
        deliveryTime: price.deliveryTime ?? fallback?.deliveryTime ?? null,
        deliveryFee: price.deliveryFee ?? fallback?.deliveryFee ?? 0,
        isOpen: price.isOpen ?? fallback?.isOpen ?? false,
        originalPrice: price.price,
        hasDiscount: typeof price.discountedPrice === "number" && price.discountedPrice !== price.price,
        priceCalculation,
        priceData: price,
      }
    })
    .sort((a, b) => a.priceCalculation.finalPrice - b.priceCalculation.finalPrice)

  const handlePharmacyClick = (entry: AvailablePharmacyEntry) => {
    setSelectedPharmacy(entry)
    setShowOrderForm(true)
  }

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardHeader className="bg-muted/50">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">{medication.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{medication.genericName}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">{medication.category}</Badge>
                <Badge variant="secondary">{medication.brand}</Badge>
              </div>
            </div>
            <Package className="h-8 w-8 text-primary" />
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="mb-4 pb-4 border-b">
            <p className="text-sm text-muted-foreground mb-2">{medication.description}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Presentación:</span> {medication.presentation}
              </div>
              <div>
                <span className="font-medium">Laboratorio:</span> {medication.laboratory}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Farmacias disponibles ({availablePharmacies.length})
            </h4>

            {availablePharmacies.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay farmacias con stock disponible</p>
            ) : (
              availablePharmacies.map((pharmacy) => (
                <button
                  key={pharmacy.id}
                  onClick={() => handlePharmacyClick(pharmacy)}
                  className={`w-full border rounded-lg p-3 transition-all text-left ${
                    selectedPharmacy?.id === pharmacy.id
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "hover:border-primary hover:bg-muted/50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-semibold">{pharmacy.name}</h5>
                        {selectedPharmacy?.id === pharmacy.id && (
                          <Badge className="bg-primary text-primary-foreground text-xs">
                            <Check className="h-3 w-3 mr-1" />
                            Seleccionada
                          </Badge>
                        )}
                        {pharmacy.isOpen && (
                          <Badge variant="secondary" className="text-xs">
                            Abierto
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {pharmacy.rating.toFixed(1)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {pharmacy.deliveryTime ?? "-"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Truck className="h-3 w-3" />${pharmacy.deliveryFee.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      {pharmacy.hasDiscount && (
                        <p className="text-xs text-muted-foreground line-through">
                          ${pharmacy.originalPrice.toLocaleString()}
                        </p>
                      )}
                      <p className="text-lg font-bold text-primary">
                        ${pharmacy.priceCalculation.finalPrice.toLocaleString()}
                      </p>
                      {userInsurance && <p className="text-xs text-muted-foreground">con {userInsurance}</p>}
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-2 text-sm text-primary font-medium">
                    <ShoppingCart className="h-4 w-4" />
                    Hacer clic para comprar
                  </div>
                </button>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={showOrderForm}
        onOpenChange={(nextOpen) => {
          setShowOrderForm(nextOpen)
          if (!nextOpen) {
            setSelectedPharmacy(null)
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Realizar Pedido</DialogTitle>
          </DialogHeader>
          {selectedPharmacy && (
            <OrderForm
              medication={medication}
              pharmacyPrice={selectedPharmacy.priceData}
              pharmacyName={selectedPharmacy.name}
              deliveryFee={selectedPharmacy.deliveryFee}
              onSuccess={() => {
                setShowOrderForm(false)
                setSelectedPharmacy(null)
              }}
              onCancel={() => {
                setShowOrderForm(false)
                setSelectedPharmacy(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
