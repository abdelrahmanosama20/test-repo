import React, { useState } from 'react';
import './ActivityDisplay.css'; // Importing the CSS file

// Define the TransportationDisplay component
const TransportationDisplayForAdvertiser = ({ transportation, onEdit, onDelete }) => {
  // Local state for editing mode and updated data
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTransportation, setUpdatedTransportation] = useState(transportation);

  // Ensure the transportation prop is provided
  if (!transportation) {
    return <div>No transportation data available.</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTransportation((prevData) => ({
      ...prevData,
      [name]: name === 'isAvailable' ? e.target.checked : value, // Handle boolean for isAvailable
    }));
  };

  const handleSave = () => {
    onEdit(transportation._id, updatedTransportation); // Call onEdit with ID and updated data
    setIsEditing(false); // Exit edit mode after saving
  };

  return (
    <div className="activity-card"> {/* Changed to activity-card for styling */}
      <h2 className="activity-title">Transportation Details</h2>
      <div className="transportation-details">
        {isEditing ? (
          <>
            <p className="activity-date">
              <strong>Type:</strong>
              <select
                name="type"
                value={updatedTransportation.type}
                onChange={handleChange}
              >
                <option value="Bus">Bus</option>
                <option value="Train">Train</option>
                <option value="Taxi">Taxi</option>
                <option value="Rental Car">Rental Car</option>
                <option value="Flight">Flight</option>
              </select>
            </p>
            <p className="activity-location">
              <strong>Provider:</strong>
              <input
                type="text"
                name="provider"
                value={updatedTransportation.provider}
                onChange={handleChange}
              />
            </p>
            <p className="activity-location">
              <strong>Departure Location:</strong>
              <input
                type="text"
                name="departureLocation"
                value={updatedTransportation.departureLocation}
                onChange={handleChange}
              />
            </p>
            <p className="activity-location">
              <strong>Arrival Location:</strong>
              <input
                type="text"
                name="arrivalLocation"
                value={updatedTransportation.arrivalLocation}
                onChange={handleChange}
              />
            </p>
            <p className="activity-time">
              <strong>Departure Time:</strong>
              <input
                type="datetime-local"
                name="departureTime"
                value={new Date(updatedTransportation.departureTime).toISOString().substring(0, 16)}
                onChange={handleChange}
              />
            </p>
            <p className="activity-time">
              <strong>Arrival Time:</strong>
              <input
                type="datetime-local"
                name="arrivalTime"
                value={new Date(updatedTransportation.arrivalTime).toISOString().substring(0, 16)}
                onChange={handleChange}
              />
            </p>
            <p className="activity-price">
              <strong>Price:</strong>
              <input
                type="number"
                name="price"
                value={updatedTransportation.price}
                onChange={handleChange}
              />
            </p>
            <p className="activity-booking-status">
              <strong>Available:</strong>
              <input
                type="checkbox"
                name="isAvailable"
                checked={updatedTransportation.isAvailable}
                onChange={handleChange}
              />
            </p>
          </>
        ) : (
          <>
            <p className="activity-date"><strong>Type:</strong> {transportation.type}</p>
            <p className="activity-location"><strong>Provider:</strong> {transportation.provider}</p>
            <p className="activity-location"><strong>Departure Location:</strong> {transportation.departureLocation}</p>
            <p className="activity-location"><strong>Arrival Location:</strong> {transportation.arrivalLocation}</p>
            <p className="activity-time"><strong>Departure Time:</strong> {new Date(transportation.departureTime).toLocaleString()}</p>
            <p className="activity-time"><strong>Arrival Time:</strong> {new Date(transportation.arrivalTime).toLocaleString()}</p>
            <p className="activity-price"><strong>Price:</strong> ${transportation.price.toFixed(2)}</p>
            <p className="activity-booking-status"><strong>Available:</strong> {transportation.isAvailable ? 'Yes' : 'No'}</p>
          </>
        )}
      </div>

      {/* Buttons for Edit and Delete actions */}
      <div className="transportation-buttons">
        {isEditing ? (
          <>
            <button className="save-button" onClick={handleSave}>Save</button>
            <button className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
          </>
        ) : (
          <>
            <button 
              className="edit-button" 
              onClick={() => setIsEditing(true)} // Set editing mode on Edit button click
            >
              Edit
            </button>
            <button 
              className="delete-button" 
              onClick={() => onDelete(transportation._id)} // Call the onDelete function with the transportation ID
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TransportationDisplayForAdvertiser;
