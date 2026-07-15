import React, { useState } from 'react';

function Offers() {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const offers = [
    {
      title: "Summer Special: 20% Off",
      description: "Book any premium ride this summer season and enjoy 20% off your total rental fare.",
      image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=600",
      code: "SUMMER20",
    },
    {
      title: "Weekend Getaway: Save ₹500",
      description: "Plan your weekend escape with family. Save flat ₹500 on all SUV bookings.",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600",
      code: "WEEKEND500",
    },
    {
      title: "Airport Transfers: Flat 15% Off",
      description: "Hassle-free, punctual airport pickups and drop-offs with custom premium comfort.",
      image: "https://images.unsplash.com/photo-1494976388531-d1058094e2fd?auto=format&fit=crop&q=80&w=600",
      code: "AIRPORT15",
    },
    {
      title: "Luxury Upgrade: Free Bonus",
      description: "Book a premium sedan today and receive a complimentary upgrade to a high-end luxury car.",
      image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=600",
      code: "LUXUPGRADE",
    },
  ];

  const handleCopyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  return (
    <div className="offers-page">
      <div className="container">
        <h1 className="page-title">Exclusive Deals & Offers</h1>
        <p className="page-subtitle">Grab limited-time promotional codes to secure maximum value on your next ride</p>

        <div className="offers-grid">
          {offers.map((offer, index) => (
            <div className="offer-card" key={index}>
              <div className="offer-image-wrapper">
                <img src={offer.image} alt={offer.title} className="offer-img" />
                <div className="promo-tag">Promo Offer</div>
              </div>
              <div className="offer-body">
                <h3>{offer.title}</h3>
                <p>{offer.description}</p>
                <div className="promo-code-box">
                  <span className="code-label">CODE:</span>
                  <span className="code-text">{offer.code}</span>
                  <button 
                    onClick={() => handleCopyCode(offer.code, index)}
                    className={`copy-code-btn ${copiedIndex === index ? 'copied' : ''}`}
                  >
                    {copiedIndex === index ? 'Copied! ✓' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        © {new Date().getFullYear()} RentalHub. All rights reserved.
      </footer>
    </div>
  );
}

export default Offers;
