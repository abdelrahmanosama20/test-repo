import React, { useState } from 'react';
import { filterItineraries } from '../RequestSendingMethods'; // Import the new method
import ItineraryDisplayFilterWise from '../Components/ItineraryDisplayFilterWise'; // Component to render filtered itineraries

const FilterItenaryPage = () => {
  const [budget, setBudget] = useState('');
  const [date, setDate] = useState(''); // Single date state
  const [tag, setTag] = useState('');
  const [language, setLanguage] = useState(''); // New state for language
  const [itineraries, setItineraries] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Create the JSON object for the request
    const filterCriteria = { 
      price: budget ? parseFloat(budget) : null,
      date: date || null,
      tag: tag || null,
      language: language || null,
    };
  
    console.log("in handle submit");
  
    // Call the request sending method
    const filteredItineraries = await filterItineraries(filterCriteria);
    console.log("filteredItineraries :", filteredItineraries);
  
    // Filter out flagged itineraries
    const validItineraries = filteredItineraries.filter(itinerary => !itinerary.flagged);
    
    // Update the state with the filtered itineraries
    setItineraries(validItineraries || []);
  };
  
  return (
    <div className="filter-itinerary-page">
      <h1>Welcome to the Filter Itinerary Page!</h1>
      <p>Here you can filter itineraries based on your preferences.</p>
      
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
          Tag:
          <input 
            type="text" 
            value={tag} 
            onChange={(e) => setTag(e.target.value)} 
          />
        </label>

        <label>
          Language: {/* New input field for language */}
          <input 
            type="text" 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)} 
          />
        </label>

        <button type="submit" className="btn">Proceed</button>
      </form>

      <button className="btn" onClick={() => window.history.back()}>Back</button>

      {/* Render filtered itineraries */}
      <div className="itineraries-list">
        {itineraries.length > 0 ? (
          itineraries.map((itinerary) => (
            <ItineraryDisplayFilterWise
              key={itinerary._id} 
              itinerary={itinerary} 
            />
          ))
        ) : (
          <p>No itineraries found based on the selected filters.</p>
        )}
      </div>
      
    </div>
  );
};

export default FilterItenaryPage;
