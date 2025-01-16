const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Create a notification
router.post('/', notificationController.createNotification);

// Get all notifications for a target
router.get('/:targetType/:targetId', notificationController.getNotifications);

// Mark a notification as read
router.patch('/:id', notificationController.markAsRead);

// Delete a notification
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
