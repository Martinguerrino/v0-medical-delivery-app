"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, CheckCircle, Clock, MapPin, MessageSquare, FileText, AlertTriangle, XCircle } from "lucide-react"

interface OrderItem {
  medicationId: number
  medicationName: string
  quantity: number
  unitPrice: number
  finalPrice: number
}

interface Order {
  id: string
  userId: string
  medicationId: number
  medicationName: string
  pharmacyId: string
  pharmacyName: string
  quantity: number
  unitPrice: number
  deliveryFee: number
  total: number
  deliveryAddress: string
  deliveryInstructions?: string
  paymentMethod: string
  prescriptionFileName: string
  prescriptionStatus: "pending" | "approved" | "rejected"
  prescriptionRejectionReason?: string
  orderStatus: "pending" | "processing" | "completed" | "delivered" | "cancelled"
  createdAt: string
  estimatedDelivery?: string
  actualDelivery?: string
}

export function OrderTracking() {
  const [orders, setOrders] = useState<Order[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      const storedOrders = localStorage.getItem("orders")
      if (storedOrders) {
        const allOrders = JSON.parse(storedOrders)
        const userOrders = allOrders.filter((order: Order) => order.userId === parsedUser.email)
        setOrders(userOrders)
      }
    }
  }, [])

  const getStatusBadge = (status: Order["orderStatus"]) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">Procesando</Badge>
      case "completed":
        return <Badge className="bg-purple-100 text-purple-800">Completado</Badge>
      case "delivered":
        return <Badge className="bg-green-100 text-green-800">Entregado</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelado</Badge>
      default:
        return <Badge variant="secondary">Desconocido</Badge>
    }
  }

  const getPrescriptionStatusBadge = (status: Order["prescriptionStatus"]) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Receta Aprobada
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Receta Pendiente
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Receta Rechazada
          </Badge>
        )
      default:
        return null
    }
  }

  const getStatusIcon = (status: Order["orderStatus"]) => {
    switch (status) {
      case "pending":
      case "processing":
        return <Clock className="h-5 w-5 text-blue-600" />
      case "completed":
        return <Package className="h-5 w-5 text-purple-600" />
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "cancelled":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const activeOrders = orders.filter((order) => order.orderStatus !== "delivered" && order.orderStatus !== "cancelled")
  const completedOrders = orders.filter(
    (order) => order.orderStatus === "delivered" || order.orderStatus === "cancelled",
  )

  return (
    <div className="space-y-6">
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Pedidos Activos ({activeOrders.length})</TabsTrigger>
          <TabsTrigger value="completed">Historial ({completedOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeOrders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tienes pedidos activos</h3>
                <p className="text-muted-foreground mb-4">Cuando realices un pedido, aparecerá aquí</p>
                <Button onClick={() => (window.location.href = "/medicamentos")}>Ver catálogo</Button>
              </CardContent>
            </Card>
          ) : (
            activeOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{order.id}</CardTitle>
                      <p className="text-muted-foreground">
                        Pedido realizado el {new Date(order.createdAt).toLocaleDateString()} • $
                        {order.total.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.orderStatus)}
                      {getStatusBadge(order.orderStatus)}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Alert className={order.prescriptionStatus === "rejected" ? "border-red-200 bg-red-50" : ""}>
                    <FileText className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">Estado de la receta médica</p>
                            {getPrescriptionStatusBadge(order.prescriptionStatus)}
                          </div>
                          {order.prescriptionStatus === "pending" && (
                            <p className="text-sm text-muted-foreground">
                              La farmacia está validando tu receta. Esto puede tomar unos minutos.
                            </p>
                          )}
                          {order.prescriptionStatus === "approved" && (
                            <p className="text-sm text-muted-foreground">
                              Tu receta ha sido aprobada por el farmacéutico. El pedido está siendo procesado.
                            </p>
                          )}
                          {order.prescriptionStatus === "rejected" && (
                            <div className="space-y-1">
                              <p className="text-sm text-red-700 font-medium">
                                Tu receta fue rechazada: {order.prescriptionRejectionReason || "Receta no válida"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Por favor, carga una nueva receta válida para continuar con tu pedido.
                              </p>
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">Archivo: {order.prescriptionFileName}</p>
                        </div>
                        {order.prescriptionStatus === "rejected" && (
                          <Button size="sm" variant="outline">
                            Cargar nueva receta
                          </Button>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>

                  {/* Delivery Info */}
                  <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Dirección de entrega</p>
                        <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
                        {order.deliveryInstructions && (
                          <p className="text-xs text-muted-foreground italic mt-1">{order.deliveryInstructions}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Método de pago</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {order.paymentMethod.replace("-", " ")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Pharmacy Info */}
                  <div className="flex items-center gap-3 p-3 bg-background border rounded-lg">
                    <Package className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">{order.pharmacyName}</p>
                      <p className="text-sm text-muted-foreground">Farmacia</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Producto</h4>
                    <div className="flex items-center justify-between p-3 bg-background border rounded">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{order.medicationName}</p>
                          <p className="text-sm text-muted-foreground">Cantidad: {order.quantity}</p>
                        </div>
                      </div>
                      <span className="font-medium">${(order.unitPrice * order.quantity).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${(order.unitPrice * order.quantity).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Envío</span>
                      <span>${order.deliveryFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span className="text-primary">${order.total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contactar farmacia
                    </Button>
                    <Button variant="outline" size="sm">
                      Ver detalles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedOrders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tienes pedidos completados</h3>
                <p className="text-muted-foreground">Tu historial de pedidos aparecerá aquí</p>
              </CardContent>
            </Card>
          ) : (
            completedOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{order.id}</CardTitle>
                      <p className="text-muted-foreground">
                        Pedido realizado el {new Date(order.createdAt).toLocaleDateString()} • $
                        {order.total.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.orderStatus)}
                      {getStatusBadge(order.orderStatus)}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Estado de receta</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getPrescriptionStatusBadge(order.prescriptionStatus)}
                      </div>
                    </div>
                  </div>

                  {/* Pharmacy Info */}
                  <div className="flex items-center gap-3 p-3 bg-background border rounded-lg">
                    <Package className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">{order.pharmacyName}</p>
                      <p className="text-sm text-muted-foreground">Farmacia</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Producto</h4>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <div>
                        <p className="font-medium text-sm">{order.medicationName}</p>
                        <p className="text-xs text-muted-foreground">Cantidad: {order.quantity}</p>
                      </div>
                      <span className="font-medium text-sm">
                        ${(order.unitPrice * order.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Delivery Status */}
                  {order.orderStatus === "delivered" && order.actualDelivery && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800">Pedido entregado exitosamente</p>
                        <p className="text-sm text-muted-foreground">
                          Entregado el {new Date(order.actualDelivery).toLocaleDateString()} a las{" "}
                          {new Date(order.actualDelivery).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm">
                      Volver a pedir
                    </Button>
                    <Button variant="outline" size="sm">
                      Ver factura
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
