const express = require('express')
const {createTourGuide, getTourGuides, deleteTourGuide} = require('../controllers/tourGuideController')
const router = express.Router()

router.get('/', getTourGuides)

//router.get('/:id', getWorkout)

router.post('/', createTourGuide)

// DELETE tour guide by ID
router.delete('/:id', deleteTourGuide); // Add delete route


//router.delete('/:id', deleteWorkout)

//router.patch('/:id', updateWorkout)

module.exports = router