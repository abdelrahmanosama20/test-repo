import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import ItineraryDisplayFilterWise from './ItineraryDisplayFilterWise';

const ItineraryDetail = () => {
    const { id } = useParams(); // Get the ID from the URL
    const [Itinerary, setItinerary] = useState(null); // State to hold the activity data
    const [loading, setLoading] = useState(true); // State to manage loading status

    useEffect(() => {
        // Fetch the activity data by ID when the component mounts
        const fetchItinerary = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/itineraries/${id}`); // Use Axios to get the activity
                setItinerary(response.data); // Set the activity data
            } catch (error) {
                console.error('Error fetching itinerary:', error);
            } finally {
                setLoading(false); // Set loading to false when done
            }
        };
        fetchItinerary();
    }, [id]); // Re-run the effect if the ID changes

    if (loading) {
        return <div>Loading...</div>; // Display a loading message while fetching data
    }
    if (!Itinerary) {
        return <div>Itinerary not found.</div>; // Handle case where no activity is found
    }

    return (
        <div>
            <h1>Itinerary Details</h1>
            <ItineraryDisplayFilterWise itinerary={Itinerary.data} /> {/* Pass the activity to the display component */}
        </div>
    );
};

export default ItineraryDetail;
