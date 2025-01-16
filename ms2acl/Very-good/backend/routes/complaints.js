const express = require('express')
const { submitComplaint, getComplaints, getComplaintById, getComplaintsForTourist } = require('../controllers/complaintController');
const router = express.Router()


router.post('/submit', submitComplaint);


// GET route for retrieving complaints based on touristId query parameter
router.get('/my-complaints', getComplaintsForTourist);
// GET route for retrieving all complaints
router.get('/', getComplaints); // Adjust the route as needed, e.g., /api/complaints
// GET route for retrieving a specific complaint by ID
router.get('/:id', getComplaintById); // Add this route



module.exports = router