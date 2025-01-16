const Notification = require('../models/notificationModel');

// Create a notification
exports.createNotification = async (req, res) => {
    const { targetId, targetType, subject, message } = req.body;

    try {
        const notification = new Notification({
            targetId,
            targetType,
            subject,
            message
        });
        await notification.save();

        res.status(201).json({ success: true, notification });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create notification', error });
    }
};

// Fetch notifications for a specific target
exports.getNotifications = async (req, res) => {
    const { targetId, targetType } = req.params;

    try {
        const notifications = await Notification.find({ targetId, targetType }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch notifications', error });
    }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
    const { id } = req.params;

    try {
        await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
        res.status(200).json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update notification', error });
    }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
    const { id } = req.params;

    try {
        await Notification.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Notification deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete notification', error });
    }
};
