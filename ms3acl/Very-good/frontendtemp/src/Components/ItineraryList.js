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
    const handleStatusItinerary = async (id, isActive) => {
        try {
            // Send the PATCH request to update itinerary status
            const response = await fetch(`http://localhost:4000/api/itineraries/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to toggle status');
            }
    
            const data = await response.json();
            console.log(`Itinerary ${id} ${isActive ? 'Activated' : 'Deactivated'}:`, data);
    
            // Update state to reflect the new flag status
            setItineraries(prevItineraries =>
                prevItineraries.map(itinerary =>
                    itinerary._id === id ? { ...itinerary, isActive: !itinerary.isActive } : itinerary // Toggle isActive status
                )
            );
        } catch (error) {
            console.error('Error toggling status for itinerary:', error);
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
                        onStatus={handleStatusItinerary}
                    />
                ))
            )}
        </div>
    );
};

export default ItineraryList;
