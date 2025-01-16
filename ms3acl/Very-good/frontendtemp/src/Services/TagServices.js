import axios from 'axios';

// Fetch all Tourism Governors
export const fetchTourismGoverners = async () => {
    const url = 'http://localhost:4000/api/tourismGovernors/'; // Adjust the URL as needed
    const response = await axios.get(url);
    return response.data; // Assuming the data you want is directly in response.data
};

// Create a new tag
export const createTag = async (newTag) => {
    const url = 'http://localhost:4000/api/tags/create'; // Adjust the URL for creating a new tag
    const response = await axios.post(url, newTag);
    console.log(response.data);
    return response.data; // Return the created tag data
};

// Update an existing tag
export const updateTag = async (tagId, updatedTagData) => {
    const url = `http://localhost:4000/api/tags/update/${tagId}`; // Adjust the URL for updating a tag by its ID
    const response = await axios.put(url, updatedTagData);
    console.log(response.data);
    return response.data; // Return the updated tag data
};

// Delete a tag by ID
export const deleteTag = async (tagId) => {
    const url = `http://localhost:4000/api/tags/delete/${tagId}`; // Adjust the URL for deleting a tag by its ID
    const response = await axios.delete(url);
    console.log(response.data);
    return response.data; // Return a success message or the deleted tag data
};

// View a specific tag by ID
export const viewTag = async (tagId) => {
    const url = `http://localhost:4000/api/tags/${tagId}`; // Adjust the URL for fetching a single tag by its ID
    const response = await axios.get(url);
    console.log(response.data);
    return response.data; // Return the specific tag data
};
