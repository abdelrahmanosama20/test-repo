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
      }
      ]

}, { timestamps : true })

module.exports = mongoose.model('tourGuide' ,tourGuideSchema)