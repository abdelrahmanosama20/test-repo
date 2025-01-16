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
    image: {
        type: String
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
    },
    pictures: {
        type: [String], // Array of URLs for pictures
        required: false
    },
    sales: {
        type: Number, // how many times this product was sold
        default : 0
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    reviewsArray: [
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
      ],
      ratings: {
        type: Number,
        min: 0,
        max: 5,
        default: 5
      },
      numberOfRatings : {
        type : Number,
        default : 1
      }
}, { timestamps: true });


module.exports = mongoose.model('product' ,productSchema)