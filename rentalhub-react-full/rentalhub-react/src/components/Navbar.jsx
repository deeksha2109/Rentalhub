import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      {/* Brand */}
      <div className="navbar-brand" onClick={() => navigate('/')}>
        <span className="brand-logo">🚗</span> RentalHub
      </div>

      {/* Center Links */}
      <div className="navbar-center">
        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
        <Link to="/fleet" className={`nav-link ${isActive('/fleet') ? 'active' : ''}`}>Fleet</Link>
        <Link to="/offers" className={`nav-link ${isActive('/offers') ? 'active' : ''}`}>Offers</Link>
        <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>
        {user && user.role !== 'admin' && (
          <Link to="/my-bookings" className={`nav-link ${isActive('/my-bookings') ? 'active' : ''}`}>My Bookings</Link>
        )}
        {user && user.role === 'admin' && (
          <Link to="/admin/dashboard" className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}>Admin Console</Link>
        )}
      </div>

      {/* Login / Profile Section */}
      <div className="navbar-right">
        {user ? (
          <div className="user-profile-menu">
            <span className="welcome-text">
              Hello, <strong className="user-highlight">{user.name}</strong>
              {user.role === 'admin' && <span className="admin-badge">Admin</span>}
            </span>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
        ) : (
          <div className="dropdown">
            <span className="nav-link login-link">Sign In ▼</span>
            <div className="dropdown-content">
              <span onClick={() => navigate('/login')} className="dropdown-item">User Login</span>
              <span onClick={() => navigate('/admin/login')} className="dropdown-item">Admin Login</span>
              <div className="dropdown-divider"></div>
              <span onClick={() => navigate('/signup')} className="dropdown-item signup-item">Create Account</span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
