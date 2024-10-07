const express = require('express')
const {createSeller, getSellers, deleteSeller} = require('../controllers/sellerController')
const router = express.Router()

router.get('/', getSellers)

//router.get('/:id', getWorkout)

router.post('/', createSeller)

//router.delete('/:id', deleteWorkout)
router.delete('/:id', deleteSeller); // Add delete route

//router.patch('/:id', updateWorkout)

module.exports = router