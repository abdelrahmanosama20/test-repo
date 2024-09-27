const express = require('express')
const {createAdvertiser, getAdvertisers} = require('../controllers/advertiserController')
const router = express.Router()

router.get('/', getAdvertisers)

//router.get('/:id', getWorkout)

router.post('/', createAdvertiser)

//router.delete('/:id', deleteWorkout)

//router.patch('/:id', updateWorkout)

module.exports = router