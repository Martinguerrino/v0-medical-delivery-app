'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Package, ArrowLeft, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState, useEffect } from "react"

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [medications, setMedications] = useState<Medication[]>([])
  const [loading, setLoading] = useState(true)

  const farmacia = {
    id: 'farmacity',
    role: 'Farmacia' as const,
    nombreFarmacia: 'Farmacity Test'
  }

  useEffect(() => {
    fetchMedications()
  }, [])

  async function fetchMedications() {
    try {
      const response = await fetch(`/api/inventory/${farmacia.id}`)
      if (response.ok) {
        const data = await response.json()
        setMedications(data)
      }
    } catch (error) {
      console.error('Error fetching medications:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddMedication(formData: FormData) {
    const data = {
      pharmacyId: formData.get('pharmacyId'),
      name: formData.get('name'),
      genericName: formData.get('genericName'),
      brand: formData.get('brand'),
      category: formData.get('category'),
      price: parseFloat(formData.get('price') as string),
      stock: parseInt(formData.get('stock') as string),
      dosage: formData.get('dosage'),
      presentation: formData.get('presentation'),
      laboratory: formData.get('laboratory'),
      description: formData.get('description')
    }

    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setErrorMessage(result.error)
      } else {
        setErrorMessage(null)
        setIsDialogOpen(false)
        fetchMedications() // Refresh the list
      }
    } catch (error) {
      console.error('Error adding medication:', error)
      setErrorMessage('Error interno del servidor')
    }
  }

  async function handleUpdateMedication(formData: FormData) {
    const data = {
      id: parseInt(formData.get('id') as string),
      pharmacyId: formData.get('pharmacyId'),
      name: formData.get('name'),
      genericName: formData.get('genericName'),
      brand: formData.get('brand'),
      category: formData.get('category'),
      price: parseFloat(formData.get('price') as string),
      stock: parseInt(formData.get('stock') as string),
      dosage: formData.get('dosage'),
      presentation: formData.get('presentation'),
      laboratory: formData.get('laboratory'),
      description: formData.get('description')
    }

    try {
      const response = await fetch('/api/inventory', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        fetchMedications() // Refresh the list
      } else {
        console.error('Error updating medication')
      }
    } catch (error) {
      console.error('Error updating medication:', error)
    }
  }

  async function handleDeleteMedication(id: number) {
    try {
      const response = await fetch('/api/inventory', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        fetchMedications() // Refresh the list
      } else {
        console.error('Error deleting medication')
      }
    } catch (error) {
      console.error('Error deleting medication:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <Button
              asChild
              variant="outline"
              className="gap-2"
            >
              <a href="/farmacia/panel">
                <ArrowLeft className="h-4 w-4" />
                Volver al Panel
              </a>
            </Button>
            <h1 className="text-3xl font-bold text-primary">Gestión de Inventario</h1>
          </div>
          <p className="text-muted-foreground">Administra los medicamentos de tu farmacia</p>
        </div>

        <div className="mb-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
              <form action={handleAddMedication} className="grid gap-4 py-4">
                <input type="hidden" name="pharmacyId" value={farmacia.id} />

                {errorMessage && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre del Medicamento *</Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      placeholder="Ej: Ibuprofeno 400mg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="genericName">Nombre Genérico</Label>
                    <Input
                      id="genericName"
                      name="genericName"
                      placeholder="Ej: Ibuprofeno"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Marca</Label>
                    <Input
                      id="brand"
                      name="brand"
                      placeholder="Ej: Genérico"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select name="category" defaultValue="Otros">
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
                      name="price"
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock *</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      required
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosificación</Label>
                  <Input
                    id="dosage"
                    name="dosage"
                    placeholder="Ej: 400mg tabletas"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="presentation">Presentación</Label>
                  <Input
                    id="presentation"
                    name="presentation"
                    placeholder="Ej: Caja con 20 tabletas"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="laboratory">Laboratorio</Label>
                  <Input
                    id="laboratory"
                    name="laboratory"
                    placeholder="Ej: Pfizer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Descripción del medicamento..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="submit">
                    Agregar Medicamento
                  </Button>
                </div>
              </form>
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
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 mr-2"
                            >
                              <Edit className="h-3 w-3" />
                              Editar
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Editar Medicamento</DialogTitle>
                              <DialogDescription>
                                Modifique la información del medicamento
                              </DialogDescription>
                            </DialogHeader>
                            <form action={handleUpdateMedication} className="grid gap-4 py-4">
                              <input type="hidden" name="id" value={medication.id} />
                              <input type="hidden" name="pharmacyId" value={farmacia.id} />
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-name-${medication.id}`}>Nombre del Medicamento *</Label>
                                  <Input
                                    id={`edit-name-${medication.id}`}
                                    name="name"
                                    defaultValue={medication.name}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-genericName-${medication.id}`}>Nombre Genérico</Label>
                                  <Input
                                    id={`edit-genericName-${medication.id}`}
                                    name="genericName"
                                    defaultValue={medication.genericName}
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-brand-${medication.id}`}>Marca</Label>
                                  <Input
                                    id={`edit-brand-${medication.id}`}
                                    name="brand"
                                    defaultValue={medication.brand}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-category-${medication.id}`}>Categoría</Label>
                                  <Select name="category" defaultValue={medication.category}>
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
                                  <Label htmlFor={`edit-price-${medication.id}`}>Precio (ARS) *</Label>
                                  <Input
                                    id={`edit-price-${medication.id}`}
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    defaultValue={medication.price}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-stock-${medication.id}`}>Stock *</Label>
                                  <Input
                                    id={`edit-stock-${medication.id}`}
                                    name="stock"
                                    type="number"
                                    defaultValue={medication.stock}
                                    required
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`edit-dosage-${medication.id}`}>Dosificación</Label>
                                <Input
                                  id={`edit-dosage-${medication.id}`}
                                  name="dosage"
                                  defaultValue={medication.dosage}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`edit-presentation-${medication.id}`}>Presentación</Label>
                                <Input
                                  id={`edit-presentation-${medication.id}`}
                                  name="presentation"
                                  defaultValue={medication.presentation}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`edit-laboratory-${medication.id}`}>Laboratorio</Label>
                                <Input
                                  id={`edit-laboratory-${medication.id}`}
                                  name="laboratory"
                                  defaultValue={medication.laboratory}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`edit-description-${medication.id}`}>Descripción</Label>
                                <Textarea
                                  id={`edit-description-${medication.id}`}
                                  name="description"
                                  defaultValue={medication.description}
                                  rows={3}
                                />
                              </div>

                              <div className="flex justify-end gap-2">
                                <Button type="submit">
                                  Actualizar Medicamento
                                </Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>

                        <Button
                          onClick={() => handleDeleteMedication(medication.id)}
                          variant="destructive"
                          size="sm"
                          className="gap-1"
                        >
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
