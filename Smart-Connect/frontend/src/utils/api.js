const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const api = {
  // Storefront endpoints
  getStore: async (slug) => {
    const response = await fetch(`${API_BASE_URL}/store/${slug}`);
    return response.json();
  },
  
  createOrder: async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/api/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return response.json();
  },
  
  // Business endpoints
  registerBusiness: async (businessData) => {
    const response = await fetch(`${API_BASE_URL}/api/business/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(businessData)
    });
    return response.json();
  },
  
  // Product endpoints
  getProducts: async (businessId) => {
    const response = await fetch(`${API_BASE_URL}/api/business/${businessId}/products`);
    return response.json();
  },
  
  addProduct: async (businessId, productData) => {
    const response = await fetch(`${API_BASE_URL}/api/business/${businessId}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    return response.json();
  },
  
  // Order endpoints
  getOrders: async (businessId) => {
    const response = await fetch(`${API_BASE_URL}/api/business/${businessId}/orders`);
    return response.json();
  },
  
  updateOrderStatus: async (orderId, status) => {
    const response = await fetch(`${API_BASE_URL}/api/order/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return response.json();
  }
};