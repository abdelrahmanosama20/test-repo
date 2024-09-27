const express = require('express')
const {createActivity, getActivities} = require('../controllers/activityController')
const router = express.Router()

router.get('/', getActivities)

//router.get('/:id', getWorkout)

router.post('/', createActivity)

//router.delete('/:id', deleteWorkout)

//router.patch('/:id', updateWorkout)

module.exports = router