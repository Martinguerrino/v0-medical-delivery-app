import { NextRequest, NextResponse } from 'next/server'
import { medicationStatements, inventoryStatements } from '@/lib/database'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid medication ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const {
      name,
      genericName,
      brand,
      category,
      requiresPrescription,
      description,
      dosage,
      presentation,
      activeIngredient,
      laboratory,
      price,
      stock,
      pharmacyId,
    } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    // Check if medication exists
    const existingMed = medicationStatements.getById.get(id)
    if (!existingMed) {
      return NextResponse.json(
        { error: 'Medication not found' },
        { status: 404 }
      )
    }

    // Update medication
    medicationStatements.update.run(
      name,
      genericName || '',
      brand || '',
      category || 'Otros',
      requiresPrescription ? 1 : 0,
      description || '',
      dosage || '',
      presentation || '',
      activeIngredient || '',
      laboratory || '',
      id
    )

    // Update inventory if pharmacyId and price/stock provided
    if (pharmacyId && (price !== undefined || stock !== undefined)) {
      const existingInventory = inventoryStatements.getByPharmacyId.all(pharmacyId)
      const existingItem = existingInventory.find((item: any) => item.medicationId === id)

      if (existingItem) {
        // Update existing inventory item
        inventoryStatements.update.run(
          price !== undefined ? price : (existingItem as any).precio,
          stock !== undefined ? stock : (existingItem as any).stock,
          new Date().toISOString(),
          pharmacyId,
          id
        )
      } else if (price !== undefined && stock !== undefined) {
        // Create new inventory item if doesn't exist
        inventoryStatements.insert.run(
          pharmacyId,
          id,
          price,
          stock,
          new Date().toISOString()
        )
      }
    }

    return NextResponse.json({
      success: true,
      medication: {
        id,
        name,
        genericName,
        brand,
        category,
        requiresPrescription,
        description,
        dosage,
        presentation,
        activeIngredient,
        laboratory,
        price,
        stock,
        inStock: stock > 0,
      }
    })
  } catch (error) {
    console.error('Error updating medication:', error)
    return NextResponse.json(
      { error: 'Error updating medication' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid medication ID' },
        { status: 400 }
      )
    }

    // Check if medication exists
    const existingMed = medicationStatements.getById.get(id)
    if (!existingMed) {
      return NextResponse.json(
        { error: 'Medication not found' },
        { status: 404 }
      )
    }

    // Delete medication
    medicationStatements.delete.run(id)

    return NextResponse.json({
      success: true,
      message: 'Medication deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting medication:', error)
    return NextResponse.json(
      { error: 'Error deleting medication' },
      { status: 500 }
    )
  }
}
