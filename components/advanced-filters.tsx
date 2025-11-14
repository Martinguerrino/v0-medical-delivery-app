"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Filter, X } from "lucide-react"
import { formatPrice } from "@/lib/utils/price-calculator"
import type { ClientPharmacyMeta } from "@/lib/types/client-medication"

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterState) => void
  currentFilters: FilterState
  pharmacies: ClientPharmacyMeta[]
}

export interface FilterState {
  maxPrice: number
}

export function AdvancedFilters({ onFiltersChange, currentFilters, pharmacies }: AdvancedFiltersProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(currentFilters)

  useEffect(() => {
    setLocalFilters(currentFilters)
  }, [currentFilters])

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearAllFilters = () => {
    const defaultFilters: FilterState = {
      maxPrice: 10000,
    }
    setLocalFilters(defaultFilters)
    onFiltersChange(defaultFilters)
  }

  const activeFiltersCount = localFilters.maxPrice < 10000 ? 1 : 0

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
