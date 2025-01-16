import axios from 'axios';
export const makePayment = async (touristId, amountPaid) => {
    const url =`http://localhost:4000/api/tourists/${touristId}/make-payment`;
    try {
        console.log("TouristID = ", touristId)
        console.log("amount paid = ", amountPaid)
        const response = await axios.post(url, {amountPaid});
        return response.data; // Return the response data from the API
    } catch (error) {
        console.error('Error making payment:', error); // Log any errors
        throw error; // Rethrow the error for further handling
    }
};
export const makePayment2 = async (touristId, amountPaid) => {
  const url =`http://localhost:4000/api/tourists/${touristId}/make-payment2`;
  try {
      console.log("TouristID = ", touristId)
      console.log("amount paid = ", amountPaid)
      const response = await axios.post(url, {amountPaid});
      return response.data; // Return the response data from the API
  } catch (error) {
      console.error('Error making payment:', error); // Log any errors
      throw error; // Rethrow the error for further handling
  }
};
export const redeemPoints = async (touristId, pointsToRedeem) => {
    const url = `http://localhost:4000/api/tourists/${touristId}/redeem-points`; // Backend endpoint for redeeming points
  
    try {
      console.log("TouristID = ", touristId);
      console.log("Points to redeem = ", pointsToRedeem);
  
      // Send POST request with the points to redeem
      const response = await axios.post(url, { pointsToRedeem });
  
      return response.data; // Return the updated tourist data after redeeming points
    } catch (error) {
      console.error('Error redeeming points:', error); // Log any errors
      throw error; // Rethrow the error for further handling
    }
  };