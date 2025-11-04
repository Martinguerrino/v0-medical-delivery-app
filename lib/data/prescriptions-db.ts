export interface Prescription {
  id: string
  userId: string
  fileName: string
  fileSize: number
  fileType: string
  uploadDate: string
  status: "pending" | "validated" | "rejected"
  medicamento?: string
  rejectionReason?: string
}

const prescriptionsDatabase: Prescription[] = []

export const uploadPrescription = (
  userId: string,
  file: File,
  medicamento?: string,
): { success: boolean; message: string; prescription?: Prescription } => {
  // Validación 1: Formato de archivo
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"]
  if (!allowedTypes.includes(file.type)) {
    return {
      success: false,
      message: "Formato de archivo inválido. Solo se permiten JPG, PNG o PDF",
    }
  }

  // Validación 2: Tamaño de archivo (10MB máximo)
  const maxSize = 10 * 1024 * 1024 // 10MB en bytes
  if (file.size > maxSize) {
    return {
      success: false,
      message: "El tamaño del archivo excede el límite permitido",
    }
  }

  // Validación 3: Receta repetida
  if (medicamento) {
    const existingPrescription = prescriptionsDatabase.find(
      (p) =>
        p.userId === userId && p.medicamento === medicamento && (p.status === "pending" || p.status === "validated"),
    )

    if (existingPrescription) {
      return {
        success: false,
        message: "Esta receta ya fue cargada anteriormente",
      }
    }
  }

  // Crear nueva receta
  const newPrescription: Prescription = {
    id: `REC-${Date.now()}`,
    userId,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    uploadDate: new Date().toISOString(),
    status: "pending",
    medicamento,
  }

  prescriptionsDatabase.push(newPrescription)

  return {
    success: true,
    message: "Receta cargada y en proceso de validación",
    prescription: newPrescription,
  }
}

export const getPrescriptionsByUser = (userId: string): Prescription[] => {
  return prescriptionsDatabase.filter((p) => p.userId === userId)
}

export const validatePrescription = (prescriptionId: string, isValid: boolean, reason?: string) => {
  const prescription = prescriptionsDatabase.find((p) => p.id === prescriptionId)
  if (prescription) {
    prescription.status = isValid ? "validated" : "rejected"
    if (!isValid && reason) {
      prescription.rejectionReason = reason
    }
  }
}
