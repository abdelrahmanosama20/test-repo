import axios from 'axios';

export const fetchActivities = async (advertiserId) => {
    const url = `http://localhost:4000/api/advertisers/${advertiserId}/activities`; 
    const response = await axios.get(url);
    console.log("response fetch activites",response)
    return response.data;

};


export const fetchActivitiesDate = async () => {
    const url = `http://localhost:4000/api/activities/`;

    
    const currentDate = new Date();

    // Prepare parameters
    const params = { date: currentDate }; // Automatically set the current date

    // Make the API call with current date as filter
    const response = await axios.get(url, { params });

    return response.data; // Return the data
};


export const deleteActivity = async (activityId) => {
    console.log("DELETE")
    const url = `http://localhost:4000/api/advertisers/${activityId}/activities`;
    await axios.delete(url);
    
};

export const updateActivity = async (activityId, updatedActivity) => {
    const url = `http://localhost:4000/api/advertisers/${activityId}/activities`;
    const response = await axios.put(url, updatedActivity); // Assuming your backend uses PUT for updates
    return response.data;
};

export const createActivity = async (newActivity) => {
    const url = `http://localhost:4000/api/activities/`;
    const response = await axios.post(url, newActivity);
    return response.data;
};

export const fetchCategories = async() => {
    const url = `http://localhost:4000/api/categories/`;
    const response = await axios.get(url);
    return response.data.data;
}

export const fetchCategoryById = async(categoryId) => {
    const url = `http://localhost:4000/api/categories/${categoryId}`;
    const response = await axios.get(url);
    return response.data;
}

// export const searchactivity = async (searchTerm) => {
//     console.log("serachterm :",searchTerm)
//     const response = await axios.get(`http://localhost:4000/api/activities/search`,searchTerm );
//     console.log(response.data)
//     return response.data;
// };


// export const searchactivity = async (searchTerm) => {
//     console.log("searchTerm :", searchTerm);
//     try {
//         const response = await axios.get(`http://localhost:4000/api/activities/search`, {
//             params: {
//                 name: searchTerm.name || undefined, // Pass as undefined if not provided
//                 category: searchTerm.category || undefined,
//                 tag: searchTerm.tag || undefined,
//             }
//         });
//         console.log(response.data);
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching activities:", error.response.data); // Log the error response
//         throw error; // Re-throw the error if needed
//     }
// };



export const searchactivity = async (searchTerm) => {
    console.log("searchTerm :", searchTerm);
    
    // Construct params object
    const params = {};
    
    // Add only the filled parameters
    if (searchTerm.name) {
        params.name = searchTerm.name;
    }
    else if (searchTerm.category) {
        params.category = searchTerm.category;
    }
    else if (searchTerm.tag) {
        params.tag = searchTerm.tag;
    }
    
    try {
        const response = await axios.get(`http://localhost:4000/api/activities/search`, {
            params // Pass the constructed params object
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching activities:", error.response.data); // Log the error response
        throw error; // Re-throw the error if needed
    }
};
