import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import MuseumDisplayFilterWise from './MuseumDisplayFilterWise'; // Import your activity display component

const MuseumDetail = () => {
    const { id } = useParams(); // Get the ID from the URL
    const [museum, setMuseum] = useState(null); // State to hold the activity data
    const [loading, setLoading] = useState(true); // State to manage loading status

    useEffect(() => {
        // Fetch the activity data by ID when the component mounts
        const fetchMuseum = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/historicalPlaces/${id}`); // Use Axios to get the activity
                setMuseum(response.data); // Set the activity data
            } catch (error) {
                console.error('Error fetching museum:', error);
            } finally {
                setLoading(false); // Set loading to false when done
            }
        };
        fetchMuseum();
    }, [id]); // Re-run the effect if the ID changes

    if (loading) {
        return <div>Loading...</div>; // Display a loading message while fetching data
    }
    if (!museum) {
        return <div>Museum not found.</div>; // Handle case where no activity is found
    }

    return (
        <div>
            <h1>Museum Details</h1>
            <MuseumDisplayFilterWise museum={museum.data} /> {/* Pass the activity to the display component */}
        </div>
    );
};

export default MuseumDetail;
