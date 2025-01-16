const mongoose = require('mongoose')

const schema = mongoose.Schema

const tourGuideSchema = new schema({

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
    mobile: {
        type: Number,
        required: true
      },
    nationality: {
        type: String,
        required: true
      },
    dob: {
        type: Date,  // Add the DOB field as a Date type
        required: true // You can decide if you want it to be required or not
      },
    isAccepted: {
        type: String,
        default : "false",
        required: false
      },
      photo: {
        type : String, // url of a photo
        required : false
    },
      IdDocument: {
        type : String, // url of a photo
        required : false
      },
      certificatesDocument:[ 
      {
        type : String,
        required : false
      }
    ],
    acceptedTermsAndConditions :{
      type : Boolean,
      default : false
    },
    yearsOfExperience: {
        type: Number,  // Add the DOB field as a Date type
        required: true // You can decide if you want it to be required or not
      },
    previousJob: {
        type: String,  // Add the DOB field as a Date type
        required: false // You can decide if you want it to be required or not
      },
    createdItineraries: [ // only for tourist
        {
          type: schema.Types.ObjectId,
          ref: 'itinerary'
        }
      ],
    createdActivities: [ //only for tourist
      {
        type: schema.Types.ObjectId,
        ref: 'activity' 
      },
      ],
      rating : {
        type : Number,
        min : 0,
        max : 5,
        default : 5
      },
      numberOfRatings : {
        type : Number,
        default : 1
      },
      commentsArray: [
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
      isPendingAcceptance : {
        type : Boolean,
        default : true,
      }
      ,
      delete: {
        type: Boolean, // Change from String to an array of strings
        required: false
    },
}, { timestamps : true })

module.exports = mongoose.model('tourGuide' ,tourGuideSchema)