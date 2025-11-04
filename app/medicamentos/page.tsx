import { Header } from "@/components/header"
import { MedicationCatalog } from "@/components/medication-catalog"

export default function MedicamentosPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <MedicationCatalog />
    </main>
  )
}
