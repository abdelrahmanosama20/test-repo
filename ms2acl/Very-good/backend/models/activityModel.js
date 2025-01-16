const mongoose = require('mongoose')
const Tag = require('./tagModel'); // Import the tag model
const tagSchema = Tag.schema;

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
        lat: {
            type: Number, // Latitude
            required: true
        },
        lng: {
            type: Number, // Longitude
            required: true
        }
    },
    price: {
        type: Number,
        required: true
    },
    time: {
        hours: {
            type: Number, // Hour in 24-hour format
            required: true
        },
        minutes: {
            type: Number, // Minutes
            required: true
        }
    },
    categoryId: {
        type: schema.Types.ObjectId,
        ref: 'category', // Reference to the Category model
        required: true
    },
    ratings: {
        type: Number,
        min: 0,
        max: 5,
        default: 5
    },
      numberOfRatings : {
        type : Number,
        default : 1
    },
    tags: {
        type: [tagSchema], // Embed array of tags
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
    },
    specialDiscount: {
        type: Number, // Discount in percentage or fixed amount
        default: 0 // Default discount is 0 if not provided
    },
    bookingOpen: {
        type: Boolean, // Boolean to indicate if booking is open
        default: true // Default value is true (open)
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

}, { timestamps : true})
activitySchema.pre('validate', function (next) {
    if ((this.tourGuideId && this.advertiserId) || (!this.tourGuideId && !this.advertiserId)) {
        next(new Error('Either tourGuideId or advertiserId is required, but both cannot be filled or missing.'));
    } else {
        next();
    }
});

module.exports = mongoose.model('activity' ,activitySchema)