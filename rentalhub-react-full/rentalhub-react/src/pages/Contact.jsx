import React, { useState } from 'react';
import { API_BASE_URL } from '../context/AuthContext';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`${API_BASE_URL}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setError(data.message || 'Failed to submit contact request');
      }
    } catch (err) {
      setError('Connection to backend server failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page container">
      <h1 className="page-title">Connect with Us</h1>
      <p className="page-subtitle">Have questions or feedback? Feel free to write to our executive desk.</p>

      <div className="contact-grid">
        {/* Contact Info */}
        <div className="contact-info-card">
          <h3>Our Head Office</h3>
          <div className="info-item">
            <span className="info-icon">📍</span>
            <p>123 Premium Drive, Business City, India</p>
          </div>
          <div className="info-item">
            <span className="info-icon">📧</span>
            <p>support@rentalhub.com</p>
          </div>
          <div className="info-item">
            <span className="info-icon">📞</span>
            <p>+91 98765 43210</p>
          </div>
          <div className="working-hours">
            <h4>Working Hours</h4>
            <p>Monday - Sunday: 24 / 7 Dispatch</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-card">
          <h3>Send a Message</h3>
          
          {success && (
            <div className="success-banner">
              🎉 Message sent successfully! Our executive will connect back shortly.
            </div>
          )}

          {error && (
            <div className="error-banner">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input 
                id="name"
                type="text" 
                placeholder="Enter your name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input 
                id="email"
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea 
                id="message"
                placeholder="Write message details..." 
                rows="4" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        © {new Date().getFullYear()} RentalHub. All rights reserved.
      </footer>
    </div>
  );
}

export default Contact;
