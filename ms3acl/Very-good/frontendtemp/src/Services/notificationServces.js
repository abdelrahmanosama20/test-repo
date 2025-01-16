import axios from 'axios';

export const fetchNotifications = async (targetType, targetId) => {
    try {
        const response = await axios.get(`http://localhost:4000/api/notifications/${targetType}/${targetId}`);
        return response.data.notifications;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
};

export const markNotificationAsRead = async (id) => {
    try {
        await axios.patch(`http://localhost:4000/api/notifications/${id}`);
        console.log('Notification marked as read');
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
};

export const deleteNotification = async (id) => {
    try {
        await axios.delete(`http://localhost:4000/api/notifications/${id}`);
        console.log('Notification deleted successfully');
    } catch (error) {
        console.error('Error deleting notification:', error);
    }
};