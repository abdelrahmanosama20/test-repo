const express = require('express')
const {createTourGuide, getTourGuides} = require('../controllers/tourGuideController')
const router = express.Router()

router.get('/', getTourGuides)

//router.get('/:id', getWorkout)

router.post('/', createTourGuide)

//router.delete('/:id', deleteWorkout)

//router.patch('/:id', updateWorkout)

module.exports = router