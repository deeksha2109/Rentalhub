import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth, API_BASE_URL } from '../context/AuthContext';

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [selectedRide, setSelectedRide] = useState(location.state?.selectedRide || null);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Form fields
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [datetime, setDatetime] = useState('');

  // Mock Payment Overlay State
  const [showMockGateway, setShowMockGateway] = useState(false);
  const [mockOrderDetails, setMockOrderDetails] = useState(null);

  // Fetch all rides in case no ride is selected (or to let them change it)
  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/rides`);
        const data = await res.json();
        if (data.success) {
          setRides(data.data);
          if (!selectedRide && data.data.length > 0) {
            setSelectedRide(data.data[0]); // default select first
          }
        }
      } catch (err) {
        console.error('Error loading rides:', err);
      }
    };
    fetchRides();
  }, [selectedRide]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleStartBooking = async (e) => {
    e.preventDefault();
    if (!selectedRide) {
      setError('Please select a vehicle first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Get Razorpay/Mock Order from backend
      const orderRes = await fetch(`${API_BASE_URL}/bookings/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({ amount: selectedRide.price }),
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      const bookingDataTemp = {
        rideId: selectedRide._id,
        rideName: selectedRide.name,
        name,
        email,
        pickup,
        dropoff,
        datetime,
        amount: selectedRide.price,
      };

      // 2. Decide between Real Razorpay and Mock Payment Gateway
      if (orderData.isMock) {
        // Show mock overlay
        setMockOrderDetails({
          orderId: orderData.orderId,
          bookingData: bookingDataTemp,
        });
        setShowMockGateway(true);
        setLoading(false);
      } else {
        // Run real Razorpay
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
        }

        const options = {
          key: "rzp_test_YOUR_API_KEY", // Will be replaced by client if configured or uses order detail key
          amount: selectedRide.price * 100, // paise
          currency: "INR",
          name: "RentalHub",
          description: `Booking for ${selectedRide.name}`,
          order_id: orderData.orderId,
          handler: async function (response) {
            await saveBookingToDB({
              ...bookingDataTemp,
              paymentId: response.razorpay_payment_id,
              paymentStatus: "Paid",
            });
          },
          prefill: {
            name: name,
            email: email,
          },
          theme: {
            color: "#6a11cb",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        setLoading(false);
      }
    } catch (err) {
      setError(err.message || 'Booking process failed');
      setLoading(false);
    }
  };

  const handleConfirmMockPayment = async () => {
    setShowMockGateway(false);
    setLoading(true);
    const mockPaymentId = `pay_mock_${Math.random().toString(36).substr(2, 9)}`;
    
    await saveBookingToDB({
      ...mockOrderDetails.bookingData,
      paymentId: mockPaymentId,
      paymentStatus: "Paid",
    });
  };

  const saveBookingToDB = async (payload) => {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        navigate('/confirmation', { state: { bookingDetails: data.data } });
      } else {
        throw new Error(data.message || 'Failed to save booking to database');
      }
    } catch (err) {
      setError(err.message || 'Error saving booking details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-page container">
      <h1 className="page-title">Confirm Your Booking</h1>
      <p className="page-subtitle">Complete the fields below to schedule your premium ride</p>

      {error && (
        <div className="error-banner">
          ⚠️ {error}
        </div>
      )}

      <div className="booking-grid">
        {/* Booking Form */}
        <div className="booking-form-card">
          <form onSubmit={handleStartBooking}>
            <div className="form-group">
              <label htmlFor="select-ride">Selected Vehicle</label>
              <select
                id="select-ride"
                value={selectedRide?._id || ''}
                onChange={(e) => {
                  const ride = rides.find(r => r._id === e.target.value);
                  setSelectedRide(ride);
                }}
                required
                className="form-select"
              >
                {rides.map(r => (
                  <option key={r._id} value={r._id}>{r.name} - ₹{r.price}/day</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="customer-name">Full Name</label>
              <input 
                id="customer-name"
                type="text" 
                placeholder="Enter customer name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="customer-email">Email Address</label>
              <input 
                id="customer-email"
                type="email" 
                placeholder="Enter email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="pickup-loc">Pick-up Location</label>
                <input 
                  id="pickup-loc"
                  type="text" 
                  placeholder="Street / Airport / City" 
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="dropoff-loc">Drop-off Location</label>
                <input 
                  id="dropoff-loc"
                  type="text" 
                  placeholder="Street / Airport / City" 
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="pickup-time">Date & Time</label>
              <input 
                id="pickup-time"
                type="datetime-local" 
                value={datetime}
                onChange={(e) => setDatetime(e.target.value)}
                required 
              />
            </div>

            <button type="submit" disabled={loading} className="checkout-btn">
              {loading ? 'Processing...' : `Confirm & Pay ₹${selectedRide?.price || 0}`}
            </button>
          </form>
        </div>

        {/* Selected Vehicle Card Summary */}
        {selectedRide && (
          <div className="booking-summary-card">
            <h3>Vehicle Summary</h3>
            <div className="summary-image-wrapper">
              <img 
                src={selectedRide.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600'} 
                alt={selectedRide.name} 
                className="summary-img"
              />
            </div>
            <div className="summary-info">
              <h4>{selectedRide.name}</h4>
              <span className="summary-badge">{selectedRide.category}</span>
              <p>{selectedRide.description}</p>
              
              <div className="divider"></div>
              
              <div className="price-details-row">
                <span>Rental Charge:</span>
                <strong>₹{selectedRide.price} / day</strong>
              </div>
              <div className="price-details-row total">
                <span>Estimated Total:</span>
                <strong>₹{selectedRide.price}</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mock Payment Gateway Modal Overlay */}
      {showMockGateway && mockOrderDetails && (
        <div className="mock-modal-overlay">
          <div className="mock-modal-card">
            <div className="mock-modal-header">
              <h2>🔒 Mock Payment Gateway</h2>
              <button className="close-modal" onClick={() => setShowMockGateway(false)}>×</button>
            </div>
            <div className="mock-modal-body">
              <p className="notice">
                Razorpay key variables are not set. The platform is running in <strong>Simulation Mode</strong>.
              </p>
              
              <div className="mock-details-box">
                <div className="detail-row">
                  <span>Merchant:</span>
                  <strong>RentalHub Corp</strong>
                </div>
                <div className="detail-row">
                  <span>Order ID:</span>
                  <code className="order-id-code">{mockOrderDetails.orderId}</code>
                </div>
                <div className="detail-row">
                  <span>Amount:</span>
                  <strong className="glowing-price">₹{mockOrderDetails.bookingData.amount}</strong>
                </div>
              </div>

              <div className="credit-card-simulation">
                <div className="card-top">
                  <span className="chip-icon">💳</span>
                  <span className="card-brand">SIMULATED CARD</span>
                </div>
                <div className="card-number">•••• •••• •••• 1234</div>
                <div className="card-footer">
                  <span className="card-holder">{mockOrderDetails.bookingData.name}</span>
                  <span className="card-expiry">12/30</span>
                </div>
              </div>
            </div>
            <div className="mock-modal-actions">
              <button className="cancel-mock-btn" onClick={() => setShowMockGateway(false)}>
                Cancel
              </button>
              <button className="confirm-mock-btn" onClick={handleConfirmMockPayment}>
                Approve Mock Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        © {new Date().getFullYear()} RentalHub. All rights reserved.
      </footer>
    </div>
  );
}

export default Booking;
