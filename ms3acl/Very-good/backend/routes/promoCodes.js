const express = require('express');
const router = express.Router();
const promoCodeController = require('../controllers/promoCodeController');

// Create a new promo code
router.post('/', promoCodeController.createPromoCode);

// Get all promo codes
router.get('/', promoCodeController.getAllPromoCodes);

// Get a promo code by ID
router.get('/:promoCodeId', promoCodeController.getPromoCodeById);

// Update a promo code
router.patch('/:promoCodeId', promoCodeController.updatePromoCode);

// Delete a promo code
router.delete('/:promoCodeId', promoCodeController.deletePromoCode);

module.exports = router;
