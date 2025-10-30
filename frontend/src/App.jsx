import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header.jsx';
import Products from './pages/Products.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import { CartProvider } from './hooks/useCart.jsx';

function App() {
  const [currentPage, setCurrentPage] = useState('products');

  const renderPage = () => {
    switch (currentPage) {
      case 'cart':
        return <Cart onNavigate={setCurrentPage} />;
      case 'checkout':
        return <Checkout onNavigate={setCurrentPage} />;
      default:
        return <Products onNavigate={setCurrentPage} />;
    }
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: 'green',
                secondary: 'black',
              },
            },
          }}
        />
        <Header currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderPage()}
        </main>
      </div>
    </CartProvider>
  );
}

export default App;