const PromoCode = require('../models/promoCodeModel');

// Create a new promo code
exports.createPromoCode = async (req, res) => {
    const { title, percentage } = req.body;

    try {
        const promoCode = new PromoCode({ title, percentage });
        await promoCode.save();
        res.status(201).json({ success: true, promoCode });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create promo code', error });
    }
};

exports.getAllPromoCodes = async (req, res) => {
    try {
        const promoCodes = await PromoCode.find();
        res.status(200).json({ success: true, promoCodes });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch promo codes', error });
    }
};

exports.getPromoCodeById = async (req, res) => {
    const { promoCodeId } = req.params;

    try {
        const promoCode = await PromoCode.findById(promoCodeId);
        if (!promoCode) {
            return res.status(404).json({ success: false, message: 'Promo code not found' });
        }
        res.status(200).json({ success: true, promoCode });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch promo code', error });
    }
};

exports.updatePromoCode = async (req, res) => {
    const { promoCodeId } = req.params;
    const { title, percentage } = req.body;

    try {
        const promoCode = await PromoCode.findByIdAndUpdate(
            promoCodeId,
            { title, percentage },
            { new: true, runValidators: true }
        );
        if (!promoCode) {
            return res.status(404).json({ success: false, message: 'Promo code not found' });
        }
        res.status(200).json({ success: true, promoCode });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update promo code', error });
    }
};

exports.deletePromoCode = async (req, res) => {
    const { promoCodeId } = req.params;

    try {
        const promoCode = await PromoCode.findByIdAndDelete(promoCodeId);
        if (!promoCode) {
            return res.status(404).json({ success: false, message: 'Promo code not found' });
        }
        res.status(200).json({ success: true, message: 'Promo code deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete promo code', error });
    }
};
