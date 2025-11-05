const { migrateData } = require('./lib/database');

console.log('Starting data migration...');
migrateData();
console.log('Migration completed!');
