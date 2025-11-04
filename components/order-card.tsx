"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Package,
  Calendar,
  MapPin,
  CreditCard,
  Shield,
  FileText,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  RotateCcw,
} from "lucide-react"
import { formatPrice } from "@/lib/utils/price-calculator"
import type { Order } from "@/lib/data/orders"

interface OrderCardProps {
  order: Order
}

const statusConfig = {
  delivered: {
    label: "Entregado",
    icon: CheckCircle,
    className: "bg-green-100 text-green-800 border-green-200",
  },
  completed: {
    label: "Completado",
    icon: CheckCircle,
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  processing: {
    label: "En proceso",
    icon: Clock,
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  cancelled: {
    label: "Cancelado",
    icon: XCircle,
    className: "bg-red-100 text-red-800 border-red-200",
  },
}

export function OrderCard({ order }: OrderCardProps) {
  const statusInfo = statusConfig[order.status]
  const StatusIcon = statusInfo.icon

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg">Pedido #{order.orderNumber}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(order.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/placeholder.svg" alt={order.pharmacyName} />
                  <AvatarFallback className="text-xs">{order.pharmacyName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{order.pharmacyName}</span>
              </div>
            </div>
          </div>
          <Badge className={statusInfo.className}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Order Items */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Medicamentos:</h4>
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Package className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">{item.medicationName}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.brand} • Cantidad: {item.quantity}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-sm">{formatPrice(item.finalPrice)}</p>
                {item.insuranceSavings > 0 && (
                  <p className="text-xs text-green-600">Ahorro: {formatPrice(item.insuranceSavings)}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Order Summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Envío:</span>
            <span>{formatPrice(order.deliveryFee)}</span>
          </div>
          {order.insuranceDiscount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Descuento obra social:</span>
              <span>-{formatPrice(order.insuranceDiscount)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-medium">
            <span>Total:</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        <Separator />

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Dirección:</span>
            </div>
            <p className="ml-6">{order.deliveryAddress}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Pago:</span>
            </div>
            <p className="ml-6">{order.paymentMethod}</p>
          </div>

          {order.insuranceUsed && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Obra social:</span>
              </div>
              <p className="ml-6">{order.insuranceUsed}</p>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Receta:</span>
            </div>
            <p className="ml-6">
              {order.prescriptionUploaded ? (
                <Badge className="bg-green-100 text-green-800 border-green-200">Subida</Badge>
              ) : (
                <Badge variant="destructive">Pendiente</Badge>
              )}
            </p>
          </div>
        </div>

        {/* Delivery Information */}
        {(order.estimatedDelivery || order.actualDelivery) && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Información de entrega:</span>
              </div>
              <div className="ml-6 space-y-1 text-sm">
                {order.estimatedDelivery && (
                  <p className="text-muted-foreground">Estimado: {formatDate(order.estimatedDelivery)}</p>
                )}
                {order.actualDelivery && (
                  <p className="text-green-600">Entregado: {formatDate(order.actualDelivery)}</p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            Ver detalles
          </Button>
          {order.status === "delivered" && (
            <Button variant="secondary" size="sm">
              <RotateCcw className="h-4 w-4 mr-1" />
              Reordenar
            </Button>
          )}
          {order.status === "processing" && (
            <Button variant="destructive" size="sm">
              Cancelar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
