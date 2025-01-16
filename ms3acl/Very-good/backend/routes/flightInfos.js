const express = require('express')
const {createFlightInfo, getAllFLightInfo, getInfoByOfferId} = require('../controllers/flightInfoController')
const router = express.Router()

router.get('/:id',getInfoByOfferId);
router.get('/', getAllFLightInfo);
router.post('/', createFlightInfo);

module.exports = router;