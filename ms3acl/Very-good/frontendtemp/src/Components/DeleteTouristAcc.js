import React, { useEffect, useState } from 'react';
import { fetchActivitiesDate } from '../Services/activityServices';
import { fetchItinerariesNoId } from '../Services/itineraryServices';
import { deleteTourist } from '../Services/TouristService';
import { getTouristByEmail } from '../Services/TouristService';
const DeleteTourist = ({ email }) => {
    const [activities, setActivities] = useState([]);
    const [itineraries, setItineraries] = useState([]);
    const [touristAct, setTouristAct] = useState([]);
    const [touristIten, setTouristIten] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [flag, setFlag] = useState(false);
    const [user, setUser] = useState(null);

 
        const fetchData = async () => {
            try {
                const userRaw = await getTouristByEmail(email);
                const userData = userRaw.data;
                setUser(userData);

                const currentDate = new Date();
                const upcomingActivities = await fetchActivitiesDate();
                const filteredActivities = upcomingActivities.data.filter(activity => 
                    new Date(activity.date) >= currentDate
                );
                setActivities(filteredActivities);

                const itinerariesResponse = await fetchItinerariesNoId();
                setItineraries(itinerariesResponse.data);

                console.log("User ID:", userData._id);
                console.log("Filtered Activities:", filteredActivities);

                // Convert userData._id to a string for comparison
                const userIdStr = String(userData._id);

                const userActivities = filteredActivities.filter(activity => {
                    console.log("Checking touristIds in activity:", activity.touristIds);

                    return activity.bookingOpen === true &&
                        activity.touristIds &&
                        activity.touristIds.some(touristObj => {
                            if (typeof touristObj === 'object' && touristObj._id) {
                                console.log("Comparing with object _id:", touristObj._id);
                                return touristObj._id === userIdStr;
                            } else {
                                console.log("Comparing with direct ID:", touristObj);
                                return touristObj === userIdStr;
                            }
                        });
                });

                const userItineraries = itinerariesResponse.data.filter(itinerary => {
                    console.log("Checking touristIds in itinerary:", itinerary.touristIds);

                    return itinerary.accessibility === true &&
                        itinerary.flagged === false &&
                        itinerary.isActive === true &&
                        itinerary.touristIds &&
                        itinerary.touristIds.some(touristObj => {
                            if (typeof touristObj === 'object' && touristObj._id) {
                                console.log("Comparing with object _id in itinerary:", touristObj._id);
                                return touristObj._id === userIdStr;
                            } else {
                                console.log("Comparing with direct ID in itinerary:", touristObj);
                                return touristObj === userIdStr;
                            }
                        });
                });

                if(user.bookedItineraries.length === 0 && user.bookedActivities === 0){
                    setFlag(false);
                    console.log("len ac",user.bookedItineraries.length)
                    console.log("len aiten",user.bookedItineraries.length)
                }
                else{
                    setFlag(true);
                }

                setTouristAct(userActivities);
                setTouristIten(userItineraries);
               
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

      
    useEffect(() => {
        fetchData();
        //const interval = setInterval(fetchData, 5000); // Poll every 5 seconds

        // Cleanup polling when component unmounts
        //return () => clearInterval(interval);
    }, [email]);

    const handleDeletion = async () => {
        if (!flag) {
            try {
                await deleteTourist(user._id); 
                alert('Your account has been deleted successfully.');
            } catch (err) {
                setError('Failed to delete account. Please try again later.');
            }
        } else {
            alert('Delete Account Request Rejected: Bookings were found.');
        }
    };

    const debugUserInfo = () => {
        if (user) {
            console.log("User ID:", user._id);
            console.log("User Email:", user.email);
            console.log("flag",flag)
            console.log("len ac",user.bookedActivities.length)
            console.log("len aiten",user.bookedItineraries.length)
            console.log("len ac2",user.bookedActivities)
            console.log("len aiten2",user.bookedItineraries)
        //     activities.forEach(element => {
        //         console.log("Activity:", element);
        //     });
        //     itineraries.forEach(element1 => {
        //         console.log("Itinerary:", element1);
        //     });
        //     touristAct.forEach(element2 => {
        //         console.log("User Activity:", element2);
        //     });
        //     if (touristIten.length === 0) console.log("No matching activities found for the user.");
        //     touristAct.forEach(element2 => {
        //         console.log("User Iten:", element2);
        //     });
        //     if (touristIten.length === 0) console.log("No matching Iten found for the user.");
         }
    };

    // if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Delete Tourist Account</h2>
            <button onClick={handleDeletion}>
                {flag ? 'Delete Account (Not Availble)' : 'Delete Account'}
                </button>
            <p>Email: {email}</p>
            <button onClick={debugUserInfo}>Check User</button>
        </div>
    );
};

export default DeleteTourist;