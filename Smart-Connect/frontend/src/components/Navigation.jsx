import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();
  const businessId = localStorage.getItem('businessId');

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">📱</span>
          <span className="logo-text">SmallBizWA</span>
        </Link>

        <div className="nav-menu">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          
          {!businessId ? (
            <Link 
              to="/register" 
              className={`nav-link btn-register ${
                location.pathname === '/register' ? 'active' : ''
              }`}
            >
              Create Store
            </Link>
          ) : (
            <Link 
              to={`/admin/${businessId}`}
              className={`nav-link ${
                location.pathname.includes('/admin') ? 'active' : ''
              }`}
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={() => {}}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;