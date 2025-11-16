import Database from 'better-sqlite3';
import path from 'path';
// Initialize database
const dbPath = path.join(process.cwd(), 'database.db');
const db = new Database(dbPath);
// Enable foreign keys
db.pragma('foreign_keys = ON');
// Create tables
db.exec(`
  -- Users table
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    nombre TEXT,
    esMayorDeEdad BOOLEAN,
    phone TEXT,
    address TEXT,
    obraSocial TEXT,
    nombreFarmacia TEXT,
    cuit TEXT,
    direccion TEXT,
  avenida INTEGER,
  calle INTEGER,
    telefono TEXT,
    nombreCompleto TEXT,
    dni TEXT,
    vehiculo TEXT,
    createdAt TEXT NOT NULL
  );

  -- Prescriptions table
  CREATE TABLE IF NOT EXISTS prescriptions (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    fileName TEXT NOT NULL,
    fileSize INTEGER NOT NULL,
    fileType TEXT NOT NULL,
    uploadDate TEXT NOT NULL,
    status TEXT NOT NULL,
    medicamento TEXT,
    rejectionReason TEXT,
    FOREIGN KEY (userId) REFERENCES users(id)
  );

  -- Orders table
  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    orderNumber TEXT UNIQUE NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL,
    pharmacyId TEXT NOT NULL,
    pharmacyName TEXT NOT NULL,
    subtotal REAL NOT NULL,
    deliveryFee REAL NOT NULL,
    insuranceDiscount REAL NOT NULL,
    total REAL NOT NULL,
    deliveryAddress TEXT NOT NULL,
    prescriptionRequired BOOLEAN NOT NULL,
    prescriptionUploaded BOOLEAN NOT NULL,
    prescriptionStatus TEXT NOT NULL,
    prescriptionRejectionReason TEXT,
    estimatedDelivery TEXT NOT NULL,
    actualDelivery TEXT,
    paymentMethod TEXT NOT NULL,
    insuranceUsed TEXT NOT NULL
  );

  -- Order items table
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId TEXT NOT NULL,
    medicationId INTEGER NOT NULL,
    medicationName TEXT NOT NULL,
    brand TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unitPrice REAL NOT NULL,
    totalPrice REAL NOT NULL,
    finalPrice REAL NOT NULL,
    insuranceSavings REAL NOT NULL,
    FOREIGN KEY (orderId) REFERENCES orders(id)
  );

  -- Pharmacies table
  CREATE TABLE IF NOT EXISTS pharmacies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    logo TEXT,
    rating REAL NOT NULL,
    deliveryTime TEXT NOT NULL,
    deliveryFee REAL NOT NULL,
    minOrder REAL NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    isOpen BOOLEAN NOT NULL,
    openHours TEXT NOT NULL,
    isOnGuard BOOLEAN NOT NULL,
    guardSchedule TEXT,
    emergencyPhone TEXT,
    location TEXT NOT NULL,
    services TEXT NOT NULL, -- JSON string
    specialties TEXT NOT NULL, -- JSON string
    paymentMethods TEXT NOT NULL, -- JSON string
    website TEXT,
    email TEXT,
    socialMedia TEXT, -- JSON string
    certifications TEXT NOT NULL, -- JSON string
    establishedYear INTEGER NOT NULL,
    totalReviews INTEGER NOT NULL,
    averageDeliveryTime REAL NOT NULL,
    hasParking BOOLEAN NOT NULL,
    isAccessible BOOLEAN NOT NULL,
    languages TEXT NOT NULL, -- JSON string
    pharmacistName TEXT NOT NULL,
    pharmacistLicense TEXT NOT NULL,
    acceptedInsurance TEXT NOT NULL, -- JSON string
    aggregatedValue REAL NOT NULL,
    Posx INTEGER NOT NULL,
    Posy INTEGER NOT NULL
  );

  -- Medications table
  CREATE TABLE IF NOT EXISTS medications (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    genericName TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    requiresPrescription BOOLEAN NOT NULL,
    description TEXT NOT NULL,
    dosage TEXT NOT NULL,
    presentation TEXT NOT NULL,
    activeIngredient TEXT NOT NULL,
    laboratory TEXT NOT NULL,
    price REAL NOT NULL
  );

  -- Medication prices table
  CREATE TABLE IF NOT EXISTS medication_prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    medicationId INTEGER NOT NULL,
    pharmacyId TEXT NOT NULL,
    price REAL NOT NULL,
    discountedPrice REAL,
    inStock BOOLEAN NOT NULL,
    lastUpdated TEXT NOT NULL,
    FOREIGN KEY (medicationId) REFERENCES medications(id),
    FOREIGN KEY (pharmacyId) REFERENCES pharmacies(id)
  );

  -- Purchase history table
  CREATE TABLE IF NOT EXISTS purchase_history (
    id TEXT PRIMARY KEY,
    medicationName TEXT NOT NULL,
    medicationId TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    pharmacyId TEXT NOT NULL,
    pharmacyName TEXT NOT NULL,
    pharmacyAddress TEXT NOT NULL,
    purchaseDate TEXT NOT NULL,
    status TEXT NOT NULL,
    prescriptionNumber TEXT,
    deliveryMethod TEXT NOT NULL,
    totalAmount REAL NOT NULL,
    userId TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
  );

  -- Insurance table
  CREATE TABLE IF NOT EXISTS insurance (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    logo TEXT NOT NULL,
    coverage REAL NOT NULL,
    copayment REAL NOT NULL,
    description TEXT NOT NULL,
    pharmacyNetwork TEXT NOT NULL -- JSON string
  );

  -- Test users table
  CREATE TABLE IF NOT EXISTS test_users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    lastName TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    obraSocial TEXT NOT NULL,
    numeroAfiliado TEXT NOT NULL,
    birthDate TEXT NOT NULL,
    preferences TEXT NOT NULL, -- JSON string
    orderHistory TEXT NOT NULL -- JSON string
  );
`);
// Alter tables to add new columns if they don't exist
try {
    db.exec(`ALTER TABLE medications ADD COLUMN price REAL NOT NULL DEFAULT 0;`);
}
catch (error) {
    // Column might already exist
}
try {
    db.exec(`ALTER TABLE pharmacies ADD COLUMN aggregatedValue REAL NOT NULL DEFAULT 0;`);
}
catch (error) {
    // Column might already exist
}
try {
    db.exec(`ALTER TABLE pharmacies ADD COLUMN Posx INTEGER NOT NULL DEFAULT 0;`);
}
catch (error) {
    // Column might already exist
}
try {
    db.exec(`ALTER TABLE pharmacies ADD COLUMN Posy INTEGER NOT NULL DEFAULT 0;`);
}
catch (error) {
    // Column might already exist
}
try {
  db.exec(`ALTER TABLE users ADD COLUMN avenida INTEGER;`);
}
catch (error) {
  // Column might already exist
}
try {
  db.exec(`ALTER TABLE users ADD COLUMN calle INTEGER;`);
}
catch (error) {
  // Column might already exist
}
// Prepared statements for users
export const userStatements = {
    insert: db.prepare(`
  INSERT INTO users (id, email, password, role, nombre, esMayorDeEdad, phone, address, obraSocial, nombreFarmacia, cuit, direccion, avenida, calle, telefono, nombreCompleto, dni, vehiculo, createdAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
  getByEmail: db.prepare('SELECT * FROM users WHERE email = ?'),
  getById: db.prepare('SELECT * FROM users WHERE id = ?'),
    getAll: db.prepare('SELECT * FROM users'),
    update: db.prepare(`
    UPDATE users SET
      email = ?, password = ?, role = ?, nombre = ?, esMayorDeEdad = ?, phone = ?, address = ?, obraSocial = ?,
      nombreFarmacia = ?, cuit = ?, direccion = ?, avenida = ?, calle = ?, telefono = ?, nombreCompleto = ?, dni = ?, vehiculo = ?, createdAt = ?
    WHERE id = ?
  `),
    delete: db.prepare('DELETE FROM users WHERE id = ?'),
};
// Prepared statements for prescriptions
export const prescriptionStatements = {
    insert: db.prepare(`
    INSERT INTO prescriptions (id, userId, fileName, fileSize, fileType, uploadDate, status, medicamento, rejectionReason)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
    getByUserId: db.prepare('SELECT * FROM prescriptions WHERE userId = ?'),
    getAll: db.prepare('SELECT * FROM prescriptions'),
    updateStatus: db.prepare('UPDATE prescriptions SET status = ?, rejectionReason = ? WHERE id = ?'),
    delete: db.prepare('DELETE FROM prescriptions WHERE id = ?'),
};
// Prepared statements for orders
export const orderStatements = {
    insert: db.prepare(`
    INSERT INTO orders (id, orderNumber, date, status, pharmacyId, pharmacyName, subtotal, deliveryFee, insuranceDiscount, total, deliveryAddress, prescriptionRequired, prescriptionUploaded, prescriptionStatus, prescriptionRejectionReason, estimatedDelivery, actualDelivery, paymentMethod, insuranceUsed)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
    getAll: db.prepare('SELECT * FROM orders'),
    updateStatus: db.prepare('UPDATE orders SET status = ?, actualDelivery = ? WHERE id = ?'),
    delete: db.prepare('DELETE FROM orders WHERE id = ?'),
};
// Prepared statements for order items
export const orderItemStatements = {
    insert: db.prepare(`
    INSERT INTO order_items (orderId, medicationId, medicationName, brand, quantity, unitPrice, totalPrice, finalPrice, insuranceSavings)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
    getByOrderId: db.prepare('SELECT * FROM order_items WHERE orderId = ?'),
    deleteByOrderId: db.prepare('DELETE FROM order_items WHERE orderId = ?'),
};
// Prepared statements for pharmacies
export const pharmacyStatements = {
    insert: db.prepare(`
    INSERT INTO pharmacies (id, name, logo, rating, deliveryTime, deliveryFee, minOrder, address, phone, isOpen, openHours, isOnGuard, guardSchedule, emergencyPhone, location, services, specialties, paymentMethods, website, email, socialMedia, certifications, establishedYear, totalReviews, averageDeliveryTime, hasParking, isAccessible, languages, pharmacistName, pharmacistLicense, acceptedInsurance, aggregatedValue, Posx, Posy)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
    getAll: db.prepare('SELECT * FROM pharmacies'),
    getById: db.prepare('SELECT * FROM pharmacies WHERE id = ?'),
    getGuardPharmacies: db.prepare('SELECT * FROM pharmacies WHERE isOnGuard = 1'),
    update: db.prepare(`
    UPDATE pharmacies SET
      name = ?, logo = ?, rating = ?, deliveryTime = ?, deliveryFee = ?, minOrder = ?, address = ?, phone = ?, isOpen = ?, openHours = ?, isOnGuard = ?, guardSchedule = ?, emergencyPhone = ?, location = ?, services = ?, specialties = ?, paymentMethods = ?, website = ?, email = ?, socialMedia = ?, certifications = ?, establishedYear = ?, totalReviews = ?, averageDeliveryTime = ?, hasParking = ?, isAccessible = ?, languages = ?, pharmacistName = ?, pharmacistLicense = ?, acceptedInsurance = ?, Posx = ?, Posy = ?
    WHERE id = ?
  `),
    delete: db.prepare('DELETE FROM pharmacies WHERE id = ?'),
};
// Prepared statements for medications
export const medicationStatements = {
    insert: db.prepare(`
    INSERT INTO medications (id, name, genericName, brand, category, requiresPrescription, description, dosage, presentation, activeIngredient, laboratory)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
    getAll: db.prepare('SELECT * FROM medications'),
  getById: db.prepare('SELECT * FROM medications WHERE id = ?'),
    update: db.prepare(`
    UPDATE medications SET
      name = ?, genericName = ?, brand = ?, category = ?, requiresPrescription = ?, description = ?, dosage = ?, presentation = ?, activeIngredient = ?, laboratory = ?
    WHERE id = ?
  `),
    delete: db.prepare('DELETE FROM medications WHERE id = ?'),
};
// Prepared statements for medication prices
export const medicationPriceStatements = {
    insert: db.prepare(`
    INSERT INTO medication_prices (medicationId, pharmacyId, price, discountedPrice, inStock, lastUpdated)
    VALUES (?, ?, ?, ?, ?, ?)
  `),
    getByMedicationId: db.prepare('SELECT * FROM medication_prices WHERE medicationId = ?'),
    getAll: db.prepare('SELECT * FROM medication_prices'),
    update: db.prepare(`
    UPDATE medication_prices SET
      price = ?, discountedPrice = ?, inStock = ?, lastUpdated = ?
    WHERE medicationId = ? AND pharmacyId = ?
  `),
    delete: db.prepare('DELETE FROM medication_prices WHERE medicationId = ? AND pharmacyId = ?'),
};
// Prepared statements for purchase history
export const purchaseHistoryStatements = {
    insert: db.prepare(`
    INSERT INTO purchase_history (id, medicationName, medicationId, quantity, price, pharmacyId, pharmacyName, pharmacyAddress, purchaseDate, status, prescriptionNumber, deliveryMethod, totalAmount, userId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
    getAll: db.prepare('SELECT * FROM purchase_history ORDER BY purchaseDate DESC'),
    getByUserId: db.prepare('SELECT * FROM purchase_history WHERE userId = ? ORDER BY purchaseDate DESC'),
    getByMedicationId: db.prepare('SELECT * FROM purchase_history WHERE medicationId = ?'),
    update: db.prepare(`
    UPDATE purchase_history SET
      medicationName = ?, medicationId = ?, quantity = ?, price = ?, pharmacyId = ?, pharmacyName = ?, pharmacyAddress = ?, purchaseDate = ?, status = ?, prescriptionNumber = ?, deliveryMethod = ?, totalAmount = ?, userId = ?
    WHERE id = ?
  `),
    delete: db.prepare('DELETE FROM purchase_history WHERE id = ?'),
};
// Prepared statements for insurance
export const insuranceStatements = {
    insert: db.prepare(`
    INSERT INTO insurance (id, name, logo, coverage, copayment, description, pharmacyNetwork)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `),
    getAll: db.prepare('SELECT * FROM insurance'),
    getById: db.prepare('SELECT * FROM insurance WHERE id = ?'),
    update: db.prepare(`
    UPDATE insurance SET
      name = ?, logo = ?, coverage = ?, copayment = ?, description = ?, pharmacyNetwork = ?
    WHERE id = ?
  `),
    delete: db.prepare('DELETE FROM insurance WHERE id = ?'),
};
// Prepared statements for test users
export const testUserStatements = {
    insert: db.prepare(`
    INSERT INTO test_users (id, email, password, name, lastName, phone, address, obraSocial, numeroAfiliado, birthDate, preferences, orderHistory)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
    getByEmail: db.prepare('SELECT * FROM test_users WHERE email = ?'),
    getById: db.prepare('SELECT * FROM test_users WHERE id = ?'),
    getAll: db.prepare('SELECT * FROM test_users'),
    update: db.prepare(`
    UPDATE test_users SET
      email = ?, password = ?, name = ?, lastName = ?, phone = ?, address = ?, obraSocial = ?, numeroAfiliado = ?, birthDate = ?, preferences = ?, orderHistory = ?
    WHERE id = ?
  `),
    delete: db.prepare('DELETE FROM test_users WHERE id = ?'),
};
// Migration functions
export const migrateData = () => {
    const { getAllUsers } = require('./data/users-db');
    const { getPrescriptionsByUser } = require('./data/prescriptions-db');
    const { mockOrders } = require('./data/orders');
    const { pharmacies } = require('./data/pharmacies');
    const { medicationsMultiPharmacy } = require('./data/medications-multi-pharmacy');
    const { purchaseHistory } = require('./data/purchase-history');
    const { insuranceOptions } = require('./data/insurance');
    const { testUsers } = require('./data/test-users');
    const usersDatabase = getAllUsers();
    const prescriptionsDatabase = getPrescriptionsByUser('cliente-1'); // Assuming some prescriptions exist
    // Migrate users
    for (const user of usersDatabase) {
        try {
            userStatements.insert.run(user.id, user.email, user.password, user.role, user.nombre || null, user.esMayorDeEdad ? 1 : 0, user.phone || null, user.address || null, user.obraSocial || null, user.nombreFarmacia || null, user.cuit || null, user.direccion || null, user.avenida ?? null, user.calle ?? null, user.telefono || null, user.nombreCompleto || null, user.dni || null, user.vehiculo || null, user.createdAt);
        }
        catch (error) {
            console.log(`User ${user.id} already exists or error:`, error);
        }
    }
    // Migrate prescriptions
    for (const prescription of prescriptionsDatabase) {
        try {
            prescriptionStatements.insert.run(prescription.id, prescription.userId, prescription.fileName, prescription.fileSize, prescription.fileType, prescription.uploadDate, prescription.status, prescription.medicamento || null, prescription.rejectionReason || null);
        }
        catch (error) {
            console.log(`Prescription ${prescription.id} already exists or error:`, error);
        }
    }
    // Migrate orders and order items
    for (const order of mockOrders) {
        try {
            orderStatements.insert.run(order.id, order.orderNumber, order.date instanceof Date ? order.date.toISOString() : order.date, order.status, order.pharmacyId, order.pharmacyName, order.subtotal, order.deliveryFee, order.insuranceDiscount, order.total, order.deliveryAddress, order.prescriptionRequired ? 1 : 0, order.prescriptionUploaded ? 1 : 0, order.prescriptionStatus, order.prescriptionRejectionReason || null, order.estimatedDelivery, order.actualDelivery || null, order.paymentMethod, order.insuranceUsed);
            // Insert order items
            for (const item of order.items) {
                orderItemStatements.insert.run(order.id, item.medicationId, item.medicationName, item.brand, item.quantity, item.unitPrice, item.totalPrice, item.finalPrice, item.insuranceSavings);
            }
        }
        catch (error) {
            console.log(`Order ${order.id} already exists or error:`, error);
        }
    }
    // Migrate pharmacies
    for (const pharmacy of pharmacies) {
        try {
            pharmacyStatements.insert.run(pharmacy.id, pharmacy.name, pharmacy.logo, pharmacy.rating, pharmacy.deliveryTime, pharmacy.deliveryFee, pharmacy.minOrder, pharmacy.address, pharmacy.phone, pharmacy.isOpen ? 1 : 0, pharmacy.openHours, pharmacy.isOnGuard ? 1 : 0, pharmacy.guardSchedule || null, pharmacy.emergencyPhone || null, pharmacy.location, JSON.stringify(pharmacy.services), JSON.stringify(pharmacy.specialties), JSON.stringify(pharmacy.paymentMethods), pharmacy.website || null, pharmacy.email || null, pharmacy.socialMedia ? JSON.stringify(pharmacy.socialMedia) : null, JSON.stringify(pharmacy.certifications), pharmacy.establishedYear, pharmacy.totalReviews, pharmacy.averageDeliveryTime, pharmacy.hasParking ? 1 : 0, pharmacy.isAccessible ? 1 : 0, JSON.stringify(pharmacy.languages), pharmacy.pharmacistName, pharmacy.pharmacistLicense, JSON.stringify(pharmacy.acceptedInsurance), 0, // Posx default
            0 // Posy default
            );
        }
        catch (error) {
            console.log(`Pharmacy ${pharmacy.id} already exists or error:`, error);
        }
    }
    // Migrate medications and prices
    for (const medication of medicationsMultiPharmacy) {
        try {
            medicationStatements.insert.run(medication.id, medication.name, medication.genericName, medication.brand, medication.category, medication.requiresPrescription ? 1 : 0, medication.description, medication.dosage, medication.presentation, medication.activeIngredient, medication.laboratory);
            // Insert prices
            for (const price of medication.prices) {
                medicationPriceStatements.insert.run(medication.id, price.pharmacyId, price.price, price.discountedPrice || null, price.inStock ? 1 : 0, price.lastUpdated);
            }
        }
        catch (error) {
            console.log(`Medication ${medication.id} already exists or error:`, error);
        }
    }
    // Migrate purchase history
    for (const purchase of purchaseHistory) {
        try {
            purchaseHistoryStatements.insert.run(purchase.id, purchase.medicationName, purchase.medicationId, purchase.quantity, purchase.price, purchase.pharmacy.id, purchase.pharmacy.name, purchase.pharmacy.address, purchase.purchaseDate.toISOString(), purchase.status, purchase.prescriptionNumber || null, purchase.deliveryMethod, purchase.totalAmount, 'cliente-1' // Use existing user
            );
        }
        catch (error) {
            console.log(`Purchase ${purchase.id} already exists or error:`, error);
        }
    }
    // Migrate insurance
    for (const insurance of insuranceOptions) {
        try {
            insuranceStatements.insert.run(insurance.id, insurance.name, insurance.logo, insurance.coverage, insurance.copayment, insurance.description, JSON.stringify(insurance.pharmacyNetwork));
        }
        catch (error) {
            console.log(`Insurance ${insurance.id} already exists or error:`, error);
        }
    }
    // Migrate test users
    for (const testUser of testUsers) {
        try {
            testUserStatements.insert.run(testUser.id, testUser.email, testUser.password, testUser.name, testUser.lastName, testUser.phone, testUser.address, testUser.obraSocial, testUser.numeroAfiliado, testUser.birthDate, JSON.stringify(testUser.preferences), JSON.stringify(testUser.orderHistory));
        }
        catch (error) {
            console.log(`Test user ${testUser.id} already exists or error:`, error);
        }
    }
    // Add test users for login
    const testUsersData = [
        {
            id: 'test-client',
            email: 'test@cliente.com',
            password: 'password',
            role: 'cliente',
            nombre: 'Juan Pérez',
            esMayorDeEdad: 1,
            phone: '+5491123456789',
            address: 'Calle Falsa 123, Buenos Aires',
            obraSocial: 'OSDE'
        },
        {
            id: 'test-pharmacy',
            email: 'test@farmacia.com',
            password: 'password',
            role: 'farmacia',
            nombre: 'Farmacia Central',
            esMayorDeEdad: 1,
            phone: '+5491145678901',
            address: 'Av. Rivadavia 1500, Buenos Aires',
            obraSocial: null,
            nombreFarmacia: 'Farmacia Central',
            cuit: '30-12345678-9',
            direccion: 'Av. Rivadavia 1500, Buenos Aires',
            telefono: '+5491145678901'
        },
        {
            id: 'test-delivery',
            email: 'test@repartidor.com',
            password: 'password',
            role: 'repartidor',
            nombre: 'Carlos García',
            esMayorDeEdad: 1,
            phone: '+5491178901234',
            address: 'San Martín 456, Buenos Aires',
            obraSocial: null,
            nombreCompleto: 'Carlos García López',
            dni: '12345678',
            vehiculo: 'Moto Honda CB 300R'
        }
    ];
    for (const user of testUsersData) {
        try {
            userStatements.insert.run(user.id, user.email, user.password, user.role, user.nombre, user.esMayorDeEdad, user.phone, user.address, user.obraSocial, user.nombreFarmacia || null, user.cuit || null, user.direccion || null, user.avenida ?? null, user.calle ?? null, user.telefono || null, user.nombreCompleto || null, user.dni || null, user.vehiculo || null, new Date().toISOString());
        }
        catch (error) {
            console.log(`Test user ${user.id} already exists or error:`, error);
        }
    }
    // Add sample prescription for test user
    try {
        prescriptionStatements.insert.run('REC-TEST-001', 'test-client', 'receta-ibuprofeno.pdf', 1024000, // 1MB
        'application/pdf', new Date().toISOString(), 'validated', 'Ibuprofeno 600mg', null);
    }
    catch (error) {
        console.log('Test prescription already exists or error:', error);
    }
    // Add sample order for test user
    try {
  orderStatements.insert.run('ORD-TEST-001', 'ORD-TEST-001', new Date().toISOString(), 'delivered', 'farmacia-farmacity', 'Farmacity', 1500.00, 200.00, 100.00, 1600.00, 'Calle Falsa 123, Buenos Aires', 1, 1, 'validated', null, new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
        new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
        'efectivo', 'OSDE');
        // Add order item
        orderItemStatements.insert.run('ORD-TEST-001', 1, // medication id
        'Ibuprofeno 600mg', 'Genérico', 2, 750.00, 1500.00, 1350.00, 150.00);
    }
    catch (error) {
        console.log('Test order already exists or error:', error);
    }
    // Add sample purchase history for test user
    try {
  purchaseHistoryStatements.insert.run('PUR-TEST-001', 'Ibuprofeno 600mg', '1', 2, 1500.00, 'farmacia-farmacity', 'Farmacity', 'Av. Corrientes 1234, Buenos Aires', new Date().toISOString(), 'completed', 'REC-TEST-001', 'delivery', 1700.00, 'test-client');
    }
    catch (error) {
        console.log('Test purchase already exists or error:', error);
    }
    console.log('Data migration completed');
};
// Export database instance for direct queries if needed
export { db };
// Close database connection on process exit
process.on('exit', () => db.close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));
