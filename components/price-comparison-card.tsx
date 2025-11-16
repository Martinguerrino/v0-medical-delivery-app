"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ShoppingCart, AlertTriangle, Info, Clock, Truck, Star, TrendingDown } from "lucide-react"
import { pharmacies } from "@/lib/data/pharmacies"
import { calculateFinalPrice, formatPrice } from "@/lib/utils/price-calculator"
import type { MedicationMultiPharmacy } from "@/lib/data/medications-multi-pharmacy"
import Link from "next/link"

interface PriceComparisonCardProps {
  medication: MedicationMultiPharmacy
}

export function PriceComparisonCard({ medication }: PriceComparisonCardProps) {
  const [userInsurance, setUserInsurance] = useState<string>("")

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      const userData = JSON.parse(user)
      setUserInsurance(userData.obraSocial?.toLowerCase().replace(/\s+/g, "-") || "")
    }
  }, [])

  const sortedPrices = medication.prices
    .map((price) => {
      const pharmacy = pharmacies.find((p) => p.id === price.pharmacyId)
      const priceCalculation = calculateFinalPrice(price, userInsurance)
      return {
        ...price,
        pharmacy,
        priceCalculation,
      }
    })
    .filter((item) => item.pharmacy)
    .sort((a, b) => a.priceCalculation.finalPrice - b.priceCalculation.finalPrice)

  const bestPrice = sortedPrices[0]

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg leading-tight">{medication.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {medication.brand} • {medication.laboratory}
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {medication.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{medication.description}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Info className="h-3 w-3 text-accent" />
            <span>{medication.presentation}</span>
          </div>
        </div>

        {bestPrice && (
          <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium text-secondary">Mejor precio</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={bestPrice.pharmacy?.logo || "/placeholder.svg"} alt={bestPrice.pharmacy?.name} />
                  <AvatarFallback>{bestPrice.pharmacy?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{bestPrice.pharmacy?.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-current text-yellow-500" />
                    <span>{bestPrice.pharmacy?.rating}</span>
                    <Clock className="h-3 w-3" />
                    <span>{bestPrice.pharmacy?.deliveryTime}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">{formatPrice(bestPrice.priceCalculation.finalPrice)}</p>
                {bestPrice.priceCalculation.savings > 0 && (
                  <p className="text-xs text-green-600">Ahorras {formatPrice(bestPrice.priceCalculation.savings)}</p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Comparar precios en todas las farmacias:</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {sortedPrices.map((item, index) => (
              <div
                key={item.pharmacyId}
                className={`flex items-center justify-between p-2 rounded-lg border ${
                  index === 0 ? "bg-secondary/5 border-secondary/20" : "bg-muted/30 border-border"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={item.pharmacy?.logo || "/placeholder.svg"} alt={item.pharmacy?.name} />
                    <AvatarFallback className="text-xs">{item.pharmacy?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{item.pharmacy?.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {item.pharmacy?.isOpen ? (
                        <Badge
                          variant="outline"
                          className="text-xs px-1 py-0 bg-green-50 text-green-700 border-green-200"
                        >
                          Abierto
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs px-1 py-0 bg-red-50 text-red-700 border-red-200">
                          Cerrado
                        </Badge>
                      )}
                      <Truck className="h-3 w-3" />
                      <span>{formatPrice(item.pharmacy?.deliveryFee || 0)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{formatPrice(item.priceCalculation.finalPrice)}</p>
                  {item.priceCalculation.savings > 0 && (
                    <p className="text-xs text-green-600">-{formatPrice(item.priceCalculation.savings)}</p>
                  )}
                  {!item.inStock && (
                    <Badge variant="destructive" className="text-xs">
                      Sin stock
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <AlertTriangle className="h-4 w-4 text-secondary" />
          <span>Requiere receta médica válida</span>
        </div>

        <Link href={`/medicamentos/${medication.id}`}>
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={!bestPrice?.inStock}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {bestPrice?.inStock ? "Realizar pedido" : "No disponible"}
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
