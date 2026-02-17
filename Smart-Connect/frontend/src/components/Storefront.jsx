import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Storefront.css';

const Storefront = () => {
  const { slug } = useParams();
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderForm, setOrderForm] = useState({
    quantity: 1,
    customer_name: '',
    customer_phone: '',
    message: ''
  });

  useEffect(() => {
    fetchStore();
  }, [slug]);

  const fetchStore = async () => {
    try {
      const response = await fetch(`http://localhost:5000/store/${slug}`);
      const data = await response.json();
      setBusiness(data.business);
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching store:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async (product) => {
    setSelectedProduct(product);
    // Show order modal or form
    document.getElementById('orderModal').style.display = 'block';
  };

  const submitOrder = async () => {
    const orderData = {
      business_id: business.id,
      product_id: selectedProduct.id,
      product_name: selectedProduct.name,
      quantity: orderForm.quantity,
      total_amount: selectedProduct.price * orderForm.quantity,
      customer_name: orderForm.customer_name,
      customer_phone: orderForm.customer_phone,
      order_message: orderForm.message
    };

    try {
      const response = await fetch('http://localhost:5000/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      
      // Redirect to WhatsApp
      window.open(data.whatsapp_url, '_blank');
      
      // Close modal
      document.getElementById('orderModal').style.display = 'none';
      
      // Reset form
      setOrderForm({ quantity: 1, customer_name: '', customer_phone: '', message: '' });
      
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="storefront">
      <header className="store-header">
        <h1>{business?.name}</h1>
        <p className="description">{business?.description}</p>
        <p className="whatsapp">WhatsApp: {business?.whatsapp}</p>
      </header>

      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            {product.image && (
              <img src={product.image} alt={product.name} className="product-image" />
            )}
            <h3>{product.name}</h3>
            <p className="description">{product.description}</p>
            <p className="price">₦{product.price.toLocaleString()}</p>
            <button 
              className="order-btn"
              onClick={() => handleOrder(product)}
            >
              Order on WhatsApp
            </button>
          </div>
        ))}
      </div>

      {/* Order Modal */}
      <div id="orderModal" className="modal">
        <div className="modal-content">
          <span className="close" onClick={() => document.getElementById('orderModal').style.display = 'none'}>&times;</span>
          <h2>Order {selectedProduct?.name}</h2>
          
          <form onSubmit={(e) => { e.preventDefault(); submitOrder(); }}>
            <div className="form-group">
              <label>Your Name:</label>
              <input
                type="text"
                value={orderForm.customer_name}
                onChange={(e) => setOrderForm({...orderForm, customer_name: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Your Phone Number:</label>
              <input
                type="tel"
                value={orderForm.customer_phone}
                onChange={(e) => setOrderForm({...orderForm, customer_phone: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Quantity:</label>
              <input
                type="number"
                min="1"
                value={orderForm.quantity}
                onChange={(e) => setOrderForm({...orderForm, quantity: parseInt(e.target.value)})}
                required
              />
            </div>

            <div className="form-group">
              <label>Additional Message (optional):</label>
              <textarea
                value={orderForm.message}
                onChange={(e) => setOrderForm({...orderForm, message: e.target.value})}
                placeholder="E.g., I want it delivered by 5pm"
              />
            </div>

            <p className="total">Total: ₦{(selectedProduct?.price * orderForm.quantity).toLocaleString()}</p>

            <button type="submit" className="submit-order-btn">
              Send Order via WhatsApp
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Storefront;