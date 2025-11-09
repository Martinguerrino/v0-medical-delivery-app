import { db } from './lib/database.js';

try {
  db.exec('DROP TABLE IF EXISTS inventory;');
  db.exec(`
    CREATE TABLE inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pharmacyId TEXT NOT NULL,
      medicationId INTEGER NOT NULL,
      precio REAL NOT NULL,
      stock INTEGER NOT NULL,
      lastUpdated TEXT NOT NULL,
      FOREIGN KEY (pharmacyId) REFERENCES users(id),
      FOREIGN KEY (medicationId) REFERENCES medications(id),
      UNIQUE (pharmacyId, medicationId)
    );
  `);
  console.log('Inventory table recreated con pharmacyId apuntando a users');
} catch (error) {
  console.log('Error:', error);
}

db.close();
