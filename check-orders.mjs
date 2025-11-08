import { db, orderStatements } from './lib/database.ts';

console.log('Checking orders in database...');

const orders = orderStatements.getAll.all();
console.log(`Found ${orders.length} orders:`);
orders.forEach(order => {
  console.log(`- ${order.id}: ${order.orderNumber} - ${order.status}`);
});

db.close();
