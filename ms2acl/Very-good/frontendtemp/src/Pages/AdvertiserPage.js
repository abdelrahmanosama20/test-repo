import React, { useState, useEffect } from 'react';
import ActivityList from '../Components/ActivityList';
import CreateActivityForm from '../Components/CreateActivityForm';
import { fetchActivities, deleteActivity, updateActivity } from '../Services/activityServices'; // Ensure this import is correct
import AdvertiserInfo from './AdvertiserInfo'; // Import AdvertiserInfo
import './AdvertiserPage.css'; 

const advertiserId = "66f826b0e184e2faa3ea510b";

const AdvertiserPage = ({email}) => {
      const [isCreating, setIsCreating] = useState(false);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAndSetActivities = async () => {
        try {
            const data = await fetchActivities(advertiserId);
            setActivities(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAndSetActivities(); // Fetch activities on mount
    }, []);
    const [isViewingProfile, setIsViewingProfile] = useState(false); // State to manage the profile info view

    const handleCreateButtonClick = () => {
        setIsCreating(true); // Show the form when the button is clicked
    };

    const handleViewProfileClick = () => {
        setIsViewingProfile(true); // Show the AdvertiserInfo and hide AdvertiserPage
    };

    const closeForm = () => {
        setIsCreating(false); // Hide the form
        fetchAndSetActivities(); // Refetch activities after closing the form
    };

    const handleDeleteActivity = async (activityId) => {
        try {
            await deleteActivity(activityId); // Call the delete function
            setActivities((prevActivities) => 
                prevActivities.filter(activity => activity._id !== activityId)
            ); // Update the activities state
        } catch (err) {
            console.error('Failed to delete activity:', err.message);
        }
    };

    const handleUpdateActivity = async (activityId, updatedData) => {
        try {
            const updatedActivity = await updateActivity(activityId, updatedData);
            setActivities((prevActivities) => 
                prevActivities.map(activity => 
                    activity._id === updatedActivity._id ? updatedActivity : activity
                )
            ); // Update the state with the new data
            return updatedActivity;
        } catch (err) {
            console.error('Failed to update activity:', err.message);
        }
    };

    if (loading) return <p>Loading activities...</p>;
    if (error) return <p>Error fetching activities: {error}</p>;

    const handleBackButtonClick = () => {
        setIsViewingProfile(false); // Go back to the main AdvertiserPage and hide AdvertiserInfo
    };

    // If viewing the profile, render only the AdvertiserInfo component
    if (isViewingProfile) {
        return <AdvertiserInfo email={email} onBack={handleBackButtonClick} />;
    }

    // Otherwise, render the main AdvertiserPage
    return (
        <div>
            <h1>Advertiser Page</h1>
            <p>Welcome to the Advertiser page!</p>
            
            {/* Create Activity button */}
            <button className="create-activity-button" onClick={handleCreateButtonClick}>
                Create Activity
            </button>

            {/* View Profile Information button */}
            <button className="view-profile-button" onClick={handleViewProfileClick}>
                View Profile Information
            </button>

            {/* Render the CreateActivityForm if isCreating is true */}
            {isCreating && <CreateActivityForm onClose={closeForm} advertiserId={advertiserId} setActivities={setActivities} />}

            {/* Call the ActivityList component and pass activities and handlers */}
            <ActivityList 
                activities={activities} 
                onDelete={handleDeleteActivity} 
                onUpdate={handleUpdateActivity} 
            />
        </div>
    );
};

export default AdvertiserPage;
