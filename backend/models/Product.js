const { dbQuery } = require('../db/database.js');

class Product {
  constructor(id, name, price, description, image, category, rating, inStock = true) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.description = description;
    this.image = image;
    this.category = category;
    this.rating = rating;
    this.inStock = inStock;
  }

  // Get all products
  static async findAll() {
    try {
      const products = await dbQuery.all('SELECT * FROM products WHERE inStock = true ORDER BY name');
      return products.map(row => new Product(
        row.id,
        row.name,
        row.price,
        row.description,
        row.image,
        row.category,
        row.rating,
        row.inStock
      ));
    } catch (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
  }

  // Get product by ID
  static async findById(id) {
    try {
      const product = await dbQuery.get('SELECT * FROM products WHERE id = ?', [id]);
      
      if (!product) {
        return null;
      }

      return new Product(
        product.id,
        product.name,
        product.price,
        product.description,
        product.image,
        product.category,
        product.rating,
        product.inStock
      );
    } catch (error) {
      throw new Error(`Failed to fetch product: ${error.message}`);
    }
  }

  // Get products by category
  static async findByCategory(category) {
    try {
      const products = await dbQuery.all(
        'SELECT * FROM products WHERE category = ? AND inStock = true ORDER BY name', 
        [category]
      );
      
      return products.map(row => new Product(
        row.id,
        row.name,
        row.price,
        row.description,
        row.image,
        row.category,
        row.rating,
        row.inStock
      ));
    } catch (error) {
      throw new Error(`Failed to fetch products by category: ${error.message}`);
    }
  }

  // Search products
  static async search(query) {
    try {
      const products = await dbQuery.all(
        `SELECT * FROM products 
         WHERE (name LIKE ? OR description LIKE ?) AND inStock = true 
         ORDER BY name`,
        [`%${query}%`, `%${query}%`]
      );
      
      return products.map(row => new Product(
        row.id,
        row.name,
        row.price,
        row.description,
        row.image,
        row.category,
        row.rating,
        row.inStock
      ));
    } catch (error) {
      throw new Error(`Failed to search products: ${error.message}`);
    }
  }

  // Create new product
  static async create(productData) {
    try {
      const { id, name, price, description, image, category, rating, inStock } = productData;
      
      await dbQuery.run(
        `INSERT INTO products (id, name, price, description, image, category, rating, inStock) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, name, price, description, image, category, rating, inStock]
      );

      return new Product(id, name, price, description, image, category, rating, inStock);
    } catch (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }
  }

  // Get all categories
  static async getCategories() {
    try {
      const categories = await dbQuery.all(
        'SELECT DISTINCT category FROM products WHERE inStock = true ORDER BY category'
      );
      return categories.map(row => row.category);
    } catch (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      description: this.description,
      image: this.image,
      category: this.category,
      rating: this.rating,
      inStock: this.inStock
    };
  }
}

module.exports = { Product };