import { Header } from "@/components/header"
import { ShoppingCart } from "@/components/shopping-cart"

export default function CarritoPage() {
  return (
    <main className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Carrito de Compras</h1>
          <p className="text-muted-foreground">Revisa tus medicamentos antes de proceder al checkout</p>
        </div>

        <ShoppingCart />
      </div>
    </main>
  )
}
