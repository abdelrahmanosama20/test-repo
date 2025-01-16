const mongoose = require('mongoose');
const schema = mongoose.Schema;

// Define Seller schema
const sellerSchema = new schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    IdDocument: {
        type : String, // url of a photo
        required : true
    },
    taxationRegistryCard: {
      type : String, // url of a photo
      required : true
    },
    logo: {
        type : String, // url of a photo
        required : true
    },
    isAccepted: {
        type: String,
        required: true
      },
    acceptedTermsAndConditions :{
        type : Boolean,
        default : false
      },
    createdProducts: [{
        type: schema.Types.ObjectId,
        ref: 'product' // Reference to the Product model
    }]
}, { timestamps: true });

module.exports = mongoose.model('seller' ,sellerSchema)