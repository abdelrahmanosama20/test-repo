// models/bookingModel.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    touristId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tourist',
        required: true
    },
    activityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'activity',
        required: false // Optional for flexibility
    },
    itineraryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'itinerary',
        required: false // Optional for flexibility
    },
    numberOfParticipants: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'confirmed', 'Cancelled'],
        default: 'confirmed'
    },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);