const express = require('express')
const {createSeller, getSellers,fetchSellerByEmail,updateSeller,deleteSeller,uploadDocuments,uploadPhoto,acceptsellers,rejectsellers,fetchProductsBySellerEmail} = require('../controllers/sellerController')
const uploadSeller = require('../middlewares/uploadMiddlewareSeller');
const router = express.Router()
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 
router.get('/', getSellers)

//router.get('/:id', getWorkout)

router.post('/', createSeller)
router.post('/getSellerByEmail', fetchSellerByEmail);
//router.delete('/:id', deleteWorkout)
router.put('/updateSeller', updateSeller);
//router.patch('/:id', updateWorkout)
router.delete('/:id', deleteSeller); 

router.post('/upload/:email', 
        uploadSeller.fields([
        { name: 'IdDocument', maxCount: 1 }, // Only one ID document
        { name: 'taxationRegistryCard', maxCount: 10 } // Allow multiple certificate documents
    ]), 
    uploadDocuments // Controller to handle the database update
);
router.post('/uploadPhoto/:email', 
uploadSeller.single('photo'), // Only one file named 'photo'
    uploadPhoto // Controller function to handle storing the photo URL in the database
);
router.post('/acceptsellers', acceptsellers);
router.post('/rejectsellers',rejectsellers);
router.post('/fetchproductsforSpecificSeller/:email',fetchProductsBySellerEmail)
module.exports = router