const express = require('express')
const {createItinerary, getItineraries,searchforitinerary,filterItineraries,filterItinerariesYassin,flagItinerary,getItineraryByID,itinerary_status,addCommentToItinerary} = require('../controllers/itineraryController')
const router = express.Router()

router.get('/', getItineraries)
router.get('/search', searchforitinerary)
router.get('/:id', getItineraryByID)

//router.get('/:id', getWorkout)

router.post('/', createItinerary)
router.patch('/:id/status', itinerary_status)
//router.delete('/:id', deleteWorkout)
router.post('/addComment',addCommentToItinerary);
//router.patch('/:id', updateWorkout)
router.post('/filter', filterItinerariesYassin) // POST request to filter itineraries
router.patch('/:id/flag', flagItinerary); 

module.exports = router