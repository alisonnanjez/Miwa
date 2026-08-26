const express = require('express');
const router  = express.Router();
const bookingController = require('../controllers/bookingController');

// GET  /api/v1/bookings          → all bookings
router.get('/', bookingController.getAllBookings);

// POST /api/v1/bookings/create   → create a new booking
router.post('/create', bookingController.createBooking);

// PATCH /api/v1/bookings/:id/status → update delivery status
router.patch('/:id/status', bookingController.updateStatus);

module.exports = router;
