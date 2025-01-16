const express = require('express');
const bookingController = require('../controllers/bookingController'); // Fix require reference

const router = express.Router();

// Route to get all bookings for a tourist, using touristId as a parameter
router.get('/:touristId', bookingController.getBookings); // Fix route for fetching bookings

// Route to create a booking
router.post('/', bookingController.createBooking);  // Match the route in the backend

// Route to cancel a booking, using bookingId as a parameter
router.patch('/cancel/:bookingId', bookingController.cancelBooking); // Update the URL pattern
module.exports = router;
