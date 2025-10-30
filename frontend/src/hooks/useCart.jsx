import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../api/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], total: 0, itemCount: 0, shipping: 0, finalTotal: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      if (response.success) {
        setCart(response.data);
      }
    } catch (err) {
      setError('Failed to fetch cart');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      const response = await cartAPI.addToCart(productId, quantity);
      if (response.success) {
        await fetchCart();
        return { success: true };
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to add item to cart';
      setError(errorMsg);
      console.error('Error adding to cart:', err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);
      const response = await cartAPI.removeFromCart(itemId);
      if (response.success) {
        await fetchCart();
      }
    } catch (err) {
      setError('Failed to remove item from cart');
      console.error('Error removing from cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      setLoading(true);
      const response = await cartAPI.updateQuantity(itemId, quantity);
      if (response.success) {
        await fetchCart();
      }
    } catch (err) {
      setError('Failed to update quantity');
      console.error('Error updating quantity:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.clearCart();
      if (response.success) {
        await fetchCart();
      }
    } catch (err) {
      setError('Failed to clear cart');
      console.error('Error clearing cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const value = {
    cart,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart: fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};