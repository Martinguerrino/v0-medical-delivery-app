export interface MedicationPrice {
  pharmacyId: string
  price: number
  discountedPrice?: number
  inStock: boolean
  lastUpdated: string
}

export interface MedicationMultiPharmacy {
  id: number
  name: string
  genericName: string
  brand: string
  category: string
  requiresPrescription: boolean
  description: string
  dosage: string
  presentation: string
  activeIngredient: string
  laboratory: string
  prices: MedicationPrice[]
}

export const medicationsMultiPharmacy: MedicationMultiPharmacy[] = [
  {
    id: 1,
    name: "Amoxicilina 500mg",
    genericName: "Amoxicilina",
    brand: "Amoxil",
    category: "Antibióticos",
    requiresPrescription: true,
    description: "Antibiótico de amplio espectro para infecciones bacterianas",
    dosage: "500mg cápsulas",
    presentation: "Caja con 21 cápsulas",
    activeIngredient: "Amoxicilina trihidratada",
    laboratory: "GSK",
    prices: [
      {
        pharmacyId: "farmacity",
        price: 2599,
        discountedPrice: 2079,
        inStock: true,
        lastUpdated: "2024-01-15T10:30:00Z",
      },
      {
        pharmacyId: "dr-ahorro",
        price: 2350,
        inStock: true,
        lastUpdated: "2024-01-15T09:15:00Z",
      },
      {
        pharmacyId: "farmacias-del-dr-simi",
        price: 1999,
        inStock: true,
        lastUpdated: "2024-01-15T11:00:00Z",
      },
      {
        pharmacyId: "farmahorro",
        price: 2450,
        discountedPrice: 2205,
        inStock: false,
        lastUpdated: "2024-01-15T08:45:00Z",
      },
      {
        pharmacyId: "farmaplus",
        price: 2200,
        inStock: true,
        lastUpdated: "2024-01-15T12:20:00Z",
      },
    ],
  },
  {
    id: 2,
    name: "Losartán 50mg",
    genericName: "Losartán",
    brand: "Cozaar",
    category: "Cardiovasculares",
    requiresPrescription: true,
    description: "Antihipertensivo para el control de la presión arterial",
    dosage: "50mg tabletas",
    presentation: "Caja con 30 tabletas",
    activeIngredient: "Losartán potásico",
    laboratory: "MSD",
    prices: [
      {
        pharmacyId: "farmacity",
        price: 1850,
        inStock: true,
        lastUpdated: "2024-01-15T10:30:00Z",
      },
      {
        pharmacyId: "dr-ahorro",
        price: 1650,
        inStock: true,
        lastUpdated: "2024-01-15T09:15:00Z",
      },
      {
        pharmacyId: "farmacias-del-dr-simi",
        price: 1450,
        inStock: true,
        lastUpdated: "2024-01-15T11:00:00Z",
      },
      {
        pharmacyId: "farmahorro",
        price: 1750,
        discountedPrice: 1575,
        inStock: true,
        lastUpdated: "2024-01-15T08:45:00Z",
      },
      {
        pharmacyId: "farmaplus",
        price: 1550,
        inStock: true,
        lastUpdated: "2024-01-15T12:20:00Z",
      },
    ],
  },
  {
    id: 3,
    name: "Metformina 850mg",
    genericName: "Metformina",
    brand: "Glucophage",
    category: "Antidiabéticos",
    requiresPrescription: true,
    description: "Antidiabético oral para el control de la glucosa",
    dosage: "850mg tabletas",
    presentation: "Caja con 60 tabletas",
    activeIngredient: "Metformina clorhidrato",
    laboratory: "Merck",
    prices: [
      {
        pharmacyId: "farmacity",
        price: 2275,
        discountedPrice: 1820,
        inStock: true,
        lastUpdated: "2024-01-15T10:30:00Z",
      },
      {
        pharmacyId: "dr-ahorro",
        price: 2100,
        inStock: false,
        lastUpdated: "2024-01-15T09:15:00Z",
      },
      {
        pharmacyId: "farmacias-del-dr-simi",
        price: 1899,
        inStock: true,
        lastUpdated: "2024-01-15T11:00:00Z",
      },
      {
        pharmacyId: "farmahorro",
        price: 2200,
        inStock: true,
        lastUpdated: "2024-01-15T08:45:00Z",
      },
      {
        pharmacyId: "farmaplus",
        price: 1950,
        inStock: true,
        lastUpdated: "2024-01-15T12:20:00Z",
      },
    ],
  },
  {
    id: 4,
    name: "Omeprazol 20mg",
    genericName: "Omeprazol",
    brand: "Prilosec",
    category: "Gastroenterología",
    requiresPrescription: true,
    description: "Inhibidor de la bomba de protones para úlceras y reflujo",
    dosage: "20mg cápsulas",
    presentation: "Caja con 28 cápsulas",
    activeIngredient: "Omeprazol magnésico",
    laboratory: "AstraZeneca",
    prices: [
      {
        pharmacyId: "farmacity",
        price: 1530,
        inStock: true,
        lastUpdated: "2024-01-15T10:30:00Z",
      },
      {
        pharmacyId: "dr-ahorro",
        price: 1350,
        inStock: true,
        lastUpdated: "2024-01-15T09:15:00Z",
      },
      {
        pharmacyId: "farmacias-del-dr-simi",
        price: 1199,
        inStock: true,
        lastUpdated: "2024-01-15T11:00:00Z",
      },
      {
        pharmacyId: "farmahorro",
        price: 1450,
        discountedPrice: 1305,
        inStock: true,
        lastUpdated: "2024-01-15T08:45:00Z",
      },
      {
        pharmacyId: "farmaplus",
        price: 1280,
        inStock: true,
        lastUpdated: "2024-01-15T12:20:00Z",
      },
    ],
  },
]
