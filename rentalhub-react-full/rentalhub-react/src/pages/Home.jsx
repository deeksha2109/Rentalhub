import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="hero-badge">Premium Car Rental Service</span>
          <h1>Experience The Ultimate Drive</h1>
          <p>
            Choose from our premium fleet of luxury sedans, rugged SUVs, and high-performance sports cars. 
            Exceptional service, instant booking, and transparent pricing.
          </p>
          <button className="hero-btn" onClick={() => navigate('/fleet')}>
            Explore Our Fleet <span className="btn-icon">→</span>
          </button>
        </div>
      </div>

      {/* Services Section */}
      <div className="services-section container">
        <h2 className="section-title">Why Choose RentalHub?</h2>
        <p className="section-subtitle">We deliver premium standards for all your travel requirements</p>

        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">💎</div>
            <h3>Luxury Fleet</h3>
            <p>Indulge in top-tier comfort and styling with vehicles from elite automotive brands.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">⚡</div>
            <h3>24/7 Road Support</h3>
            <p>Our dedicated support desk and road assistance are ready to serve you anywhere, anytime.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🏷️</div>
            <h3>Affordable Pricing</h3>
            <p>Premium travel packages custom tailored to your budget with no hidden costs.</p>
          </div>
        </div>
      </div>

      {/* Testimonial Banner */}
      <div className="stats-banner">
        <div className="stat-item">
          <h2>10k+</h2>
          <p>Happy Rides</p>
        </div>
        <div className="stat-item">
          <h2>50+</h2>
          <p>Luxury Models</p>
        </div>
        <div className="stat-item">
          <h2>99.9%</h2>
          <p>Customer Safety</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        © {new Date().getFullYear()} RentalHub. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;
