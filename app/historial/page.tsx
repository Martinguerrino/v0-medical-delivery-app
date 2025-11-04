import { PurchaseHistory } from "@/components/purchase-history"
import { Header } from "@/components/header"
import { AuthGuard } from "@/components/auth-guard"

export default function HistorialPage() {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <PurchaseHistory />
        </div>
      </main>
    </AuthGuard>
  )
}
