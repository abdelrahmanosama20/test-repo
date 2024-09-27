const express = require('express')
const {createItinerary, getItineraries} = require('../controllers/itineraryController')
const router = express.Router()

router.get('/', getItineraries)

//router.get('/:id', getWorkout)

router.post('/', createItinerary)

//router.delete('/:id', deleteWorkout)

//router.patch('/:id', updateWorkout)

module.exports = router