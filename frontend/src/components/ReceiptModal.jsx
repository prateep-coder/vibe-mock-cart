import React from 'react';
import { X, CheckCircle, Truck, Download } from 'lucide-react';

const ReceiptModal = ({ receipt, isOpen, onClose }) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-success-500" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Order Confirmed!</h2>
                <p className="text-gray-600">Thank you for your purchase</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Save</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-gray-900">Order ID</p>
              <p className="text-gray-600">{receipt.orderId}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Order Date</p>
              <p className="text-gray-600">{formatDate(receipt.timestamp)}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Customer</p>
              <p className="text-gray-600">{receipt.customer.name}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Email</p>
              <p className="text-gray-600">{receipt.customer.email}</p>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Truck className="w-6 h-6 text-primary-600" />
              <div>
                <p className="font-semibold text-primary-900">Estimated Delivery</p>
                <p className="text-primary-700">
                  {formatDate(receipt.estimatedDelivery)}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-3">
              {receipt.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">${receipt.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="text-gray-900">${receipt.shipping.toFixed(2)}</span>
            </div>
            {receipt.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount</span>
                <span className="text-success-600">-${receipt.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span className="text-gray-900">Total</span>
              <span className="text-primary-600">${receipt.finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Continue Shopping
            </button>
            <button
              onClick={handlePrint}
              className="btn-primary flex-1"
            >
              Save Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;