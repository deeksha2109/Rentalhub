const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Ride = require('../models/Ride');
const { protect, authorize } = require('../middleware/auth');
const Razorpay = require('razorpay');

// Initialize Razorpay
let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== 'rzp_test_YOUR_API_KEY') {
  try {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  } catch (error) {
    console.error('Razorpay initialization error:', error.message);
  }
}

// @desc    Create Razorpay Order
// @route   POST /api/bookings/order
// @access  Private
router.post('/order', protect, async (req, res) => {
  const { amount } = req.body;

  if (!amount) {
    return res.status(400).json({ success: false, message: 'Please provide amount' });
  }

  // Check if Razorpay is initialized
  if (razorpay) {
    try {
      const options = {
        amount: amount * 100, // in paise
        currency: 'INR',
        receipt: `receipt_order_${new Date().getTime()}`,
      };

      const order = await razorpay.orders.create(options);
      return res.status(200).json({ success: true, orderId: order.id, isMock: false });
    } catch (error) {
      console.error('Razorpay order creation failed, falling back to mock:', error.message);
    }
  }

  // Fallback / Mock Order ID
  const mockOrderId = `order_mock_${Math.random().toString(36).substr(2, 9)}`;
  res.status(200).json({
    success: true,
    orderId: mockOrderId,
    isMock: true,
    message: 'Mock payment order generated (Razorpay keys not configured)',
  });
});

// @desc    Create new booking in DB
// @route   POST /api/bookings
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      rideId,
      rideName,
      name,
      email,
      pickup,
      dropoff,
      datetime,
      amount,
      paymentId,
      paymentStatus,
    } = req.body;

    const booking = await Booking.create({
      user: req.user.id,
      ride: rideId || null,
      rideName,
      name,
      email,
      pickup,
      dropoff,
      datetime,
      amount,
      paymentId,
      paymentStatus: paymentStatus || 'Paid',
      adminStatus: 'Pending',
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Get bookings for logged in user
// @route   GET /api/bookings/my
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user', 'name email').sort('-createdAt');
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update booking approval status
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body; // Approved or Rejected

    if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    let booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.adminStatus = status;
    await booking.save();

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
