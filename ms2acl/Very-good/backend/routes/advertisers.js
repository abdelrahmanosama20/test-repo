const express = require('express')
const {createAdvertiser, getAdvertisers, getActivitieswithAdvertiserId, deleteActivityById, updateActivityWithId,fetchAdvertiserByEmail,deleteAdvertiser,updateAdvertiserByEmailBackend} = require('../controllers/advertiserController')
const router = express.Router()

router.get('/', getAdvertisers)

router.get('/:id/activities', getActivitieswithAdvertiserId);

router.delete('/:id/activities', deleteActivityById);

router.put('/:id/activities', updateActivityWithId);
router.delete('/:id', deleteAdvertiser);
//router.get('/:id', getWorkout)
router.post('/getAdvertiserByEmail', fetchAdvertiserByEmail);
router.post('/', createAdvertiser)
router.put ('/updateAdvertiserByEmail',updateAdvertiserByEmailBackend)
//router.delete('/:id', deleteWorkout)

//router.patch('/:id', updateWorkout)

module.exports = router