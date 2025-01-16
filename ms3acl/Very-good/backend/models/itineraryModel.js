const mongoose = require('mongoose');

const schema = mongoose.Schema;

const itinerarySchema = new schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  ratings: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  numberOfRatings : {
    type : Number,
    default : 1
  },
  activities: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    duration: {
      type: Number, // in minutes
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    location: {
      coordinates: {
        lat: Number,
        lng: Number
      },
      address: String
    },
    price: Number
  }],
  locationsToVisit: [{
    name: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    address: String
  }],
  language: {
    type: String,
    enum: ['English', 'Spanish', 'French', 'German', 'Chinese', 'Other'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  availableDates: [{
    type: Date,
    required: true
  }],
  availableTimes: [{
    type: String, // e.g., "09:00 AM", "02:00 PM"
    required: true
  }],
  accessibility: {
    type: Boolean,
    default: false
  },
  pickUpLocation: {
    type: String,
    required: true
  },
  dropOffLocation: {
    type: String,
    required: true
  },
  touristIds: [{ // Hold multiple tourist references
    type: schema.Types.ObjectId,
    ref: 'tourist',
    required: true
  }],
  tourGuideId: {
    type: schema.Types.ObjectId,
    ref: 'tourGuide',
    required: true
  },
  tags: [{ // New field for storing tag references
    type: schema.Types.ObjectId,
    ref: 'Tag', // Reference to the Tag model
    required: false // Make this optional if you want
  }],
  isActive: {
    type: Boolean,
    default : true
  },
  isAppropriate : {
    type : Boolean,
    deafult : true
  },
  flagged: {
     type: Boolean, default: false 
    },
    commentsArray: [
      {
        comment: {
          type: String,
          required: true
        },
        touristId: {
          type: schema.Types.ObjectId,
          ref: 'Tourist',  
          required: true
        }
      }
    ]

}, { timestamps: true });

const Itinerary = mongoose.model('itinerary', itinerarySchema);

module.exports = Itinerary;
