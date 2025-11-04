export interface Pharmacy {
  id: string
  name: string
  logo: string
  rating: number
  deliveryTime: string
  deliveryFee: number
  minOrder: number
  acceptedInsurance: string[]
  address: string
  phone: string
  isOpen: boolean
  openHours: string
  isOnGuard: boolean
  guardSchedule?: string
  emergencyPhone?: string
  location: string
  services: string[]
  specialties: string[]
  paymentMethods: string[]
  website?: string
  email?: string
  socialMedia?: {
    facebook?: string
    instagram?: string
    whatsapp?: string
  }
  certifications: string[]
  establishedYear: number
  totalReviews: number
  averageDeliveryTime: number
  hasParking: boolean
  isAccessible: boolean
  languages: string[]
  pharmacistName: string
  pharmacistLicense: string
}

export const pharmacies: Pharmacy[] = [
  {
    id: "farmacity",
    name: "Farmacity",
    logo: "/placeholder-ha3vf.png",
    rating: 4.5,
    deliveryTime: "30-45 min",
    deliveryFee: 350,
    minOrder: 1500,
    acceptedInsurance: ["OSDE", "Swiss Medical", "Galeno", "Medicus", "IOMA"],
    address: "Av. Santa Fe 1234, CABA",
    phone: "0800-333-2762",
    isOpen: true,
    openHours: "24hs",
    isOnGuard: true,
    guardSchedule: "24hs todos los días",
    emergencyPhone: "0800-333-2762",
    location: "Palermo, CABA",
    services: ["Delivery 24hs", "Vacunación", "Control de presión", "Inyectables", "Test COVID-19", "Perfumería"],
    specialties: ["Medicamentos oncológicos", "Nutrición deportiva", "Dermocosmética", "Productos naturales"],
    paymentMethods: ["Efectivo", "Débito", "Crédito", "Mercado Pago", "Transferencia", "Cheques"],
    website: "https://www.farmacity.com",
    email: "info@farmacity.com",
    socialMedia: {
      facebook: "@farmacity",
      instagram: "@farmacity",
      whatsapp: "+5491133327622",
    },
    certifications: ["ISO 9001", "Buenas Prácticas de Farmacia", "ANMAT"],
    establishedYear: 1997,
    totalReviews: 15420,
    averageDeliveryTime: 37,
    hasParking: true,
    isAccessible: true,
    languages: ["Español", "Inglés"],
    pharmacistName: "Dra. María González",
    pharmacistLicense: "MP 12345",
  },
  {
    id: "dr-ahorro",
    name: "Dr. Ahorro",
    logo: "/placeholder-lz72g.png",
    rating: 4.2,
    deliveryTime: "25-40 min",
    deliveryFee: 300,
    minOrder: 1200,
    acceptedInsurance: ["PAMI", "IOMA", "Obra Social Empleados de Comercio", "OSECAC"],
    address: "Av. Corrientes 2456, CABA",
    phone: "0800-777-2467",
    isOpen: true,
    openHours: "8:00 - 22:00",
    isOnGuard: false,
    location: "San Nicolás, CABA",
    services: ["Delivery", "Medicamentos genéricos", "Control de presión", "Inyectables", "Perfumería básica"],
    specialties: ["Medicamentos genéricos", "Precios accesibles", "Atención PAMI"],
    paymentMethods: ["Efectivo", "Débito", "Crédito", "Mercado Pago"],
    website: "https://www.drahorro.com.ar",
    email: "contacto@drahorro.com.ar",
    socialMedia: {
      facebook: "@drahorro",
      whatsapp: "+5491177724677",
    },
    certifications: ["Buenas Prácticas de Farmacia", "ANMAT"],
    establishedYear: 2005,
    totalReviews: 8930,
    averageDeliveryTime: 32,
    hasParking: false,
    isAccessible: true,
    languages: ["Español"],
    pharmacistName: "Dr. Carlos Rodríguez",
    pharmacistLicense: "MP 23456",
  },
  {
    id: "farmacias-del-dr-simi",
    name: "Farmacias del Dr. Simi",
    logo: "/placeholder-06w9g.png",
    rating: 4.0,
    deliveryTime: "35-50 min",
    deliveryFee: 250,
    minOrder: 1000,
    acceptedInsurance: ["PAMI", "IOMA", "OSPRERA", "Obra Social Empleados de Comercio"],
    address: "Av. Rivadavia 3789, CABA",
    phone: "0800-444-7464",
    isOpen: true,
    openHours: "9:00 - 21:00",
    isOnGuard: true,
    guardSchedule: "Fines de semana y feriados",
    emergencyPhone: "0800-444-7464",
    location: "Balvanera, CABA",
    services: ["Delivery", "Medicamentos similares", "Consulta médica", "Laboratorio", "Inyectables"],
    specialties: ["Medicamentos similares", "Consulta médica gratuita", "Laboratorio clínico"],
    paymentMethods: ["Efectivo", "Débito", "Crédito"],
    website: "https://www.drsimi.com.ar",
    email: "info@drsimi.com.ar",
    socialMedia: {
      facebook: "@drsimiargentina",
      instagram: "@drsimiarg",
    },
    certifications: ["ANMAT", "Buenas Prácticas de Farmacia"],
    establishedYear: 2010,
    totalReviews: 6750,
    averageDeliveryTime: 42,
    hasParking: true,
    isAccessible: false,
    languages: ["Español"],
    pharmacistName: "Dra. Ana López",
    pharmacistLicense: "MP 34567",
  },
  {
    id: "farmahorro",
    name: "Farmahorro",
    logo: "/placeholder-u4k0m.png",
    rating: 4.3,
    deliveryTime: "20-35 min",
    deliveryFee: 400,
    minOrder: 1800,
    acceptedInsurance: ["OSDE", "Swiss Medical", "Medicus", "Galeno"],
    address: "Av. Cabildo 1567, CABA",
    phone: "0800-555-3276",
    isOpen: false,
    openHours: "8:00 - 20:00",
    isOnGuard: false,
    location: "Belgrano, CABA",
    services: ["Delivery", "Perfumería premium", "Dermocosmética", "Nutrición", "Inyectables"],
    specialties: ["Dermocosmética", "Perfumería importada", "Suplementos deportivos"],
    paymentMethods: ["Efectivo", "Débito", "Crédito", "Mercado Pago", "Transferencia"],
    website: "https://www.farmahorro.com.ar",
    email: "ventas@farmahorro.com.ar",
    socialMedia: {
      instagram: "@farmahorro",
      whatsapp: "+5491155532766",
    },
    certifications: ["ISO 9001", "Buenas Prácticas de Farmacia", "ANMAT"],
    establishedYear: 1985,
    totalReviews: 12340,
    averageDeliveryTime: 27,
    hasParking: true,
    isAccessible: true,
    languages: ["Español", "Inglés", "Portugués"],
    pharmacistName: "Dr. Roberto Silva",
    pharmacistLicense: "MP 45678",
  },
  {
    id: "farmaplus",
    name: "Farmaplus",
    logo: "/placeholder-59zcq.png",
    rating: 4.1,
    deliveryTime: "40-60 min",
    deliveryFee: 200,
    minOrder: 800,
    acceptedInsurance: ["PAMI", "IOMA", "OSECAC", "OSPRERA", "Obra Social Empleados de Comercio"],
    address: "Av. San Juan 2890, CABA",
    phone: "0800-666-7587",
    isOpen: true,
    openHours: "7:00 - 23:00",
    isOnGuard: true,
    guardSchedule: "Lunes a viernes 20:00 - 8:00",
    emergencyPhone: "0800-666-7587",
    location: "San Telmo, CABA",
    services: ["Delivery", "Medicamentos genéricos", "Control de presión", "Test rápidos", "Perfumería"],
    specialties: ["Atención barrial", "Medicamentos accesibles", "Atención personalizada"],
    paymentMethods: ["Efectivo", "Débito", "Crédito", "Mercado Pago"],
    website: "https://www.farmaplus.com.ar",
    email: "contacto@farmaplus.com.ar",
    socialMedia: {
      facebook: "@farmaplus",
      whatsapp: "+5491166675877",
    },
    certifications: ["Buenas Prácticas de Farmacia", "ANMAT"],
    establishedYear: 1992,
    totalReviews: 4560,
    averageDeliveryTime: 50,
    hasParking: false,
    isAccessible: true,
    languages: ["Español"],
    pharmacistName: "Dra. Laura Martínez",
    pharmacistLicense: "MP 56789",
  },
]

export const getGuardPharmacies = (location?: string) => {
  let guardPharmacies = pharmacies.filter((pharmacy) => pharmacy.isOnGuard)

  if (location) {
    guardPharmacies = guardPharmacies.filter(
      (pharmacy) =>
        pharmacy.location.toLowerCase().includes(location.toLowerCase()) ||
        location.toLowerCase().includes(pharmacy.location.toLowerCase()),
    )
  }

  return guardPharmacies
}
