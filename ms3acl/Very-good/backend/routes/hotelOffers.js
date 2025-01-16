const express = require('express')
const {createHotelOffer, getAllHotelOffers, getHotelOfferById,} = require('../controllers/hotelOfferController')
const router = express.Router()

router.get('/:id',getHotelOfferById);
router.get('/', getAllHotelOffers);
router.post('/', createHotelOffer);

module.exports = router;