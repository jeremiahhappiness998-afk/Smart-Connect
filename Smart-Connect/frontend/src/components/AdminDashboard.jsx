import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = ({ businessId }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    image_url: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/business/${businessId}/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/business/${businessId}/orders`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/business/${businessId}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });

      if (response.ok) {
        fetchProducts();
        setNewProduct({ name: '', description: '', price: '', image_url: '' });
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await fetch(`http://localhost:5000/api/order/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const getStats = () => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);

    return { totalOrders, pendingOrders, completedOrders, totalRevenue };
  };

  const stats = getStats();

  return (
    <div className="admin-dashboard">
      <h1>Business Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-value">{stats.totalOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p className="stat-value">{stats.pendingOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p className="stat-value">{stats.completedOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Revenue</h3>
          <p className="stat-value">₦{stats.totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button 
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="products-tab">
          <h2>Add New Product</h2>
          <form onSubmit={addProduct} className="product-form">
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              required
            />
            <textarea
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
            />
            <input
              type="number"
              placeholder="Price (₦)"
              value={newProduct.price}
              onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
              required
            />
            <input
              type="url"
              placeholder="Image URL (optional)"
              value={newProduct.image_url}
              onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})}
            />
            <button type="submit">Add Product</button>
          </form>

          <h2>Your Products</h2>
          <div className="products-list">
            {products.map(product => (
              <div key={product.id} className="product-item">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p className="price">₦{product.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="orders-tab">
          <h2>Recent Orders</h2>
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className={`order-item status-${order.status}`}>
                <div className="order-header">
                  <span className="order-id">Order #{order.id}</span>
                  <span className={`order-status ${order.status}`}>{order.status}</span>
                </div>
                <div className="order-details">
                  <p><strong>Product:</strong> {order.product_name}</p>
                  <p><strong>Customer:</strong> {order.customer_name || 'Anonymous'}</p>
                  <p><strong>Quantity:</strong> {order.quantity}</p>
                  <p><strong>Total:</strong> ₦{order.total_amount.toLocaleString()}</p>
                  <p><strong>Message:</strong> {order.order_message}</p>
                  <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
                </div>
                <div className="order-actions">
                  <button 
                    onClick={() => updateOrderStatus(order.id, 'completed')}
                    className="complete-btn"
                  >
                    Mark Completed
                  </button>
                  <button 
                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                    className="cancel-btn"
                  >
                    Cancel Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;