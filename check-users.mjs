import { db } from './lib/database.js';

console.log('Checking users in database...');

const users = db.prepare('SELECT id, email, role, nombreFarmacia FROM users WHERE role = ?').all('Farmacia');
console.log(`Found ${users.length} pharmacy users:`);
users.forEach(user => {
  console.log(`- ID: ${user.id}, Email: ${user.email}, Pharmacy: ${user.nombreFarmacia}`);
});

db.close();
