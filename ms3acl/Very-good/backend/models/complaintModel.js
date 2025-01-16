const mongoose = require('mongoose')

const schema = mongoose.Schema

const complaintSchema = new schema({

    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true, // Ensure email is included
    },
    isResolved: {
        type: Boolean,
        default: false
    },
    adminReply: {
        type: String,
        default: null  // Field to store the admin's reply
    }

}, { timestamps : true })

module.exports = mongoose.model('Complaint' ,complaintSchema)