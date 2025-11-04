"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Shield, Phone, MapPin, Clock, Star } from "lucide-react"
import { getGuardPharmacies } from "@/lib/data/pharmacies"

interface GuardPharmaciesProps {
  location?: string
}

export function GuardPharmacies({ location }: GuardPharmaciesProps) {
  const guardPharmacies = getGuardPharmacies(location)

  if (guardPharmacies.length === 0) {
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-500" />
            Farmacias de Guardia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No hay farmacias de guardia disponibles en tu zona en este momento.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-red-500" />
          Farmacias de Guardia
          <Badge variant="destructive" className="text-xs">
            {guardPharmacies.length} disponibles
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {guardPharmacies.map((pharmacy) => (
          <div
            key={pharmacy.id}
            className="flex items-center justify-between p-3 border border-red-200 bg-red-50/50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={pharmacy.logo || "/placeholder.svg"} alt={pharmacy.name} />
                <AvatarFallback>{pharmacy.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{pharmacy.name}</p>
                  <Badge variant="destructive" className="text-xs px-1 py-0">
                    GUARDIA
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3" />
                  <span>{pharmacy.location}</span>
                  <Star className="h-3 w-3 fill-current text-yellow-500" />
                  <span>{pharmacy.rating}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{pharmacy.guardSchedule}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Button size="sm" variant="outline" className="mb-1 bg-transparent">
                <Phone className="h-3 w-3 mr-1" />
                Llamar
              </Button>
              <p className="text-xs text-muted-foreground">{pharmacy.emergencyPhone}</p>
            </div>
          </div>
        ))}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div className="text-xs text-yellow-800">
              <p className="font-medium">Información importante:</p>
              <p>
                Las farmacias de guardia están disponibles para emergencias fuera del horario comercial. Pueden tener
                stock limitado.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
