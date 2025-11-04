import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { MedicationCatalog } from "@/components/medication-catalog"
import { AuthGuard } from "@/components/auth-guard"

export default function HomePage() {
  return (
    <AuthGuard>
      <main className="min-h-screen">
        <Header />
        <HeroSection />
        <div className="bg-muted/30 py-2">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground">
              Vista previa del catálogo -{" "}
              <a href="/medicamentos" className="text-primary hover:underline">
                Ver catálogo completo
              </a>
            </p>
          </div>
        </div>
        <MedicationCatalog />
      </main>
    </AuthGuard>
  )
}
