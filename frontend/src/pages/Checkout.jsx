import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Shield } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import ReceiptModal from '../components/ReceiptModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { cartAPI } from '../api/api';

const Checkout = ({ onNavigate }) => {
  const { cart, loading: cartLoading, refreshCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [processing, setProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!formData.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) newErrors.cardNumber = 'Valid card number is required';
    if (!formData.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) newErrors.expiryDate = 'Valid expiry date is required';
    if (!formData.cvv.match(/^\d{3,4}$/)) newErrors.cvv = 'Valid CVV is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setProcessing(true);
    try {
      const customerInfo = {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode
      };

      const response = await cartAPI.checkout(customerInfo);
      
      if (response.success) {
        setReceipt(response.data);
        setShowReceipt(true);
        await refreshCart();
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setErrors({ submit: 'Checkout failed. Please try again.' });
    } finally {
      setProcessing(false);
    }
  };

  if (cartLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="large" text="Loading checkout..." />
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white rounded-xl p-8 max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-600 mb-6">Add some items to proceed with checkout</p>
          <button
            onClick={() => onNavigate('products')}
            className="btn-primary"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => onNavigate('cart')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Cart</span>
        </button>
        <h2 className="text-3xl font-bold text-gray-900">Checkout</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="input-field"
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="input-field"
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="input-field"
                  placeholder="Enter your address"
                />
                {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="input-field"
                  placeholder="Enter your city"
                />
                {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  className="input-field"
                  placeholder="ZIP code"
                />
                {errors.zipCode && <p className="text-red-600 text-sm mt-1">{errors.zipCode}</p>}
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="card p-6">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-900">Payment Information</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number *
                </label>
                <input
                  type="text"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                  className="input-field"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
                {errors.cardNumber && <p className="text-red-600 text-sm mt-1">{errors.cardNumber}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date *
                  </label>
                  <input
                    type="text"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    className="input-field"
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                  {errors.expiryDate && <p className="text-red-600 text-sm mt-1">{errors.expiryDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV *
                  </label>
                  <input
                    type="text"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                    className="input-field"
                    placeholder="123"
                    maxLength={4}
                  />
                  {errors.cvv && <p className="text-red-600 text-sm mt-1">{errors.cvv}</p>}
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-center space-x-2 mt-4 p-3 bg-gray-50 rounded-lg">
              <Shield className="w-4 h-4 text-success-500" />
              <p className="text-sm text-gray-600">
                Your payment information is secure and encrypted
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="card p-6 sticky top-24">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h3>
            
            {/* Order Items */}
            <div className="space-y-4 mb-6">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium text-gray-900 text-sm line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
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
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span className="text-gray-900">Total</span>
                <span className="text-primary-600">${cart.finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={processing}
              className="btn-primary w-full mt-6"
            >
              {processing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                `Pay $${cart.finalTotal.toFixed(2)}`
              )}
            </button>

            {errors.submit && (
              <p className="text-red-600 text-sm mt-3 text-center">{errors.submit}</p>
            )}

            <p className="text-xs text-gray-500 text-center mt-4">
              By completing this purchase, you agree to our terms of service
            </p>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {receipt && (
        <ReceiptModal
          receipt={receipt}
          isOpen={showReceipt}
          onClose={() => {
            setShowReceipt(false);
            onNavigate('products');
          }}
        />
      )}
    </div>
  );
};

export default Checkout;