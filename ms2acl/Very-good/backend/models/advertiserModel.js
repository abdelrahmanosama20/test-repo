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
        required : true
    },
    acceptedTermsAndConditions :{
      type : Boolean,
      default : false
    },
    IdDocument: {
        type : String, // url of a photo
        required : true
    },
    taxationRegistryCard: {
      type : String, // url of a photo
      required : true
    },
    isAccepted: {
        type: String,
        required: true
      },
      createdActivities: [ //only for tourist
        {
          type: schema.Types.ObjectId,
          ref: 'activity' 
        }
      ]
}, { timestamps : true })

module.exports = mongoose.model('advertiser' ,advertiserSchema)