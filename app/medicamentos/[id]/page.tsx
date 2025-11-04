"use client"

import { use } from "react"
import { Header } from "@/components/header"
import { OrderFlow } from "@/components/order-flow"
import { medicationsMultiPharmacy } from "@/lib/data/medications-multi-pharmacy"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function MedicationOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const medication = medicationsMultiPharmacy.find((med) => med.id === Number.parseInt(id))

  if (!medication) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Medicamento no encontrado</h1>
            <Link href="/medicamentos">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al catálogo
              </Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <OrderFlow medication={medication} />
      </main>
    </div>
  )
}
