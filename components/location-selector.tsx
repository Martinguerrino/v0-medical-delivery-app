"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MapPin, Search, Navigation } from "lucide-react"

interface LocationSelectorProps {
  onLocationSelect: (location: string) => void
  selectedLocation?: string
}

const popularLocations = [
  "Palermo, CABA",
  "Belgrano, CABA",
  "Recoleta, CABA",
  "San Telmo, CABA",
  "Villa Crespo, CABA",
  "Caballito, CABA",
  "San Isidro, GBA",
  "Vicente López, GBA",
  "Olivos, GBA",
  "Martínez, GBA",
]

export function LocationSelector({ onLocationSelect, selectedLocation }: LocationSelectorProps) {
  const [customLocation, setCustomLocation] = useState("")
  const [isExpanded, setIsExpanded] = useState(!selectedLocation)

  const handleLocationSelect = (location: string) => {
    onLocationSelect(location)
    setIsExpanded(false)
  }

  const handleCustomLocation = () => {
    if (customLocation.trim()) {
      handleLocationSelect(customLocation.trim())
      setCustomLocation("")
    }
  }

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Simular geocoding inverso
          handleLocationSelect("Tu ubicación actual")
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error)
        },
      )
    }
  }

  if (selectedLocation && !isExpanded) {
    return (
      <Card className="mb-4">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Entrega en:</span>
              <Badge variant="secondary">{selectedLocation}</Badge>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsExpanded(true)}>
              Cambiar
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Selecciona tu ubicación
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Ingresa tu dirección o barrio"
            value={customLocation}
            onChange={(e) => setCustomLocation(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleCustomLocation()}
          />
          <Button onClick={handleCustomLocation} size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <Button variant="outline" className="w-full bg-transparent" onClick={handleCurrentLocation}>
          <Navigation className="h-4 w-4 mr-2" />
          Usar mi ubicación actual
        </Button>

        <div>
          <p className="text-sm font-medium mb-2">Ubicaciones populares:</p>
          <div className="grid grid-cols-2 gap-2">
            {popularLocations.map((location) => (
              <Button
                key={location}
                variant="outline"
                size="sm"
                className="justify-start text-xs bg-transparent"
                onClick={() => handleLocationSelect(location)}
              >
                {location}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
