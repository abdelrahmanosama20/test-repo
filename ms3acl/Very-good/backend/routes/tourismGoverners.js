const express = require('express');
const {
    createTourismGoverner,
    getTourismGoverners,
    deleteTourismGoverner,
    updateRecordsTourism
} = require('../controllers/tourismGovernerController');

const router = express.Router();

// Get all tourism governors
router.get('/', getTourismGoverners);

// Create a new tourism governor
router.post('/', createTourismGoverner);

// Get a tourism governor by email

// In your tourism governor router file (tourismGovernerRoutes.js)

// Define the route for updating tourism governor by email
router.put('/updateByEmailTourism', updateRecordsTourism);




// Delete a tourism governor by ID
router.delete('/:id', deleteTourismGoverner); // Add delete route

module.exports = router;
