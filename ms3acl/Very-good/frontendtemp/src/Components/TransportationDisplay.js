import React from 'react';
import './ActivityDisplay.css'; // Importing the CSS file
import bookTransportation from '../Services/bookingTransportationServices'

// Define the TransportationDisplay component
const TransportationDisplay = ({ touristId, transportation }) => {
  // Ensure the transportation prop is provided
  if (!transportation) {
    return <div>No transportation data available.</div>;
  }

  const handleBook = async () => {
    try {
      // Call the bookTransportation function with touristId and transportationId
      console.log("touristId :", touristId)
      console.log("transportationId :", transportation._id)
      const result = await bookTransportation(touristId, transportation._id);
      console.log('Booking result:', result); // Log the result for debugging
      alert('Transportation booked successfully!');
    } catch (error) {
      console.error('Error booking transportation:', error);
      alert('Failed to book transportation. Please try again.');
    }
  };

  return (
    <div className="activity-card"> {/* Changed to activity-card for styling */}
      <h2 className="activity-title">Transportation Details</h2>
      <div className="transportation-details">
        <p className="activity-date"><strong>Type:</strong> {transportation.type}</p>
        <p className="activity-location"><strong>Provider:</strong> {transportation.provider}</p>
        <p className="activity-location"><strong>Departure Location:</strong> {transportation.departureLocation}</p>
        <p className="activity-location"><strong>Arrival Location:</strong> {transportation.arrivalLocation}</p>
        <p className="activity-time"><strong>Departure Time:</strong> {new Date(transportation.departureTime).toLocaleString()}</p>
        <p className="activity-time"><strong>Arrival Time:</strong> {new Date(transportation.arrivalTime).toLocaleString()}</p>
        <p className="activity-price"><strong>Price:</strong> ${transportation.price.toFixed(2)}</p>
        <p className="activity-booking-status"><strong>Available:</strong> {transportation.isAvailable ? 'Yes' : 'No'}</p>
        <button onClick={handleBook} className="create-activity-button">Book Now</button>
      </div>
    </div>
  );
};

export default TransportationDisplay;
