const mongoose = require('mongoose');

const hotelOfferSchema = new mongoose.Schema(
  {
    data: { type: mongoose.Schema.Types.Mixed, required: true }, // Store entire JSON as a single field
  },
  { timestamps: true } // Enable timestamps
);

module.exports = mongoose.model('HotelOffer', hotelOfferSchema);