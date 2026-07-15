import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../context/AuthContext';

function Fleet() {
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [filteredRides, setFilteredRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [selectedType, setSelectedType] = useState('All');
  const [sortBy, setSortBy] = useState('none');

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/rides`);
        const data = await res.json();
        if (data.success) {
          setRides(data.data);
          setFilteredRides(data.data);
        } else {
          setError('Failed to fetch rides data');
        }
      } catch (err) {
        setError('Error connecting to backend server');
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...rides];

    // Filter by type
    if (selectedType !== 'All') {
      result = result.filter(ride => ride.category?.toLowerCase() === selectedType.toLowerCase());
    }

    // Sort by price
    if (sortBy === 'low-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'high-low') {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredRides(result);
  }, [selectedType, sortBy, rides]);

  const handleSelectRide = (ride) => {
    navigate('/booking', { state: { selectedRide: ride } });
  };

  const types = ['All', 'Sedan', 'SUV', 'Convertible', 'Luxury', 'Sports', 'Hatchback'];

  return (
    <div className="fleet-page">
      <div className="container">
        <h1 className="page-title">Explore Our Premium Fleet</h1>
        <p className="page-subtitle">Select the vehicle that matches your style and destination</p>

        {/* Filter Toolbar */}
        <div className="fleet-toolbar">
          <div className="filter-group">
            <label>Category:</label>
            <div className="filter-chips">
              {types.map((type) => (
                <button
                  key={type}
                  className={`chip ${selectedType === type ? 'active' : ''}`}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="sort-group">
            <label htmlFor="sort">Sort Price:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="none">Standard</option>
              <option value="low-high">Low to High</option>
              <option value="high-low">High to Low</option>
            </select>
          </div>
        </div>

        {/* Loading and Error states */}
        {loading && (
          <div className="loader-container">
            <div className="spinner"></div>
          </div>
        )}

        {error && (
          <div className="error-message">
            ⚠️ {error}. Please try again later.
          </div>
        )}

        {/* Fleet Grid */}
        {!loading && !error && (
          <div className="fleet-grid">
            {filteredRides.length > 0 ? (
              filteredRides.map((ride) => (
                <div className="ride-card" key={ride._id}>
                  <div className="ride-image-container">
                    <img 
                      src={ride.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600'} 
                      alt={ride.name} 
                      className="ride-img" 
                    />
                    <div className="type-badge">{ride.category}</div>
                  </div>
                  <div className="ride-details">
                    <h3>{ride.name}</h3>
                    <p className="ride-desc">{ride.description}</p>
                    <div className="ride-price-row">
                      <div className="price-tag">
                        <span className="amount">₹{ride.price}</span>
                        <span className="unit">/ day</span>
                      </div>
                      <button 
                        disabled={!ride.available}
                        onClick={() => handleSelectRide(ride)}
                        className={`select-btn ${!ride.available ? 'disabled' : ''}`}
                      >
                        {ride.available ? 'Book Now' : 'Not Available'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                No vehicles found matching the selected filters.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        © {new Date().getFullYear()} RentalHub. All rights reserved.
      </footer>
    </div>
  );
}

export default Fleet;
