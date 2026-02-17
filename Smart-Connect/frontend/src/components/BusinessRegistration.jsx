import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BUSINESS_CATEGORIES, NIGERIAN_STATES } from '../utils/constants';
import './BusinessRegistration.css';

const BusinessRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    business_name: '',
    description: '',
    whatsapp_number: '',
    category: '',
    address: '',
    state: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validatePhoneNumber = (phone) => {
    // Nigerian phone number validation
    const phoneRegex = /^(?:\+234|234|0)[789][01]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.business_name || !formData.category) {
        setError('Please fill in all required fields');
        return;
      }
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate phone number
    if (!validatePhoneNumber(formData.whatsapp_number)) {
      setError('Please enter a valid Nigerian phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/business/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Store business ID in localStorage for admin access
        localStorage.setItem('businessId', data.business_id);
        localStorage.setItem('storeUrl', data.store_url);
        
        // Redirect to admin dashboard
        navigate(`/admin/${data.business_id}`);
      } else {
        setError(data.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <div className="registration-header">
          <h1>Create Your Free Store</h1>
          <p>Join thousands of Nigerian small businesses selling on WhatsApp</p>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Business Info</span>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Contact Details</span>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="form-step">
              <div className="form-group">
                <label htmlFor="business_name">Business Name *</label>
                <input
                  type="text"
                  id="business_name"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleChange}
                  placeholder="e.g., Mama Put Restaurant"
                  required
                  maxLength="100"
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Business Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  {BUSINESS_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="description">Business Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell customers about your business..."
                  rows="4"
                />
              </div>

              <button type="button" onClick={handleNext} className="btn-next">
                Next Step →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="form-step">
              <div className="form-group">
                <label htmlFor="whatsapp_number">WhatsApp Number *</label>
                <input
                  type="tel"
                  id="whatsapp_number"
                  name="whatsapp_number"
                  value={formData.whatsapp_number}
                  onChange={handleChange}
                  placeholder="e.g., 08031234567"
                  required
                />
                <small className="hint">Enter Nigerian number (e.g., 08031234567)</small>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Business Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="state">State</label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                >
                  <option value="">Select state</option>
                  {NIGERIAN_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleBack} className="btn-back">
                  ← Back
                </button>
                <button 
                  type="submit" 
                  className="btn-submit"
                  disabled={loading}
                >
                  {loading ? 'Creating your store...' : 'Create Store'}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="registration-footer">
          <p>By creating a store, you agree to our Terms of Service</p>
        </div>
      </div>
    </div>
  );
};

export default BusinessRegistration;