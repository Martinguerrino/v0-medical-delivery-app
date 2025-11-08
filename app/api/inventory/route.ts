import { NextRequest, NextResponse } from 'next/server'
import { inventoryStatements, medicationStatements, pharmacyStatements } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { pharmacyId, name, genericName, brand, category, price, stock, dosage, presentation, laboratory, description } = await request.json()

    // Check if medication already exists for this pharmacy
    const existingMedication = inventoryStatements.getInventoryWithDetails.all(pharmacyId)
      .find((item: any) => item.name.toLowerCase() === name.toLowerCase())

    if (existingMedication) {
      return NextResponse.json({ error: `El medicamento "${name}" ya existe en el inventario de esta farmacia.` }, { status: 400 })
    }

    // Insert medication
    const insertResult = medicationStatements.insert.run(
      null,
      name,
      genericName || '',
      brand || '',
      category || 'Otros',
      0, // requiresPrescription
      description || '',
      dosage || '',
      presentation || '',
      '', // activeIngredient
      laboratory || '',
      price
    )

    const newMedicationId = insertResult.lastInsertRowid

    // Add to inventory - ensure pharmacy exists first
    let pharmacyExists = pharmacyStatements.getById.get(pharmacyId)
    if (!pharmacyExists) {
      // Create the pharmacy if it doesn't exist
      pharmacyStatements.insert.run(
        pharmacyId,
        'Farmacity Test',
        '/placeholder-ha3vf.png',
        4.5,
        '30-45 min',
        350,
        1500,
        'Av. Santa Fe 1234, CABA',
        '0800-333-2762',
        1, // isOpen
        '24hs',
        1, // isOnGuard
        '24hs todos los días',
        '0800-333-2762',
        'Palermo, CABA',
        '["Delivery 24hs", "Vacunación", "Control de presión", "Inyectables", "Test COVID-19", "Perfumería"]',
        '["Medicamentos oncológicos", "Nutrición deportiva", "Dermocosmética", "Productos naturales"]',
        '["Efectivo", "Débito", "Crédito", "Mercado Pago", "Transferencia", "Cheques"]',
        'https://www.farmacity.com',
        'info@farmacity.com',
        null,
        '["ISO 9001", "Buenas Prácticas de Farmacia", "ANMAT"]',
        1997,
        15420,
        37,
        1, // hasParking
        1, // isAccessible
        '["Español", "Inglés"]',
        'Dra. María González',
        'MP 12345',
        '["OSDE", "Swiss Medical", "Galeno", "Medicus", "IOMA"]',
        0, // Posx
        0  // Posy
      )
    }

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
    const { id, pharmacyId, name, genericName, brand, category, price, stock, dosage, presentation, laboratory, description } = await request.json()

    // Update medication
    medicationStatements.update.run(
      name,
      genericName || '',
      brand || '',
      category || 'Otros',
      0,
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
    const { id } = await request.json()

    // Delete from inventory first
    inventoryStatements.delete.run('farmacity', id) // Assuming pharmacyId

    // Delete medication
    medicationStatements.delete.run(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting medication:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
