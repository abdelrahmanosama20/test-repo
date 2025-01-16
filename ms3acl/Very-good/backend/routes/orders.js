const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Create a new order
router.post('/', orderController.createOrder);

// Get all orders
router.get('/', orderController.getAllOrders);

// Get an order by ID
router.get('/:orderId', orderController.getOrderById);

// Update order status
router.patch('/:orderId', orderController.updateOrderStatus);

// Delete an order
router.delete('/:orderId', orderController.deleteOrder);
// Get the amount of a cancelled order (for the tourist to view)
router.get('/:orderId/cancelled-amount', orderController.viewCancelledOrderAmount);


module.exports = router;
