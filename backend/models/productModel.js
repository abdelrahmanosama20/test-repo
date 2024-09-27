const mongoose = require('mongoose')

const schema = mongoose.Schema

const productSchema = new schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    stock: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0 // Default rating if not provided
    },
    sellerId: {
        type: schema.Types.ObjectId,
        ref: 'seller', // Reference to the Seller model
        required: true
    }
}, { timestamps: true });


module.exports = mongoose.model('product' ,productSchema)