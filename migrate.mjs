import { migrateData } from './lib/database.js';

console.log('Starting data migration...');
migrateData();
console.log('Migration completed!');
