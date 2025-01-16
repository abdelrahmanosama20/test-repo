const express = require('express');
const { createBooking, getBookings } = require('../controllers/bookingController'); // Adjust the path accordingly

const router = express.Router();

// POST / - Create a new booking
router.post('/', createBooking); 

// GET / - Fetch all bookings
router.get('/', getBookings); // Use only '/' here

module.exports = router;