const mongoose = require('mongoose');

const schema = mongoose.Schema;

const historicalPlaceSchema = new schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    pictures: {
        type: [String], // Array of URLs for pictures
        required: false
    },
    location: {
        city: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: false
        }
    },
    openingHours: {
        monday: {
            type: String,
            required: true
        },
        tuesday: {
            type: String,
            required: true
        },
        wednesday: {
            type: String,
            required: true
        },
        thursday: {
            type: String,
            required: true
        },
        friday: {
            type: String,
            required: true
        },
        saturday: {
            type: String,
            required: true
        },
        sunday: {
            type: String,
            required: true
        }
    },
    ticketPrices: {
        foreigner: {
            type: Number,
            required: true
        },
        native: {
            type: Number,
            required: true
        },
        student: {
            type: Number,
            required: true
        }
    },
    museum :{
        type : Boolean
    },
    tourismGovernerId:{
        type:schema.Types.ObjectId,
        ref: 'tourist',
    },
    tags: [{ // Array of ObjectIds referencing the tag model
        type: schema.Types.ObjectId,
        ref: 'tag'
    }]
}, { timestamps: true });

module.exports = mongoose.model('historicalPlace', historicalPlaceSchema);
