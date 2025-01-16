const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    targetType: {
        type: String,
        enum: ['Tourist', 'TourGuide', 'Advertiser', 'Seller', 'Admin'], // Add all entity types
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true }); // Enable timestamps

module.exports = mongoose.model('Notification', notificationSchema);
