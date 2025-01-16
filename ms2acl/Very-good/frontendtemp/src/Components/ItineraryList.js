import React, { useEffect, useState } from 'react';
import ItineraryDisplay from './ItineraryDisplay'; // Assume this is your Itinerary display component
import { fetchItineraries, deleteItinerary, updateItinerary } from '../Services/itineraryServices'; // Adjust the import path as needed

const ItineraryList = ({ tourGuideId }) => {
    const [itineraries, setItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getItineraries = async () => {
            try {
                console.log('Tour Guide ID:', tourGuideId);
                const data = await fetchItineraries(tourGuideId);
                setItineraries(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getItineraries();
    }, [tourGuideId]);

    const handleDeleteItinerary = async (itineraryId) => {
        try {
            await deleteItinerary(itineraryId); // Call the delete function from services
            setItineraries(itineraries.filter(itinerary => itinerary._id !== itineraryId)); // Update the state
        } catch (err) {
            console.error('Failed to delete itinerary:', err.message);
        }
    };

    const handleUpdateItinerary = async (itineraryId, updatedData) => {
        try {
            const updatedItinerary = await updateItinerary(itineraryId, updatedData); // Call the update function from services
            setItineraries(prevItineraries => 
                prevItineraries.map(itinerary => 
                    itinerary._id === updatedItinerary._id ? updatedItinerary : itinerary
                )
            ); // Update the state with the new data
            return updatedItinerary;
        } catch (err) {
            console.error('Failed to update itinerary:', err.message);
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
                    <ItineraryDisplay 
                        key={itinerary._id} 
                        itinerary={itinerary} 
                        onDelete={handleDeleteItinerary} 
                        onUpdate={handleUpdateItinerary} 
                    />
                ))
            )}
        </div>
    );
};

export default ItineraryList;
