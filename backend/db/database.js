const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

let db;

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    try {
      // Create database directory if it doesn't exist
      const dbDir = path.join(__dirname, '..', 'database');
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
        console.log('✅ Created database directory');
      }

      // Database file path
      const dbPath = path.join(dbDir, 'ecommerce.db');
      console.log(`📁 Database path: ${dbPath}`);

      // Create database connection
      db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('❌ Error opening database:', err);
          reject(err);
        } else {
          console.log('✅ Connected to SQLite database');
          createTables().then(resolve).catch(reject);
        }
      });
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      reject(error);
    }
  });
}

function createTables() {
  return new Promise((resolve, reject) => {
    // Create products table
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT,
        image TEXT,
        category TEXT,
        rating REAL,
        inStock BOOLEAN DEFAULT true
      )
    `, (err) => {
      if (err) {
        console.error('❌ Error creating products table:', err);
        reject(err);
        return;
      }
      
      // Create cart_items table
      db.run(`
        CREATE TABLE IF NOT EXISTS cart_items (
          id TEXT PRIMARY KEY,
          productId TEXT NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 1,
          addedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (productId) REFERENCES products (id)
        )
      `, async (err) => {
        if (err) {
          console.error('❌ Error creating cart_items table:', err);
          reject(err);
          return;
        }
        
        console.log('✅ Database tables created successfully');
        await seedProducts();
        resolve();
      });
    });
  });
}

async function seedProducts() {
  return new Promise((resolve, reject) => {
    // Check if products already exist
    db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
      if (err) {
        console.error('❌ Error checking products:', err);
        reject(err);
        return;
      }

      if (row.count === 0) {
        console.log('🌱 Seeding products...');
        const products = [
          {
            id: '1',
            name: 'Wireless Bluetooth Headphones',
            price: 99.99,
            description: 'High-quality wireless headphones with active noise cancellation and 30-hour battery life.',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
            category: 'Electronics',
            rating: 4.5
          },
          {
            id: '2',
            name: 'Smart Watch Pro',
            price: 199.99,
            description: 'Advanced smartwatch with health monitoring, GPS, and water resistance.',
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
            category: 'Electronics',
            rating: 4.3
          },
          {
            id: '3',
            name: 'Laptop Backpack',
            price: 49.99,
            description: 'Durable laptop backpack with USB charging port and water-resistant material.',
            image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
            category: 'Accessories',
            rating: 4.7
          },
          {
            id: '4',
            name: 'Mechanical Keyboard',
            price: 79.99,
            description: 'RGB mechanical keyboard with blue switches and customizable backlighting.',
            image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop',
            category: 'Electronics',
            rating: 4.4
          },
          {
            id: '5',
            name: 'Gaming Mouse',
            price: 39.99,
            description: 'High-precision gaming mouse with RGB lighting and programmable buttons.',
            image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop',
            category: 'Electronics',
            rating: 4.2
          },
          {
            id: '6',
            name: 'Wireless Earbuds',
            price: 69.99,
            description: 'True wireless earbuds with charging case and 24-hour battery life.',
            image: 'https://images.unsplash.com/photo-1590658165737-15a047b8b5e1?w=500&h=500&fit=crop',
            category: 'Electronics',
            rating: 4.6
          },
          {
            id: '7',
            name: 'Phone Case',
            price: 19.99,
            description: 'Protective phone case with shock absorption and sleek design.',
            image: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=500&h=500&fit=crop',
            category: 'Accessories',
            rating: 4.1
          },
          {
            id: '8',
            name: 'Tablet Stand',
            price: 29.99,
            description: 'Adjustable tablet stand for comfortable viewing angles.',
            image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&h=500&fit=crop',
            category: 'Accessories',
            rating: 4.0
          }
        ];

        let inserted = 0;
        const totalProducts = products.length;
        
        if (totalProducts === 0) {
          resolve();
          return;
        }

        products.forEach(product => {
          db.run(
            `INSERT INTO products (id, name, price, description, image, category, rating, inStock) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [product.id, product.name, product.price, product.description, product.image, product.category, product.rating, true],
            (err) => {
              if (err) {
                console.error('❌ Error seeding product:', err);
                reject(err);
                return;
              } else {
                inserted++;
                if (inserted === totalProducts) {
                  console.log(`✅ ${inserted} products seeded successfully`);
                  resolve();
                }
              }
            }
          );
        });
      } else {
        console.log('✅ Products already seeded');
        resolve();
      }
    });
  });
}

// Database query methods
const dbQuery = {
  // Run a query that doesn't return data (INSERT, UPDATE, DELETE)
  run: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes, lastID: this.lastID });
        }
      });
    });
  },

  // Get a single row
  get: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  // Get all rows
  all: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
};

function getDb() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

module.exports = {
  initializeDatabase,
  dbQuery,
  getDb
};