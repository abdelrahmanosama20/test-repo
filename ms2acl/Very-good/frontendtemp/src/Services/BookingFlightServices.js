import axios from 'axios';

export const fetchAccessToken = async () => {
    console.error('key :');
  console.error('secret :');
  const clientId = 'a';
  const clientSecret = 'a';
  console.error('key :', clientId);
  console.error('secret :', clientSecret);

  try {
    const response = await axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const token = response.data.access_token;
    console.log('Access Token:', token);
    return token;
  } catch (error) {
    console.error('Error fetching access token:', error);
    return null;
  }
};

export const fetchFlightoffers = async (data) => {
    const token = await fetchAccessToken();  // Fetch the access token
  
    if (!token) {
      console.error('No access token available.');
      return null;
    }
  
    try {
      const response = await axios.post(
        'https://test.api.amadeus.com/v2/shopping/flight-offers',
        data,  // Send the request body
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',  // Set content type for JSON
          },
        }
      );

      console.log('Flight Offers Response:', response.data);

      return response.data;  // Return the response data containing flight offers
    } catch (error) {
        if (error.response) {
            // The request was made, and the server responded with a status code outside the range of 2xx
            console.error('Error fetching flight offers:', error.response.data);
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        } else {
            // The request was made but no response was received
            console.error('Error:', error.message);
        }
        return null;
    }
  };

  export const createFlightOrder = async (flightOrderData) => {
    const token = await fetchAccessToken(); // Fetch the access token
  
    if (!token) {
      console.error('No access token available.');
      return null;
    }
  
    try {
      const response = await axios.post(
        'https://test.api.amadeus.com/v1/booking/flight-orders',
        flightOrderData,  // Send the flight order data
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',  // Set content type for JSON
          },
        }
      );
  
      console.log('Flight Order Created:', response.data);
  
      return response.data;  // Return the response data containing flight order details
    } catch (error) {
      if (error.response) {
        // The request was made, and the server responded with a status code outside the range of 2xx
        console.error('Error creating flight order:', error.response.data);
        console.error('Status:', error.response.status);
        console.error('Headers:', error.response.headers);
      } else {
        // The request was made but no response was received
        console.error('Error:', error.message);
      }
      return null;
    }
  };
  

  
