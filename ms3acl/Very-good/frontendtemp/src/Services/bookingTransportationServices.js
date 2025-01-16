import axios from 'axios';

// Function to book transportation
export const bookTransportation = async (touristId, transportationId) => {
  try {
    const response = await axios.patch(`http://localhost:4000/api/tourists/${touristId}/bookTransportation`, {
      transportationId
    });

    console.log('Transportation booked successfully:', response.data);
    return response.data; // Return the response data for further processing if needed
  } catch (error) {
    console.error('Error booking transportation:', error.response ? error.response.data : error.message);
    throw error; // Re-throw the error for handling it in the calling function if needed
  }
};

export const fetchTransportationsByAdvertiserId = async (advertiserId) => {
  try {
    const response = await axios.get(`http://localhost:4000/api/transportations/advertiser/${advertiserId}`);
    console.log('Transportations fetched successfully:', response.data);
    return response.data; // Return the data received from the API
  } catch (error) {
    console.error('Error fetching transportations:', error.response ? error.response.data : error.message);
    throw error; // Re-throw the error for handling in the calling function if needed
  }
};

export const createTransportation = async (transportationData) => {
  try {
    const response = await axios.post('http://localhost:4000/api/transportations/', transportationData);
    return response.data;
  } catch (error) {
    console.error('Error creating transportation:', error);
    throw error;
  }
};

export const editTransportation = async (transportationId, transportationData) => {
  try {
    const response = await axios.put(`http://localhost:4000/api/transportations/${transportationId}`, transportationData);
    console.log('Transportation edited successfully:', response.data);
    return response.data; // Return the updated transportation data
  } catch (error) {
    console.error('Error editing transportation:', error.response ? error.response.data : error.message);
    throw error; // Re-throw the error for handling in the calling function if needed
  }
};

// Function to delete a transportation record
export const deleteTransportation = async (transportationId) => {
  try {
    const response = await axios.delete(`http://localhost:4000/api/transportations/${transportationId}`);
    console.log('Transportation deleted successfully:', response.data);
    return response.data; // Return a message confirming deletion
  } catch (error) {
    console.error('Error deleting transportation:', error.response ? error.response.data : error.message);
    throw error; // Re-throw the error for handling in the calling function if needed
  }
};

export default bookTransportation;
