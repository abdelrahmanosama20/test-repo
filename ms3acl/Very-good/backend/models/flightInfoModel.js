const mongoose = require('mongoose')

const schema = mongoose.Schema

const flightInfoSchema = new schema({

      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      passportNumber: {
        type: String,
        required: true
      },
      phoneNumber: {
        type: String,
        required: true
      },
      checkedBags : {
        type: Number,
        required: true
      },
      seatPreference : {
        type : String
      },
      nationality: {
        type: String,
        required: true
      },
      dateOfBirth: {
        type: Date,  // Add the DOB field as a Date type
        required: true // You can decide if you want it to be required or not
      },
      offerId : {
        type : schema.Types.ObjectId,
        ref : 'FlightOffer'
      }
    
}, { timestamps : true })

module.exports = mongoose.model('flightInfo' ,flightInfoSchema)