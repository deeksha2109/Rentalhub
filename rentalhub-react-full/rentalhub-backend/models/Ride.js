const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a car name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a daily price'],
  },
  image: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
  },
  seats: {
    type: Number,
    default: 5,
  },
  transmission: {
    type: String,
    default: 'Automatic',
  },
  fuel: {
    type: String,
    default: 'Petrol',
  },
  features: {
    type: [String],
    default: [],
  },
  active: {
    type: Boolean,
    default: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Map model to the existing "cars" collection in MongoDB
module.exports = mongoose.model('Ride', RideSchema, 'cars');
