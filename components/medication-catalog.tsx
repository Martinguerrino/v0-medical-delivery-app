"use client"

import { useState, useEffect, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter } from "lucide-react"
import { MedicationCardWithPharmacies } from "./medication-card-with-pharmacies"
import { AdvancedFilters, type FilterState } from "./advanced-filters"
import { insuranceOptions } from "@/lib/data/insurance"
import type { ClientMedication, ClientMedicationPrice, ClientPharmacyMeta } from "@/lib/types/client-medication"
import { pharmacies as fallbackPharmacies } from "@/lib/data/pharmacies"

const fallbackPharmacyMap = new Map(
  fallbackPharmacies.flatMap((pharmacy) => {
    const entries: Array<[string, (typeof fallbackPharmacies)[number]]> = [
      [pharmacy.id, pharmacy],
      [pharmacy.id.toLowerCase(), pharmacy],
    ]
    return entries
  }),
)

const fallbackCategories = [
  "Antibióticos",
  "Cardiovasculares",
  "Antidiabéticos",
  "Gastroenterología",
  "Endocrinología",
]

const createDefaultFilters = (): FilterState => ({
  showOnlyInsuranceCovered: false,
  selectedPharmacies: [],
  maxDeliveryTime: 60,
  maxDeliveryFee: 50000,
  minRating: 0,
  showOnlyOpen: false,
  maxPrice: 10000,
})

const parseDeliveryTime = (value?: string | null): number | null => {
  if (!value) return null
  const matches = value.match(/\d+/g)
  if (!matches) return null
  const numbers = matches
    .map((segment) => Number.parseInt(segment, 10))
    .filter((segment) => Number.isFinite(segment))
  if (numbers.length === 0) return null
  return Math.max(...numbers)
}

export function MedicationCatalog() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [sortBy, setSortBy] = useState("name")
  const [userInsurance, setUserInsurance] = useState<string>("")
  const [filters, setFilters] = useState<FilterState>(() => createDefaultFilters())
  const [medications, setMedications] = useState<ClientMedication[]>([])
  const [pharmaciesMeta, setPharmaciesMeta] = useState<ClientPharmacyMeta[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const fallbackPharmaciesMeta = useMemo<ClientPharmacyMeta[]>(
    () =>
      fallbackPharmacies
        .map((pharmacy) => ({
          id: pharmacy.id,
          name: pharmacy.name,
          rating: pharmacy.rating,
          deliveryFee: pharmacy.deliveryFee,
          deliveryTime: pharmacy.deliveryTime,
          isOpen: pharmacy.isOpen,
          address: pharmacy.address,
          phone: pharmacy.phone,
          logo: pharmacy.logo,
          minOrder: pharmacy.minOrder,
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [],
  )

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUserInsurance(userData.obraSocial || "")
      } catch (error) {
        console.error("Error parsing stored user:", error)
      }
    }
  }, [])

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoadingData(true)
      setLoadError(null)

      try {
        const response = await fetch("/api/medications")
        if (!response.ok) {
          throw new Error(`Estado inesperado: ${response.status}`)
        }

        const data = (await response.json()) as ClientMedication[]
        setMedications(data)

        const pharmacyAccumulator = new Map<string, ClientPharmacyMeta>()
        data.forEach((medication) => {
          medication.prices.forEach((price) => {
            const pharmacyId = price.pharmacyId
            if (!pharmacyId || pharmacyAccumulator.has(pharmacyId)) {
              return
            }

            const fallback =
              fallbackPharmacyMap.get(pharmacyId) ||
              (price.pharmacySlug ? fallbackPharmacyMap.get(price.pharmacySlug) : undefined)

            pharmacyAccumulator.set(pharmacyId, {
              id: pharmacyId,
              name: price.pharmacyName ?? fallback?.name ?? pharmacyId,
              rating: typeof price.rating === "number" ? price.rating : fallback?.rating ?? 0,
              deliveryFee: typeof price.deliveryFee === "number" ? price.deliveryFee : fallback?.deliveryFee ?? 0,
              deliveryTime: price.deliveryTime ?? fallback?.deliveryTime ?? "30-45 min",
              isOpen: typeof price.isOpen === "boolean" ? price.isOpen : fallback?.isOpen ?? true,
              address: price.address ?? fallback?.address ?? null,
              phone: price.phone ?? fallback?.phone ?? null,
              logo: price.logo ?? fallback?.logo ?? null,
              minOrder: price.minOrder ?? fallback?.minOrder ?? null,
            })
          })
        })

        if (pharmacyAccumulator.size === 0) {
          fallbackPharmacies.forEach((pharmacy) => {
            pharmacyAccumulator.set(pharmacy.id, {
              id: pharmacy.id,
              name: pharmacy.name,
              rating: pharmacy.rating,
              deliveryFee: pharmacy.deliveryFee,
              deliveryTime: pharmacy.deliveryTime,
              isOpen: pharmacy.isOpen,
              address: pharmacy.address,
              phone: pharmacy.phone,
              logo: pharmacy.logo,
              minOrder: pharmacy.minOrder,
            })
          })
        }

        setPharmaciesMeta(Array.from(pharmacyAccumulator.values()).sort((a, b) => a.name.localeCompare(b.name)))
      } catch (error) {
        console.error("Error loading medication catalog:", error)
        setLoadError(error instanceof Error ? error.message : "Error desconocido al cargar el catálogo")
        setPharmaciesMeta(fallbackPharmaciesMeta)
      } finally {
        setLoadingData(false)
      }
    }

    void fetchCatalog()
  }, [fallbackPharmaciesMeta])

  const userInsuranceData = useMemo(() => {
    if (!userInsurance) return undefined
    const normalized = userInsurance.trim().toLowerCase()
    return (
      insuranceOptions.find((ins) => ins.id.toLowerCase() === normalized) ||
      insuranceOptions.find((ins) => ins.name.toLowerCase() === normalized)
    )
  }, [userInsurance])

  const insuranceNetwork = useMemo(() => {
    if (!userInsuranceData) return [] as string[]
    return userInsuranceData.pharmacyNetwork.map((entry) => entry.toLowerCase())
  }, [userInsuranceData])

  const pharmacyMetaMap = useMemo(() => {
    const map = new Map<string, ClientPharmacyMeta>()
    pharmaciesMeta.forEach((pharmacy) => map.set(pharmacy.id, pharmacy))
    return map
  }, [pharmaciesMeta])

  const categoryOptions = useMemo(() => {
    const uniqueCategories = new Set<string>()
    medications.forEach((medication) => {
      if (medication.category) {
        uniqueCategories.add(medication.category)
      }
    })

    const dynamicCategories = Array.from(uniqueCategories).sort((a, b) => a.localeCompare(b))
    const baseCategories = dynamicCategories.length > 0 ? dynamicCategories : fallbackCategories
    return ["Todos", ...baseCategories]
  }, [medications])

  const filteredMedications = useMemo(() => {
    const results: Array<{ medication: ClientMedication; minAvailablePrice: number }> = []
    const normalizedSearch = searchTerm.trim().toLowerCase()
    const networkSet = new Set(insuranceNetwork)

    medications.forEach((medication) => {
      const matchesCategory = selectedCategory === "Todos" || medication.category === selectedCategory
      if (!matchesCategory) return

      const matchesSearch =
        normalizedSearch.length === 0 ||
        [medication.name, medication.genericName, medication.brand].some((field) =>
          field.toLowerCase().includes(normalizedSearch),
        )
      if (!matchesSearch) return

      if (filters.showOnlyInsuranceCovered && networkSet.size > 0) {
        const hasCoverage = medication.prices.some((price) => {
          const id = price.pharmacyId?.toLowerCase()
          const slug = price.pharmacySlug?.toLowerCase()
          return (id && networkSet.has(id)) || (slug && networkSet.has(slug))
        })
        if (!hasCoverage) return
      }

      if (filters.selectedPharmacies.length > 0) {
        const hasSelected = medication.prices.some((price) => filters.selectedPharmacies.includes(price.pharmacyId))
        if (!hasSelected) return
      }

      const availableEntries = medication.prices
        .map((price) => {
          const meta = pharmacyMetaMap.get(price.pharmacyId)
          const rating = meta?.rating ?? (typeof price.rating === "number" ? price.rating : 0)
          const deliveryFee = meta?.deliveryFee ?? (typeof price.deliveryFee === "number" ? price.deliveryFee : 0)
          const deliveryTime = meta?.deliveryTime ?? price.deliveryTime ?? null
          const isOpen = meta?.isOpen ?? (typeof price.isOpen === "boolean" ? price.isOpen : true)
          return { price, rating, deliveryFee, deliveryTime, isOpen }
        })
        .filter(({ rating, deliveryFee, deliveryTime, isOpen }) => {
          if (filters.showOnlyOpen && !isOpen) return false
          if (rating < filters.minRating) return false
          if (deliveryFee > filters.maxDeliveryFee) return false
          const maxTime = parseDeliveryTime(deliveryTime)
          if (maxTime !== null && maxTime > filters.maxDeliveryTime) return false
          return true
        })

      if (availableEntries.length === 0) return

      const minAvailablePrice = availableEntries.reduce((best, { price }) => {
        const effectivePrice = price.discountedPrice ?? price.price
        return effectivePrice < best ? effectivePrice : best
      }, Number.POSITIVE_INFINITY)

      if (!Number.isFinite(minAvailablePrice) || minAvailablePrice > filters.maxPrice) return

      results.push({ medication, minAvailablePrice })
    })

    const sorted = results.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.minAvailablePrice - b.minAvailablePrice
        case "category":
          return a.medication.category.localeCompare(b.medication.category)
        default:
          return a.medication.name.localeCompare(b.medication.name)
      }
    })

    return sorted.map((entry) => entry.medication)
  }, [medications, selectedCategory, searchTerm, filters, sortBy, insuranceNetwork, pharmacyMetaMap])

  const groupedMedications = useMemo(() => {
    const groups = new Map<
      string,
      {
        medication: ClientMedication
        priceKeys: Set<string>
      }
    >()

    const createPriceKey = (price: ClientMedicationPrice) => {
      const pharmacyId = (price.pharmacyId ?? "").toLowerCase()
      const pharmacySlug = (price.pharmacySlug ?? "").toLowerCase()
      const basePrice = Number.isFinite(price.price) ? price.price : 0
      const discounted = price.discountedPrice ?? null
      return `${pharmacyId}::${pharmacySlug}::${basePrice}::${discounted ?? "null"}`
    }

    filteredMedications.forEach((medication) => {
      const normalizedName = medication.name.trim().toLowerCase()
      const normalizedCategory = medication.category.trim().toLowerCase()
      const groupKey = `${normalizedName}::${normalizedCategory}`
      const existing = groups.get(groupKey)

      if (!existing) {
        const priceKeys = new Set<string>()
        const dedupedPrices: ClientMedicationPrice[] = []

        medication.prices.forEach((price) => {
          const key = createPriceKey(price)
          if (!priceKeys.has(key)) {
            priceKeys.add(key)
            dedupedPrices.push(price)
          }
        })

        groups.set(groupKey, {
          medication: { ...medication, prices: dedupedPrices },
          priceKeys,
        })
        return
      }

      const dedupedPrices = [...existing.medication.prices]
      medication.prices.forEach((price) => {
        const key = createPriceKey(price)
        if (!existing.priceKeys.has(key)) {
          existing.priceKeys.add(key)
          dedupedPrices.push(price)
        }
      })

      existing.medication = {
        ...existing.medication,
        prices: dedupedPrices,
      }
    })

    return Array.from(groups.values()).map((entry) => entry.medication)
  }, [filteredMedications])

  const activeFiltersCount = useMemo(() => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === "selectedPharmacies") return (value as string[]).length > 0
      if (key === "maxDeliveryTime") return value < 60
      if (key === "maxDeliveryFee") return value < 50000
      if (key === "minRating") return value > 0
      if (key === "maxPrice") return value < 10000
      return value === true
    }).length
  }, [filters])

  const handleResetFilters = () => {
    setSearchTerm("")
    setSelectedCategory("Todos")
    setFilters(createDefaultFilters())
  }

  const advancedFilterPharmacies = pharmaciesMeta.length > 0 ? pharmaciesMeta : fallbackPharmaciesMeta

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
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((category) => (
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

            <AdvancedFilters
              onFiltersChange={setFilters}
              currentFilters={filters}
              pharmacies={advancedFilterPharmacies}
            />
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
          {loadingData ? (
            <p className="text-muted-foreground">Cargando medicamentos...</p>
          ) : loadError ? (
            <p className="text-destructive">No se pudo cargar el catálogo: {loadError}</p>
          ) : (
            <p className="text-muted-foreground">Mostrando {groupedMedications.length} medicamentos</p>
          )}
        </div>

        {loadingData ? (
          <div className="text-center py-12 text-muted-foreground">Cargando catálogo...</div>
        ) : loadError ? (
          <div className="text-center py-12">
            <p className="text-destructive text-lg mb-4">No se pudo cargar el catálogo de medicamentos.</p>
            <Button variant="secondary" onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </div>
        ) : groupedMedications.length > 0 ? (
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
            {groupedMedications.map((medication) => (
              <MedicationCardWithPharmacies key={medication.id} medication={medication} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No se encontraron medicamentos que coincidan con tu búsqueda y filtros
            </p>
            <Button variant="secondary" className="mt-4" onClick={handleResetFilters}>
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
