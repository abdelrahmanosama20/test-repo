import React, { useEffect, useState } from 'react';
import { 
    fetchActivities, 
    deleteActivity, 
    searchactivity 
} from '../Services/activityServices';
import { 
    fetchItineraries, 
    deleteItinerary, 
    searchforitinerary 
} from '../Services/itineraryServices';
import {
    deletAdvertiser, 
    deleteTourGuide, 
    fetchTourists, 
    fetchAdvertiserByEmail, 
    getTourGuideByEmail
} from '../RequestSendingMethods';

const DeleteTA = ({ dataTA, isTourGuideA }) => {
    const [activities, setActivities] = useState([]);
    const [itineraries, setItineraries] = useState([]);
    const [tourists, setTourists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [userType, setUserType] = useState('');
    const [flag, setFlag] = useState(false);
    const [activitiesID, setActivitiesID] = useState([]);
    const [itinerariesID, setItinerariesID] = useState([]);

    // Fetch data logic for both Tour Guide and Advertiser
    const fetchData = async () => {
        try {
            setLoading(true);
            const touristList = await fetchTourists();
            setTourists(touristList.data);

            let userResponse;
            if (isTourGuideA) {
                userResponse = await getTourGuideByEmail(dataTA);
                setUserType('tourGuide');
            } else {
                userResponse = await fetchAdvertiserByEmail({ email: dataTA });
                setUserType('advertiser');
            }

            if (!userResponse) {
                setError("User not found.");
                setLoading(false);
                return;
            }

            setUser(userResponse);
            
            // Tour Guide specific logic
            if (isTourGuideA) {
                const itinerariesResponse = await fetchItineraries(userResponse?.tourGuide?._id);
                setItineraries(itinerariesResponse);

                const tempItineraryID = touristList.data.flatMap(tourist =>
                    tourist.bookedItineraries.filter(itineraryID => itineraryID)
                );
                setItinerariesID(tempItineraryID);

                const hasConflict = tempItineraryID.some(id => itinerariesResponse.some(i => i._id === id));
                setFlag(hasConflict);

            // Advertiser specific logic
            } else {
                const activitiesResponse = await fetchActivities(userResponse?.advertiser?._id);
                setActivities(activitiesResponse);

                const tempActivityID = touristList.data.flatMap(tourist =>
                    tourist.bookedActivities.filter(activityID => activityID)
                );
                setActivitiesID(tempActivityID);

                const hasConflict = tempActivityID.some(id => activitiesResponse.some(a => a._id === id));
                setFlag(hasConflict);
            }

        } catch (err) {
            setError('Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        

    }, [dataTA, isTourGuideA]);

    // Handle account deletion
    const handleDeletion = async () => {
        if (flag) {
            alert('Cannot delete account. Bookings exist.');
            return;
        }

        try {
            if (userType === 'tourGuide') {
                await Promise.all(itineraries.map(itinerary => deleteItinerary(itinerary._id)));
                await deleteTourGuide(user?.tourGuide?._id);
            } else {
                await Promise.all(activities.map(activity => deleteActivity(activity._id)));
                await deletAdvertiser(user?.advertiser?._id);
            }

            alert('Account successfully deleted');
            setUser(null);
        } catch (err) {
            setError('Failed to delete account');
        }
    };

    return (
        <div>
            <h2>Delete Account</h2>
            <button onClick={handleDeletion} disabled={flag}>
                {flag ? 'Delete Account (Not Available)' : 'Delete Account'}
            </button>
            {user && <p>Account Type: {userType === 'tourGuide' ? 'Tour Guide' : 'Advertiser'}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default DeleteTA;
