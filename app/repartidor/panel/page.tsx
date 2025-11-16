"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bike, Package, CheckCircle, Clock, LogOut, MapPin, RefreshCcw, Truck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ORDER_STATUS_LABELS, type OrderStatus, type OrderWithItems } from "@/lib/types/orders"
import type { RepartidorUser } from "@/lib/types/user-types"

const STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  processing: "bg-blue-100 text-blue-800 border border-blue-200",
  accepted: "bg-purple-100 text-purple-800 border border-purple-200",
  delivering: "bg-amber-100 text-amber-800 border border-amber-200",
  delivered: "bg-green-100 text-green-800 border border-green-200",
  cancelled: "bg-red-100 text-red-800 border border-red-200",
}

const DEFAULT_BADGE_CLASS = "bg-muted text-muted-foreground border border-muted"

const formatDateTime = (value?: string | null) => {
  if (!value) return "-"
  return new Date(value).toLocaleString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const renderStatusBadge = (status: OrderStatus) => {
  const label = ORDER_STATUS_LABELS[status] ?? status
  const className = STATUS_BADGE_CLASSES[status] ?? DEFAULT_BADGE_CLASS
  return <Badge className={className}>{label}</Badge>
}

export default function RepartidorPanelPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [courier, setCourier] = useState<RepartidorUser | null>(null)
  const [availableOrders, setAvailableOrders] = useState<OrderWithItems[]>([])
  const [assignedOrders, setAssignedOrders] = useState<OrderWithItems[]>([])
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null)

  const courierId = courier?.id

  useEffect(() => {
    try {
      const storedUser = typeof window !== "undefined" ? window.localStorage.getItem("user") : null
      if (!storedUser) {
        router.push("/auth")
        return
      }

      const parsed = JSON.parse(storedUser) as RepartidorUser
      if (parsed.role !== "Repartidor") {
        router.push("/auth")
        return
      }

      setCourier(parsed)
    } catch (error) {
      console.error("Error leyendo el usuario de repartidor", error)
      router.push("/auth")
    } finally {
      setIsLoadingUser(false)
    }
  }, [router])

  const loadOrders = useCallback(
    async (showSkeleton = true) => {
      if (!courierId) return

      setFetchError(null)
      if (showSkeleton) {
        setIsLoadingOrders(true)
      } else {
        setIsRefreshing(true)
      }

      try {
        const [availableResponse, assignedResponse] = await Promise.all([
          fetch("/api/orders?availableForCouriers=true", { cache: "no-store" }),
          fetch(`/api/orders?courierId=${encodeURIComponent(String(courierId))}`, { cache: "no-store" }),
        ])

        const availablePayload = (await availableResponse.json().catch(() => null)) as unknown
        if (!availableResponse.ok) {
          const message =
            (availablePayload as { error?: string } | null)?.error ?? "No se pudieron obtener los pedidos disponibles"
          throw new Error(message)
        }
        if (!Array.isArray(availablePayload)) {
          throw new Error("Formato de pedidos disponibles inválido")
        }

        const assignedPayload = (await assignedResponse.json().catch(() => null)) as unknown
        if (!assignedResponse.ok) {
          const message = (assignedPayload as { error?: string } | null)?.error ?? "No se pudieron obtener tus pedidos"
          throw new Error(message)
        }
        if (!Array.isArray(assignedPayload)) {
          throw new Error("Formato de pedidos asignados inválido")
        }

        const parsedAvailable = (availablePayload as OrderWithItems[]).filter(
          (order) => order.status === "accepted" && !order.courierId,
        )
        const parsedAssigned = (assignedPayload as OrderWithItems[]).sort(
          (a, b) => new Date(b.updatedAt ?? b.date).getTime() - new Date(a.updatedAt ?? a.date).getTime(),
        )

        setAvailableOrders(parsedAvailable)
        setAssignedOrders(parsedAssigned)
      } catch (error) {
        console.error("Error cargando pedidos para el repartidor", error)
        setFetchError(error instanceof Error ? error.message : "No se pudieron cargar los pedidos")
      } finally {
        setIsLoadingOrders(false)
        setIsRefreshing(false)
      }
    },
    [courierId],
  )

  useEffect(() => {
    if (!courierId) return
    loadOrders(true).catch((error) => console.error("Error inicial al cargar pedidos de repartidor", error))
  }, [courierId, loadOrders])

  const handleLogout = () => {
    window.localStorage.removeItem("user")
    router.push("/auth")
  }

  const handleRefresh = () => {
    loadOrders(false).catch((error) => console.error("Error al refrescar pedidos de repartidor", error))
  }

  const handleTakeOrder = useCallback(
    async (orderId: string) => {
      if (!courierId) return

      setPendingOrderId(orderId)
      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "delivering", courierId }),
        })

        const payload = (await response.json().catch(() => null)) as unknown

        if (!response.ok) {
          const message = (payload as { error?: string } | null)?.error ?? "No se pudo tomar el pedido"
          throw new Error(message)
        }

        if (!payload || typeof payload !== "object") {
          throw new Error("Respuesta inválida del servidor")
        }

        const updatedOrder = payload as OrderWithItems

        setAvailableOrders((prev) => prev.filter((order) => order.id !== updatedOrder.id))
        setAssignedOrders((prev) => {
          const others = prev.filter((order) => order.id !== updatedOrder.id)
          return [updatedOrder, ...others]
        })

        toast({ title: "Pedido asignado", description: "Comenzaste la entrega. ¡Buen viaje!" })
      } catch (error) {
        console.error("Error al tomar el pedido", error)
        toast({
          title: "No se pudo tomar el pedido",
          description: error instanceof Error ? error.message : "Intenta nuevamente en unos segundos",
          variant: "destructive",
        })
      } finally {
        setPendingOrderId(null)
      }
    },
    [courierId, toast],
  )

  const handleCompleteOrder = useCallback(
    async (orderId: string) => {
      if (!courierId) return

      setPendingOrderId(orderId)
      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "delivered", courierId }),
        })

        const payload = (await response.json().catch(() => null)) as unknown

        if (!response.ok) {
          const message = (payload as { error?: string } | null)?.error ?? "No se pudo cerrar el pedido"
          throw new Error(message)
        }

        if (!payload || typeof payload !== "object") {
          throw new Error("Respuesta inválida del servidor")
        }

        const updatedOrder = payload as OrderWithItems

        setAssignedOrders((prev) => prev.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)))

        toast({ title: "Entrega confirmada", description: "El pedido fue marcado como entregado." })
      } catch (error) {
        console.error("Error al completar el pedido", error)
        toast({
          title: "No se pudo completar el pedido",
          description: error instanceof Error ? error.message : "Intenta nuevamente en unos segundos",
          variant: "destructive",
        })
      } finally {
        setPendingOrderId(null)
      }
    },
    [courierId, toast],
  )

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
    [],
  )

  const activeDeliveries = assignedOrders.filter((order) => order.status === "delivering")
  const completedDeliveries = assignedOrders.filter((order) => order.status === "delivered")
  const todayKey = new Date().toDateString()
  const todaysCompleted = completedDeliveries.filter((order) => {
    const sourceDate = order.actualDelivery ?? order.updatedAt ?? order.date
    if (!sourceDate) return false
    return new Date(sourceDate).toDateString() === todayKey
  })
  const todaysEarnings = todaysCompleted.reduce((sum, order) => sum + order.deliveryFee, 0)

  if (isLoadingUser) {
    return null
  }

  if (!courier) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        <header className="space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-primary">Panel de repartidor</h1>
            <Button onClick={handleLogout} variant="outline" className="gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
          <p className="text-muted-foreground">Bienvenido, {courier.nombreCompleto}</p>
        </header>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos disponibles</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableOrders.length}</div>
              <p className="text-xs text-muted-foreground">Listos para tomar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Entregas en curso</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeDeliveries.length}</div>
              <p className="text-xs text-muted-foreground">Pedidos que estás entregando</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Entregas completadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedDeliveries.length}</div>
              <p className="text-xs text-muted-foreground">Historial de pedidos entregados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ganancia de hoy</CardTitle>
              <Bike className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currencyFormatter.format(todaysEarnings)}</div>
              <p className="text-xs text-muted-foreground">{todaysCompleted.length} entregas finalizadas</p>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Card className="order-2 lg:order-1">
            <CardHeader>
              <CardTitle>Información del repartidor</CardTitle>
              <CardDescription>Tus datos registrados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="font-semibold">Nombre completo: </span>
                {courier.nombreCompleto}
              </div>
              <div>
                <span className="font-semibold">DNI: </span>
                {courier.dni}
              </div>
              <div>
                <span className="font-semibold">Teléfono: </span>
                {courier.telefono}
              </div>
              <div>
                <span className="font-semibold">Email: </span>
                {courier.email}
              </div>
              {courier.vehiculo && (
                <div>
                  <span className="font-semibold">Vehículo: </span>
                  {courier.vehiculo}
                </div>
              )}
              {courier.zonaCobertura && (
                <div>
                  <span className="font-semibold">Zona de cobertura: </span>
                  {courier.zonaCobertura}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="order-1 lg:order-2">
            <CardHeader>
              <CardTitle>Acciones rápidas</CardTitle>
              <CardDescription>Gestiona tus entregas y actualiza la vista</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline" onClick={handleRefresh} disabled={isRefreshing || isLoadingOrders}>
                <RefreshCcw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} /> Refrescar pedidos
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <header className="space-y-2">
            <h2 className="text-2xl font-semibold">Pedidos disponibles</h2>
            <p className="text-sm text-muted-foreground">
              Estos pedidos ya fueron aceptados por la farmacia y están listos para que los tomes.
            </p>
          </header>

          {fetchError && (
            <Alert variant="destructive">
              <AlertDescription>{fetchError}</AlertDescription>
            </Alert>
          )}

          {isLoadingOrders && availableOrders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">Cargando pedidos disponibles...</CardContent>
            </Card>
          ) : availableOrders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No hay pedidos disponibles en este momento. Actualiza más tarde.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {availableOrders.map((order) => (
                <Card key={order.id} className="flex flex-col">
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg">Pedido #{order.orderNumber ?? order.id.slice(-6)}</CardTitle>
                        <CardDescription>{order.pharmacyName}</CardDescription>
                      </div>
                      {renderStatusBadge(order.status)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Creado el {formatDateTime(order.createdAt)}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col space-y-4">
                    <div className="flex items-start gap-3 text-sm">
                      <MapPin className="mt-1 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Dirección de entrega</p>
                        <p className="text-muted-foreground">{order.deliveryAddress}</p>
                        {order.deliveryInstructions && (
                          <p className="mt-1 text-xs text-muted-foreground">{order.deliveryInstructions}</p>
                        )}
                        {typeof order.deliveryDistance === "number" && Number.isFinite(order.deliveryDistance) && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Distancia: {order.deliveryDistance.toFixed(2)} cuadras · Envío: {currencyFormatter.format(order.deliveryFee)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>{order.items.length} producto{order.items.length === 1 ? "" : "s"}</span>
                      <span className="font-semibold">{currencyFormatter.format(order.total)}</span>
                    </div>
                    <Button
                      className="mt-auto w-full"
                      onClick={() => handleTakeOrder(order.id)}
                      disabled={pendingOrderId === order.id || isRefreshing}
                    >
                      <Bike className="mr-2 h-4 w-4" />
                      Tomar pedido
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <header className="space-y-2">
            <h2 className="text-2xl font-semibold">Tus entregas</h2>
            <p className="text-sm text-muted-foreground">
              Gestiona los pedidos que ya aceptaste y confirma cuando completes la entrega.
            </p>
          </header>

          {isLoadingOrders && assignedOrders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">Cargando tus entregas...</CardContent>
            </Card>
          ) : assignedOrders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Aún no tenés pedidos asignados. Toma uno de la lista disponible para comenzar.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {activeDeliveries.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">En curso ({activeDeliveries.length})</h3>
                  <div className="space-y-4">
                    {activeDeliveries.map((order) => (
                      <Card key={order.id} className="flex flex-col">
                        <CardHeader className="space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <CardTitle className="text-lg">Pedido #{order.orderNumber ?? order.id.slice(-6)}</CardTitle>
                              <CardDescription>{order.pharmacyName}</CardDescription>
                            </div>
                            {renderStatusBadge(order.status)}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Desde {formatDateTime(order.updatedAt ?? order.createdAt)}</span>
                          </div>
                        </CardHeader>
                        <CardContent className="flex flex-1 flex-col space-y-4">
                          <div className="flex items-start gap-3 text-sm">
                            <MapPin className="mt-1 h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Dirección de entrega</p>
                              <p className="text-muted-foreground">{order.deliveryAddress}</p>
                              {order.deliveryInstructions && (
                                <p className="mt-1 text-xs text-muted-foreground">{order.deliveryInstructions}</p>
                              )}
                            </div>
                          </div>
                          {order.estimatedDelivery && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Truck className="h-4 w-4" />
                              <span>Entrega estimada: {formatDateTime(order.estimatedDelivery)}</span>
                            </div>
                          )}
                          {typeof order.deliveryDistance === "number" && Number.isFinite(order.deliveryDistance) && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Bike className="h-4 w-4" />
                              <span>
                                Distancia: {order.deliveryDistance.toFixed(2)} cuadras · Envío: {currencyFormatter.format(order.deliveryFee)}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center justify-between text-sm">
                            <span>Total del pedido</span>
                            <span className="font-semibold">{currencyFormatter.format(order.total)}</span>
                          </div>
                          <Button
                            className="mt-auto w-full"
                            onClick={() => handleCompleteOrder(order.id)}
                            disabled={pendingOrderId === order.id || isRefreshing}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Marcar como entregado
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {completedDeliveries.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Historial reciente ({completedDeliveries.length})</h3>
                  <div className="space-y-4">
                    {completedDeliveries.map((order) => (
                      <Card key={order.id}>
                        <CardHeader className="space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <CardTitle className="text-lg">Pedido #{order.orderNumber ?? order.id.slice(-6)}</CardTitle>
                              <CardDescription>{order.pharmacyName}</CardDescription>
                            </div>
                            {renderStatusBadge(order.status)}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <CheckCircle className="h-4 w-4" />
                            <span>Entregado el {formatDateTime(order.actualDelivery ?? order.updatedAt)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Pago de envío</span>
                            <span className="font-semibold">{currencyFormatter.format(order.deliveryFee)}</span>
                          </div>
                          {typeof order.deliveryDistance === "number" && Number.isFinite(order.deliveryDistance) && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Bike className="h-4 w-4" />
                              <span>Distancia recorrida: {order.deliveryDistance.toFixed(2)} cuadras</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Total del pedido</span>
                            <span>{currencyFormatter.format(order.total)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
