const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const schema = mongoose.Schema

const tourismGovernerSchema = new schema({

    username: {
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
      }
    
}, { timestamps : true })

// Pre-save hook to hash password before saving
tourismGovernerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('tourismGoverner' ,tourismGovernerSchema)