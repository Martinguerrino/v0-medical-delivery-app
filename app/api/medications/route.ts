import { NextRequest, NextResponse } from 'next/server'
import { medicationStatements, medicationPriceStatements } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pharmacyId = searchParams.get('pharmacyId')

    if (pharmacyId) {
      // Get medications available in this pharmacy
      const pharmacyMeds = medicationPriceStatements.getAll.all()
        .filter((price: any) => price.pharmacyId === pharmacyId)
        .map((price: any) => {
          const medication = medicationStatements.getById.get(price.medicationId)
          if (medication) {
            return {
              ...medication,
              price: price.price,
              discountedPrice: price.discountedPrice,
              inStock: price.inStock,
              stock: price.inStock ? 10 : 0, // Simulate stock
              pharmacyPriceId: price.id,
            }
          }
          return null
        })
        .filter((med: any) => med !== null)
      return NextResponse.json(pharmacyMeds)
    } else {
      // Get all medications (for admin/general view)
      const medications = medicationStatements.getAll.all()
      const medicationsWithStock = medications.map((med: any) => ({
        ...med,
        stock: Math.floor(Math.random() * 100) + 1, // Random stock for demo
        inStock: Math.random() > 0.1, // 90% chance of being in stock
      }))
      return NextResponse.json(medicationsWithStock)
    }
  } catch (error) {
    console.error('Error fetching medications:', error)
    return NextResponse.json(
      { error: 'Error fetching medications' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      // For adding new medication to catalog
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
      discountedPrice,
      inStock,
      pharmacyId,
      // For adding existing medication to pharmacy inventory
      medicationId,
    } = body

    // If medicationId is provided, add existing medication to pharmacy inventory
    if (medicationId) {
      // Validate required fields
      if (!pharmacyId || price === undefined) {
        return NextResponse.json(
          { error: 'Missing required fields: pharmacyId, price' },
          { status: 400 }
        )
      }

      // Check if medication exists
      const medication = medicationStatements.getById.get(medicationId)
      if (!medication) {
        return NextResponse.json(
          { error: 'Medication not found' },
          { status: 404 }
        )
      }

      // Check if price already exists for this pharmacy
      const existingPrices = medicationPriceStatements.getByMedicationId.all(medicationId)
      const existingPrice = existingPrices.find((price: any) => price.pharmacyId === pharmacyId)

      if (existingPrice) {
        return NextResponse.json(
          { error: 'Medication already exists in this pharmacy inventory' },
          { status: 400 }
        )
      }

      // Insert medication price for this pharmacy
      medicationPriceStatements.insert.run(
        medicationId,
        pharmacyId,
        price,
        discountedPrice || null,
        inStock !== undefined ? inStock : true,
        new Date().toISOString()
      )

      return NextResponse.json({
        success: true,
        message: 'Medication added to pharmacy inventory',
        medication: {
          ...medication,
          price,
          discountedPrice,
          inStock: inStock !== undefined ? inStock : true,
        }
      })
    }

    // If no medicationId, create new medication and add to pharmacy inventory
    if (!name || !price || !pharmacyId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, price, pharmacyId' },
        { status: 400 }
      )
    }

    // Generate new ID (simple increment)
    const existingMeds = medicationStatements.getAll.all()
    const newId = existingMeds.length > 0 ? Math.max(...existingMeds.map((m: any) => m.id)) + 1 : 1

    // Insert medication
    medicationStatements.insert.run(
      newId,
      name,
      genericName || '',
      brand || '',
      category || 'Otros',
      requiresPrescription ? 1 : 0,
      description || '',
      dosage || '',
      presentation || '',
      activeIngredient || '',
      laboratory || ''
    )

    // Add to pharmacy inventory
    medicationPriceStatements.insert.run(
      newId,
      pharmacyId,
      price,
      discountedPrice || null,
      inStock !== undefined ? inStock : true,
      new Date().toISOString()
    )

    return NextResponse.json({
      success: true,
      message: 'Medication created and added to pharmacy inventory',
      medication: {
        id: newId,
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
        discountedPrice,
        inStock: inStock !== undefined ? inStock : true,
      }
    })
  } catch (error) {
    console.error('Error creating medication:', error)
    return NextResponse.json(
      { error: 'Error creating medication' },
      { status: 500 }
    )
  }
}
