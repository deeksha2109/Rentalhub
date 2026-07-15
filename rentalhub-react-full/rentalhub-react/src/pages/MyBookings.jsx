import React, { useState, useEffect } from 'react';
import { useAuth, API_BASE_URL } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function MyBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/bookings/my`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          setBookings(data.data);
        } else {
          setError(data.message || 'Failed to fetch bookings');
        }
      } catch (err) {
        setError('Error connecting to backend server');
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [user.token]);

  return (
    <div className="my-bookings-page container">
      <h1 className="page-title">My Rental History</h1>
      <p className="page-subtitle">Track the verification status of your scheduled trips and payments</p>

      {loading && (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      )}

      {error && (
        <div className="error-message">
          ⚠️ {error}. Please refresh to try again.
        </div>
      )}

      {!loading && !error && (
        <div className="bookings-container">
          {bookings.length > 0 ? (
            <div className="bookings-list">
              {bookings.map((booking) => (
                <div className="booking-status-card" key={booking._id}>
                  <div className="card-header-row">
                    <div>
                      <h3>{booking.rideName}</h3>
                      <span className="ref-id">Ref: #{booking._id}</span>
                    </div>
                    <div className="status-badge-container">
                      <span className={`status-badge admin-status ${booking.adminStatus.toLowerCase()}`}>
                        {booking.adminStatus}
                      </span>
                    </div>
                  </div>

                  <div className="card-body-grid">
                    <div className="body-item">
                      <span>Pick-up Location:</span>
                      <strong>📍 {booking.pickup}</strong>
                    </div>
                    <div className="body-item">
                      <span>Drop-off Location:</span>
                      <strong>🏁 {booking.dropoff}</strong>
                    </div>
                    <div className="body-item">
                      <span>Scheduled Time:</span>
                      <strong>📅 {new Date(booking.datetime).toLocaleString()}</strong>
                    </div>
                    <div className="body-item">
                      <span>Amount Paid:</span>
                      <strong className="amount-glowing">₹{booking.amount}</strong>
                    </div>
                  </div>

                  <div className="card-footer-row">
                    <div className="payment-status">
                      <span>Payment Reference ID: </span>
                      <code>{booking.paymentId}</code>
                    </div>
                    <div className="payment-badge">
                      <span className="success-pill">Paid</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-bookings">
              <h3>No Bookings Found</h3>
              <p>You haven't scheduled any rides yet. Head over to our fleet page to choose your premium ride!</p>
              <button className="primary-btn" onClick={() => navigate('/fleet')}>Browse Fleet</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
