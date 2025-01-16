const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransportationSchema = new Schema({
  advertiserId: {
    type: Schema.Types.ObjectId,
    ref: 'advertiser'
  },
  type: {
    type: String,
    enum: ['Bus', 'Train', 'Taxi', 'Rental Car', 'Flight'], // Enum for transportation types
    required: true,
  },
  provider: {
    type: String, // Name of the transportation company/provider
    required: true,
  }, 
  departureLocation: {
    type: String, // e.g., "New York"
    required: true,
  },
  arrivalLocation: {
    type: String, // e.g., "Boston"
    required: true,
  },
  departureTime: {
    type: Date, // Departure time of the transportation
    required: true,
  },
  arrivalTime: {
    type: Date, // Arrival time of the transportation
    required: true,
  },
  price: {
    type: Number, // Price of the transportation ticket
    required: true,
  },
  isAvailable: {
    type: Boolean, // Whether this transportation service is available for booking
    default: true,
  }
});

// Export the model
module.exports = mongoose.model('transportation', TransportationSchema);
