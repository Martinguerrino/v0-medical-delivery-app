import { db } from './lib/database.js';

console.log('Checking medications in database...');

const medications = db.prepare('SELECT * FROM medications').all();
console.log(`Found ${medications.length} medications:`);
medications.forEach(med => {
  console.log(`- ID: ${med.id}, Name: ${med.name}`);
});

console.log('\nChecking order items...');
const orderItems = db.prepare('SELECT * FROM order_items').all();
console.log(`Found ${orderItems.length} order items:`);
orderItems.forEach(item => {
  console.log(`- Order: ${item.orderId}, Medication ID: ${item.medicationId}, Name: ${item.medicationName}`);
});

db.close();
