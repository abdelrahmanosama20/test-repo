const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true, // Promo codes should be unique
        trim: true
    },
    percentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100 // Restrict the value between 0 and 100
    }
}, { timestamps: true }); // Enable timestamps

module.exports = mongoose.model('promoCode', promoCodeSchema);
