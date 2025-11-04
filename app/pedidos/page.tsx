import { Header } from "@/components/header"
import { OrderTracking } from "@/components/order-tracking"

export default function PedidosPage() {
  return (
    <main className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mis Pedidos</h1>
          <p className="text-muted-foreground">Rastrea el estado de tus pedidos y revisa tu historial de compras</p>
        </div>

        <OrderTracking />
      </div>
    </main>
  )
}
