const { v4: uuidv4 } = require('uuid');
const { dbQuery } = require('../db/database.js');

class CartItem {
  constructor(id, productId, quantity, addedAt, product = null) {
    this.id = id;
    this.productId = productId;
    this.quantity = quantity;
    this.addedAt = addedAt;
    this.product = product;
  }

  // Get all cart items with product details
  static async findAll() {
    try {
      const cartItems = await dbQuery.all(`
        SELECT ci.*, p.name, p.price, p.image, p.inStock 
        FROM cart_items ci 
        JOIN products p ON ci.productId = p.id
        ORDER BY ci.addedAt DESC
      `);
      
      return cartItems.map(row => new CartItem(
        row.id,
        row.productId,
        row.quantity,
        row.addedAt,
        {
          name: row.name,
          price: row.price,
          image: row.image,
          inStock: row.inStock
        }
      ));
    } catch (error) {
      throw new Error(`Failed to fetch cart items: ${error.message}`);
    }
  }

  // Get cart item by ID
  static async findById(id) {
    try {
      const cartItem = await dbQuery.get(`
        SELECT ci.*, p.name, p.price, p.image, p.inStock 
        FROM cart_items ci 
        JOIN products p ON ci.productId = p.id 
        WHERE ci.id = ?
      `, [id]);
      
      if (!cartItem) {
        return null;
      }

      return new CartItem(
        cartItem.id,
        cartItem.productId,
        cartItem.quantity,
        cartItem.addedAt,
        {
          name: cartItem.name,
          price: cartItem.price,
          image: cartItem.image,
          inStock: cartItem.inStock
        }
      );
    } catch (error) {
      throw new Error(`Failed to fetch cart item: ${error.message}`);
    }
  }

  // Get cart item by product ID
  static async findByProductId(productId) {
    try {
      const cartItem = await dbQuery.get(`
        SELECT ci.*, p.name, p.price, p.image, p.inStock 
        FROM cart_items ci 
        JOIN products p ON ci.productId = p.id 
        WHERE ci.productId = ?
      `, [productId]);
      
      if (!cartItem) {
        return null;
      }

      return new CartItem(
        cartItem.id,
        cartItem.productId,
        cartItem.quantity,
        cartItem.addedAt,
        {
          name: cartItem.name,
          price: cartItem.price,
          image: cartItem.image,
          inStock: cartItem.inStock
        }
      );
    } catch (error) {
      throw new Error(`Failed to fetch cart item by product ID: ${error.message}`);
    }
  }

  // Add item to cart
  static async addToCart(productId, quantity = 1) {
    try {
      // Check if product exists and is in stock
      const product = await dbQuery.get('SELECT * FROM products WHERE id = ? AND inStock = true', [productId]);
      if (!product) {
        throw new Error('Product not found or out of stock');
      }

      // Check if item already in cart
      const existingItem = await CartItem.findByProductId(productId);
      
      if (existingItem) {
        // Update quantity
        const newQuantity = existingItem.quantity + quantity;
        return await CartItem.updateQuantity(existingItem.id, newQuantity);
      } else {
        // Add new item
        const id = uuidv4();
        await dbQuery.run(
          'INSERT INTO cart_items (id, productId, quantity) VALUES (?, ?, ?)',
          [id, productId, quantity]
        );

        return await CartItem.findById(id);
      }
    } catch (error) {
      throw new Error(`Failed to add item to cart: ${error.message}`);
    }
  }

  // Update quantity
  static async updateQuantity(id, quantity) {
    try {
      if (quantity < 1) {
        throw new Error('Quantity must be at least 1');
      }

      const result = await dbQuery.run(
        'UPDATE cart_items SET quantity = ? WHERE id = ?',
        [quantity, id]
      );
      
      if (result.changes === 0) {
        throw new Error('Cart item not found');
      }

      return await CartItem.findById(id);
    } catch (error) {
      throw new Error(`Failed to update quantity: ${error.message}`);
    }
  }

  // Remove item from cart
  static async removeFromCart(id) {
    try {
      const result = await dbQuery.run('DELETE FROM cart_items WHERE id = ?', [id]);
      
      if (result.changes === 0) {
        throw new Error('Cart item not found');
      }

      return { success: true, message: 'Item removed from cart' };
    } catch (error) {
      throw new Error(`Failed to remove item from cart: ${error.message}`);
    }
  }

  // Clear all cart items
  static async clearCart() {
    try {
      await dbQuery.run('DELETE FROM cart_items');
      return { success: true, message: 'Cart cleared successfully' };
    } catch (error) {
      throw new Error(`Failed to clear cart: ${error.message}`);
    }
  }

  // Get cart summary (total, item count, etc.)
  static async getCartSummary() {
    try {
      const cartItems = await CartItem.findAll();
      
      const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      const shipping = itemCount > 0 ? 5.99 : 0;
      const discount = 0;
      const finalTotal = subtotal + shipping - discount;

      return {
        items: cartItems,
        subtotal: parseFloat(subtotal.toFixed(2)),
        itemCount,
        shipping: parseFloat(shipping.toFixed(2)),
        discount: parseFloat(discount.toFixed(2)),
        finalTotal: parseFloat(finalTotal.toFixed(2))
      };
    } catch (error) {
      throw new Error(`Failed to get cart summary: ${error.message}`);
    }
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      productId: this.productId,
      quantity: this.quantity,
      addedAt: this.addedAt,
      ...(this.product && {
        name: this.product.name,
        price: this.product.price,
        image: this.product.image,
        inStock: this.product.inStock
      })
    };
  }
}

module.exports = { CartItem };