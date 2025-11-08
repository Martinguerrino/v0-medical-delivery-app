import { migrateData } from './lib/database.ts';

console.log('Starting data migration...');
migrateData();
console.log('Migration completed!');
