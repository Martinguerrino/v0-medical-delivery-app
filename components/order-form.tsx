"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, CheckCircle2, AlertCircle, X } from "lucide-react"
import { pharmacies } from "@/lib/data/pharmacies"
import { calculateFinalPrice } from "@/lib/utils/price-calculator"
import { insuranceOptions } from "@/lib/data/insurance"
import type { MedicationMultiPharmacy } from "@/lib/data/medications-multi-pharmacy"

interface OrderFormProps {
  medication: MedicationMultiPharmacy
  pharmacyId: string
  onSuccess: () => void
  onCancel: () => void
}

export function OrderForm({ medication, pharmacyId, onSuccess, onCancel }: OrderFormProps) {
  const [formData, setFormData] = useState({
    quantity: 1,
    deliveryAddress: "",
    deliveryInstructions: "",
    paymentMethod: "",
    prescriptionFile: null as File | null,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const pharmacy = pharmacies.find((p) => p.id === pharmacyId)
  const medicationPrice = medication.prices.find((p) => p.pharmacyId === pharmacyId)

  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : {}
  const userInsurance = user.obraSocial || ""
  const userInsuranceData = insuranceOptions.find((ins) => ins.name.toLowerCase() === userInsurance.toLowerCase())

  const unitPrice = medicationPrice?.discountedPrice || medicationPrice?.price || 0
  const finalUnitPrice = calculateFinalPrice(
    unitPrice,
    userInsuranceData?.discount || 0,
    userInsuranceData?.copayment || 0,
  )
  const subtotal = finalUnitPrice * formData.quantity
  const deliveryFee = pharmacy?.deliveryFee || 0
  const total = subtotal + deliveryFee

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validFormats = ["image/jpeg", "image/png", "application/pdf"]
    if (!validFormats.includes(file.type)) {
      setErrors({ ...errors, prescriptionFile: "Solo se permiten archivos JPG, PNG o PDF" })
      return
    }

    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      setErrors({ ...errors, prescriptionFile: "El archivo no debe superar los 10MB" })
      return
    }

    setFormData({ ...formData, prescriptionFile: file })
    setErrors({ ...errors, prescriptionFile: "" })
    setUploadSuccess(true)
  }

  const removeFile = () => {
    setFormData({ ...formData, prescriptionFile: null })
    setUploadSuccess(false)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = "La dirección de entrega es obligatoria"
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "Debe seleccionar un método de pago"
    }

    if (!formData.prescriptionFile) {
      newErrors.prescriptionFile = "Debe cargar la receta médica"
    }

    if (formData.quantity < 1) {
      newErrors.quantity = "La cantidad debe ser al menos 1"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    setTimeout(() => {
      // Guardar pedido en localStorage
      const orders = JSON.parse(localStorage.getItem("orders") || "[]")
      const newOrder = {
        id: `ORD-${Date.now()}`,
        userId: user.email,
        medicationId: medication.id,
        medicationName: medication.name,
        pharmacyId: pharmacyId,
        pharmacyName: pharmacy?.name,
        quantity: formData.quantity,
        unitPrice: finalUnitPrice,
        deliveryFee: deliveryFee,
        total: total,
        deliveryAddress: formData.deliveryAddress,
        deliveryInstructions: formData.deliveryInstructions,
        paymentMethod: formData.paymentMethod,
        prescriptionFileName: formData.prescriptionFile?.name,
        prescriptionStatus: "pending",
        orderStatus: "pending",
        createdAt: new Date().toISOString(),
      }
      orders.push(newOrder)
      localStorage.setItem("orders", JSON.stringify(orders))

      setIsSubmitting(false)
      onSuccess()
    }, 1500)
  }

  if (!pharmacy || !medicationPrice) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>No se pudo cargar la información del pedido</AlertDescription>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Resumen del pedido */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Resumen del Pedido</h3>
        <div className="space-y-1 text-sm">
          <p>
            <span className="font-medium">Medicamento:</span> {medication.name}
          </p>
          <p>
            <span className="font-medium">Farmacia:</span> {pharmacy.name}
          </p>
          <p>
            <span className="font-medium">Precio unitario:</span> ${finalUnitPrice.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Cantidad */}
      <div className="space-y-2">
        <Label htmlFor="quantity">Cantidad</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: Number.parseInt(e.target.value) || 1 })}
          className={errors.quantity ? "border-destructive" : ""}
        />
        {errors.quantity && <p className="text-sm text-destructive">{errors.quantity}</p>}
      </div>

      {/* Dirección de entrega */}
      <div className="space-y-2">
        <Label htmlFor="deliveryAddress">
          Dirección de entrega <span className="text-destructive">*</span>
        </Label>
        <Input
          id="deliveryAddress"
          placeholder="Calle, número, piso, depto"
          value={formData.deliveryAddress}
          onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
          className={errors.deliveryAddress ? "border-destructive" : ""}
        />
        {errors.deliveryAddress && <p className="text-sm text-destructive">{errors.deliveryAddress}</p>}
      </div>

      {/* Instrucciones de entrega */}
      <div className="space-y-2">
        <Label htmlFor="deliveryInstructions">Instrucciones de entrega (opcional)</Label>
        <Textarea
          id="deliveryInstructions"
          placeholder="Ej: Tocar timbre 3B, dejar con portero, etc."
          value={formData.deliveryInstructions}
          onChange={(e) => setFormData({ ...formData, deliveryInstructions: e.target.value })}
          rows={3}
        />
      </div>

      {/* Carga de receta médica */}
      <div className="space-y-2">
        <Label htmlFor="prescription">
          Receta médica <span className="text-destructive">*</span>
        </Label>
        <div className="border-2 border-dashed rounded-lg p-6 text-center">
          {!formData.prescriptionFile ? (
            <>
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">Arrastra tu receta aquí o haz clic para seleccionar</p>
              <p className="text-xs text-muted-foreground mb-4">Formatos: JPG, PNG, PDF (máx. 10MB)</p>
              <Input
                id="prescription"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => document.getElementById("prescription")?.click()}
              >
                Seleccionar archivo
              </Button>
            </>
          ) : (
            <div className="flex items-center justify-between bg-muted rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <p className="font-medium text-sm">{formData.prescriptionFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(formData.prescriptionFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={removeFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        {uploadSuccess && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">Receta cargada correctamente</AlertDescription>
          </Alert>
        )}
        {errors.prescriptionFile && <p className="text-sm text-destructive">{errors.prescriptionFile}</p>}
      </div>

      {/* Método de pago */}
      <div className="space-y-2">
        <Label htmlFor="paymentMethod">
          Método de pago <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.paymentMethod}
          onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
        >
          <SelectTrigger className={errors.paymentMethod ? "border-destructive" : ""}>
            <SelectValue placeholder="Selecciona un método de pago" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="efectivo">Efectivo</SelectItem>
            <SelectItem value="tarjeta-debito">Tarjeta de débito</SelectItem>
            <SelectItem value="tarjeta-credito">Tarjeta de crédito</SelectItem>
            <SelectItem value="transferencia">Transferencia bancaria</SelectItem>
          </SelectContent>
        </Select>
        {errors.paymentMethod && <p className="text-sm text-destructive">{errors.paymentMethod}</p>}
      </div>

      {/* Total */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>
            Subtotal ({formData.quantity} unidad{formData.quantity > 1 ? "es" : ""})
          </span>
          <span>${subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Envío</span>
          <span>${deliveryFee.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-2 border-t">
          <span>Total</span>
          <span className="text-primary">${total.toLocaleString()}</span>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 bg-transparent"
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" className="flex-1 bg-primary text-primary-foreground" disabled={isSubmitting}>
          {isSubmitting ? "Procesando..." : "Confirmar Pedido"}
        </Button>
      </div>
    </form>
  )
}
