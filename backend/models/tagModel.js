const mongoose = require('mongoose')

const schema = mongoose.Schema

const tagSchema = new schema({

    name: {
        type: String,
        required: true
    },
    tourismGovernerId: {
        type: schema.Types.ObjectId,
        ref: 'tourismGoverner'
    },

}, { timestamps : true})

module.exports = mongoose.model('tag' ,tagSchema)
