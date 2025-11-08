import { mockOrders } from './lib/data/orders.js';
import { medicationsMultiPharmacy } from './lib/data/medications-multi-pharmacy.js';
import { db, inventoryStatements } from './lib/database.js';

console.log('Starting migration of orders to inventory...');

// Map pharmacy IDs from orders to users format
const pharmacyMap = {
  "farmacity": "farmacia-farmacity",
  "dr-ahorro": "farmacia-dr-ahorro",
  "farmacias-del-dr-simi": "farmacia-farmacias-del-dr-simi",
  "farmahorro": "farmacia-farmahorro"
};

for (const order of mockOrders) {
  console.log(`Processing order ${order.id}...`);

  for (const item of order.items) {
    const medication = medicationsMultiPharmacy.find(m => m.id === item.medicationId);
    if (!medication) {
      console.log(`Medication ${item.medicationId} not found, skipping...`);
      continue;
    }

    const pharmacyId = pharmacyMap[order.pharmacyId];
    if (!pharmacyId) {
      console.log(`Pharmacy ${order.pharmacyId} not mapped, skipping...`);
      continue;
    }

    // Check if inventory record exists
    const existingInventory = db.prepare('SELECT * FROM inventory WHERE pharmacyId = ? AND medicationId = ?').get(pharmacyId, item.medicationId);

    if (existingInventory) {
      // Update existing record
      const newStock = existingInventory.stock - item.quantity;
      const newPrecio = item.unitPrice; // Update price if changed
      const newLastUpdated = order.date;

      inventoryStatements.update.run(
        newPrecio,
        newStock,
        newLastUpdated,
        medication.name,
        medication.genericName,
        medication.brand,
        medication.category,
        medication.requiresPrescription ? 1 : 0,
        medication.description,
        medication.dosage,
        medication.presentation,
        medication.activeIngredient,
        medication.laboratory,
        order.pharmacyName, // farmacia_nombre
        pharmacyId,
        item.medicationId
      );

      console.log(`Updated inventory for medication ${item.medicationId} in pharmacy ${pharmacyId}: stock=${newStock}`);
    } else {
      // Insert new record
      const initialStock = 10 - item.quantity; // Assume default stock of 10
      const precio = item.unitPrice;
      const lastUpdated = order.date;

      try {
        inventoryStatements.insert.run(
          pharmacyId,
          item.medicationId,
          precio,
          initialStock,
          lastUpdated,
          medication.name,
          medication.genericName,
          medication.brand,
          medication.category,
          medication.requiresPrescription ? 1 : 0,
          medication.description,
          medication.dosage,
          medication.presentation,
          medication.activeIngredient,
          medication.laboratory,
          order.pharmacyName
        );
        console.log(`Inserted new inventory record for medication ${item.medicationId} in pharmacy ${pharmacyId}: stock=${initialStock}`);
      } catch (insertError) {
        console.log(`Failed to insert inventory for medication ${item.medicationId} in pharmacy ${pharmacyId}:`, insertError.message);
        console.log(`PharmacyId: ${pharmacyId}, MedicationId: ${item.medicationId}`);
      }

      console.log(`Inserted new inventory record for medication ${item.medicationId} in pharmacy ${pharmacyId}: stock=${initialStock}`);
    }
  }
}

console.log('Migration completed!');
db.close();
