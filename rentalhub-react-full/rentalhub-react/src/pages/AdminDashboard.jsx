import React, { useState, useEffect } from 'react';
import { useAuth, API_BASE_URL } from '../context/AuthContext';

function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');

  // Bookings Data
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  // Fleet Data
  const [rides, setRides] = useState([]);
  const [ridesLoading, setRidesLoading] = useState(true);

  // Contact Feed Data
  const [contacts, setContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(true);

  // Add Ride Form state
  const [newRide, setNewRide] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Sedan',
    image: '',
    available: true
  });
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(false);

  // Errors
  const [error, setError] = useState(null);

  // Load Bookings
  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        headers: { 'Authorization': `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setBookingsLoading(false);
    }
  };

  // Load Fleet
  const fetchRides = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/rides`);
      const data = await res.json();
      if (data.success) {
        setRides(data.data);
      }
    } catch (err) {
      console.error('Error fetching fleet:', err);
    } finally {
      setRidesLoading(false);
    }
  };

  // Load Contact Messages
  const fetchContacts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/contacts`, {
        headers: { 'Authorization': `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (data.success) {
        setContacts(data.data);
      }
    } catch (err) {
      console.error('Error fetching contact messages:', err);
    } finally {
      setContactsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchRides();
    fetchContacts();
  }, [user.token]);

  // Approve Booking
  const handleApproveBooking = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({ status: 'Approved' }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings(prev => prev.map(b => b._id === id ? { ...b, adminStatus: 'Approved' } : b));
      }
    } catch (err) {
      alert('Error updating status');
    }
  };

  // Reject Booking
  const handleRejectBooking = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({ status: 'Rejected' }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings(prev => prev.map(b => b._id === id ? { ...b, adminStatus: 'Rejected' } : b));
      }
    } catch (err) {
      alert('Error updating status');
    }
  };

  // Delete Ride
  const handleDeleteRide = async (id) => {
    if (!window.confirm('Are you sure you want to remove this vehicle from the active fleet?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/rides/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (data.success) {
        setRides(prev => prev.filter(r => r._id !== id));
      }
    } catch (err) {
      alert('Error removing ride');
    }
  };

  // Add Ride
  const handleAddRide = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(false);

    if (!newRide.name || !newRide.description || !newRide.price) {
      setFormError('Please fill in all required fields.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/rides`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          ...newRide,
          price: Number(newRide.price),
        }),
      });
      const data = await res.json();
      
      if (data.success) {
        setFormSuccess(true);
        setRides(prev => [...prev, data.data]);
        setNewRide({
          name: '',
          description: '',
          price: '',
          category: 'Sedan',
          image: '',
          available: true
        });
      } else {
        setFormError(data.message || 'Failed to add vehicle');
      }
    } catch (err) {
      setFormError('Connection to API failed.');
    }
  };

  return (
    <div className="admin-dashboard container">
      <div className="dashboard-header">
        <h1>Admin Command Console</h1>
        <p>Manage fleet inventory, approve rental requests, and review customer feedback feeds.</p>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          📁 Bookings ({bookings.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'fleet' ? 'active' : ''}`}
          onClick={() => setActiveTab('fleet')}
        >
          🚘 Fleet Management ({rides.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          ✉️ Feedback Feeds ({contacts.length})
        </button>
      </div>

      {/* Tab Contents: Bookings */}
      {activeTab === 'bookings' && (
        <div className="tab-pane">
          <h3>Manage Booking Requests</h3>
          {bookingsLoading ? (
            <div className="spinner"></div>
          ) : bookings.length > 0 ? (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Email Address</th>
                    <th>Vehicle Requested</th>
                    <th>Pick-up</th>
                    <th>Drop-off</th>
                    <th>Date & Time</th>
                    <th>Amount</th>
                    <th>Review Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>{booking.name}</td>
                      <td>{booking.email}</td>
                      <td><strong>{booking.rideName}</strong></td>
                      <td>{booking.pickup}</td>
                      <td>{booking.dropoff}</td>
                      <td>{new Date(booking.datetime).toLocaleString()}</td>
                      <td>₹{booking.amount}</td>
                      <td>
                        <span className={`status-pill ${booking.adminStatus.toLowerCase()}`}>
                          {booking.adminStatus}
                        </span>
                      </td>
                      <td className="actions-cell">
                        {booking.adminStatus === 'Pending' ? (
                          <>
                            <button 
                              className="action-btn approve-btn" 
                              onClick={() => handleApproveBooking(booking._id)}
                            >
                              Approve
                            </button>
                            <button 
                              className="action-btn reject-btn" 
                              onClick={() => handleRejectBooking(booking._id)}
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className="status-locked">Locked</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-data-notice">No booking records found in database.</div>
          )}
        </div>
      )}

      {/* Tab Contents: Fleet Management */}
      {activeTab === 'fleet' && (
        <div className="tab-pane">
          <div className="fleet-dashboard-split">
            {/* Add Ride Form */}
            <div className="add-vehicle-card">
              <h4>Add New Fleet Vehicle</h4>
              
              {formSuccess && (
                <div className="success-banner">Vehicle added successfully to fleet!</div>
              )}
              {formError && (
                <div className="error-banner">⚠️ {formError}</div>
              )}

              <form onSubmit={handleAddRide} className="admin-form">
                <div className="form-group">
                  <label htmlFor="ride-name">Vehicle Name</label>
                  <input 
                    id="ride-name"
                    type="text" 
                    placeholder="e.g. BMW 5 Series"
                    value={newRide.name}
                    onChange={(e) => setNewRide(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="ride-type">Category</label>
                    <select
                      id="ride-type"
                      value={newRide.category}
                      onChange={(e) => setNewRide(prev => ({ ...prev, category: e.target.value }))}
                      required
                    >
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Convertible">Convertible</option>
                      <option value="Luxury">Luxury</option>
                      <option value="Sports">Sports</option>
                      <option value="Hatchback">Hatchback</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="ride-price">Price / Day (₹)</label>
                    <input 
                      id="ride-price"
                      type="number" 
                      placeholder="e.g. 3500"
                      value={newRide.price}
                      onChange={(e) => setNewRide(prev => ({ ...prev, price: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="ride-desc">Description</label>
                  <textarea
                    id="ride-desc"
                    placeholder="Provide details about performance, interior comfort, trunk space..."
                    value={newRide.description}
                    onChange={(e) => setNewRide(prev => ({ ...prev, description: e.target.value }))}
                    rows="3"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="ride-image">Image URL</label>
                  <input 
                    id="ride-image"
                    type="text" 
                    placeholder="https://images.unsplash.com/..."
                    value={newRide.image}
                    onChange={(e) => setNewRide(prev => ({ ...prev, image: e.target.value }))}
                  />
                </div>

                <button type="submit" className="add-btn">Add to Fleet</button>
              </form>
            </div>

            {/* List Active Fleet */}
            <div className="active-fleet-list">
              <h4>Active Fleet Registry</h4>
              {ridesLoading ? (
                <div className="spinner"></div>
              ) : rides.length > 0 ? (
                <div className="fleet-dashboard-grid">
                  {rides.map((ride) => (
                    <div className="admin-ride-card" key={ride._id}>
                      <div className="ride-meta">
                        <strong>{ride.name}</strong>
                        <span className="meta-badge">{ride.category}</span>
                        <span className="meta-price">₹{ride.price}/day</span>
                      </div>
                      <button 
                        className="delete-ride-btn" 
                        onClick={() => handleDeleteRide(ride._id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data-notice">No fleet vehicles registered.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab Contents: Contacts */}
      {activeTab === 'contacts' && (
        <div className="tab-pane">
          <h3>Customer Feedback Feeds</h3>
          {contactsLoading ? (
            <div className="spinner"></div>
          ) : contacts.length > 0 ? (
            <div className="feedback-list">
              {contacts.map((feed) => (
                <div className="feedback-card" key={feed._id}>
                  <div className="feedback-header">
                    <div>
                      <strong>👤 {feed.name}</strong>
                      <span className="feedback-email">({feed.email})</span>
                    </div>
                    <span className="feedback-date">
                      {new Date(feed.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="feedback-msg">"{feed.message}"</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data-notice">No messages found.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
