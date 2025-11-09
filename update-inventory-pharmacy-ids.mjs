import { db } from './lib/database.js';

console.log('Actualizando pharmacyId en inventario para usar IDs de usuarios...');

const pharmacyMap = {
  'farmacity': 'farmacia-farmacity',
  'dr-ahorro': 'farmacia-dr-ahorro',
  'farmacias-del-dr-simi': 'farmacia-farmacias-del-dr-simi',
  'farmahorro': 'farmacia-farmahorro'
};

const selectByPharmacy = db.prepare('SELECT id, pharmacyId, medicationId, precio, stock, lastUpdated FROM inventory WHERE pharmacyId = ?');
const selectTarget = db.prepare('SELECT id, precio, stock, lastUpdated FROM inventory WHERE pharmacyId = ? AND medicationId = ?');
const deleteRow = db.prepare('DELETE FROM inventory WHERE id = ?');
const updatePharmacy = db.prepare('UPDATE inventory SET pharmacyId = ?, lastUpdated = ? WHERE id = ?');
const updateMerged = db.prepare('UPDATE inventory SET precio = ?, stock = ?, lastUpdated = ? WHERE id = ?');

const migratePharmacy = db.transaction((oldId, newId) => {
  const rows = selectByPharmacy.all(oldId);
  if (!rows.length) {
    return 0;
  }

  let updated = 0;

  for (const row of rows) {
    const existing = selectTarget.get(newId, row.medicationId);

    if (existing) {
      const mergedStock = existing.stock + row.stock;
      const latestEntry = existing.lastUpdated > row.lastUpdated ? existing : row;
      updateMerged.run(latestEntry.precio, mergedStock, latestEntry.lastUpdated, existing.id);
      deleteRow.run(row.id);
    } else {
      updatePharmacy.run(newId, row.lastUpdated, row.id);
    }

    updated += 1;
  }

  return updated;
});

for (const [oldId, newId] of Object.entries(pharmacyMap)) {
  try {
    const changes = migratePharmacy(oldId, newId);
    if (changes > 0) {
      console.log(`Actualizados ${changes} registros de ${oldId} a ${newId}.`);
    }
  } catch (error) {
    console.error(`Error actualizando ${oldId} a ${newId}:`, error);
  }
}

db.close();
console.log('Actualización de inventario completada.');
