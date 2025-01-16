const express = require('express')
const {createTourist, getTourist,getTouristByEmail,updateRecords,deleteTourist,getPastItinerariesWithTourGuides,getPastItinerariesWithTourGuidesForCommentOnItenrary,addItineraryToTourist,getPastBookedActivities, bookTransportation, addFlightOfferToTourist, addHotelOfferToTourist, rateProduct ,purchaseProductbck, getPurchasedProducts, rateTourGuide, rateItinerary ,makePayment,redeemPoints,rateActivity,makePayment2, addDeliveryAddress, getDeliveryAddresses, selectDeliveryAddress} = require('../controllers/touristController')
const router = express.Router()

router.get('/', getTourist)

router.patch('/:id/bookTransportation', bookTransportation);
router.post('/', createTourist)
router.post('/getByEmail', getTouristByEmail);
router.post('/updateByEmail',updateRecords);
router.delete('/:id', deleteTourist);
router.post('/past-itineraries', getPastItinerariesWithTourGuides);
router.post('/past-itineraries2', getPastItinerariesWithTourGuidesForCommentOnItenrary);
router.post('/test',addItineraryToTourist);
router.post('/past-activities',getPastBookedActivities)
router.put('/:userId/book-flight-offer/:offerId', addFlightOfferToTourist);
router.put('/:userId/book-hotel-offer/:offerId', addHotelOfferToTourist);
router.post('/purchase', purchaseProductbck);
router.get('/purchased', getPurchasedProducts);
router.patch('/rate/', rateProduct);
router.patch('/rate-tour-guide', rateTourGuide);
router.patch('/rate-itinerary', rateItinerary);
router.patch('/rate-activity', rateActivity);
router.post('/:id/make-payment', makePayment);
router.post('/:id/redeem-points', redeemPoints);
router.post('/:id/make-payment2', makePayment2);
router.post('/:touristId/add-delivery-address', addDeliveryAddress);
// Example of how the backend should extract touristId
router.get('/:touristId/get-delivery-addresses', getDeliveryAddresses);
router.post('/:touristId/select-delivery-address', selectDeliveryAddress);
// Example backend code (Node.js with Express)

  
  
  
module.exports = router