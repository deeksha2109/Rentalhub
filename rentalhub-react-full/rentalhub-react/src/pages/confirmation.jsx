import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingDetails } = location.state || {};

  if (!bookingDetails) {
    return (
      <div className="container confirmation-error">
        <h1>No Booking Details Found</h1>
        <p>It seems you navigated here directly. Please explore our fleet to book a ride.</p>
        <button className="primary-btn" onClick={() => navigate('/fleet')}>Go to Fleet</button>
      </div>
    );
  }

  // Format date-time
  const formattedDateTime = new Date(bookingDetails.datetime).toLocaleString();

  return (
    <div className="confirmation-page container">
      <div className="confirmation-header">
        <span className="success-icon">🎉</span>
        <h1>Booking Confirmed!</h1>
        <p>Thank you for choosing RentalHub. Your payment was verified and booking request is queued for review.</p>
      </div>

      <div className="booking-receipt-card">
        <div className="receipt-header">
          <h3>RENTAL RECEIPT</h3>
          <span className="receipt-badge">PAID</span>
        </div>
        
        <div className="receipt-body">
          <div className="receipt-row">
            <span>Booking Reference ID:</span>
            <strong className="reference-code">{bookingDetails._id || 'Pending'}</strong>
          </div>
          <div className="receipt-row">
            <span>Transaction / Payment ID:</span>
            <strong className="payment-code">{bookingDetails.paymentId || 'Simulated'}</strong>
          </div>
          <div className="receipt-row">
            <span>Vehicle Model:</span>
            <strong>{bookingDetails.rideName}</strong>
          </div>
          
          <div className="divider"></div>

          <div className="receipt-row">
            <span>Customer Name:</span>
            <strong>{bookingDetails.name}</strong>
          </div>
          <div className="receipt-row">
            <span>Email Address:</span>
            <strong>{bookingDetails.email}</strong>
          </div>
          <div className="receipt-row">
            <span>Pick-up Location:</span>
            <strong>{bookingDetails.pickup}</strong>
          </div>
          <div className="receipt-row">
            <span>Drop-off Location:</span>
            <strong>{bookingDetails.dropoff}</strong>
          </div>
          <div className="receipt-row">
            <span>Scheduled Date & Time:</span>
            <strong>{formattedDateTime}</strong>
          </div>
          
          <div className="divider"></div>

          <div className="receipt-row total">
            <span>Amount Paid:</span>
            <strong className="receipt-total-price">₹{bookingDetails.amount}</strong>
          </div>
        </div>

        <div className="receipt-footer">
          <p>
            <strong>Status Check:</strong> You can check if the administrator has approved your dispatch details 
            real-time inside the "My Bookings" history panel.
          </p>
        </div>
      </div>

      <div className="action-buttons-row">
        <button className="secondary-btn" onClick={() => navigate('/my-bookings')}>View My Bookings</button>
        <button className="primary-btn" onClick={() => navigate('/')}>Return Home</button>
      </div>

      <div className="terms-card">
        <h3>Important Notes</h3>
        <ul>
          <li>Please arrive at the pick-up location 10 minutes prior to scheduled dispatch.</li>
          <li>Ensure you carry a valid driver's license matching local regulations.</li>
          <li>For cancellation, queries, or rescheduling, connect with support@rentalhub.com.</li>
        </ul>
      </div>
    </div>
  );
}

export default Confirmation;
