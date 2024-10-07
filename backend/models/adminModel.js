const mongoose = require('mongoose');

const schema = mongoose.Schema;

const adminSchema = new schema({
    username: {
        type: String,
        required: true,
        unique: true // Ensure username is unique
    },

    email: {
        type: String,
        required: true,
        unique: true // Ensure email is unique
    },

    
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
