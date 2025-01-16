const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// Create a new order
exports.createOrder = async (req, res) => {
    const { products } = req.body;

    try {
        // Calculate total price
        let totalPrice = 0;
        for (const productId of products) {
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ success: false, message: `Product with ID ${productId} not found.` });
            }
            totalPrice += product.price;
        }

        // Create the order
        const order = new Order({
            products,
            totalPrice
        });

        await order.save();
        res.status(201).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create order', error });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('products');
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch orders', error });
    }
};

exports.getOrderById = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await Order.findById(orderId).populate('products');
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch order', error });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update order status', error });
    }
};

exports.deleteOrder = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await Order.findByIdAndDelete(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.status(200).json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete order', error });
    }
};
exports.viewCancelledOrderAmount = async (req, res) => {
    const { orderId } = req.params;

    try {
        // Fetch the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Check if the order is cancelled
        if (order.status !== 'Cancelled') {
            return res.status(400).json({ success: false, message: 'This order is not cancelled' });
        }

        // Return the total price of the cancelled order
        res.status(200).json({
            success: true,
            cancelledOrderAmount: order.totalPrice
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch cancelled order amount', error });
    }
};

