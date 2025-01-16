import React, { useState } from 'react';
import { filterActivities } from '../RequestSendingMethods';
import ActivityListFilterWise from '../Components/ActivityListFilterWise';

const FilterActivitiesPage = ({ onBack }) => { // Receive the onBack prop
  const [budget, setBudget] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [minRating, setMinRating] = useState('');
  const [activities, setActivities] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const filterCriteria = { 
      price: budget ? parseFloat(budget) : null,
      date: date || null,
      category: category || null,
      ratings: minRating ? parseFloat(minRating) : null
    };

    const filteredActivities = await filterActivities(filterCriteria);
    setActivities(filteredActivities || []);
  };

  return (
    <div className="filter-activities-page">
      <h1>Welcome to the Filter Activities Page!</h1>
      <p>Here you can filter activities based on your preferences.</p>
      
      <form onSubmit={handleSubmit} className="form-container">
        <label>
          Budget:
          <input 
            type="number" 
            value={budget} 
            onChange={(e) => setBudget(e.target.value)} 
          />
        </label>

        <label>
          Date:
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
          />
        </label>

        <label>
          Category:
          <input 
            type="text" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
          />
        </label>

        <label>
           Rating:
          <input 
            type="number" 
            value={minRating} 
            onChange={(e) => setMinRating(e.target.value)} 
          />
        </label>

        <button type="submit" className="btn">Proceed</button>
      </form>

      <button className="btn" onClick={onBack}>Back</button> {/* Call onBack when back is clicked */}

      <ActivityListFilterWise 
        activities={activities} 
      />
    </div>
  );
};

export default FilterActivitiesPage;
