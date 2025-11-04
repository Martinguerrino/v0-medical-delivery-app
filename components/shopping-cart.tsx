"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, AlertTriangle, FileText, ShoppingBag } from "lucide-react"

interface CartItem {
  id: number
  name: string
  brand: string
  price: number
  quantity: number
  maxQuantity: number
  prescriptionRequired: boolean
  prescriptionId?: string
  prescriptionStatus?: "pending" | "approved" | "rejected"
  inStock: boolean
}

// Mock cart data
const initialCartItems: CartItem[] = [
  {
    id: 1,
    name: "Amoxicilina 500mg",
    brand: "Amoxil",
    price: 25.99,
    quantity: 1,
    maxQuantity: 21,
    prescriptionRequired: true,
    prescriptionId: "RX-2024-001",
    prescriptionStatus: "approved",
    inStock: true,
  },
  {
    id: 2,
    name: "Losartán 50mg",
    brand: "Cozaar",
    price: 18.5,
    quantity: 2,
    maxQuantity: 30,
    prescriptionRequired: true,
    prescriptionStatus: "pending",
    inStock: true,
  },
  {
    id: 3,
    name: "Omeprazol 20mg",
    brand: "Prilosec",
    price: 15.3,
    quantity: 1,
    maxQuantity: 28,
    prescriptionRequired: true,
    prescriptionId: "RX-2024-003",
    prescriptionStatus: "rejected",
    inStock: true,
  },
]

export function ShoppingCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems)
  const [promoCode, setPromoCode] = useState("")
  const [promoDiscount, setPromoDiscount] = useState(0)

  const updateQuantity = (id: number, newQuantity: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, Math.min(newQuantity, item.maxQuantity)) } : item,
      ),
    )
  }

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "descuento10") {
      setPromoDiscount(0.1)
    } else {
      setPromoDiscount(0)
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = subtotal * promoDiscount
  const deliveryFee = subtotal > 50 ? 0 : 5.99
  const total = subtotal - discount + deliveryFee

  const hasApprovedItems = cartItems.some((item) => item.prescriptionStatus === "approved")
  const hasPendingItems = cartItems.some((item) => item.prescriptionStatus === "pending")
  const hasRejectedItems = cartItems.some((item) => item.prescriptionStatus === "rejected")

  const getPrescriptionStatusBadge = (status?: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 text-xs">Receta aprobada</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Receta pendiente</Badge>
      case "rejected":
        return (
          <Badge variant="destructive" className="text-xs">
            Receta rechazada
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="text-xs">
            Sin receta
          </Badge>
        )
    }
  }

  if (cartItems.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Tu carrito está vacío</h3>
          <p className="text-muted-foreground mb-4">Agrega medicamentos desde nuestro catálogo</p>
          <Button>Ver catálogo</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Carrito de Compras ({cartItems.length} productos)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 border border-border rounded-lg">
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.brand}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    {getPrescriptionStatusBadge(item.prescriptionStatus)}
                    {item.prescriptionId && (
                      <span className="text-xs text-muted-foreground">ID: {item.prescriptionId}</span>
                    )}
                  </div>

                  {item.prescriptionStatus === "rejected" && (
                    <Alert className="mt-2">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        La receta para este medicamento fue rechazada.
                        <Button variant="link" className="p-0 h-auto text-sm ml-1">
                          Subir nueva receta
                        </Button>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.maxQuantity}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <span className="text-xs text-muted-foreground ml-2">Máx: {item.maxQuantity}</span>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} c/u</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Prescription Status Summary */}
        {(hasPendingItems || hasRejectedItems) && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {hasPendingItems && (
                <p className="mb-2">
                  Algunos medicamentos tienen recetas pendientes de validación. Solo se procesarán los medicamentos con
                  recetas aprobadas.
                </p>
              )}
              {hasRejectedItems && (
                <p>
                  Algunos medicamentos tienen recetas rechazadas. Debes subir nuevas recetas para poder comprar estos
                  productos.
                </p>
              )}
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Order Summary */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Resumen del Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {promoDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento ({(promoDiscount * 100).toFixed(0)}%)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Envío</span>
                <span>{deliveryFee === 0 ? "Gratis" : `$${deliveryFee.toFixed(2)}`}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {subtotal < 50 && (
              <p className="text-sm text-muted-foreground">
                Agrega ${(50 - subtotal).toFixed(2)} más para envío gratis
              </p>
            )}

            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Código promocional"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <Button variant="outline" onClick={applyPromoCode}>
                  Aplicar
                </Button>
              </div>
              {promoCode && promoDiscount === 0 && (
                <p className="text-sm text-destructive">Código promocional inválido</p>
              )}
            </div>

            <Button className="w-full" size="lg" disabled={!hasApprovedItems || hasRejectedItems}>
              Proceder al Checkout
            </Button>

            {!hasApprovedItems && (
              <p className="text-sm text-muted-foreground text-center">
                Necesitas al menos un medicamento con receta aprobada para continuar
              </p>
            )}
          </CardContent>
        </Card>

        {/* Delivery Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Información de Entrega</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Tiempo estimado:</span>
              <span className="font-medium">2-4 horas</span>
            </div>
            <div className="flex justify-between">
              <span>Horario de entrega:</span>
              <span className="font-medium">8:00 AM - 10:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Seguimiento:</span>
              <span className="font-medium">En tiempo real</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
