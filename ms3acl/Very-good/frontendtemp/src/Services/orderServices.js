import axios from 'axios';

export const createOrder = async (orderData) => {
    try {
        const response = await axios.post('http://localhost:4000/api/orders', orderData);
        return response.data.order;
    } catch (error) {
        console.error('Error creating order:', error);
        return null;
    }
};

export const fetchAllOrders = async () => {
    try {
        const response = await axios.get('/api/orders');
        return response.data.orders;
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
};

export const fetchOrderById = async (orderId) => {
    try {
        const response = await axios.get(`/api/orders/${orderId}`);
        return response.data.order;
    } catch (error) {
        console.error('Error fetching order:', error);
        return null;
    }
};

export const updateOrderStatus = async (orderId, status) => {
    try {
        const response = await axios.patch(`/api/orders/${orderId}`, { status });
        return response.data.order;
    } catch (error) {
        console.error('Error updating order status:', error);
        return null;
    }
};

export const deleteOrder = async (orderId) => {
    try {
        await axios.delete(`/api/orders/${orderId}`);
        console.log('Order deleted successfully');
    } catch (error) {
        console.error('Error deleting order:', error);
    }
};