const express = require('express')
const {createAdvertiser, getAdvertisers, getActivitieswithAdvertiserId, deleteActivityById, updateActivityWithId,fetchAdvertiserByEmail,deleteAdvertiser,updateAdvertiserByEmail,uploadDocuments,uploadPhoto,acceptAdvertiser,rejectadvertiser,} = require('../controllers/advertiserController')
const uploadAdvertiser = require('../middlewares/uploadMiddlewareAdvertiser');
const router = express.Router()

router.get('/', getAdvertisers)

router.get('/:id/activities', getActivitieswithAdvertiserId);

router.delete('/:id/activities', deleteActivityById);

router.put('/:id/activities', updateActivityWithId);
router.delete('/:id', deleteAdvertiser);
//router.get('/:id', getWorkout)
router.post('/getAdvertiserByEmail', fetchAdvertiserByEmail);
router.post('/', createAdvertiser)
router.put('/updateAdvertiserByEmail', updateAdvertiserByEmail);


//router.delete('/:id', deleteWorkout)
//router.patch('/:id', updateWorkout)
router.post('/upload/:email', 
      uploadAdvertiser.fields([
        { name: 'IdDocument', maxCount: 1 }, // Only one ID document
        { name: 'taxationRegistryCard', maxCount: 10 } // Allow multiple certificate documents
    ]), 
    uploadDocuments // Controller to handle the database update
);
router.post('/uploadPhoto/:email', 
    uploadAdvertiser.single('photo'), // Only one file named 'photo'
    uploadPhoto // Controller function to handle storing the photo URL in the database
);


router.post('/acceptadvertisers', acceptAdvertiser);
router.post('/rejectadvertisers',rejectadvertiser);

module.exports = router