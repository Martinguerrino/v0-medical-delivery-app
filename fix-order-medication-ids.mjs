import { db } from './lib/database.js';

console.log('Fixing order medication IDs to match medications table...');

// Map medication names to IDs based on the medications table
const medicationMap = {
  "Amoxicilina 500mg": 1,
  "Losartán 50mg": 2,
  "Metformina 850mg": 3,
  "Omeprazol 20mg": 4,
  "Ibuprofeno 400mg": 5,
  "Paracetamol 500mg": 6,
  "Aspirina 100mg": 7,
  "Atorvastatina 20mg": 8
};

const updateOrderItem = db.prepare('UPDATE order_items SET medicationId = ? WHERE medicationName = ?');

for (const [name, id] of Object.entries(medicationMap)) {
  const result = updateOrderItem.run(id, name);
  console.log(`Updated ${result.changes} order items for ${name} to ID ${id}`);
}

// Special case for the test order that has "Ibuprofeno 600mg" but should be "Ibuprofeno 400mg"
const result = updateOrderItem.run(5, "Ibuprofeno 600mg");
console.log(`Updated ${result.changes} order items for Ibuprofeno 600mg to ID 5`);

console.log('Order medication IDs fixed!');
db.close();
