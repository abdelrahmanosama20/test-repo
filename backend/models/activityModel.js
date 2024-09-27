const mongoose = require('mongoose')

const schema = mongoose.Schema

const activitySchema = new schema({

    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    duration: {
        type: Number, // Duration in hours or minutes depending on your preference
        required: true
    },
    location: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    time: {
        type: String, // Could be formatted as "HH:MM" or "AM/PM" format
        required: true
    },
    category: {
        type: String,
        required: true
    },
    ratings: {
        type: Number, // Assuming ratings are out of 5
        min: 0,
        max: 5,
        default: 0 // Default rating if not provided
    },
    tags: {
        type: [String], // Array of tags for categorization
        required: false
    },
    tourGuideId: { // New field to reference the tour guide
        type: schema.Types.ObjectId,
        ref: 'tourGuide', // Reference to the TourGuide model
    },
    touristIds: [{ // Changed to an array to hold multiple tourist references
        type: schema.Types.ObjectId,
        ref: 'tourist', // Reference to the Tourist model
    }],
    advertiserId: { // New field to reference the tour guide
        type: schema.Types.ObjectId,
        ref: 'advertiser', // Reference to the TourGuide model
    }

}, { timestamps : true})

activitySchema.pre('validate', function (next) {
    // Ensure that either tourGuideId or advertiserId is present, but not both
    if ((this.tourGuideId && this.advertiserId) || (!this.tourGuideId && !this.advertiserId)) {
        next(new Error('Either tourGuideId or advertiserId is required, but both cannot be filled or missing.'));
    } else {
        next(); // Validation passed, continue to save
    }
});

module.exports = mongoose.model('activity' ,activitySchema)