import axios from 'axios';


export const addCommentToItinerary = async (itineraryId, touristId, comment) => {
    try {
        const response = await axios.post('http://localhost:4000/api/itineraries/addComment', {
            itineraryId,
            touristId,
            comment
        });
        
        console.log('Comment added successfully:', response.data);
        return response.data; // You can handle this response data in your calling function if needed
    } catch (error) {
        console.error('Error adding comment:', error.response ? error.response.data : error.message);
        throw error; // Optionally, rethrow the error to handle it further up the call stack
    }
};

export const addCommentToActivity = async (activityId, touristId, comment) => {
    try {
        const response = await axios.post('http://localhost:4000/api/activities/addComment', {
            activityId,
            touristId,
            comment
        });
        
        console.log('Comment added successfully:', response.data);
        return response.data; // You can handle this response data in your calling function if needed
    } catch (error) {
        console.error('Error adding comment:', error.response ? error.response.data : error.message);
        throw error; // Optionally, rethrow the error to handle it further up the call stack
    }
};

export const addCommentToTourGuide = async (tourGuideId, touristId, comment) => {
    try {
        const response = await axios.post('http://localhost:4000/api/tourGuides/addComment', {
            tourGuideId,
            touristId,
            comment
        });
        
        console.log('Comment added successfully:', response.data);
        return response.data; // You can handle this response data in your calling function if needed
    } catch (error) {
        console.error('Error adding comment:', error.response ? error.response.data : error.message);
        throw error; // Optionally, rethrow the error to handle it further up the call stack
    }
};
//addReviewToProduct
export const addReviewToProduct = async (productId, touristId, comment) => {
    try {
        const response = await axios.post('http://localhost:4000/api/products/review', {
            productId,
            touristId,
            comment
        });
        
        console.log('review added successfully:', response.data);
        return response.data; // You can handle this response data in your calling function if needed
    } catch (error) {
        console.error('Error adding review:', error.response ? error.response.data : error.message);
        throw error; // Optionally, rethrow the error to handle it further up the call stack
    }
};
