"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Camera, FileText, CheckCircle, Clock, AlertTriangle, X } from "lucide-react"
import { uploadPrescription } from "@/lib/data/prescriptions-db"
import { toast } from "@/hooks/use-toast"

interface PrescriptionFile {
  id: string
  file: File
  preview: string
  status: "uploading" | "uploaded" | "validating" | "approved" | "rejected"
  rejectionReason?: string
  medicamento?: string
}

export function PrescriptionUpload() {
  const [files, setFiles] = useState<PrescriptionFile[]>([])
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    dni: "",
    phone: "",
    email: "",
    notes: "",
    medicamento: "",
  })
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [userId, setUserId] = useState<string>("")

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      setUserId(user.id || "guest")
    }
  }, [])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }, [])

  const handleFiles = (fileList: File[]) => {
    if (files.length > 0) {
      toast({
        title: "Error",
        description: "Solo se permite una receta por carga",
        variant: "destructive",
      })
      return
    }

    if (fileList.length > 1) {
      toast({
        title: "Error",
        description: "Solo se permite una receta por carga",
        variant: "destructive",
      })
      return
    }

    const file = fileList[0]

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"]
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Error",
        description: "Formato de archivo inválido. Solo se permiten JPG, PNG o PDF",
        variant: "destructive",
      })
      return
    }

    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      toast({
        title: "Error",
        description: "El tamaño del archivo excede el límite permitido",
        variant: "destructive",
      })
      return
    }

    const id = Math.random().toString(36).substr(2, 9)
    const reader = new FileReader()

    reader.onload = (e) => {
      const newFile: PrescriptionFile = {
        id,
        file,
        preview: e.target?.result as string,
        status: "uploading",
      }

      setFiles([newFile])

      // Simulate upload progress
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setUploadProgress(progress)

        if (progress >= 100) {
          clearInterval(interval)
          setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, status: "uploaded" } : f)))
          setUploadProgress(0)
        }
      }, 200)
    }

    reader.readAsDataURL(file)
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const simulateValidation = (id: string) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, status: "validating" } : f)))

    // Simulate validation process
    setTimeout(() => {
      const isApproved = Math.random() > 0.3 // 70% approval rate for demo
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? {
                ...f,
                status: isApproved ? "approved" : "rejected",
                rejectionReason: !isApproved ? "La receta no es legible o está incompleta" : undefined,
              }
            : f,
        ),
      )
    }, 3000)
  }

  const getStatusBadge = (status: PrescriptionFile["status"]) => {
    switch (status) {
      case "uploading":
        return <Badge variant="secondary">Subiendo...</Badge>
      case "uploaded":
        return <Badge className="bg-accent text-accent-foreground">Subida</Badge>
      case "validating":
        return <Badge className="bg-secondary text-secondary-foreground">Validando...</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Aprobada</Badge>
      case "rejected":
        return <Badge variant="destructive">Rechazada</Badge>
      default:
        return null
    }
  }

  const getStatusIcon = (status: PrescriptionFile["status"]) => {
    switch (status) {
      case "uploading":
        return <Upload className="h-4 w-4 animate-pulse" />
      case "uploaded":
        return <FileText className="h-4 w-4 text-accent-foreground" />
      case "validating":
        return <Clock className="h-4 w-4 text-secondary-foreground animate-pulse" />
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const handleSubmit = async () => {
    if (files.length === 0) {
      toast({
        title: "Error",
        description: "Debes subir una receta médica",
        variant: "destructive",
      })
      return
    }

    if (!patientInfo.name || !patientInfo.dni || !patientInfo.phone) {
      toast({
        title: "Error",
        description: "Completa todos los campos requeridos",
        variant: "destructive",
      })
      return
    }

    const file = files[0].file

    const result = uploadPrescription(userId, file, patientInfo.medicamento)

    if (result.success) {
      toast({
        title: "Éxito",
        description: result.message,
      })

      // Enviar confirmación por email (simulado)
      console.log(`[v0] Confirmación enviada a: ${patientInfo.email || "email del usuario"}`)

      // Limpiar formulario
      setFiles([])
      setPatientInfo({
        name: "",
        dni: "",
        phone: "",
        email: "",
        notes: "",
        medicamento: "",
      })
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Importante:</strong> Solo se permite cargar una receta a la vez. Los formatos aceptados son JPG, PNG o
          PDF con un tamaño máximo de 10MB. La receta debe ser legible y estar completa.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Subir Receta Médica
          </CardTitle>
          <p className="text-muted-foreground">
            Sube una foto clara de tu receta médica. Formatos aceptados: JPG, PNG, PDF (máx. 10MB)
          </p>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="bg-secondary/10 p-4 rounded-full">
                  <Camera className="h-8 w-8 text-secondary" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Arrastra tu receta aquí o haz clic para seleccionar</h3>
                <p className="text-muted-foreground">
                  Solo una receta por carga. Máximo 10MB. Asegúrate de que sea legible.
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => document.getElementById("file-input")?.click()}
                  className="flex items-center gap-2"
                  disabled={files.length > 0}
                >
                  <Upload className="h-4 w-4" />
                  Seleccionar archivo
                </Button>
                <Button variant="secondary" className="flex items-center gap-2" disabled={files.length > 0}>
                  <Camera className="h-4 w-4" />
                  Tomar foto
                </Button>
              </div>

              <input
                id="file-input"
                type="file"
                accept="image/jpeg,image/jpg,image/png,application/pdf"
                className="hidden"
                onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
              />
            </div>
          </div>

          {uploadProgress > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Subiendo archivo...</span>
                <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Receta Subida</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.id} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                  <div className="flex-shrink-0">
                    {file.file.type.startsWith("image/") ? (
                      <img
                        src={file.preview || "/placeholder.svg"}
                        alt="Receta"
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{file.file.name}</h4>
                      <Badge variant="secondary">Listo para enviar</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{(file.file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>

                  <Button variant="ghost" size="sm" onClick={() => setFiles([])}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Información del Paciente</CardTitle>
          <p className="text-muted-foreground">Completa los datos del paciente para procesar la receta</p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="patient-name">Nombre completo *</Label>
              <Input
                id="patient-name"
                value={patientInfo.name}
                onChange={(e) => setPatientInfo((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Nombre del paciente"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="patient-dni">DNI/Cédula *</Label>
              <Input
                id="patient-dni"
                value={patientInfo.dni}
                onChange={(e) => setPatientInfo((prev) => ({ ...prev, dni: e.target.value }))}
                placeholder="Número de identificación"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="patient-phone">Teléfono *</Label>
              <Input
                id="patient-phone"
                value={patientInfo.phone}
                onChange={(e) => setPatientInfo((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="Número de contacto"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="patient-email">Email</Label>
              <Input
                id="patient-email"
                type="email"
                value={patientInfo.email}
                onChange={(e) => setPatientInfo((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Correo electrónico"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicamento">Medicamento (opcional)</Label>
              <Input
                id="medicamento"
                value={patientInfo.medicamento}
                onChange={(e) => setPatientInfo((prev) => ({ ...prev, medicamento: e.target.value }))}
                placeholder="Nombre del medicamento recetado"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="patient-notes">Notas adicionales</Label>
              <Textarea
                id="patient-notes"
                value={patientInfo.notes}
                onChange={(e) => setPatientInfo((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Información adicional sobre el tratamiento o alergias"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => setFiles([])}>
          Cancelar
        </Button>
        <Button
          variant="secondary"
          className="px-8"
          disabled={files.length === 0 || !patientInfo.name || !patientInfo.dni || !patientInfo.phone}
          onClick={handleSubmit}
        >
          Enviar para validación
        </Button>
      </div>
    </div>
  )
}
