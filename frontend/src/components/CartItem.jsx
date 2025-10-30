import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../hooks/useCart';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(item.id, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  return (
    <div className="card p-6 animate-slide-in-right">
      <div className="flex items-center space-x-4">
        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {item.name}
          </h3>
          <p className="text-primary-600 font-bold text-lg">
            ${item.price}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Quantity Controls */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="p-1 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              disabled={item.quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            
            <span className="text-lg font-semibold w-8 text-center">
              {item.quantity}
            </span>
            
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="p-1 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          {/* Total Price */}
          <div className="text-right min-w-20">
            <p className="text-lg font-bold text-gray-900">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
          
          {/* Remove Button */}
          <button
            onClick={handleRemove}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2"
            title="Remove item"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;