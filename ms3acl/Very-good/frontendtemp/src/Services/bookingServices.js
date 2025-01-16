// Fetch bookings
import axios from "axios";
export const fetchBookings = async (touristId) => {
    try {
        const response = await axios.get(`http://localhost:4000/api/bookings/${touristId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching bookings:', error);
        throw new Error('Failed to fetch bookings.');
    }
};

// Create booking
export const createBooking = async (touristId, selectedActivity, selectedItinerary, numberOfParticipants) => {
    const bookingData = {
        touristId,
        activityId: selectedActivity || undefined,
        itineraryId: selectedItinerary || undefined,
        numberOfParticipants,
    };

    try {
        const response = await axios.post('http://localhost:4000/api/bookings', bookingData);
        return response.data;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw new Error('Error creating booking. Please try again.');
    }
};

// Cancel booking
export const cancelBooking = async (bookingId) => {
    try {
        const response = await axios.patch(`http://localhost:4000/api/bookings/cancel/${bookingId}`);
        return response.data;
    } catch (error) {
        console.error('Error cancelling booking:', error);
        throw new Error('Error cancelling booking. Please try again.');
    }
};
