const express = require('express')
const {createFlightOffer, getAllFlightOffers, getFlightOfferById} = require('../controllers/flightOfferController')
const router = express.Router()

router.get('/:id',getFlightOfferById);
router.get('/', getAllFlightOffers);
router.post('/', createFlightOffer);

module.exports = router;