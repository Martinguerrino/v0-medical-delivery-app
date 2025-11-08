import { db } from './lib/database.js';

console.log('Updating orders pharmacy IDs to match users table...');

// Map old pharmacy IDs to new user IDs
const pharmacyMap = {
  "farmacity": "farmacia-farmacity",
  "dr-ahorro": "farmacia-dr-ahorro",
  "farmacias-del-dr-simi": "farmacia-farmacias-del-dr-simi",
  "farmahorro": "farmacia-farmahorro"
};

const updateOrder = db.prepare('UPDATE orders SET pharmacyId = ? WHERE pharmacyId = ?');

for (const [oldId, newId] of Object.entries(pharmacyMap)) {
  const result = updateOrder.run(newId, oldId);
  console.log(`Updated ${result.changes} orders from ${oldId} to ${newId}`);
}

console.log('Orders pharmacy IDs updated!');
db.close();
