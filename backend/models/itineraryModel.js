const mongoose = require('mongoose');

const schema = mongoose.Schema;

const itinerarySchema = new schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    activities: [{
        type: schema.Types.ObjectId,
        ref: 'activity' // Reference to the Activity model
    }],
    touristIds: [{ // Changed to an array to hold multiple tourist references
        type: schema.Types.ObjectId,
        ref: 'tourist', // Reference to the Tourist model
        required: true
    }],
    tourGuideId: {
        type: schema.Types.ObjectId,
        ref: 'tourGuide', // Reference to the Tour Guide model
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model('itinerary', itinerarySchema);