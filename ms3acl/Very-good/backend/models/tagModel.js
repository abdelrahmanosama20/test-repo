const mongoose = require('mongoose');

const schema = mongoose.Schema;

const tagSchema = new schema({
    name: {
        type: String,
        required: false,
    },
    tourismGovernerId: {
        type: schema.Types.ObjectId,
        ref: 'tourismGoverner',
        required: false // Assuming this should be required
    },
    category: {
        type: String,
        enum: ['preference', 'general'], // Specify whether the tag is a preference or general
        default: 'general' // Default value
    },
}, { timestamps: true });

module.exports = mongoose.model('Tag', tagSchema);