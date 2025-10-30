import React from 'react';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import CartItem from '../components/CartItem';
import LoadingSpinner from '../components/LoadingSpinner';

const Cart = ({ onNavigate }) => {
  const { cart, loading, error } = useCart();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="large" text="Loading cart..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-800 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onNavigate('products')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Products</span>
          </button>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Your Shopping Cart</h2>
      </div>

      {cart.items.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-white rounded-xl p-8 max-w-md mx-auto">
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
            <button
              onClick={() => onNavigate('products')}
              className="btn-primary"
            >
              Start Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({cart.itemCount} items)</span>
                  <span className="text-gray-900">${cart.total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">${cart.shipping.toFixed(2)}</span>
                </div>
                
                {cart.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-success-600">-${cart.discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-primary-600">${cart.finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('checkout')}
                className="btn-primary w-full"
              >
                Proceed to Checkout
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Free shipping on orders over $100
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;