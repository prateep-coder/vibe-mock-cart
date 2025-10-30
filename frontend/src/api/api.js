const API_BASE = '/api';

// Generic API call function
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw new Error(error.message || 'Something went wrong');
  }
}

// Products API
export const productsAPI = {
  getAll: () => apiCall('/products'),
  getById: (id) => apiCall(`/products/${id}`),
  getByCategory: (category) => apiCall(`/products/category/${category}`),
  search: (query) => apiCall(`/products/search/${query}`),
  getCategories: () => apiCall('/products/categories/all'),
};

// Cart API
export const cartAPI = {
  getCart: () => apiCall('/cart'),
  addToCart: (productId, quantity = 1) => 
    apiCall('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    }),
  removeFromCart: (itemId) => 
    apiCall(`/cart/${itemId}`, {
      method: 'DELETE',
    }),
  updateQuantity: (itemId, quantity) =>
    apiCall(`/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),
  clearCart: () =>
    apiCall('/cart/clear/all', {
      method: 'DELETE',
    }),
  checkout: (customerInfo) =>
    apiCall('/cart/checkout', {
      method: 'POST',
      body: JSON.stringify({ customerInfo }),
    }),
};