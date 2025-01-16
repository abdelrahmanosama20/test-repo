const mongoose = require('mongoose');

const schema = mongoose.Schema


const hotelInfoSchema = new schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  nationality: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  roomType: {
    type: String,
    required: true,
    enum: ['Master Room', 'Double', 'Triple', 'Single', 'Suite'], // Example room types
    trim: true
  },
  extraBed: {
    type: Boolean,
    default: false
  },
  offerId: {
    type : schema.Types.ObjectId,
    ref : 'HotelOffer'
  },
}, {
  timestamps: true  // Adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model('hotelInfo', hotelInfoSchema);
