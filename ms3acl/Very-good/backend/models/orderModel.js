const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product', // Reference to the Product model
        required: true
         
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    }
}, { timestamps: true }); // Enable timestamps

module.exports = mongoose.model('order', orderSchema);
