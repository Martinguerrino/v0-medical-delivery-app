"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Filter, X, Shield, Clock, Truck, Star } from "lucide-react"
import { insuranceOptions } from "@/lib/data/insurance"
import { formatPrice } from "@/lib/utils/price-calculator"
import type { ClientPharmacyMeta } from "@/lib/types/client-medication"

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterState) => void
  currentFilters: FilterState
  pharmacies: ClientPharmacyMeta[]
}

export interface FilterState {
  showOnlyInsuranceCovered: boolean
  selectedPharmacies: string[]
  maxDeliveryTime: number
  maxDeliveryFee: number
  minRating: number
  showOnlyOpen: boolean
  maxPrice: number
}

export function AdvancedFilters({ onFiltersChange, currentFilters, pharmacies }: AdvancedFiltersProps) {
  const [userInsurance, setUserInsurance] = useState<string>("")
  const [localFilters, setLocalFilters] = useState<FilterState>(currentFilters)

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      const userData = JSON.parse(user)
      setUserInsurance(userData.obraSocial || "")
    }
  }, [])

  useEffect(() => {
    setLocalFilters(currentFilters)
  }, [currentFilters])

  const userInsuranceData = insuranceOptions.find((ins) => ins.name.toLowerCase() === userInsurance.toLowerCase())

  const coveredPharmacies = userInsuranceData
    ? pharmacies.filter((pharmacy) => userInsuranceData.pharmacyNetwork.includes(pharmacy.id))
    : []

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handlePharmacyToggle = (pharmacyId: string) => {
    const newSelected = localFilters.selectedPharmacies.includes(pharmacyId)
      ? localFilters.selectedPharmacies.filter((id) => id !== pharmacyId)
      : [...localFilters.selectedPharmacies, pharmacyId]
    handleFilterChange("selectedPharmacies", newSelected)
  }

  const clearAllFilters = () => {
    const defaultFilters: FilterState = {
      showOnlyInsuranceCovered: false,
      selectedPharmacies: [],
      maxDeliveryTime: 60,
      maxDeliveryFee: 50000,
      minRating: 0,
      showOnlyOpen: false,
      maxPrice: 10000,
    }
    setLocalFilters(defaultFilters)
    onFiltersChange(defaultFilters)
  }

  const activeFiltersCount = Object.entries(localFilters).filter(([key, value]) => {
    if (key === "selectedPharmacies") return (value as string[]).length > 0
    if (key === "maxDeliveryTime") return value < 60
    if (key === "maxDeliveryFee") return value < 50000
    if (key === "minRating") return value > 0
    if (key === "maxPrice") return value < 10000
    return value === true
  }).length

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Filtros avanzados
          {activeFiltersCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-secondary text-secondary-foreground">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filtros Avanzados</SheetTitle>
          <SheetDescription>Personaliza tu búsqueda según tus necesidades</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Insurance Coverage Filter */}
          {userInsurance && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Tu Obra Social
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="insurance-covered"
                    checked={localFilters.showOnlyInsuranceCovered}
                    onCheckedChange={(checked) => handleFilterChange("showOnlyInsuranceCovered", checked)}
                  />
                  <Label htmlFor="insurance-covered" className="text-sm">
                    Solo farmacias con cobertura de {userInsurance}
                  </Label>
                </div>
                {localFilters.showOnlyInsuranceCovered && (
                  <div className="text-xs text-muted-foreground">
                    Mostrando {coveredPharmacies.length} farmacias con cobertura
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Pharmacy Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Farmacias</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pharmacies.map((pharmacy) => {
                const isCovered = coveredPharmacies.some((p) => p.id === pharmacy.id)
                return (
                  <div key={pharmacy.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={pharmacy.id}
                      checked={localFilters.selectedPharmacies.includes(pharmacy.id)}
                      onCheckedChange={() => handlePharmacyToggle(pharmacy.id)}
                    />
                    <Label htmlFor={pharmacy.id} className="text-sm flex items-center gap-2 flex-1">
                      <span>{pharmacy.name}</span>
                      {isCovered && (
                        <Badge variant="secondary" className="text-xs">
                          Tu obra social
                        </Badge>
                      )}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                        <Star className="h-3 w-3 fill-current text-yellow-500" />
                        {pharmacy.rating}
                      </div>
                    </Label>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Delivery Time Filter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Tiempo de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label className="text-sm">Máximo: {localFilters.maxDeliveryTime} minutos</Label>
                <Slider
                  value={[localFilters.maxDeliveryTime]}
                  onValueChange={([value]) => handleFilterChange("maxDeliveryTime", value)}
                  max={60}
                  min={15}
                  step={5}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Delivery Fee Filter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Costo de Envío
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label className="text-sm">Máximo: {formatPrice(localFilters.maxDeliveryFee)}</Label>
                <Slider
                  value={[localFilters.maxDeliveryFee]}
                  onValueChange={([value]) => handleFilterChange("maxDeliveryFee", value)}
                  max={50000}
                  min={0}
                  step={5000}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Rating Filter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Star className="h-4 w-4" />
                Calificación Mínima
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label className="text-sm">
                  {localFilters.minRating > 0 ? `${localFilters.minRating} estrellas o más` : "Cualquier calificación"}
                </Label>
                <Slider
                  value={[localFilters.minRating]}
                  onValueChange={([value]) => handleFilterChange("minRating", value)}
                  max={5}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Price Range Filter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Rango de Precio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label className="text-sm">Máximo: {formatPrice(localFilters.maxPrice)}</Label>
                <Slider
                  value={[localFilters.maxPrice]}
                  onValueChange={([value]) => handleFilterChange("maxPrice", value)}
                  max={10000}
                  min={500}
                  step={500}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Open Now Filter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Disponibilidad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="open-now"
                  checked={localFilters.showOnlyOpen}
                  onCheckedChange={(checked) => handleFilterChange("showOnlyOpen", checked)}
                />
                <Label htmlFor="open-now" className="text-sm">
                  Solo farmacias abiertas ahora
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <Button variant="outline" onClick={clearAllFilters} className="w-full bg-transparent">
              <X className="h-4 w-4 mr-2" />
              Limpiar todos los filtros
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
