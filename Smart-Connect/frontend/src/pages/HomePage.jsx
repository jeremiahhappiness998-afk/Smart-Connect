import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Sell on WhatsApp, the Easy Way</h1>
          <p className="hero-subtitle">
            Create your free online store in minutes. Perfect for food vendors, 
            tailors, and small shops in Nigeria.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">
              Create Your Store
            </Link>
            <a href="#how-it-works" className="btn btn-secondary">
              How It Works
            </a>
          </div>
        </div>
        <div className="hero-image">
          <img src="/images/hero-illustration.svg" alt="WhatsApp Store" />
        </div>
      </section>

      <section id="how-it-works" className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Create Your Store</h3>
            <p>Sign up for free and add your business details and products</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Share Your Link</h3>
            <p>Get a unique link to share with customers on WhatsApp</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Start Selling</h3>
            <p>Customers click to order and messages come straight to your WhatsApp</p>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Perfect for Small Businesses</h2>
        <div className="features-grid">
          <div className="feature">
            <span className="feature-icon">📱</span>
            <h3>Works on Any Phone</h3>
            <p>No app needed - works on basic smartphones</p>
          </div>
          <div className="feature">
            <span className="feature-icon">💬</span>
            <h3>WhatsApp Integration</h3>
            <p>Orders come directly to your WhatsApp</p>
          </div>
          <div className="feature">
            <span className="feature-icon">📊</span>
            <h3>Simple Dashboard</h3>
            <p>Track all your orders in one place</p>
          </div>
          <div className="feature">
            <span className="feature-icon">💰</span>
            <h3>100% Free</h3>
            <p>No hidden fees, no commissions</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to start selling?</h2>
        <p>Join thousands of Nigerian small businesses already using our platform</p>
        <Link to="/register" className="btn btn-primary btn-large">
          Create Your Free Store Now
        </Link>
      </section>
    </div>
  );
};

export default HomePage;