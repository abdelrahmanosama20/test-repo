import React from 'react';
import { useLocation } from 'react-router-dom';
import './Ticket.css'; // Ensure you import the CSS file

const TicketViewForTourist = (offer) => {
  console.log("offer inside : ", offer)
  const formData = offer.offer.flightInfo.data
  offer = offer.offer.bookedFlight.data
  console.log('offer inside the component :', formData)
  console.log('formData inside the component :', formData)
  // Accessing the itinerary details
  const flightItinerary = offer.itineraries[0]; // Assuming the first itinerary
  const segments = flightItinerary.segments;
  const departureSegment = segments[0]; // First segment for departure
  const arrivalSegment = segments[segments.length - 1]; // Last segment for arrival

  // Price details
  const totalPrice = offer.price.grandTotal;
  const currency = offer.price.currency;

  return (
    <div className="ticket-container">
      <div className="ticket-header">
        <h2 className="ticket-title">Booking Confirmed!</h2>
      </div>
      <h3 className="ticket-subtitle">Your Ticket:</h3>
      <p className="ticket-info"><strong>Name:</strong> {formData.name || 'N/A'}</p>
      <p className="ticket-info"><strong>Email:</strong> {formData.email}</p>
      <p className="ticket-info"><strong>Passport Number:</strong> {formData.passportNumber}</p>
      <p className="ticket-info"><strong>Date of Birth:</strong> {formData.dateOfBirth}</p>
      <p className="ticket-info"><strong>Nationality:</strong> {formData.nationality}</p>
      <p className="ticket-info"><strong>Phone Number:</strong> {formData.phoneNumber}</p>
      <p className="ticket-info"><strong>Checked Bags:</strong> {formData.checkedBags}</p>
      <p className="ticket-info"><strong>Seat Preference:</strong> {formData.seatPreference}</p>
      
      {/* Display flight offer details */}
      <div className="ticket-segment">
        <p className="ticket-info"><strong>Flight ID:</strong> {offer.id}</p>
        <p className="ticket-info"><strong>Departure:</strong> {departureSegment.departure.iataCode} - {departureSegment.departure.at}</p>
        <p className="ticket-info"><strong>Arrival:</strong> {arrivalSegment.arrival.iataCode} - {arrivalSegment.arrival.at}</p>
      </div>
      
      {/* Price section */}
      <div className="ticket-price">
        <p className="ticket-info"><strong>Total Price:</strong> {totalPrice} {currency}</p>
      </div>

      {/* Footer with confirmation message */}
      <div className="ticket-footer">
        <p>Thank you for booking with us!</p>
      </div>
    </div>
  );
};

export default TicketViewForTourist;
