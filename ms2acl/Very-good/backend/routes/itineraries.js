const express = require('express')
const {createItinerary, getItineraries,searchforitinerary,filterItineraries,filterItinerariesYassin,flagItinerary,getItineraryByID} = require('../controllers/itineraryController')
const router = express.Router()

router.get('/', getItineraries)
router.get('/search', searchforitinerary)
router.get('/:id', getItineraryByID)

//router.get('/:id', getWorkout)

router.post('/', createItinerary)

//router.delete('/:id', deleteWorkout)

//router.patch('/:id', updateWorkout)
router.post('/filter', filterItinerariesYassin) // POST request to filter itineraries
router.patch('/:id/flag', flagItinerary); // Add this line

module.exports = router