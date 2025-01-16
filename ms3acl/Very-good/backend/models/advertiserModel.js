const mongoose = require('mongoose')

const schema = mongoose.Schema

const advertiserSchema = new schema({

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
    websiteLink: {
        type: String,
        required: true
      },
    hotline: {
        type: Number,
        required: true
      },
    logo: {
        type : String, // url of a photo
        required : false
    },
    acceptedTermsAndConditions :{
      type : Boolean,
      default : false
    },
    IdDocument: {
        type : String, // url of a photo
        required : false
    },
    taxationRegistryCard: {
      type: [String], // Change from String to an array of strings
      required: false
  },
    isAccepted: {
        type: String,
        default : "false",
        required: false
      },
      isPendingAcceptance : {
        type : Boolean,
        default : true,
      },
      delete: {
        type: Boolean, // Change from String to an array of strings
        required: false
    },
}, { timestamps : true })

module.exports = mongoose.model('advertiser' ,advertiserSchema)