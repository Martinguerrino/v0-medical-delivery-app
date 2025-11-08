import { db } from './lib/database.js';

try {
  db.exec('DROP TABLE IF EXISTS inventory;');
  db.exec(`
    CREATE TABLE inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pharmacyId TEXT NOT NULL,
      medicationId INTEGER,
      precio REAL NOT NULL,
      stock INTEGER NOT NULL,
      lastUpdated TEXT NOT NULL,
      name TEXT NOT NULL,
      genericName TEXT,
      brand TEXT,
      category TEXT,
      requiresPrescription INTEGER,
      description TEXT,
      dosage TEXT,
      presentation TEXT,
      activeIngredient TEXT,
      laboratory TEXT,
      farmacia_nombre TEXT,
      FOREIGN KEY (pharmacyId) REFERENCES users(id)
    );
  `);
  console.log('Inventory table recreated without medicationId foreign key');
} catch (error) {
  console.log('Error:', error);
}

db.close();
