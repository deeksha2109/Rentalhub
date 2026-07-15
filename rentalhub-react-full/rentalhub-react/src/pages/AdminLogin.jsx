import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login, logout, user } = useAuth();

  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await login(email, password);
    
    if (res.success) {
      // Success auth, check if user is actually admin
      // Since AuthContext already updated the user state, we fetch the role
      const token = localStorage.getItem('token');
      try {
        const checkRes = await fetch('http://localhost:5000/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const checkData = await checkRes.json();
        
        if (checkData.success && checkData.user.role === 'admin') {
          setLoading(false);
          navigate('/admin/dashboard');
        } else {
          logout(); // logout as they aren't admin
          setError('Access Denied: You do not have administrator privileges.');
          setLoading(false);
        }
      } catch (err) {
        logout();
        setError('Error checking user credentials');
        setLoading(false);
      }
    } else {
      setError(res.message || 'Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container admin-login-page">
      <div className="auth-card admin-card">
        <div className="admin-icon-header">🛡️</div>
        <h1>Admin Portal</h1>
        <p>Sign in with administrator credentials to manage fleet and booking requests.</p>
        
        {error && (
          <div className="error-banner">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="admin-email">Admin Email</label>
            <input
              id="admin-email"
              type="email"
              placeholder="admin@yourcompany.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="admin-password">Admin Password</label>
            <input
              id="admin-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="auth-btn admin-btn">
            {loading ? 'Authenticating...' : 'Access Admin Dashboard'}
          </button>
        </form>

        <p className="admin-notice">
          Notice: All login attempts and control panel activities are securely monitored in the database logs.
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
