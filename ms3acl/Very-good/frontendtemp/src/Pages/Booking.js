import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchActivitiesDate } from '../Services/activityServices';
import { fetchItinerariesNoId } from '../Services/itineraryServices';

const Booking = ({email}) => {
    const [activities, setActivities] = useState([]);
    const [itineraries, setItineraries] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState('');
    const [selectedItinerary, setSelectedItinerary] = useState('');
    const [numberOfParticipants, setNumberOfParticipants] = useState(1);
    const [message, setMessage] = useState('');
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const activitiesResponse = await fetchActivitiesDate();
                const itinerariesResponse = await fetchItinerariesNoId();
                const currentDate = new Date();
    
                // Filter activities to only include upcoming ones
                const upcomingActivities = activitiesResponse.data.filter(activity => {
                    const activityDate = new Date(activity.date);
                    return activityDate >= currentDate;
                });
                console.log("ablha: ", itinerariesResponse.data)
    
                // Filter itineraries to only include upcoming, active, appropriate, and unflagged ones
                const upcomingItineraries = itinerariesResponse.data.filter(itinerary => {
                    const hasUpcomingDate = itinerary.availableDates.some(date => new Date(date) >= currentDate);
                    return hasUpcomingDate && itinerary.isActive && !itinerary.flagged;
                });

                console.log("b3dha: ", upcomingItineraries)



                setActivities(upcomingActivities);
                setItineraries(upcomingItineraries);
            } catch (error) {
                console.error('Error fetching activities or itineraries:', error);
                setMessage('Failed to load activities or itineraries.');
            }
        };
        
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure that either activity or itinerary is selected
        if (!selectedActivity && !selectedItinerary) {
            setMessage('Please select either an activity or an itinerary.');
            return;
        }

        try {
            const bookingData = {
                email: email,
                activityId: selectedActivity || undefined,
                itineraryId: selectedItinerary || undefined,
                numberOfParticipants,
            };

            const response = await axios.post('http://localhost:4000/api/bookings', bookingData);

            setMessage(response.data.message);

            // Reset form fields on success
            setSelectedActivity('');
            setSelectedItinerary('');
            setNumberOfParticipants(1);
        } catch (error) {
            console.error('Error creating booking:', error.response ? error.response.data : error.message);
            const errorMessage = error.response?.data?.message || 'Error creating booking. Please try again.';
            setMessage(errorMessage);
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <h2>Book an Activity or Itinerary</h2>



            <div>
                <label htmlFor="activities">Select Activity:</label>
                <select
                    id="activities"
                    value={selectedActivity}
                    onChange={(e) => {
                        setSelectedActivity(e.target.value);
                        setSelectedItinerary(''); // Clear itinerary selection
                    }}
                >
                    <option value="">--Select an Activity--</option>
                    {activities.map((activity) => (
                        <option key={activity._id} value={activity._id}>
                            {activity.name} - ${activity.price}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="itineraries">Select Itinerary:</label>
                <select
                    id="itineraries"
                    value={selectedItinerary}
                    onChange={(e) => {
                        setSelectedItinerary(e.target.value);
                        setSelectedActivity(''); // Clear activity selection
                    }}
                >
                    <option value="">--Select an Itinerary--</option>
                    {itineraries.map((itinerary) => (
                        <option key={itinerary._id} value={itinerary._id}>
                            {itinerary.title} - ${itinerary.price}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="participants">Number of Participants:</label>
                <input
                    type="number"
                    id="participants"
                    value={numberOfParticipants}
                    onChange={(e) => setNumberOfParticipants(e.target.value)}
                    min="1"
                    required
                />
            </div>

            <button type="submit">Book Now</button>

            {message && <p>{message}</p>}
        </form>
    );
};

export default Booking;