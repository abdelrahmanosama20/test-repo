const express = require('express')
const {createAdvertiser, getAdvertisers, getActivitieswithAdvertiserId, deleteActivityById, updateActivityWithId} = require('../controllers/advertiserController')
const router = express.Router()

router.get('/', getAdvertisers)

router.get('/:id/activities', getActivitieswithAdvertiserId);

router.delete('/:id/activities', deleteActivityById);

router.put('/:id/activities', updateActivityWithId);

//router.get('/:id', getWorkout)

router.post('/', createAdvertiser)

//router.delete('/:id', deleteWorkout)

//router.patch('/:id', updateWorkout)

module.exports = router