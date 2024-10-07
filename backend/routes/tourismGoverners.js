const express = require('express')
const {createTourismGoverner, getTourismGoverners, deleteTourismGoverner} = require('../controllers/tourismGovernerController')
const router = express.Router()

router.get('/', getTourismGoverners)

//router.get('/:id', getWorkout)

router.post('/', createTourismGoverner)

// DELETE tourism governor by ID
router.delete('/:id', deleteTourismGoverner); // Add delete route

//router.delete('/:id', deleteWorkout)

//router.patch('/:id', updateWorkout)

module.exports = router