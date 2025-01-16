const mongoose = require('mongoose')

const schema = mongoose.Schema

const tourismGovernerSchema = new schema({

    username: {
        type: String,
        required: true,
        unique: true
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
      }
    
}, { timestamps : true })

module.exports = mongoose.model('tourismGoverner' ,tourismGovernerSchema)