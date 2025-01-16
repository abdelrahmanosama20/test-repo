// TouristService.js

import axios from 'axios';

const API_URL = 'http://localhost:4000/api/tourists';

// Directly exporting the functions
// TouristService.js
export const getTouristByEmail = async (email) => {
    try {
        const response = await axios.post(`http://localhost:4000/api/tourists/getByEmail`, {
            email : email  // Pass email as query parameter

            
        });
        console.log("trial",email)
        return response.data;
    } catch (error) {
        console.error("Error fetching tourist by email:" ,email, error);
        throw new Error("Failed to fetch tourist data");  // Re-throw the error
    }
};





export const deleteTourist = async (userId) => {
    try {
        const response = await axios.delete(`http://localhost:4000/api/tourists/${userId}`);
        console.log("true")
        return response.data;
    } catch (error) {
        throw error;
    }
};
