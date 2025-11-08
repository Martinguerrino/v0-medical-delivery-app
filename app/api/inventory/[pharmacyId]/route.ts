import { NextRequest, NextResponse } from 'next/server'
import { inventoryStatements } from '@/lib/database'

export async function GET(request: NextRequest, { params }: { params: { pharmacyId: string } }) {
  try {
    const { pharmacyId } = params

    const inventoryItems = inventoryStatements.getInventoryWithDetails.all(pharmacyId)
    const medications = inventoryItems.map((item: any) => ({
      ...item,
      id: item.medicationId,
      price: item.precio,
      inStock: item.stock > 0,
    }))

    return NextResponse.json(medications)
  } catch (error) {
    console.error('Error fetching medications:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
