import React from 'react';
import ActivityDisplay from './ActivityDisplay';
import { fetchActivities, deleteActivity, updateActivity, searchactivity } from '../Services/activityServices'; // Adjust the import path as needed

const ActivityList = ({ activities, onDelete, onUpdate }) => {
    if (activities.length === 0) {
        return <p>No activities found.</p>;
    }

    return (
        <div className="container">
            <h1>Activities</h1>
            {activities.map((activity) => (
                <ActivityDisplay 
                    key={activity._id} 
                    activity={activity} 
                    onDelete={onDelete} 
                    onUpdate={onUpdate}
                />
            ))}
        </div>
    );
};

export default ActivityList;
