import axios from 'axios';

export const fetchAccessToken = async () => {

  const clientId = 'vouIZLXjsA0kJKJpQcCGXmEGFInZOADS';
  const clientSecret = 't81xfIvqByEgzv50';


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


export const fetchHotelsByCity = async ({ cityCode, radius = 5, radiusUnit = 'KM', chainCodes = [], amenities = [], ratings = [], hotelSource = 'ALL' }) => {
    const token = await fetchAccessToken();  // Fetch the access token
  
    if (!token) {
        console.error('No access token available.');
        return null;
    }

    // Construct the query string based on provided parameters
    const params = new URLSearchParams({
        cityCode,
        radius,
        radiusUnit,
        hotelSource,
    });

    // Append optional parameters if they are provided
    if (chainCodes.length) {
        params.append('chainCodes', chainCodes.join(','));
    }
    if (amenities.length) {
        params.append('amenities', amenities.join(','));
    }
    if (ratings.length) {
        params.append('ratings', ratings.join(','));
    }

    try {
        const response = await axios.get(
            `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?${params.toString()}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',  // Set content type for JSON
                },
            }
        );

        console.log('Hotels Response:', response.data);

        return response.data;  // Return the response data containing hotel information
    } catch (error) {
        if (error.response) {
            // The request was made, and the server responded with a status code outside the range of 2xx
            console.error('Error fetching hotels:', error.response.data);
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        } else {
            // The request was made but no response was received
            console.error('Error:', error.message);
        }
        return null;
    }
};


  export const createFlightOffer = async (flightOfferData) => {
    try {
      // Define the API endpoint for creating a flight offer
      const apiUrl = 'http://localhost:4000/api/flightOffers/'; // Change this URL based on your server configuration
  
      // Send a POST request to create the flight offer
      const response = await axios.post(apiUrl, flightOfferData);
  
      // Handle the response and return the created flight offer
      console.log('Flight Offer Created:', response.data);
      return response.data;
    } catch (error) {
      // Handle errors, logging them for troubleshooting
      console.error('Error creating flight offer:', error.response?.data || error.message);
      throw error;
    }
  };

  export const createHotelOffer = async (hotelOfferData) => {
    try {
      // Define the API endpoint for creating a flight offer
      const apiUrl = 'http://localhost:4000/api/hotelOffers/'; // Change this URL based on your server configuration
  
      // Send a POST request to create the flight offer
      const response = await axios.post(apiUrl, hotelOfferData);
  
      // Handle the response and return the created flight offer
      console.log('Hotel Offer Created:', response.data);
      return response.data;
    } catch (error) {
      // Handle errors, logging them for troubleshooting
      console.error('Error creating hotel offer:', error.response?.data || error.message);
      throw error;
    }
  };

  export const fetchFlightWithId = async (id) => {
    try {
      // Define the API endpoint for fetching a flight offer by ID
      const apiUrl = `http://localhost:4000/api/flightOffers/${id}`; // Change this URL based on your server configuration
  
      // Send a GET request to fetch the flight offer
      const response = await axios.get(apiUrl);
  
      // Handle the response and return the fetched flight offer
      console.log('Flight Offer Retrieved:', response.data);
      return response.data.data;
    } catch (error) {
      // Handle errors, logging them for troubleshooting
      console.error('Error retrieving flight offer:', error.response?.data || error.message);
      throw error;
    }
  };

  export const addFlightOfferToTourist = async (userId, offerId) => {
    try {
      // Define the API endpoint for adding a flight offer to the tourist
      console.log("userId :", userId)
      console.log("offerId :", offerId)

      const apiUrl = `http://localhost:4000/api/tourists/${userId}/book-flight-offer/${offerId}`; // Adjust the URL according to your server configuration
  
      // Send a PUT request to add the flight offer to the tourist
      const response = await axios.put(apiUrl);
  
      // Handle the response and return the result
      console.log('Flight offer added to tourist:', response.data);
      return response.data;
    } catch (error) {
      // Handle errors, logging them for troubleshooting
      console.error('Error adding flight offer to tourist:', error.response?.data || error.message);
      throw error; // You can also handle the error in the UI as needed
    }
  };

  export const addHotelOfferToTourist = async (userId, offerId) => {
    try {
      // Define the API endpoint for adding a flight offer to the tourist
      console.log("userId :", userId)
      console.log("offerId :", offerId)

      const apiUrl = `http://localhost:4000/api/tourists/${userId}/book-hotel-offer/${offerId}`; // Adjust the URL according to your server configuration
  
      // Send a PUT request to add the flight offer to the tourist
      const response = await axios.put(apiUrl);
  
      // Handle the response and return the result
      console.log('Hotel offer added to tourist:', response.data);
      return response.data;
    } catch (error) {
      // Handle errors, logging them for troubleshooting
      console.error('Error adding Hotel offer to tourist:', error.response?.data || error.message);
      throw error; // You can also handle the error in the UI as needed
    }
  };

  // export const createFlightOrder = async (flightOrderData) => {
  //   const token = await fetchAccessToken(); // Fetch the access token
  
  //   if (!token) {
  //     console.error('No access token available.');
  //     return null;
  //   }
  
  //   try {
  //     const response = await axios.post(
  //       'https://test.api.amadeus.com/v1/booking/flight-orders',
  //       flightOrderData,  // Send the flight order data
  //       {
  //         headers: {
  //           'Authorization': `Bearer ${token}`,
  //           'Content-Type': 'application/json',  // Set content type for JSON
  //         },
  //       }
  //     );
  
  //     console.log('Flight Order Created:', response.data);
  
  //     return response.data;  // Return the response data containing flight order details
  //   } catch (error) {
  //     if (error.response) {
  //       // The request was made, and the server responded with a status code outside the range of 2xx
  //       console.error('Error creating flight order:', error.response.data);
  //       console.error('Status:', error.response.status);
  //       console.error('Headers:', error.response.headers);
  //     } else {
  //       // The request was made but no response was received
  //       console.error('Error:', error.message);
  //     }
  //     return null;
  //   }
  // };

  export const createFlightInfo = async (data) => {
    try {
      const response = await axios.post('http://localhost:4000/api/flightInfos', data);
      console.log('Flight information created successfully:', response.data);
      return response.data; // Return the response data if needed
    } catch (error) {
      console.error('Error creating flight information:', error);
      throw error; // Re-throw the error for further handling if needed
    }
  };
  
  export const getAllFlightInfos = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/flightInfos');
      console.log('All flight information retrieved successfully:', response.data);
      return response.data; // Return the response data if needed
    } catch (error) {
      console.error('Error retrieving all flight information:', error);
      throw error; // Re-throw the error for further handling if needed
    }
  };
  
  // Function to get specific flight information by ID
  export const getFlightInfoById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/flightInfos/${id}`);
      console.log('Flight information retrieved successfully:', response.data);
      return response.data; // Return the response data if needed
    } catch (error) {
      console.error(`Error retrieving flight information with ID ${id}:`, error);
      throw error; // Re-throw the error for further handling if needed
    }
  };

  export const createHotelInfo = async (data) => {
    try {
      const response = await axios.post('http://localhost:4000/api/hotelInfos', data);
      console.log('Hotel information created successfully:', response.data);
      return response.data; // Return the response data if needed
    } catch (error) {
      console.error('Error creating hotel information:', error);
      throw error; // Re-throw the error for further handling if needed
    }
  };
  
  export const getAllHotelInfos = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/hotelInfos');
      console.log('All hotel information retrieved successfully:', response.data);
      return response.data; // Return the response data if needed
    } catch (error) {
      console.error('Error retrieving all hotel information:', error);
      throw error; // Re-throw the error for further handling if needed
    }
  };
  
  // Function to get specific hotel information by offer ID
  export const getHotelInfoByOfferId = async (offerId) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/hotelInfos/${offerId}`);
      console.log('Hotel information retrieved successfully:', response.data);
      return response.data; // Return the response data if needed
    } catch (error) {
      console.error(`Error retrieving hotel information with offer ID ${offerId}:`, error);
      throw error; // Re-throw the error for further handling if needed
    }
  };

  export const getHotelById = async (id) => {
    try {
      // Define the API endpoint, adding the hotel offer ID to the URL
      const apiUrl = `http://localhost:4000/api/hotelOffers/${id}`;
  
      // Send a GET request to retrieve the hotel offer by ID
      const response = await axios.get(apiUrl);
  
      // Handle the response and return the retrieved hotel offer data
      console.log('Hotel Offer Retrieved:', response.data);
      return response.data;
    } catch (error) {
      // Handle errors, logging them for troubleshooting
      console.error(`Error retrieving hotel offer with ID ${id}:`, error.response?.data || error.message);
      throw error;
    }
  };
