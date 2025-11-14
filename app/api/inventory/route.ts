import { NextRequest, NextResponse } from 'next/server'
import { inventoryStatements, medicationStatements, pharmacyStatements, userStatements } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const {
      pharmacyId,
      name,
      genericName,
      brand,
      category,
      price,
      stock,
      dosage,
      presentation,
      laboratory,
      description,
      requiresPrescription,
    } = await request.json()
    
    if (!pharmacyId || !name) {
      return NextResponse.json({ error: 'Faltan datos obligatorios (pharmacyId, name).' }, { status: 400 })
    }

    if (requiresPrescription === undefined || requiresPrescription === null || requiresPrescription === '') {
      return NextResponse.json({ error: 'Debe indicar si el medicamento requiere receta médica.' }, { status: 400 })
    }
    
  const pharmacyUser: any = userStatements.getById.get(pharmacyId)
    if (!pharmacyUser || pharmacyUser.role !== 'Farmacia') {
      return NextResponse.json({ error: 'La farmacia indicada no existe.' }, { status: 404 })
    }
    
    if (price === undefined || price === null || stock === undefined || stock === null) {
      return NextResponse.json({ error: 'Debe especificar precio y stock.' }, { status: 400 })
    }

    let pharmacyExists = pharmacyStatements.getById.get(pharmacyId)
    if (!pharmacyExists) {
      const defaultName = pharmacyUser.nombreFarmacia || pharmacyUser.nombre || 'Farmacia'
      pharmacyStatements.insert.run(
        pharmacyId,
        defaultName,
        '/placeholder-ha3vf.png',
        0,
        'Sin información',
        0,
        0,
        pharmacyUser.direccion || pharmacyUser.address || 'Sin dirección registrada',
        pharmacyUser.telefono || pharmacyUser.phone || 'Sin teléfono registrado',
        1,
        '24hs',
        0,
        null,
        null,
        pharmacyUser.address || 'Sin ubicación registrada',
        JSON.stringify(['Servicios no configurados']),
        JSON.stringify([]),
        JSON.stringify(['Efectivo']),
        null,
        pharmacyUser.email || null,
        null,
        JSON.stringify([]),
        new Date().getFullYear(),
        0,
        0,
        0,
        0,
        JSON.stringify(['Español']),
        defaultName,
        'N/A',
        JSON.stringify([]),
        0,
        0,
        0
      )
    }

    // Check if medication already exists for this pharmacy
    const existingMedication = inventoryStatements.getInventoryWithDetails.all(pharmacyId)
      .find((item: any) => item.name.toLowerCase() === name.toLowerCase())

    if (existingMedication) {
      return NextResponse.json({ error: `El medicamento "${name}" ya existe en el inventario de esta farmacia.` }, { status: 400 })
    }

    // Insert medication
    const requiresPrescriptionFlag =
      requiresPrescription === true ||
      requiresPrescription === 1 ||
      requiresPrescription === 'si' ||
      requiresPrescription === 'true'

    const insertResult = medicationStatements.insert.run(
      null,
      name,
      genericName || '',
      brand || '',
      category || 'Otros',
      requiresPrescriptionFlag ? 1 : 0,
      description || '',
      dosage || '',
      presentation || '',
      '', // activeIngredient
      laboratory || '',
      price
    )

    const newMedicationId = insertResult.lastInsertRowid


    inventoryStatements.insert.run(
      pharmacyId,
      newMedicationId,
      price,
      stock,
      new Date().toISOString()
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error adding medication:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      id,
      pharmacyId,
      name,
      genericName,
      brand,
      category,
      requiresPrescription,
      price,
      stock,
      dosage,
      presentation,
      laboratory,
      description,
    } = await request.json()

    if (!id || !pharmacyId) {
      return NextResponse.json({ error: 'Faltan datos obligatorios (id, pharmacyId).' }, { status: 400 })
    }

    if (price === undefined || price === null || stock === undefined || stock === null) {
      return NextResponse.json({ error: 'Debe especificar precio y stock.' }, { status: 400 })
    }

    if (requiresPrescription === undefined || requiresPrescription === null || requiresPrescription === '') {
      return NextResponse.json({ error: 'Debe indicar si el medicamento requiere receta médica.' }, { status: 400 })
    }

    const requiresPrescriptionFlag =
      requiresPrescription === true ||
      requiresPrescription === 1 ||
      requiresPrescription === 'si' ||
      requiresPrescription === 'true'

    // Update medication
    medicationStatements.update.run(
      name,
      genericName || '',
      brand || '',
      category || 'Otros',
      requiresPrescriptionFlag ? 1 : 0,
      description || '',
      dosage || '',
      presentation || '',
      '',
      laboratory || '',
      id
    )

    // Update inventory
    inventoryStatements.update.run(
      price,
      stock,
      new Date().toISOString(),
      pharmacyId,
      id
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating medication:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id, pharmacyId } = await request.json()

    if (!id || !pharmacyId) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos.' }, { status: 400 })
    }

    // Delete from inventory first
    inventoryStatements.delete.run(pharmacyId, id)

    // Delete medication
    medicationStatements.delete.run(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting medication:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
