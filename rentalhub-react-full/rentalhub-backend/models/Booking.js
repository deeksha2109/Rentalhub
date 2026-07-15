const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  ride: {
    type: mongoose.Schema.ObjectId,
    ref: 'Ride',
    required: false, // can be optional if ride gets deleted
  },
  rideName: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please add a customer name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
  },
  pickup: {
    type: String,
    required: [true, 'Please add pick-up location'],
  },
  dropoff: {
    type: String,
    required: [true, 'Please add drop-off location'],
  },
  datetime: {
    type: Date,
    required: [true, 'Please add booking date and time'],
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentId: {
    type: String,
  },
  paymentStatus: {
    type: String,
    default: 'Pending',
  },
  adminStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Booking', BookingSchema);
