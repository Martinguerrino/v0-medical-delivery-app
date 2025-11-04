"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Clock,
  Star,
  Shield,
  Car,
  Accessibility,
  Languages,
  Award,
  Calendar,
  MessageCircle,
  Facebook,
  Instagram,
  CreditCard,
  Stethoscope,
  Users,
} from "lucide-react"
import type { Pharmacy } from "@/lib/data/pharmacies"

interface PharmacyDetailsProps {
  pharmacy: Pharmacy
  onClose?: () => void
}

export function PharmacyDetails({ pharmacy, onClose }: PharmacyDetailsProps) {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={pharmacy.logo || "/placeholder.svg"} alt={pharmacy.name} />
              <AvatarFallback>{pharmacy.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{pharmacy.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current text-yellow-500" />
                  <span className="font-medium">{pharmacy.rating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({pharmacy.totalReviews.toLocaleString()} reseñas)
                  </span>
                </div>
                {pharmacy.isOnGuard && (
                  <Badge variant="destructive" className="text-xs">
                    GUARDIA
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              Cerrar
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Información básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{pharmacy.address}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-primary" />
              <span>{pharmacy.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span>{pharmacy.openHours}</span>
              <Badge variant={pharmacy.isOpen ? "default" : "secondary"} className="text-xs">
                {pharmacy.isOpen ? "Abierto" : "Cerrado"}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span>Desde {pharmacy.establishedYear}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Stethoscope className="h-4 w-4 text-primary" />
              <span>{pharmacy.pharmacistName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Award className="h-4 w-4 text-primary" />
              <span>{pharmacy.pharmacistLicense}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Servicios */}
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Servicios disponibles
          </h4>
          <div className="flex flex-wrap gap-1">
            {pharmacy.services.map((service) => (
              <Badge key={service} variant="outline" className="text-xs">
                {service}
              </Badge>
            ))}
          </div>
        </div>

        {/* Especialidades */}
        <div>
          <h4 className="font-medium mb-2">Especialidades</h4>
          <div className="flex flex-wrap gap-1">
            {pharmacy.specialties.map((specialty) => (
              <Badge key={specialty} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Información de entrega */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium">Tiempo de entrega</p>
            <p className="text-muted-foreground">{pharmacy.deliveryTime}</p>
            <p className="text-xs text-muted-foreground">Promedio: {pharmacy.averageDeliveryTime} min</p>
          </div>
          <div>
            <p className="font-medium">Costo de envío</p>
            <p className="text-muted-foreground">${pharmacy.deliveryFee}</p>
            <p className="text-xs text-muted-foreground">Pedido mínimo: ${pharmacy.minOrder}</p>
          </div>
        </div>

        <Separator />

        {/* Métodos de pago */}
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" />
            Métodos de pago
          </h4>
          <div className="flex flex-wrap gap-1">
            {pharmacy.paymentMethods.map((method) => (
              <Badge key={method} variant="outline" className="text-xs">
                {method}
              </Badge>
            ))}
          </div>
        </div>

        {/* Obras sociales */}
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Obras sociales aceptadas
          </h4>
          <div className="flex flex-wrap gap-1">
            {pharmacy.acceptedInsurance.map((insurance) => (
              <Badge key={insurance} variant="secondary" className="text-xs">
                {insurance}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Características adicionales */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Car className={`h-4 w-4 ${pharmacy.hasParking ? "text-green-600" : "text-gray-400"}`} />
              <span className={pharmacy.hasParking ? "text-green-600" : "text-gray-400"}>
                {pharmacy.hasParking ? "Estacionamiento disponible" : "Sin estacionamiento"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Accessibility className={`h-4 w-4 ${pharmacy.isAccessible ? "text-green-600" : "text-gray-400"}`} />
              <span className={pharmacy.isAccessible ? "text-green-600" : "text-gray-400"}>
                {pharmacy.isAccessible ? "Accesible" : "No accesible"}
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm mb-2">
              <Languages className="h-4 w-4 text-primary" />
              <span>Idiomas:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {pharmacy.languages.map((language) => (
                <Badge key={language} variant="outline" className="text-xs">
                  {language}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Contacto y redes sociales */}
        <div className="flex flex-wrap gap-2">
          {pharmacy.website && (
            <Button variant="outline" size="sm" asChild>
              <a href={pharmacy.website} target="_blank" rel="noopener noreferrer">
                <Globe className="h-4 w-4 mr-1" />
                Sitio web
              </a>
            </Button>
          )}
          {pharmacy.email && (
            <Button variant="outline" size="sm" asChild>
              <a href={`mailto:${pharmacy.email}`}>
                <Mail className="h-4 w-4 mr-1" />
                Email
              </a>
            </Button>
          )}
          {pharmacy.socialMedia?.whatsapp && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={`https://wa.me/${pharmacy.socialMedia.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                WhatsApp
              </a>
            </Button>
          )}
          {pharmacy.socialMedia?.facebook && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={`https://facebook.com/${pharmacy.socialMedia.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-4 w-4 mr-1" />
                Facebook
              </a>
            </Button>
          )}
          {pharmacy.socialMedia?.instagram && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={`https://instagram.com/${pharmacy.socialMedia.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-4 w-4 mr-1" />
                Instagram
              </a>
            </Button>
          )}
        </div>

        {/* Certificaciones */}
        <div>
          <h4 className="font-medium mb-2">Certificaciones</h4>
          <div className="flex flex-wrap gap-1">
            {pharmacy.certifications.map((cert) => (
              <Badge key={cert} variant="default" className="text-xs">
                {cert}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
