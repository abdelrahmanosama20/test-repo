const express = require('express')
const {createTourGuide, getTourGuides, getTourGuideByEmail, getItinerarieswithTourGuideId, deleteItineraryById,addCommentToTourGuide ,updateItineraryWithId,deleteTourGuide,uploadDocuments,acceptTourGuide,rejectTourGuide,uploadPhoto,updateTourGuideByEmail} = require('../controllers/tourGuideController')
const router = express.Router()
const uploadTourGuide = require('../middlewares/uploadMiddlewareTourGuide'); // middleware is different from the controller, something the controller uses

router.get('/', getTourGuides)

router.get('/:id/itineraries', getItinerarieswithTourGuideId)

router.delete('/:id/itineraries', deleteItineraryById);

router.put('/:id/itineraries', updateItineraryWithId);

//router.get('/:id', getWorkout)

router.post('/', createTourGuide)
router.post('/getByEmail',getTourGuideByEmail)
//router.delete('/:id', deleteWorkout)

//router.patch('/:id', updateWorkout)
router.delete('/:id', deleteTourGuide);
//In your route definition, you are orchestrating the order in which these functions are executed: middleware first, then controller.
// middleware actually saves onto the device while the controller saves onto the database 
// now both dont interact together they perform different jobs 
// the controller method should make use of the file path created by the middle ware 
// so actually 2 way operation 
router.post('/upload/:email', 
    uploadTourGuide.fields([
        { name: 'IdDocument', maxCount: 1 }, // Only one ID document
        { name: 'certificatesDocument', maxCount: 10 } // Allow multiple certificate documents
    ]), 
    uploadDocuments // Controller to handle the database update
);
router.post('/uploadPhoto/:email', 
    uploadTourGuide.single('photo'), // Only one file named 'photo'
    uploadPhoto // Controller function to handle storing the photo URL in the database
);
router.post('/addComment', addCommentToTourGuide)
router.post('/accept-tour-guide', acceptTourGuide);
router.post('/reject-tour-guide',rejectTourGuide);



router.put('/updateTourGuideByEmail', updateTourGuideByEmail);


module.exports = router