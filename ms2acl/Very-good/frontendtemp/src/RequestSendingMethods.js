// RequestSendingMethods.js - contains all the methods that send requests used in the action listeners

import axios from "axios";

// Function for the registration of a tourist
const registerTourist = async (touristData) => {
    try {
      const response = await fetch('http://localhost:4000/api/tourists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(touristData),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Tourist registered successfully:', data);
        return data;
      } else {
        console.error('Error during registration:', data);
        return null;
      }
    } catch (error) {
      console.error('Network or server error:', error);
      return null;
    }
  };
  
  // Function to send a request to retrieve a certain tourist record by email
  const fetchTouristByEmail = async (emailObject) => {
    try {
      const response = await fetch('http://localhost:4000/api/tourists/getByEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailObject),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Tourist data retrieved successfully:', data);
        return data;
      } else {
        console.error('Error:', data.message);
        return null;
      }
    } catch (error) {
      console.error('Network error while fetching tourist:', error);
      return null;
    }
  };
  
  // Function to send a request for updating a tourist by email
  async function updateTouristByEmail(email, updatedData) {
    const url = 'http://localhost:4000/api/tourists/updateByEmail';
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, updatedData }),
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Error updating tourist');
      }
  
      const result = await response.json();
      console.log('Tourist updated successfully:', result);
      return result;
    } catch (error) {
      console.error('Error updating tourist:', error.message);
      throw error;
    }
  }

// RequestSendingMethods.js

export const sendComplaint = async (complaintData) => {
  const response = await fetch('http://localhost:4000/api/complaints/submit', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(complaintData),
  });

  if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || 'Something went wrong');
  }

  return await response.json(); // Return the successful response
};

const handleViewComplaints = async () => {
  try {
      console.log("View Complaints button clicked");
      
      // Fetch complaints from the backend endpoint
      const response = await fetch('http://localhost:4000/api/complaints');

      // Check if the response is okay
      if (!response.ok) {
          const errorText = await response.text(); // Get the response text for debugging
          console.error("Error fetching complaints:", errorText);
          throw new Error('Failed to fetch complaints');
      }

      // Parse the JSON response
      const complaints = await response.json();
      console.log(complaints); // Set this to state or handle it as needed
  } catch (error) {
      console.error("Error in handleViewComplaints:", error);
  }
};

// In RequestSendingMethods.js

export const fetchComplaintsByEmail = async (email) => {
  try {
    const response = await fetch(`http://localhost:4000/api/complaints/my-complaints?email=${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Include any necessary headers, e.g., authentication tokens
      },
    });

    if (!response.ok) {
      const errorData = await response.json(); // Attempt to get error details
      throw new Error(`Failed to fetch complaints: ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in fetchComplaintsByEmail:", error);
    throw error; // Rethrow error for handling in calling function
  }
};







// Other methods can be defined here as needed

  
  
  // Tour guide request methods
  
  // Function for the registration of a tour guide
  const createTourGuideRequest = async (tourGuideData) => {
    try {
      const response = await fetch('http://localhost:4000/api/tourGuides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tourGuideData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create tour guide: ' + response.statusText);
      }
  
      const data = await response.json();
      console.log('registrationOK', data);
      return data;
    } catch (error) {
        console.error('Error:', error);
        throw error; // propagate the error to be handled where this function is called
    }
    
};

//Admin regest
const registerAdmin = async (adminData) => {
    try {
        const response = await fetch('http://localhost:4000/api/admins', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(adminData),
        });
  
        const data = await response.json();
        if (response.ok) {
            console.log('Admin registered successfully:', data);
            // Handle success here
            return data; // You can return data for further processing if needed
        } else {
            console.error('Error during registration:', data);
            // Handle error response here
            return null; // Return null in case of error
        }
    } catch (error) {
        console.error('Network or server error:', error);
        // Handle network errors
        return null; // Return null to signify an error occurred
    }
  };


// a method that handles reading the info of the tour guide by email 

// Function to send a request to retrieve a tour guide record by email
const fetchTourGuideByEmail = async (email) => {
    try {
      const response = await fetch('http://localhost:4000/api/tourGuides/getByEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error fetching Tour Guide');
      }
  
      const data = await response.json();
      return data.tourGuide;
    } catch (error) {
        console.error('Error fetching tour guide:', error.message);
        throw error; // Propagate error for further handling
    }
};
//-------------------------
// function to create an advertiser and place in database 
const registerAdvertiser = async (advertiserData) => {
    try {
        const response = await fetch('http://localhost:4000/api/advertisers/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(advertiserData),
        });
  
        const data = await response.json();
        if (response.ok) {
            console.log('Advertiser created successfully:', data);
            return data; // Return the created advertiser data for further use
        } else {
            console.error('Error during advertiser creation:', data);
            return null; // Return null in case of an error response
        }
    } catch (error) {
        console.error('Network or server error:', error);
        return null; // Return null if there was a network or server error
    }
  };
  const fetchAdvertiserByEmail = async (data) => {
    try {
      const response = await fetch('http://localhost:4000/api/advertisers/getAdvertiserByEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Error fetching advertiser');
      }
  
      return result;
    } catch (error) {
      console.error('Error fetching advertiser:', error);
      throw error;
    }
  };





  const fetchAllItineraries = async () => {
    try {
        const response = await fetch('http://localhost:4000/api/itineraries', {
            method: 'GET', // Use GET method to retrieve data
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Itineraries retrieved successfully:', data);
            return data.data; // Assuming your backend returns an object with a 'data' property containing the itineraries
        } else {
            console.error('Error retrieving itineraries:', data.message);
            return null; // Return null in case of error
        }
    } catch (error) {
        console.error('Network error while fetching itineraries:', error);
        return null; // Return null in case of a network error
    }
};






//----------------------------------------
//seller functions 
//function to create a seller and place in the database 
const registerSeller = async (sellerData) => {
    try {
      // Send the POST request to the backend
      const response = await fetch('http://localhost:4000/api/sellers/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sellerData), // Send seller data as JSON
      });
  
      // Parse the JSON response
      const data = await response.json();
  
      // Check if the response is successful
      if (response.ok) {
        console.log('Seller registered successfully:', data);
        // You can handle success logic here (e.g., navigate to another page, show success message)
        return data;
      } else {
        // Handle error response from the server
        console.error('Error during seller registration:', data);
        return null; // Return null in case of error
      }
    } catch (error) {
      // Handle network or server errors
      console.error('Network or server error:', error);
      return null; // Return null to signify an error occurred
    }
  };
  const fetchSellerByEmail = async (email) => {
    try {
        const response = await fetch('http://localhost:4000/api/sellers/getSellerByEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }), // Send email as an object
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching seller by email:', error);
        throw error; // Re-throw the error for handling in the calling function
    }
};
const updateSellerByEmail = async (email, updatedData) => {
    try {
      const response = await fetch('http://localhost:4000/api/sellers/updateSeller', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, updatedData }), // Send email and updated data
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      return data; // Handle success
    } catch (error) {
      console.error('Error updating seller:', error);
      throw error; // Handle error
    }
  };

  const updateAdvertiserByEmail = async (email, updatedData) => {
    try {
        const response = await fetch('http://localhost:4000/api/advertisers/updateAdvertiserByEmail', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, updatedData }), // This is correct
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Network response was not ok');
        }

        const data = await response.json();
        return data; // Handle success
    } catch (error) {
        console.error('Error updating advertiser:', error);
        throw error; // Re-throw error to be handled by calling code
    }
};
  

//-------------------------------------------------------------------------------------------
// New function to get all tags
const fetchAllTags = async () => {
    try {
        const response = await fetch('http://localhost:4000/api/tags', {
            method: 'GET', // Use GET method to retrieve data
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Tags retrieved successfully:', data);
            return data.data; // Assuming your backend returns an object with a 'data' property containing the tags
        } else {
            console.error('Error retrieving tags:', data.message);
            return null; // Return null in case of error
        }
    } catch (error) {
        console.error('Network error while fetching tags:', error);
        return null; // Return null in case of a network error
    }
};

/*
const updateTag = async (tagId, updatedData) => {
    try {
        const response = await fetch('http://localhost:4000/api/tags//update/${tagId}', {
            method: 'PUT', // Use PUT for update
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData), // Send updated data
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error updating tag');
        }

        const result = await response.json(); // Get updated tag data
        console.log('Tag updated successfully:', result);
        return result; // Return updated tag data
    } catch (error) {
        console.error('Error updating tag:', error.message);
        throw error; // Propagate error
    }
};
*/

// Function to delete a tag
/*const deleteTag = async (tagId) => {
    try {
        const response = await fetch(`http://localhost:4000/api/tags/delete/${tagId}`, {
            method: 'DELETE', // Use DELETE for removing a tag
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error deleting tag');
        }

        console.log('Tag deleted successfully');
        return true; // Return true on success
    } catch (error) {
        console.error('Error deleting tag:', error.message);
        throw error; // Propagate error
    }
};*/

const deleteTag = async (tagId)=>{
    const url = `http://localhost:4000/api/tags/deletee/${tagId}`;
    const response = await axios.delete(url);
    return response.data
}

const updateTag = async (tagId ,updatedData) =>{
    console.log(updatedData)
    const url = `http://localhost:4000/api/tags/update/${tagId}`;
    const response = await axios.patch(url, updatedData);
    return response.data;
}
//----------------------------------------------------------------
//Admin request sending methods 
const BASE_URL = 'http://localhost:4000/api/admins/';
const addAdmin = async (adminData) => {
    try {
        const response = await axios.post(BASE_URL, adminData);
        return response.data; // Return the response data from the server
    } catch (error) {
        console.error('Error creating admin:', error.response ? error.response.data : error.message);
        throw error; // Propagate the error for handling in the component
    }
};
const BASE_URL2 = 'http://localhost:4000/api/tourismGoverners/';

const addTourismGoverner = async (tourismGovernerData) => {
    try {
        const response = await axios.post('http://localhost:4000/api/tourismGoverners/', tourismGovernerData);
        console.log(response.data); // Handle the response data as needed
        return response.data; // Return the response data for further use
    } catch (error) {
        console.error('Error adding Tourism Governer:', error.response ? error.response.data : error.message);
        throw error; // Throw the error for further handling if necessary
    }
};
//---------------------------
// method that sends a request to get all tourist accounts 

// Function to send a request to filter activities
const filterActivities = async (filterCriteria) => {
  try {
      const response = await axios.post('http://localhost:4000/api/activities/filterYassin', filterCriteria);
      return response.data; // Return the filtered activities
  } catch (error) {
      console.error('Error fetching activities:', error);
      throw error; // Rethrow error for handling in calling code
  }
};
const filterItineraries = async (filterCriteria) => {
  try {
    const response = await axios.post('http://localhost:4000/api/itineraries/filter', filterCriteria);
    return response.data; // Return the filtered itineraries
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    throw error; // Rethrow error for handling in calling code
  }
};

const getTagNames = async () => {
  try {
    const response = await axios.get('http://localhost:4000/api/tags/tags/names');
    return response.data; // Assuming the data is an array of tag names
  } catch (error) {
    throw new Error('Failed to fetch tags');
  }
};
const filterMuseumByTagName = async (tagName) => {
  try {
    const response = await fetch('http://localhost:4000/api/historicalPlaces/filterByTag', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tagName }), // Send the selected tag name in the request body
    });

    if (!response.ok) {
      throw new Error('Failed to filter museums');
    }

    const museums = await response.json();
    return museums;
  } catch (error) {
    console.error('Error filtering museums:', error);
    throw error;
  }
};
const filterProductsByPrice = async ({ minPrice, maxPrice }) => {
  const response = await axios.get(`http://localhost:4000/api/products/filter`, {
    params: {
      minPrice,
      maxPrice,
    },
  });
  return response.data; // Assuming the backend returns the data in this structure
};

// Export the new method along with others
export { registerTourist,fetchAllItineraries, fetchTouristByEmail, updateTouristByEmail, createTourGuideRequest, fetchTourGuideByEmail,fetchAllTags,updateTag,deleteTag,addAdmin,addTourismGoverner,
    registerAdvertiser,registerSeller,fetchSellerByEmail,updateSellerByEmail,fetchAdvertiserByEmail,filterActivities,filterItineraries,getTagNames,filterMuseumByTagName,filterProductsByPrice,updateAdvertiserByEmail };
