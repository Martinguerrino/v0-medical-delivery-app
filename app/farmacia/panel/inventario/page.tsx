"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Package, ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import type { FarmaciaUser } from "@/lib/types/user-types"

interface Medication {
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
  price: number
  stock: number
  inStock: boolean
}

export default function InventarioPage() {
  const router = useRouter()
  const [farmacia, setFarmacia] = useState<FarmaciaUser | null>(null)
  const [medications, setMedications] = useState<Medication[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    genericName: "",
    brand: "",
    category: "",
    requiresPrescription: false,
    description: "",
    dosage: "",
    presentation: "",
    activeIngredient: "",
    laboratory: "",
    price: "",
    stock: "",
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      if (user.role === "Farmacia") {
        setFarmacia(user)
        loadMedications()
      } else {
        router.push("/auth")
      }
    } else {
      router.push("/auth")
    }
  }, [router])

  const loadMedications = async () => {
    try {
      const response = await fetch(`/api/medications?pharmacyId=${farmacia?.id}`)
      if (response.ok) {
        const data = await response.json()
        setMedications(data)
      }
    } catch (error) {
      console.error('Error loading medications:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      genericName: "",
      brand: "",
      category: "",
      requiresPrescription: false,
      description: "",
      dosage: "",
      presentation: "",
      activeIngredient: "",
      laboratory: "",
      price: "",
      stock: "",
    })
  }

  const handleAddMedication = async () => {
    // Validate required fields
    if (!formData.name || !formData.price || !formData.stock) {
      setError("Por favor complete todos los campos obligatorios")
      return
    }

    // Validate price and stock
    const price = parseFloat(formData.price)
    const stock = parseInt(formData.stock)

    if (isNaN(price) || price <= 0) {
      setError("El precio debe ser un número positivo")
      return
    }

    if (isNaN(stock) || stock < 0) {
      setError("El stock debe ser un número entero no negativo")
      return
    }

    try {
      const response = await fetch('/api/medications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price,
          stock,
          pharmacyId: farmacia?.id,
        }),
      })

      if (response.ok) {
        setSuccess("Medicamento agregado exitosamente")
        setIsAddDialogOpen(false)
        resetForm()
        loadMedications()
        setTimeout(() => setSuccess(""), 3000)
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Error al agregar medicamento")
      }
    } catch (error) {
      console.error('Error adding medication:', error)
      setError("Error al agregar medicamento")
    }
  }

  const handleEditMedication = async () => {
    if (!editingMedication) return

    // Validate required fields
    if (!formData.name || !formData.price || !formData.stock) {
      setError("Por favor complete todos los campos obligatorios")
      return
    }

    // Validate price and stock
    const price = parseFloat(formData.price)
    const stock = parseInt(formData.stock)

    if (isNaN(price) || price <= 0) {
      setError("El precio debe ser un número positivo")
      return
    }

    if (isNaN(stock) || stock < 0) {
      setError("El stock debe ser un número entero no negativo")
      return
    }

    try {
      const response = await fetch(`/api/medications/${editingMedication.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price,
          stock,
          pharmacyId: farmacia?.id,
        }),
      })

      if (response.ok) {
        setSuccess("Medicamento actualizado exitosamente")
        setIsEditDialogOpen(false)
        setEditingMedication(null)
        resetForm()
        loadMedications()
        setTimeout(() => setSuccess(""), 3000)
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Error al actualizar medicamento")
      }
    } catch (error) {
      console.error('Error updating medication:', error)
      setError("Error al actualizar medicamento")
    }
  }

  const openEditDialog = (medication: Medication) => {
    setEditingMedication(medication)
    setFormData({
      name: medication.name,
      genericName: medication.genericName,
      brand: medication.brand,
      category: medication.category,
      requiresPrescription: medication.requiresPrescription,
      description: medication.description,
      dosage: medication.dosage,
      presentation: medication.presentation,
      activeIngredient: medication.activeIngredient,
      laboratory: medication.laboratory,
      price: medication.price.toString(),
      stock: medication.stock.toString(),
    })
    setIsEditDialogOpen(true)
  }

  if (!farmacia) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Package className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Cargando inventario...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <Button
              onClick={() => router.push('/farmacia/panel')}
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al Panel
            </Button>
            <h1 className="text-3xl font-bold text-primary">Gestión de Inventario</h1>
          </div>
          <p className="text-muted-foreground">Administra los medicamentos de tu farmacia</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-500 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <div className="mb-6">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Agregar Medicamento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Medicamento</DialogTitle>
                <DialogDescription>
                  Complete la información del medicamento para agregarlo al inventario
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre del Medicamento *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ej: Ibuprofeno 400mg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="genericName">Nombre Genérico</Label>
                    <Input
                      id="genericName"
                      value={formData.genericName}
                      onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                      placeholder="Ej: Ibuprofeno"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Marca</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="Ej: Genérico"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Analgésicos">Analgésicos</SelectItem>
                        <SelectItem value="Antibióticos">Antibióticos</SelectItem>
                        <SelectItem value="Cardiovasculares">Cardiovasculares</SelectItem>
                        <SelectItem value="Antidiabéticos">Antidiabéticos</SelectItem>
                        <SelectItem value="Gastroenterología">Gastroenterología</SelectItem>
                        <SelectItem value="Otros">Otros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Precio (ARS) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock *</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosificación</Label>
                  <Input
                    id="dosage"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    placeholder="Ej: 400mg tabletas"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="presentation">Presentación</Label>
                  <Input
                    id="presentation"
                    value={formData.presentation}
                    onChange={(e) => setFormData({ ...formData, presentation: e.target.value })}
                    placeholder="Ej: Caja con 20 tabletas"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="laboratory">Laboratorio</Label>
                  <Input
                    id="laboratory"
                    value={formData.laboratory}
                    onChange={(e) => setFormData({ ...formData, laboratory: e.target.value })}
                    placeholder="Ej: Pfizer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descripción del medicamento..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>
                  Cancelar
                </Button>
                <Button onClick={handleAddMedication}>
                  Agregar Medicamento
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Inventario de Medicamentos</CardTitle>
            <CardDescription>
              Lista de todos los medicamentos disponibles en tu farmacia
            </CardDescription>
          </CardHeader>
          <CardContent>
            {medications.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No hay medicamentos en el inventario</p>
                <p className="text-sm text-muted-foreground">Agrega tu primer medicamento usando el botón "Agregar Medicamento"</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medications.map((medication) => (
                    <TableRow key={medication.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{medication.name}</div>
                          <div className="text-sm text-muted-foreground">{medication.brand}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{medication.category}</Badge>
                      </TableCell>
                      <TableCell>${medication.price.toLocaleString('es-AR')}</TableCell>
                      <TableCell>{medication.stock}</TableCell>
                      <TableCell>
                        {medication.inStock ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Disponible
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="h-3 w-3 mr-1" />
                            Sin Stock
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(medication)}
                          className="gap-1"
                        >
                          <Edit className="h-3 w-3" />
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Medicamento</DialogTitle>
              <DialogDescription>
                Modifique la información del medicamento
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nombre del Medicamento *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-genericName">Nombre Genérico</Label>
                  <Input
                    id="edit-genericName"
                    value={formData.genericName}
                    onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-brand">Marca</Label>
                  <Input
                    id="edit-brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Categoría</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Analgésicos">Analgésicos</SelectItem>
                      <SelectItem value="Antibióticos">Antibióticos</SelectItem>
                      <SelectItem value="Cardiovasculares">Cardiovasculares</SelectItem>
                      <SelectItem value="Antidiabéticos">Antidiabéticos</SelectItem>
                      <SelectItem value="Gastroenterología">Gastroenterología</SelectItem>
                      <SelectItem value="Otros">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Precio (ARS) *</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-stock">Stock *</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-dosage">Dosificación</Label>
                <Input
                  id="edit-dosage"
                  value={formData.dosage}
                  onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-presentation">Presentación</Label>
                <Input
                  id="edit-presentation"
                  value={formData.presentation}
                  onChange={(e) => setFormData({ ...formData, presentation: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-laboratory">Laboratorio</Label>
                <Input
                  id="edit-laboratory"
                  value={formData.laboratory}
                  onChange={(e) => setFormData({ ...formData, laboratory: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Descripción</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); setEditingMedication(null); resetForm(); }}>
                Cancelar
              </Button>
              <Button onClick={handleEditMedication}>
                Actualizar Medicamento
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
