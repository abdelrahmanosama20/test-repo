const express = require('express')
const {createTourist, getTourist} = require('../controllers/touristController')
const router = express.Router()

router.get('/', getTourist)

//router.get('/:id', getWorkout)

router.post('/', createTourist)

//router.delete('/:id', deleteWorkout)

//router.patch('/:id', updateWorkout)

module.exports = router