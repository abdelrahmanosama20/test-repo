import axios from 'axios';

export const fetchMuseums = async () => {
    const url = `http://localhost:4000/api/historicalPlaces/`; 
    const response = await axios.get(url);
    return response.data;
};

export const deleteMuseum = async (museumId) => { 
    const url = `http://localhost:4000/api/historicalPlaces/${museumId}`;
    await axios.delete(url);
};

export const updateMuseum = async (museumId, updatedMuseum) => { // do
    const url = `http://localhost:4000/api/historicalPlaces/${museumId}`;
    const response = await axios.put(url, updatedMuseum); // Assuming your backend uses PUT for updates
    return response.data;
};

export const createMuseum = async (newMuseum) => {
    const url = `http://localhost:4000/api/historicalPlaces/`;
    const response = await axios.post(url, newMuseum);
    return response.data;
};

export const fetchMuseumTags = async(museumId) => {
    const url = `http://localhost:4000/api/historicalPlaces/${museumId}/tags`;
    const response = await axios.get(url);
    return response.data;
}

export const fetchTags = async() => {
    const url = `http://localhost:4000/api/tags/`;
    const response = await axios.get(url);
    return response.data.data;
}




export const searchforHP = async (searchTerm) => {
    console.log("searchTerm :", searchTerm);
    
    // Construct params object
    const params = {};
    
    // Add only the filled parameters
    if (searchTerm.name) {
        params.name = searchTerm.name;
    }
    else if (searchTerm.tag) {
        params.tag = searchTerm.tag;
    }
    
    try {
        const response = await axios.get(`http://localhost:4000/api/historicalPlaces/search`, {
            params // Pass the constructed params object
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching historical places:", error.response.data); // Log the error response
        throw error; // Re-throw the error if needed
    }
};