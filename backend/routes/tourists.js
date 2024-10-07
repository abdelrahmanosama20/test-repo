const express = require('express')
const {createTourist, getTourist, deleteTourist} = require('../controllers/touristController')
const router = express.Router()

router.get('/', getTourist)

//router.get('/:id', getWorkout)

router.post('/', createTourist)

//router.delete('/:id', deleteWorkout)

router.delete('/:id', deleteTourist);

//router.patch('/:id', updateWorkout)

module.exports = router