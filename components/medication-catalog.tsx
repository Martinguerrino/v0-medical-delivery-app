"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter } from "lucide-react"
import { MedicationCardWithPharmacies } from "./medication-card-with-pharmacies"
import { AdvancedFilters, type FilterState } from "./advanced-filters"
import { medicationsMultiPharmacy } from "@/lib/data/medications-multi-pharmacy"
import { pharmacies } from "@/lib/data/pharmacies"
import { insuranceOptions } from "@/lib/data/insurance"

const categories = [
  "Todos",
  "Antibióticos",
  "Cardiovasculares",
  "Antidiabéticos",
  "Gastroenterología",
  "Endocrinología",
]

export function MedicationCatalog() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [sortBy, setSortBy] = useState("name")
  const [userInsurance, setUserInsurance] = useState<string>("")
  const [filters, setFilters] = useState<FilterState>({
    showOnlyInsuranceCovered: false,
    selectedPharmacies: [],
    maxDeliveryTime: 60,
    maxDeliveryFee: 50000,
    minRating: 0,
    showOnlyOpen: false,
    maxPrice: 10000,
  })

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      const userData = JSON.parse(user)
      setUserInsurance(userData.obraSocial || "")
    }
  }, [])

  const userInsuranceData = insuranceOptions.find((ins) => ins.name.toLowerCase() === userInsurance.toLowerCase())

  const filteredMedications = medicationsMultiPharmacy
    .filter((med) => {
      const matchesCategory = selectedCategory === "Todos" || med.category === selectedCategory
      const matchesSearch =
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.brand.toLowerCase().includes(searchTerm.toLowerCase())

      if (!matchesCategory || !matchesSearch) return false

      // Filter by insurance coverage
      if (filters.showOnlyInsuranceCovered && userInsuranceData) {
        const hasInsuranceCoverage = med.prices.some((price) =>
          userInsuranceData.pharmacyNetwork.includes(price.pharmacyId),
        )
        if (!hasInsuranceCoverage) return false
      }

      // Filter by selected pharmacies
      if (filters.selectedPharmacies.length > 0) {
        const hasSelectedPharmacy = med.prices.some((price) => filters.selectedPharmacies.includes(price.pharmacyId))
        if (!hasSelectedPharmacy) return false
      }

      // Filter by pharmacy criteria (rating, delivery time, etc.)
      const availablePharmacies = med.prices
        .map((price) => {
          const pharmacy = pharmacies.find((p) => p.id === price.pharmacyId)
          return { price, pharmacy }
        })
        .filter(({ pharmacy }) => {
          if (!pharmacy) return false
          if (filters.showOnlyOpen && !pharmacy.isOpen) return false
          if (pharmacy.rating < filters.minRating) return false
          if (pharmacy.deliveryFee > filters.maxDeliveryFee) return false

          // Parse delivery time (e.g., "30-45 min" -> 45)
          const maxTime = Number.parseInt(pharmacy.deliveryTime.split("-")[1] || pharmacy.deliveryTime.split(" ")[0])
          if (maxTime > filters.maxDeliveryTime) return false

          return true
        })

      if (availablePharmacies.length === 0) return false

      // Filter by price range
      const minPrice = Math.min(...availablePharmacies.map(({ price }) => price.discountedPrice || price.price))
      if (minPrice > filters.maxPrice) return false

      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          const aMinPrice = Math.min(...a.prices.map((p) => p.discountedPrice || p.price))
          const bMinPrice = Math.min(...b.prices.map((p) => p.discountedPrice || p.price))
          return aMinPrice - bMinPrice
        case "category":
          return a.category.localeCompare(b.category)
        default:
          return a.name.localeCompare(b.name)
      }
    })

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "selectedPharmacies") return (value as string[]).length > 0
    if (key === "maxDeliveryTime") return value < 60
    if (key === "maxDeliveryFee") return value < 50000
    if (key === "minRating") return value > 0
    if (key === "maxPrice") return value < 10000
    return value === true
  }).length

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Comparador de Precios</h2>
          <p className="text-muted-foreground text-lg">
            Compara precios en múltiples farmacias y encuentra el mejor precio con tu obra social
          </p>
          {userInsurance && (
            <div className="mt-4">
              <Badge variant="secondary" className="text-sm">
                Precios calculados con {userInsurance}
              </Badge>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar medicamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nombre</SelectItem>
                <SelectItem value="price">Mejor precio</SelectItem>
                <SelectItem value="category">Categoría</SelectItem>
              </SelectContent>
            </Select>

            <AdvancedFilters onFiltersChange={setFilters} currentFilters={filters} />
          </div>

          {activeFiltersCount > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span>
                  {activeFiltersCount} filtro{activeFiltersCount > 1 ? "s" : ""} activo
                  {activeFiltersCount > 1 ? "s" : ""}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-muted-foreground">Mostrando {filteredMedications.length} medicamentos</p>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMedications.map((medication) => (
            <MedicationCardWithPharmacies key={medication.id} medication={medication} />
          ))}
        </div>

        {filteredMedications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No se encontraron medicamentos que coincidan con tu búsqueda y filtros
            </p>
            <Button
              variant="secondary"
              className="mt-4"
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("Todos")
                setFilters({
                  showOnlyInsuranceCovered: false,
                  selectedPharmacies: [],
                  maxDeliveryTime: 60,
                  maxDeliveryFee: 50000,
                  minRating: 0,
                  showOnlyOpen: false,
                  maxPrice: 10000,
                })
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
