import React from 'react';
import ActivityDisplayFilterWise from './ActivityDisplayFilterWise';

const ActivityListFilterWise = ({ activities }) => {
    if (activities.length === 0) {
        return <p>No activities found.</p>;
    }

    return (
        <div className="container">
            <h1>Activities</h1>
            {activities.map((activity) => (
                <ActivityDisplayFilterWise 
                    key={activity._id} 
                    activity={activity} 
                />
            ))}
        </div>
    );
};

export default ActivityListFilterWise;
