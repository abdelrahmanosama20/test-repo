import React, { useState, useEffect } from 'react';
import './ActivityDisplay.css';

const ItineraryDisplay = ({ itinerary, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false); // State to toggle between edit and view mode
  const [updatedItinerary, setUpdatedItinerary] = useState(itinerary); // Copy of the itinerary to hold updated values
  const [tags, setTags] = useState([]); // State to hold fetched tags
  const [tagNames, setTagNames] = useState([]); // State to hold tag names based on the itinerary's tag IDs

  // Fetch tags on component mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/tags/');
        const data = await response.json();
        console.log("fetched tags in itinerarydisplay : ", data);
        setTags(data.data); // Store all tags in state
      } catch (err) {
        console.error('Failed to fetch tags:', err.message);
      }
    };

    fetchTags();
  }, []);

  // Map tag IDs to names
  useEffect(() => {
    if (tags.length > 0) {
      const names = updatedItinerary.tags.map(tagId => {
        const tag = tags.find(t => t._id === tagId);
        return tag ? tag.name : null; // Get the tag name or null if not found
      }).filter(Boolean); // Filter out null values
      setTagNames(names);
    }
  }, [tags, updatedItinerary.tags]);

  const handleEditClick = () => {
    setIsEditing(true); // Switch to edit mode
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === 'price' ? parseFloat(value) : value; // Convert to float for price
    setUpdatedItinerary({
      ...updatedItinerary,
      [name]: newValue,
    });
  };

  const handleSaveClick = async () => {
    try {
      await onUpdate(itinerary._id, updatedItinerary); // Call the update function passed as prop
      setIsEditing(false); // Exit edit mode
    } catch (err) {
      console.error('Failed to update itinerary:', err.message);
    }
  };

  const handleTagClick = (tagId) => {
    // Check if the tag ID is already in the tags array
    if (!updatedItinerary.tags.includes(tagId)) {
      // Add tag ID to the itinerary's tags if not already included
      setUpdatedItinerary(prevState => ({
        ...prevState,
        tags: [...prevState.tags, tagId], // Add new tag ID
      }));
    }
  };

  return (
    <div className="activity-card">
      {isEditing ? (
        // Render form fields in editing mode
        <>
          <input
            type="text"
            name="title"
            value={updatedItinerary.title}
            onChange={handleInputChange}
            placeholder="Itinerary Title"
          />
          <textarea
            name="description"
            value={updatedItinerary.description}
            onChange={handleInputChange}
            placeholder="Itinerary Description"
          />
          <input
            type="number"
            name="price"
            value={updatedItinerary.price}
            onChange={handleInputChange}
            placeholder="Total Price"
          />
          <input
            type="text"
            name="language"
            value={updatedItinerary.language}
            onChange={handleInputChange}
            placeholder="Language"
          />
          <input
            type="text"
            name="pickUpLocation"
            value={updatedItinerary.pickUpLocation}
            onChange={handleInputChange}
            placeholder="Pick Up Location"
          />
          <input
            type="text"
            name="dropOffLocation"
            value={updatedItinerary.dropOffLocation}
            onChange={handleInputChange}
            placeholder="Drop Off Location"
          />

          {/* Edit activities */}
          <div className="activities-container">
            <h3>Activities</h3>
            {updatedItinerary.activities.map((activity, index) => (
              <div key={index}>
                <input
                  type="text"
                  name={`activityTitle-${index}`}
                  value={activity.title}
                  onChange={(e) => {
                    const newActivities = [...updatedItinerary.activities];
                    newActivities[index].title = e.target.value;
                    setUpdatedItinerary({
                      ...updatedItinerary,
                      activities: newActivities,
                    });
                  }}
                  placeholder="Activity Title"
                />
                <input
                  type="number"
                  name={`activityDuration-${index}`}
                  value={activity.duration}
                  onChange={(e) => {
                    const newActivities = [...updatedItinerary.activities];
                    newActivities[index].duration = parseFloat(e.target.value);
                    setUpdatedItinerary({
                      ...updatedItinerary,
                      activities: newActivities,
                    });
                  }}
                  placeholder="Duration (minutes)"
                />
                <input
                  type="number"
                  name={`activityPrice-${index}`}
                  value={activity.price}
                  onChange={(e) => {
                    const newActivities = [...updatedItinerary.activities];
                    newActivities[index].price = parseFloat(e.target.value);
                    setUpdatedItinerary({
                      ...updatedItinerary,
                      activities: newActivities,
                    });
                  }}
                  placeholder="Price"
                />
              </div>
            ))}
          </div>

          {/* Edit locations to visit */}
          <div className="locations-container">
            <h3>Locations to Visit</h3>
            {updatedItinerary.locationsToVisit.map((location, index) => (
              <div key={index}>
                <input
                  type="text"
                  name={`locationName-${index}`}
                  value={location.name}
                  onChange={(e) => {
                    const newLocations = [...updatedItinerary.locationsToVisit];
                    newLocations[index].name = e.target.value;
                    setUpdatedItinerary({
                      ...updatedItinerary,
                      locationsToVisit: newLocations,
                    });
                  }}
                  placeholder="Location Name"
                />
              </div>
            ))}
          </div>

          {/* Edit available dates */}
          <div className="dates-container">
            <h3>Available Dates</h3>
            {updatedItinerary.availableDates.map((date, index) => (
              <input
                key={index}
                type="date"
                value={date}
                onChange={(e) => {
                  const newDates = [...updatedItinerary.availableDates];
                  newDates[index] = e.target.value;
                  setUpdatedItinerary({
                    ...updatedItinerary,
                    availableDates: newDates,
                  });
                }}
              />
            ))}
          </div>

          {/* Edit available times */}
          <div className="times-container">
            <h3>Available Times</h3>
            {updatedItinerary.availableTimes.map((time, index) => (
              <input
                key={index}
                type="time"
                value={time}
                onChange={(e) => {
                  const newTimes = [...updatedItinerary.availableTimes];
                  newTimes[index] = e.target.value;
                  setUpdatedItinerary({
                    ...updatedItinerary,
                    availableTimes: newTimes,
                  });
                }}
              />
            ))}
          </div>

          {/* Tags Section */}
          <div className="tags-container">
            <h3>Select Tags (Category: Preference)</h3>
            {tags.filter(tag => tag.category === 'preference').map(tag => (
              <button
                key={tag._id}
                onClick={() => handleTagClick(tag._id)}
                className={`tag-button ${updatedItinerary.tags.includes(tag._id) ? 'selected' : ''}`}
              >
                {tag.name}
              </button>
            ))}
          </div>

          <button className="save-button" onClick={handleSaveClick}>Save</button>
          <button className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        // Display itinerary details in view mode
        <>
          <h2 className="itinerary-title">{itinerary.title}</h2>
          <h4 className="itinerary-description">Description: </h4><p>{itinerary.description}</p>
          <h4 className="itinerary-price">Total Price:</h4><p> ${itinerary.price}</p>
          <h4 className="itinerary-language">Language:</h4><p> {itinerary.language}</p>
          <h4 className="itinerary-pickup">Pick Up Location:</h4><p> {itinerary.pickUpLocation}</p>
          <h4 className="itinerary-dropoff">Drop Off Location: </h4><p>{itinerary.dropOffLocation}</p>
          
          {/* Display tag names */}
          <h4 className="itinerary-tags">Tags:</h4><p>{tagNames.join(', ')}</p>

          {/* Activities List */}
          <h3>Activities</h3>
          <ul>
            {itinerary.activities.map((activity, index) => (
              <li key={index}>{activity.title} - Duration: {activity.duration} minutes - Price: ${activity.price}</li>
            ))}
          </ul>

          {/* Locations to Visit List */}
          <h3>Locations to Visit</h3>
          <ul>
            {itinerary.locationsToVisit.map((location, index) => (
              <li key={index}>{location.name}</li>
            ))}
          </ul>

          {/* Available Dates */}
          <h3>Available Dates</h3>
          <ul>
            {itinerary.availableDates.map((date, index) => (
              <li key={index}>{date}</li>
            ))}
          </ul>

          {/* Available Times */}
          <h3>Available Times</h3>
          <ul>
            {itinerary.availableTimes.map((time, index) => (
              <li key={index}>{time}</li>
            ))}
          </ul>

          <button onClick={handleEditClick}>Edit Itinerary</button>
          <button onClick={() => onDelete(itinerary._id)}>Delete Itinerary</button>
        </>
      )}
    </div>
  );
};

export default ItineraryDisplay;
