import { db, inventoryStatements } from './lib/database.ts';

console.log('Checking inventory in database...');

const inventory = inventoryStatements.getAll.all();
console.log(`Found ${inventory.length} inventory records:`);
inventory.forEach(item => {
  console.log(`- Pharmacy: ${item.farmacia_nombre || item.pharmacyId}, Medication: ${item.name} (${item.medicationId}), Stock: ${item.stock}, Price: ${item.precio}`);
});

db.close();
