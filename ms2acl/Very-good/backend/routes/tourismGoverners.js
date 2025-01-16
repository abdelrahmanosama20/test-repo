const express = require('express')
const {createTourismGoverner, getTourismGoverners,deleteTourismGoverner} = require('../controllers/tourismGovernerController')
const router = express.Router()

router.get('/', getTourismGoverners)

//router.get('/:id', getWorkout)

router.post('/', createTourismGoverner)

//router.delete('/:id', deleteWorkout)

//router.patch('/:id', updateWorkout)
router.delete('/:id', deleteTourismGoverner); // Add delete route
module.exports = router