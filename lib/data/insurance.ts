export interface Insurance {
  id: string
  name: string
  logo: string
  coverage: number // Percentage of coverage
  copayment: number // Fixed copayment amount
  description: string
  pharmacyNetwork: string[]
}

export const insuranceOptions: Insurance[] = [
  {
    id: "osde",
    name: "OSDE",
    logo: "/generic-health-logo.png",
    coverage: 80,
    copayment: 500,
    description: "Cobertura del 80% en medicamentos ambulatorios",
    pharmacyNetwork: ["farmacity", "farmahorro", "dr-ahorro"],
  },
  {
    id: "swiss-medical",
    name: "Swiss Medical",
    logo: "/placeholder-agfze.png",
    coverage: 70,
    copayment: 600,
    description: "Cobertura del 70% con copago fijo",
    pharmacyNetwork: ["farmacity", "farmahorro", "dr-ahorro"],
  },
  {
    id: "galeno",
    name: "Galeno",
    logo: "/placeholder-cgxhl.png",
    coverage: 75,
    copayment: 450,
    description: "Cobertura del 75% en red de farmacias adheridas",
    pharmacyNetwork: ["farmacity", "farmahorro", "dr-ahorro"],
  },
  {
    id: "medicus",
    name: "Medicus",
    logo: "/placeholder-6onp3.png",
    coverage: 85,
    copayment: 400,
    description: "Cobertura del 85% con menor copago",
    pharmacyNetwork: ["farmacity", "farmahorro", "dr-ahorro"],
  },
  {
    id: "ioma",
    name: "IOMA",
    logo: "/placeholder-6vjcp.png",
    coverage: 100,
    copayment: 200,
    description: "Cobertura total con copago mínimo",
    pharmacyNetwork: ["farmacity", "dr-ahorro", "farmacias-del-dr-simi", "farmaplus"],
  },
  {
    id: "pami",
    name: "PAMI",
    logo: "/placeholder-z2m3s.png",
    coverage: 100,
    copayment: 0,
    description: "Cobertura total sin copago para jubilados",
    pharmacyNetwork: ["dr-ahorro", "farmacias-del-dr-simi", "farmaplus"],
  },
  {
    id: "osecac",
    name: "OSECAC",
    logo: "/placeholder-45z9a.png",
    coverage: 70,
    copayment: 350,
    description: "Obra social de empleados de comercio",
    pharmacyNetwork: ["dr-ahorro", "farmacias-del-dr-simi", "farmaplus"],
  },
  {
    id: "osprera",
    name: "OSPRERA",
    logo: "/placeholder-3fgu2.png",
    coverage: 80,
    copayment: 300,
    description: "Obra social de trabajadores rurales",
    pharmacyNetwork: ["farmacias-del-dr-simi", "farmaplus"],
  },
]
