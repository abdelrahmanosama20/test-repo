const mongoose = require('mongoose')

const schema = mongoose.Schema

const touristSchema = new schema({

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
      job: {
        type: String,  
        required: false 
      },
      bookedItineraries: [ // only for tourist
        {
          type: schema.Types.ObjectId,
          ref: 'itinerary'
        }
      ],
      bookedActivities: [ //only for tourist
      {
        type: schema.Types.ObjectId, ref: 'activity' 
      }
      ],
      bookedMuseums: [ //only for tourist
      {
       type: schema.Types.ObjectId, ref: 'Museum' 
      }
      ],
      wallet: { // only for tourist
        type: Number,
        default: 0 
      }
    
}, { timestamps : true })

module.exports = mongoose.model('tourist' ,touristSchema)