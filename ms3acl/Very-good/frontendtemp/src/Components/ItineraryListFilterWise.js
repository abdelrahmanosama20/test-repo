import React, { useEffect, useState } from 'react';
import ItineraryDisplayFilterWise from './ItineraryDisplayFilterWise'; // Your simplified itinerary display component
import { fetchItinerariesNoId, deleteItinerary } from '../Services/itineraryServices'; // Adjust the import path as needed

const ItineraryListFilterWise = () => {
    const [itineraries, setItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getItineraries = async () => {
            try {
                const data = await fetchItinerariesNoId();
                
                // Check if the data is an array and set the state
                if (Array.isArray(data)) {
                    setItineraries(data);
                } else {
                    throw new Error('Unexpected response format');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getItineraries();
    }, []);

    const handleDeleteItinerary = async (itineraryId) => {
        try {
            await deleteItinerary(itineraryId); // Call the delete function from services
            
            // Use the updater function for state to ensure you're working with the latest state
            setItineraries((prevItineraries) => 
                prevItineraries.filter(itinerary => itinerary._id !== itineraryId)
            ); 
        } catch (err) {
            console.error('Failed to delete itinerary:', err.message);
        }
    };

    if (loading) return <p>Loading itineraries...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container">
            <h1>Itineraries</h1>
            {itineraries.length === 0 ? (
                <p>No itineraries found.</p>
            ) : (
                itineraries.map((itinerary) => (
                    <ItineraryDisplayFilterWise
                        key={itinerary._id} 
                        itinerary={itinerary} 
                        onDelete={handleDeleteItinerary} 
                    />
                ))
            )}
        </div>
    );
};

export default ItineraryListFilterWise;
