import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import ActivityDisplayFilterWise from './ActivityDisplayFilterWise'; // Import your activity display component

const ActivityDetail = () => {
    const { id } = useParams(); // Get the ID from the URL
    const [activity, setActivity] = useState(null); // State to hold the activity data
    const [loading, setLoading] = useState(true); // State to manage loading status

    useEffect(() => {
        // Fetch the activity data by ID when the component mounts
        const fetchActivity = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/activities/${id}`); // Use Axios to get the activity
                setActivity(response.data); // Set the activity data
            } catch (error) {
                console.error('Error fetching activity:', error);
            } finally {
                setLoading(false); // Set loading to false when done
            }
        };
        fetchActivity();
    }, [id]); // Re-run the effect if the ID changes

    if (loading) {
        return <div>Loading...</div>; // Display a loading message while fetching data
    }
    if (!activity) {
        return <div>Activity not found.</div>; // Handle case where no activity is found
    }

    return (
        <div>
            <h1>Activity Details</h1>
            <ActivityDisplayFilterWise activity={activity.data} /> {/* Pass the activity to the display component */}
        </div>
    );
};

export default ActivityDetail;
