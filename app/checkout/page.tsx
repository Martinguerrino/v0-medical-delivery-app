import { Header } from "@/components/header"
import { CheckoutForm } from "@/components/checkout-form"

export default function CheckoutPage() {
  return (
    <main className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Finalizar Compra</h1>
          <p className="text-muted-foreground">Completa tu información para recibir tus medicamentos</p>
        </div>

        <CheckoutForm />
      </div>
    </main>
  )
}
