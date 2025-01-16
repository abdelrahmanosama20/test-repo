const express = require('express')
const {createSeller, getSellers,fetchSellerByEmail,updateSeller,deleteSeller} = require('../controllers/sellerController')
const router = express.Router()

router.get('/', getSellers)

//router.get('/:id', getWorkout)

router.post('/', createSeller)
router.post('/getSellerByEmail', fetchSellerByEmail);
//router.delete('/:id', deleteWorkout)
router.put('/updateSeller', updateSeller);
//router.patch('/:id', updateWorkout)
router.delete('/:id', deleteSeller); 
module.exports = router