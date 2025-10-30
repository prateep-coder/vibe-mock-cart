import React, { useState } from 'react';
import { ShoppingCart, Star, Check } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';

const ProductCard = ({ product }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { showSuccess, showError } = useToast();

  const handleAddToCart = async () => {
    setIsAdding(true);
    const result = await addToCart(product.id);
    
    if (result.success) {
      showSuccess('Product added to cart!');
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } else {
      showError(result.error || 'Failed to add product to cart');
    }
    
    setIsAdding(false);
  };

  const renderRating = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="card-hover group animate-fade-in-up">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-2xl bg-gray-100 relative">
        <img
          src={product.image}
          alt={product.name}
          className="h-48 w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-success-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            In Stock
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
            {product.name}
          </h3>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            {renderRating(product.rating)}
            <span className="text-sm text-gray-500 ml-1">
              {product.rating}
            </span>
          </div>
          <span className="text-xs font-medium px-2 py-1 bg-primary-100 text-primary-700 rounded-full">
            {product.category}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-600">
            ${product.price}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={isAdding || added}
            className={`flex items-center space-x-2 font-semibold py-2 px-4 rounded-lg transition-all duration-200 ${
              added
                ? 'bg-success-500 text-white'
                : 'bg-primary-600 hover:bg-primary-700 text-white'
            } ${isAdding ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isAdding ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Adding...</span>
              </>
            ) : added ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;