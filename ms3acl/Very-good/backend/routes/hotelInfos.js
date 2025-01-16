const express = require('express')
const {createHotelInfo, getAllHotelInfo, getHotelInfoByOfferId} = require('../controllers/hotelInfoController')
const router = express.Router()

router.get('/:id',getHotelInfoByOfferId);
router.get('/', getAllHotelInfo);
router.post('/', createHotelInfo);

module.exports = router;