import React, { useEffect, useState } from 'react';
import { fetchActivitiesDate } from '../Services/activityServices';
import { fetchMuseums } from '../Services/museumServices';
import { fetchItinerariesNoId } from '../Services/itineraryServices';
import ActivityDisplayFilterWise from './ActivityDisplayFilterWise';
import ItineraryDisplayFilterWise from './ItineraryDisplayFilterWise';
import MuseumDisplayFilterWise from './MuseumDisplayFilterWise';

const ActivityHistoricalList = () => {
    const [activities, setActivities] = useState([]);
    const [historicalPlaces, setHistoricalPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showMappings, setShowMappings] = useState(false);
    const [showMappingsNotUpcoming, setShowMappingsNotUpcoming] = useState(false);
    const [itineraries, setItineraries] = useState([]);
    const [allItineraries, setAllItineraries] = useState([]);
    const [allActivities, setAllActivities] = useState([]);



    useEffect(() => {
        const getActivities = async () => {
            try {
                const currentDate = new Date();
                const upcomingActivities = await fetchActivitiesDate();

                setAllActivities(upcomingActivities.data)

                const filteredActivities = upcomingActivities.data.filter(activity => {
                    const activityDate = new Date(activity.date);
                    return activityDate >= currentDate;
                });

                if (filteredActivities.length > 0) {
                    setActivities(filteredActivities);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const getUpcomingItineraries = async () => {
            try {
                const currentDate = new Date();
                const itinerariesResponse = await fetchItinerariesNoId();
                console.log("Itineraries Response:", itinerariesResponse); // Log response

                setAllItineraries(itinerariesResponse.data);
                
                const filteredItineraries = itinerariesResponse.data.filter(itinerary => {
                    return itinerary.availableDates.some(date => new Date(date) > currentDate) && !itinerary.flagged && itinerary.isActive;
                });

                if (filteredItineraries.length > 0) {
                    setItineraries(filteredItineraries);
                    console.log("Filtered Itineraries:", filteredItineraries); // Log filtered itineraries
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const getHistoricalPlaces = async () => {
            try {
                const museumResponse = await fetchMuseums();
                setHistoricalPlaces(museumResponse.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getActivities();
        getHistoricalPlaces();
        getUpcomingItineraries();
    }, []);

    const toggleMappings = () => {
        setShowMappings(prevState => !prevState);
    };

    const toggleMappings2 = () => {
        setShowMappingsNotUpcoming(prevState => !prevState);
    };

    return (
        <div className="container">
            
            <h1>All Activities, Historical Places, and Itineraries</h1>
            
            <button onClick={toggleMappings2}>
                {showMappingsNotUpcoming ? "Hide All" : "Show All"}
            </button>

            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}

            {showMappingsNotUpcoming && (
    <>
        {/* Display upcoming activities */}
        <h2>All Activities</h2>
        {allActivities.length === 0 ? (
            <p>No activities found.</p>
        ) : (
            allActivities.map(activity => (
                <ActivityDisplayFilterWise activity = {activity} comments={true}/>
            ))
        )}


        {/* Display upcoming itineraries */}
        <h2>All Itineraries</h2>
        {allItineraries.length === 0 ? (
            <p>No itineraries found.</p>
        ) : (
            allItineraries.map(itinerary => (
                <ItineraryDisplayFilterWise itinerary={itinerary} comments={true}/>
            ))
        )}

        {/* Display historical places / museums */}
        <h2>Historical Places / Museums</h2>
        {historicalPlaces.length === 0 ? (
            <p>No historical places or museums available.</p>
        ) : (
            historicalPlaces.map(place => (
                <MuseumDisplayFilterWise museum={place}/>
            ))
        )}
    </>
)}

        `<h1>Upcoming Activities, Historical Places, and Itineraries</h1>
            
            <button onClick={toggleMappings}>
                {showMappings ? "Hide Available to Visit" : "Show Available to Visit"}
            </button>
`

            {showMappings && (
    <>
        {/* Display upcoming activities */}
        <h2>Activities</h2>
        {activities.length === 0 ? (
            <p>No activities available for the selected date.</p>
        ) : (
            activities.map(activity => (
                <ActivityDisplayFilterWise activity = {activity}/>
            ))
        )}


        {/* Display upcoming itineraries */}
        <h2>Upcoming Itineraries</h2>
        {itineraries.length === 0 ? (
            <p>No upcoming itineraries available.</p>
        ) : (
            itineraries.map(itinerary => (
                <ItineraryDisplayFilterWise itinerary={itinerary}/>
            ))
        )}

        {/* Display historical places / museums */}
        <h2>Historical Places / Museums</h2>
        {historicalPlaces.length === 0 ? (
            <p>No historical places or museums available.</p>
        ) : (
            historicalPlaces.map(place => (
                <MuseumDisplayFilterWise museum={place}/>
            ))
        )}
    </>
)}
        </div>
    );
};

export default ActivityHistoricalList;
